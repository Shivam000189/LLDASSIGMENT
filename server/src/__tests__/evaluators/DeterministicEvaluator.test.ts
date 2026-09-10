/// <reference types="jest" />
import { DeterministicEvaluator } from "../../evaluators/DeterministicEvaluator";
import { Problem, Submission } from "../../types";

describe("DeterministicEvaluator", () => {
  let evaluator: DeterministicEvaluator;

  const parkingLotProblem: Problem = {
    id: "parking-lot",
    title: "Parking Lot",
    requirements: [
      "Support multiple vehicle types",
      "Manage parking spots",
      "Issue tickets",
      "Calculate fees",
    ],
    constraints: ["Clean separation of concerns"],
    expectedEntities: ["Vehicle", "ParkingSpot", "Ticket", "ParkingLot"],
  };

  beforeEach(() => {
    evaluator = new DeterministicEvaluator();
  });

  it("returns high scores for well-structured TypeScript code", async () => {
    const wellStructuredCode = `
      export enum VehicleType {
        CAR,
        BIKE,
        TRUCK
      }

      export class Vehicle {
        constructor(public licensePlate: string, public type: VehicleType) {}
      }

      export class ParkingSpot {
        constructor(public id: string, public isOccupied: boolean = false) {}
      }

      export class Ticket {
        constructor(public id: string, public entryTime: Date, public spotId: string) {}
      }

      export class ParkingLot {
        private spots: ParkingSpot[] = [];
        public park(vehicle: Vehicle): Ticket | null { return null; }
      }
    `;

    const submission: Submission = {
      code: wellStructuredCode,
      language: "TS",
      submittedAt: new Date(),
    };

    const result = await evaluator.evaluate(submission, parkingLotProblem);

    expect(result.source).toBe("deterministic");
    expect(result.dimensions.structurePresent.score).toBe(1);
    expect(result.dimensions.structurePresent.explanation).toContain("Found class or interface declarations");
    expect(result.dimensions.entityCoverage.score).toBe(1);
    expect(result.dimensions.statePresent.score).toBe(1);
    expect(result.dimensions.responsibilitySpread.score).toBe(1);
    expect(result.dimensions.entityCoverage.explanation).toContain("Identified 4/4 expected entities");
  });

  it("returns high scores for well-structured Python code", async () => {
    const pythonCode = `
from enum import Enum
from datetime import datetime

class VehicleType(Enum):
    CAR = 1
    MOTORCYCLE = 2
    TRUCK = 3

class Vehicle:
    def __init__(self, license_plate: str, vehicle_type: VehicleType):
        self.license_plate = license_plate
        self.vehicle_type = vehicle_type

class ParkingSpot:
    def __init__(self, spot_id: str):
        self.spot_id = spot_id
        self.is_occupied = False

class Ticket:
    def __init__(self, ticket_id: str, spot_id: str):
        self.ticket_id = ticket_id
        self.spot_id = spot_id
        self.entry_time = datetime.now()

class ParkingLot:
    def __init__(self):
        self.spots = []

    def park_vehicle(self, vehicle: Vehicle) -> Ticket:
        pass
    `;

    const submission: Submission = {
      code: pythonCode,
      language: "PY",
      submittedAt: new Date(),
    };

    const result = await evaluator.evaluate(submission, parkingLotProblem);

    expect(result.source).toBe("deterministic");
    expect(result.dimensions.structurePresent.score).toBe(1);
    expect(result.dimensions.structurePresent.explanation).toContain("Found class declaration(s)");
    expect(result.dimensions.entityCoverage.score).toBe(1);
    expect(result.dimensions.statePresent.score).toBe(1);
    expect(result.dimensions.statePresent.explanation).toContain("Found Enum class definition or enum import");
    expect(result.dimensions.responsibilitySpread.score).toBe(1);
  });

  it("returns 0 for statePresent on Python code without Enum", async () => {
    const pythonNoEnum = `
class Vehicle:
    def __init__(self, license_plate: str):
        self.license_plate = license_plate

class ParkingSpot:
    def __init__(self, spot_id: str):
        self.spot_id = spot_id
    `;

    const submission: Submission = {
      code: pythonNoEnum,
      language: "PY",
      submittedAt: new Date(),
    };

    const result = await evaluator.evaluate(submission, parkingLotProblem);

    expect(result.dimensions.statePresent.score).toBe(0);
    expect(result.dimensions.statePresent.explanation).toBe("No Enum definitions or enum imports found.");
  });

  it("returns partial entityCoverage when some entities are missing", async () => {
    const partialCode = `
      export enum SpotType { REGULAR }

      export class Vehicle {
        constructor(public plate: string) {}
      }

      export class ParkingSpot {
        constructor(public id: string) {}
      }
    `;

    const submission: Submission = {
      code: partialCode,
      language: "TS",
      submittedAt: new Date(),
    };

    const result = await evaluator.evaluate(submission, parkingLotProblem);

    expect(result.dimensions.entityCoverage.score).toBe(0.5);
    expect(result.dimensions.entityCoverage.explanation).toContain("Identified 2/4 expected entities");
    expect(result.dimensions.entityCoverage.explanation).toContain("Missing: [Ticket, ParkingLot]");
    expect(result.dimensions.entityCoverage.explanation).toContain("Found: [Vehicle, ParkingSpot]");
  });

  it("returns 0 for statePresent when no enum exists in TS", async () => {
    const noEnumCode = `
      export class Vehicle {
        constructor(public plate: string) {}
      }

      export class ParkingSpot {
        constructor(public id: string) {}
      }
    `;

    const submission: Submission = {
      code: noEnumCode,
      language: "TS",
      submittedAt: new Date(),
    };

    const result = await evaluator.evaluate(submission, parkingLotProblem);

    expect(result.dimensions.statePresent.score).toBe(0);
    expect(result.dimensions.statePresent.explanation).toBe("No enum definitions found.");
  });

  it("does not throw on completely invalid/garbage input", async () => {
    const garbageCode = "}{][///\\\\\\!@#$%^&*()_+=~`<<<>>>;;;'''\"\"\"";

    const submission: Submission = {
      code: garbageCode,
      language: "TS",
      submittedAt: new Date(),
    };

    let result;
    expect(async () => {
      result = await evaluator.evaluate(submission, parkingLotProblem);
    }).not.toThrow();

    result = await evaluator.evaluate(submission, parkingLotProblem);
    expect(result).toBeDefined();
    expect(result.source).toBe("deterministic");
    // Should safely complete without throwing an unhandled error
    expect(result.dimensions).toBeDefined();
  });

  it("returns empty string code without crashing", async () => {
    const submission: Submission = {
      code: "",
      language: "TS",
      submittedAt: new Date(),
    };

    const result = await evaluator.evaluate(submission, parkingLotProblem);

    expect(result).toBeDefined();
    expect(result.source).toBe("deterministic");
    expect(result.dimensions.structurePresent.score).toBe(0);
    expect(result.dimensions.entityCoverage.score).toBe(0);
    expect(result.dimensions.statePresent.score).toBe(0);
    expect(result.dimensions.responsibilitySpread.score).toBe(0);
  });
});
