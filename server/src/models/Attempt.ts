import mongoose, { Schema, Document } from "mongoose";
import {
  Attempt as IAttempt,
  Submission as ISubmission,
  Feedback as IFeedback,
  EvaluationResult as IEvaluationResult,
  AttemptStatus,
} from "../types";

export interface IAttemptDocument extends Omit<IAttempt, "id">, Document {}

const EvaluationResultSchema = new Schema<IEvaluationResult>(
  {
    source: {
      type: String,
      enum: ["deterministic", "llm"],
      required: true,
    },
    dimensions: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
    parseError: {
      type: String,
    },
  },
  { _id: false }
);

const SubmissionSchema = new Schema<ISubmission>(
  {
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ["TS", "PY"],
      default: "TS",
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { _id: false }
);

const FeedbackSchema = new Schema<IFeedback>(
  {
    deterministic: {
      type: EvaluationResultSchema,
      required: true,
    },
    llm: {
      type: EvaluationResultSchema,
      default: null,
    },
    usedFallback: {
      type: Boolean,
      required: true,
      default: false,
    },
    overallNotes: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const AttemptSchema = new Schema<IAttemptDocument>(
  {
    problemId: {
      type: String,
      required: true,
      index: true,
    },
    learnerId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["evaluating", "completed", "failed"] as AttemptStatus[],
      default: "evaluating",
      required: true,
    },
    submission: {
      type: SubmissionSchema,
      required: true,
    },
    feedback: {
      type: FeedbackSchema,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index for querying a learner's history on a problem sorted by date
AttemptSchema.index({ learnerId: 1, problemId: 1, createdAt: -1 });

export const AttemptModel = mongoose.model<IAttemptDocument>("Attempt", AttemptSchema);
