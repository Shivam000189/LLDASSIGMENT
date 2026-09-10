import mongoose, { Schema, Document } from "mongoose";

export interface IProblemDocument extends Document<string> {
  _id: string;
  title: string;
  requirements: string[];
  constraints: string[];
  expectedEntities: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProblemSchema = new Schema<IProblemDocument>(
  {
    _id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    requirements: {
      type: [String],
      required: true,
      default: [],
    },
    constraints: {
      type: [String],
      required: true,
      default: [],
    },
    expectedEntities: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const ProblemModel = mongoose.model<IProblemDocument>("Problem", ProblemSchema);
