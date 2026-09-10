export interface CodeToken {
  text: string;
  type?: "keyword" | "type" | "function" | "string" | "variable" | "number" | "comment" | "operator" | "punctuation" | "decorator" | "property";
}

export interface CodeLine {
  num: number;
  tokens: CodeToken[];
}

export interface TestCase {
  name: string;
  status: "passed" | "running";
  time: string;
}

export interface CodeSample {
  id: string;
  filename: string;
  problemTitle: string;
  difficulty: "Easy" | "Medium" | "Hard";
  pattern: string;
  description: string;
  testCasesCount: number;
  testCases: TestCase[];
  lines: CodeLine[];
}

export const LLD_CODE_SAMPLES: CodeSample[] = [
  {
    id: "parking-lot",
    filename: "ParkingLot.ts",
    problemTitle: "Parking Lot System",
    difficulty: "Medium",
    pattern: "Strategy + Factory Pattern",
    description: "Multi-level parking system supporting vehicle categorization, dynamic fee strategies, and spot reservation.",
    testCasesCount: 5,
    testCases: [
      { name: "Spot Allocation (Car -> Compact/Large)", status: "passed", time: "1.2ms" },
      { name: "Ticket Generation with UUID & Timestamp", status: "passed", time: "0.8ms" },
      { name: "Dynamic Fee Calculation (PeakPricingStrategy)", status: "passed", time: "1.5ms" },
      { name: "Concurrency-Safe Spot Occupancy Lock", status: "passed", time: "2.1ms" },
      { name: "Real-time Available Capacity Metrics", status: "passed", time: "0.4ms" },
    ],
    lines: [
      {
        num: 1,
        tokens: [
          { text: "// LLSOLVE - Low-Level Design: Parking Lot Architecture", type: "comment" },
        ],
      },
      {
        num: 2,
        tokens: [
          { text: "export enum ", type: "keyword" },
          { text: "VehicleType ", type: "type" },
          { text: "{\n", type: "punctuation" },
        ],
      },
      {
        num: 3,
        tokens: [
          { text: "  MOTORCYCLE = ", type: "property" },
          { text: "'MOTORCYCLE'", type: "string" },
          { text: ",\n", type: "punctuation" },
        ],
      },
      {
        num: 4,
        tokens: [
          { text: "  CAR = ", type: "property" },
          { text: "'CAR'", type: "string" },
          { text: ",\n", type: "punctuation" },
        ],
      },
      {
        num: 5,
        tokens: [
          { text: "  TRUCK = ", type: "property" },
          { text: "'TRUCK'", type: "string" },
          { text: ",\n", type: "punctuation" },
        ],
      },
      {
        num: 6,
        tokens: [
          { text: "}\n", type: "punctuation" },
        ],
      },
      {
        num: 7,
        tokens: [
          { text: "export interface ", type: "keyword" },
          { text: "PricingStrategy ", type: "type" },
          { text: "{\n", type: "punctuation" },
        ],
      },
      {
        num: 8,
        tokens: [
          { text: "  calculateFee", type: "function" },
          { text: "(", type: "punctuation" },
          { text: "durationHours", type: "variable" },
          { text: ": ", type: "punctuation" },
          { text: "number", type: "type" },
          { text: ", ", type: "punctuation" },
          { text: "type", type: "variable" },
          { text: ": ", type: "punctuation" },
          { text: "VehicleType", type: "type" },
          { text: "): ", type: "punctuation" },
          { text: "number", type: "type" },
          { text: ";\n", type: "punctuation" },
        ],
      },
      {
        num: 9,
        tokens: [
          { text: "}\n", type: "punctuation" },
        ],
      },
      {
        num: 10,
        tokens: [
          { text: "export class ", type: "keyword" },
          { text: "ParkingLot ", type: "type" },
          { text: "{\n", type: "punctuation" },
        ],
      },
      {
        num: 11,
        tokens: [
          { text: "  private ", type: "keyword" },
          { text: "spots", type: "variable" },
          { text: " = new ", type: "operator" },
          { text: "Map", type: "type" },
          { text: "<", type: "punctuation" },
          { text: "string", type: "type" },
          { text: ", ", type: "punctuation" },
          { text: "ParkingSpot", type: "type" },
          { text: ">();\n", type: "punctuation" },
        ],
      },
      {
        num: 12,
        tokens: [
          { text: "  constructor(", type: "punctuation" },
          { text: "private ", type: "keyword" },
          { text: "pricingStrategy", type: "variable" },
          { text: ": ", type: "punctuation" },
          { text: "PricingStrategy", type: "type" },
          { text: ") {}\n", type: "punctuation" },
        ],
      },
      {
        num: 13,
        tokens: [
          { text: "  public ", type: "keyword" },
          { text: "parkVehicle", type: "function" },
          { text: "(", type: "punctuation" },
          { text: "vehicle", type: "variable" },
          { text: ": ", type: "punctuation" },
          { text: "Vehicle", type: "type" },
          { text: "): ", type: "punctuation" },
          { text: "Ticket ", type: "type" },
          { text: "{\n", type: "punctuation" },
        ],
      },
      {
        num: 14,
        tokens: [
          { text: "    const ", type: "keyword" },
          { text: "spot", type: "variable" },
          { text: " = ", type: "operator" },
          { text: "this", type: "keyword" },
          { text: ".", type: "punctuation" },
          { text: "findAvailableSpot", type: "function" },
          { text: "(", type: "punctuation" },
          { text: "vehicle", type: "variable" },
          { text: ".", type: "punctuation" },
          { text: "type", type: "property" },
          { text: ");\n", type: "punctuation" },
        ],
      },
      {
        num: 15,
        tokens: [
          { text: "    if (!", type: "operator" },
          { text: "spot", type: "variable" },
          { text: ") throw new ", type: "keyword" },
          { text: "Error", type: "type" },
          { text: "(", type: "punctuation" },
          { text: '"No spot available for vehicle type"', type: "string" },
          { text: ");\n", type: "punctuation" },
        ],
      },
      {
        num: 16,
        tokens: [
          { text: "    spot.", type: "variable" },
          { text: "assignVehicle", type: "function" },
          { text: "(", type: "punctuation" },
          { text: "vehicle", type: "variable" },
          { text: ");\n", type: "punctuation" },
        ],
      },
      {
        num: 17,
        tokens: [
          { text: "    return new ", type: "keyword" },
          { text: "Ticket", type: "type" },
          { text: "(", type: "punctuation" },
          { text: "vehicle", type: "variable" },
          { text: ".", type: "punctuation" },
          { text: "licensePlate", type: "property" },
          { text: ", ", type: "punctuation" },
          { text: "spot", type: "variable" },
          { text: ".", type: "punctuation" },
          { text: "id", type: "property" },
          { text: ", ", type: "punctuation" },
          { text: "new ", type: "operator" },
          { text: "Date", type: "type" },
          { text: "());\n", type: "punctuation" },
        ],
      },
      {
        num: 18,
        tokens: [
          { text: "  }\n", type: "punctuation" },
        ],
      },
      {
        num: 19,
        tokens: [
          { text: "  public ", type: "keyword" },
          { text: "exitVehicle", type: "function" },
          { text: "(", type: "punctuation" },
          { text: "ticket", type: "variable" },
          { text: ": ", type: "punctuation" },
          { text: "Ticket", type: "type" },
          { text: "): ", type: "punctuation" },
          { text: "number ", type: "type" },
          { text: "{\n", type: "punctuation" },
        ],
      },
      {
        num: 20,
        tokens: [
          { text: "    const ", type: "keyword" },
          { text: "duration", type: "variable" },
          { text: " = ", type: "operator" },
          { text: "this", type: "keyword" },
          { text: ".", type: "punctuation" },
          { text: "computeHours", type: "function" },
          { text: "(", type: "punctuation" },
          { text: "ticket", type: "variable" },
          { text: ".", type: "punctuation" },
          { text: "entryTime", type: "property" },
          { text: ");\n", type: "punctuation" },
        ],
      },
      {
        num: 21,
        tokens: [
          { text: "    return ", type: "keyword" },
          { text: "this", type: "keyword" },
          { text: ".", type: "punctuation" },
          { text: "pricingStrategy", type: "variable" },
          { text: ".", type: "punctuation" },
          { text: "calculateFee", type: "function" },
          { text: "(", type: "punctuation" },
          { text: "duration", type: "variable" },
          { text: ", ", type: "punctuation" },
          { text: "ticket", type: "variable" },
          { text: ".", type: "punctuation" },
          { text: "vehicleType", type: "property" },
          { text: ");\n", type: "punctuation" },
        ],
      },
      {
        num: 22,
        tokens: [
          { text: "  }\n", type: "punctuation" },
        ],
      },
      {
        num: 23,
        tokens: [
          { text: "}", type: "punctuation" },
        ],
      },
    ],
  },
  {
    id: "lru-cache",
    filename: "LRUCache.ts",
    problemTitle: "LRU Cache System",
    difficulty: "Medium",
    pattern: "Doubly Linked List + Hash Table",
    description: "Thread-safe Least Recently Used (LRU) Cache with O(1) get/put operations and eviction listener hooks.",
    testCasesCount: 4,
    testCases: [
      { name: "O(1) Constant Time Retrieval", status: "passed", time: "0.2ms" },
      { name: "Capacity-Bound Eviction of Least Recent", status: "passed", time: "0.5ms" },
      { name: "Head/Tail Node Pointer Re-linking", status: "passed", time: "0.3ms" },
      { name: "Generic Key-Value Type Safety", status: "passed", time: "0.1ms" },
    ],
    lines: [
      {
        num: 1,
        tokens: [
          { text: "// LLSOLVE - Generic O(1) LRU Cache Architecture", type: "comment" },
        ],
      },
      {
        num: 2,
        tokens: [
          { text: "class ", type: "keyword" },
          { text: "DNode", type: "type" },
          { text: "<", type: "punctuation" },
          { text: "K", type: "type" },
          { text: ", ", type: "punctuation" },
          { text: "V", type: "type" },
          { text: "> {\n", type: "punctuation" },
        ],
      },
      {
        num: 3,
        tokens: [
          { text: "  prev", type: "variable" },
          { text: ": ", type: "punctuation" },
          { text: "DNode", type: "type" },
          { text: "<", type: "punctuation" },
          { text: "K", type: "type" },
          { text: ", ", type: "punctuation" },
          { text: "V", type: "type" },
          { text: "> | ", type: "operator" },
          { text: "null ", type: "keyword" },
          { text: "= ", type: "operator" },
          { text: "null", type: "keyword" },
          { text: ";\n", type: "punctuation" },
        ],
      },
      {
        num: 4,
        tokens: [
          { text: "  next", type: "variable" },
          { text: ": ", type: "punctuation" },
          { text: "DNode", type: "type" },
          { text: "<", type: "punctuation" },
          { text: "K", type: "type" },
          { text: ", ", type: "punctuation" },
          { text: "V", type: "type" },
          { text: "> | ", type: "operator" },
          { text: "null ", type: "keyword" },
          { text: "= ", type: "operator" },
          { text: "null", type: "keyword" },
          { text: ";\n", type: "punctuation" },
        ],
      },
      {
        num: 5,
        tokens: [
          { text: "  constructor(", type: "punctuation" },
          { text: "public ", type: "keyword" },
          { text: "key", type: "variable" },
          { text: ": ", type: "punctuation" },
          { text: "K", type: "type" },
          { text: ", ", type: "punctuation" },
          { text: "public ", type: "keyword" },
          { text: "value", type: "variable" },
          { text: ": ", type: "punctuation" },
          { text: "V", type: "type" },
          { text: ") {}\n", type: "punctuation" },
        ],
      },
      {
        num: 6,
        tokens: [
          { text: "}\n", type: "punctuation" },
        ],
      },
      {
        num: 7,
        tokens: [
          { text: "export class ", type: "keyword" },
          { text: "LRUCache", type: "type" },
          { text: "<", type: "punctuation" },
          { text: "K", type: "type" },
          { text: ", ", type: "punctuation" },
          { text: "V", type: "type" },
          { text: "> {\n", type: "punctuation" },
        ],
      },
      {
        num: 8,
        tokens: [
          { text: "  private ", type: "keyword" },
          { text: "cache", type: "variable" },
          { text: " = new ", type: "operator" },
          { text: "Map", type: "type" },
          { text: "<", type: "punctuation" },
          { text: "K", type: "type" },
          { text: ", ", type: "punctuation" },
          { text: "DNode", type: "type" },
          { text: "<", type: "punctuation" },
          { text: "K", type: "type" },
          { text: ", ", type: "punctuation" },
          { text: "V", type: "type" },
          { text: ">>();\n", type: "punctuation" },
        ],
      },
      {
        num: 9,
        tokens: [
          { text: "  private ", type: "keyword" },
          { text: "head", type: "variable" },
          { text: " = new ", type: "operator" },
          { text: "DNode", type: "type" },
          { text: "(", type: "punctuation" },
          { text: "null as any", type: "keyword" },
          { text: ", ", type: "punctuation" },
          { text: "null as any", type: "keyword" },
          { text: ");\n", type: "punctuation" },
        ],
      },
      {
        num: 10,
        tokens: [
          { text: "  private ", type: "keyword" },
          { text: "tail", type: "variable" },
          { text: " = new ", type: "operator" },
          { text: "DNode", type: "type" },
          { text: "(", type: "punctuation" },
          { text: "null as any", type: "keyword" },
          { text: ", ", type: "punctuation" },
          { text: "null as any", type: "keyword" },
          { text: ");\n", type: "punctuation" },
        ],
      },
      {
        num: 11,
        tokens: [
          { text: "  constructor(", type: "punctuation" },
          { text: "private readonly ", type: "keyword" },
          { text: "capacity", type: "variable" },
          { text: ": ", type: "punctuation" },
          { text: "number", type: "type" },
          { text: ") {\n", type: "punctuation" },
        ],
      },
      {
        num: 12,
        tokens: [
          { text: "    this.head.next = this.tail;\n", type: "punctuation" },
        ],
      },
      {
        num: 13,
        tokens: [
          { text: "    this.tail.prev = this.head;\n", type: "punctuation" },
        ],
      },
      {
        num: 14,
        tokens: [
          { text: "  }\n", type: "punctuation" },
        ],
      },
      {
        num: 15,
        tokens: [
          { text: "  public ", type: "keyword" },
          { text: "get", type: "function" },
          { text: "(", type: "punctuation" },
          { text: "key", type: "variable" },
          { text: ": ", type: "punctuation" },
          { text: "K", type: "type" },
          { text: "): ", type: "punctuation" },
          { text: "V | null ", type: "type" },
          { text: "{\n", type: "punctuation" },
        ],
      },
      {
        num: 16,
        tokens: [
          { text: "    const ", type: "keyword" },
          { text: "node", type: "variable" },
          { text: " = this.cache.get(key);\n", type: "punctuation" },
        ],
      },
      {
        num: 17,
        tokens: [
          { text: "    if (!node) return ", type: "keyword" },
          { text: "null", type: "keyword" },
          { text: ";\n", type: "punctuation" },
        ],
      },
      {
        num: 18,
        tokens: [
          { text: "    this.moveToHead(node);\n", type: "punctuation" },
        ],
      },
      {
        num: 19,
        tokens: [
          { text: "    return node.value;\n", type: "punctuation" },
        ],
      },
      {
        num: 20,
        tokens: [
          { text: "  }\n", type: "punctuation" },
        ],
      },
      {
        num: 21,
        tokens: [
          { text: "}", type: "punctuation" },
        ],
      },
    ],
  },
  {
    id: "rate-limiter",
    filename: "RateLimiter.ts",
    problemTitle: "Token Bucket Rate Limiter",
    difficulty: "Hard",
    pattern: "Token Bucket Algorithm",
    description: "High-throughput, concurrency-safe API rate limiter handling bursts with sub-millisecond refill precision.",
    testCasesCount: 4,
    testCases: [
      { name: "Tokens Refill Proportionate to Delta Time", status: "passed", time: "0.6ms" },
      { name: "Burst Request Allowance within Capacity", status: "passed", time: "1.1ms" },
      { name: "Rejection of Excess Ingress under Load", status: "passed", time: "0.9ms" },
      { name: "Per-Client Partitioning Isolation", status: "passed", time: "1.4ms" },
    ],
    lines: [
      {
        num: 1,
        tokens: [
          { text: "// LLSOLVE - Distributed Token Bucket Rate Limiter", type: "comment" },
        ],
      },
      {
        num: 2,
        tokens: [
          { text: "export interface ", type: "keyword" },
          { text: "LimiterOptions ", type: "type" },
          { text: "{\n", type: "punctuation" },
        ],
      },
      {
        num: 3,
        tokens: [
          { text: "  maxCapacity", type: "property" },
          { text: ": ", type: "punctuation" },
          { text: "number", type: "type" },
          { text: ";\n", type: "punctuation" },
        ],
      },
      {
        num: 4,
        tokens: [
          { text: "  refillRatePerSec", type: "property" },
          { text: ": ", type: "punctuation" },
          { text: "number", type: "type" },
          { text: ";\n", type: "punctuation" },
        ],
      },
      {
        num: 5,
        tokens: [
          { text: "}\n", type: "punctuation" },
        ],
      },
      {
        num: 6,
        tokens: [
          { text: "export class ", type: "keyword" },
          { text: "TokenBucketLimiter ", type: "type" },
          { text: "{\n", type: "punctuation" },
        ],
      },
      {
        num: 7,
        tokens: [
          { text: "  private ", type: "keyword" },
          { text: "tokens", type: "variable" },
          { text: ": ", type: "punctuation" },
          { text: "number", type: "type" },
          { text: ";\n", type: "punctuation" },
        ],
      },
      {
        num: 8,
        tokens: [
          { text: "  private ", type: "keyword" },
          { text: "lastRefillTime", type: "variable" },
          { text: ": ", type: "punctuation" },
          { text: "number", type: "type" },
          { text: ";\n", type: "punctuation" },
        ],
      },
      {
        num: 9,
        tokens: [
          { text: "  constructor(", type: "punctuation" },
          { text: "private readonly ", type: "keyword" },
          { text: "opts", type: "variable" },
          { text: ": ", type: "punctuation" },
          { text: "LimiterOptions", type: "type" },
          { text: ") {\n", type: "punctuation" },
        ],
      },
      {
        num: 10,
        tokens: [
          { text: "    this.tokens = opts.maxCapacity;\n", type: "punctuation" },
        ],
      },
      {
        num: 11,
        tokens: [
          { text: "    this.lastRefillTime = Date.now();\n", type: "punctuation" },
        ],
      },
      {
        num: 12,
        tokens: [
          { text: "  }\n", type: "punctuation" },
        ],
      },
      {
        num: 13,
        tokens: [
          { text: "  public ", type: "keyword" },
          { text: "allowRequest", type: "function" },
          { text: "(", type: "punctuation" },
          { text: "tokensRequired", type: "variable" },
          { text: " = ", type: "operator" },
          { text: "1", type: "number" },
          { text: "): ", type: "punctuation" },
          { text: "boolean ", type: "type" },
          { text: "{\n", type: "punctuation" },
        ],
      },
      {
        num: 14,
        tokens: [
          { text: "    this.refill();\n", type: "punctuation" },
        ],
      },
      {
        num: 15,
        tokens: [
          { text: "    if (this.tokens >= tokensRequired) {\n", type: "punctuation" },
        ],
      },
      {
        num: 16,
        tokens: [
          { text: "      this.tokens -= tokensRequired;\n", type: "punctuation" },
        ],
      },
      {
        num: 17,
        tokens: [
          { text: "      return ", type: "keyword" },
          { text: "true", type: "keyword" },
          { text: ";\n", type: "punctuation" },
        ],
      },
      {
        num: 18,
        tokens: [
          { text: "    }\n", type: "punctuation" },
        ],
      },
      {
        num: 19,
        tokens: [
          { text: "    return ", type: "keyword" },
          { text: "false", type: "keyword" },
          { text: "; // Rate limit exceeded\n", type: "comment" },
        ],
      },
      {
        num: 20,
        tokens: [
          { text: "  }\n", type: "punctuation" },
        ],
      },
      {
        num: 21,
        tokens: [
          { text: "}", type: "punctuation" },
        ],
      },
    ],
  },
];
