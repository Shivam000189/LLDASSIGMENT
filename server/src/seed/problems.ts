import { Problem } from "../types";

export const problems: Problem[] = [
  {
    id: "parking-lot",
    title: "Parking Lot",
    requirements: [
      "Support multiple vehicle types (e.g. Motorcycle, Car, Bus/Truck) with differing spot size requirements.",
      "Manage a limited number of parking spots organized across multiple levels or rows.",
      "Issue a parking ticket with entry timestamp and assigned spot upon vehicle entry.",
      "Calculate parking fees dynamically on exit based on duration and vehicle type.",
      "Track and report available parking spots in real-time.",
    ],
    constraints: [
      "Clean separation of concerns between spot allocation, ticketing, and fee calculation.",
      "Extensible fee calculation without modifying core parking lot logic (Strategy pattern).",
      "Thread-safe or concurrency-aware spot allocation abstractions.",
    ],
    expectedEntities: ["Vehicle", "ParkingSpot", "Ticket", "ParkingLot"],
  },
  {
    id: "vending-machine",
    title: "Vending Machine",
    requirements: [
      "Support item selection via item codes and verify inventory availability.",
      "Accept payments in multiple denominations, validate balance, and handle insufficient funds.",
      "Dispense selected item and calculate/dispense appropriate change.",
      "Support transaction cancellation at any point before dispensing with full refund.",
      "Track inventory counts and provide maintenance/restocking capabilities.",
    ],
    constraints: [
      "Model state transitions cleanly (Idle, ItemSelected, MoneyInserted, Dispensing) using the State pattern.",
      "Ensure payment handling and inventory management remain decoupled.",
      "Prevent inconsistent inventory state during concurrent or failed transactions.",
    ],
    expectedEntities: ["Item", "Inventory", "PaymentStrategy", "VendingMachine"],
  },
  {
    id: "elevator-system",
    title: "Elevator System",
    requirements: [
      "Manage multiple elevators servicing a building with multiple floors.",
      "Handle pickup requests from any floor with direction awareness (Up/Down) and destination floor requests from inside elevator cars.",
      "Track elevator motion, current floor, direction, and door states (Open, Closed).",
      "Enforce maximum weight or passenger capacity limits per elevator car.",
      "Dispatch elevators to service requests based on a scheduling strategy (e.g. Nearest Elevator, SCAN/LOOK algorithm).",
    ],
    constraints: [
      "Decouple elevator car movement and door control from request dispatching logic.",
      "Support pluggable or extensible dispatch/scheduling strategies (Strategy pattern).",
      "Maintain consistent state transitions (Idle, Moving, Stopped, DoorOpening, DoorClosing).",
    ],
    expectedEntities: ["Elevator", "ElevatorController", "Request", "Floor"],
  },
];
