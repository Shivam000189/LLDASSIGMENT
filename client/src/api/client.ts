import type { Problem, Attempt, ApiResponse } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });
  } catch (error) {
    throw new Error(
      `Network error while fetching ${url}: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  let body: ApiResponse<T>;
  try {
    body = await response.json();
  } catch {
    throw new Error(`Failed to parse response JSON from ${url} (HTTP ${response.status})`);
  }

  if (!response.ok || !body.success) {
    const errorMsg = body.message || `Request to ${endpoint} failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return body.data;
}

export async function getProblems(): Promise<Problem[]> {
  return request<Problem[]>("/problems");
}

export async function getProblem(id: string): Promise<Problem> {
  return request<Problem>(`/problems/${encodeURIComponent(id)}`);
}

export async function createAttempt(
  problemId: string,
  learnerId: string,
  code: string
): Promise<Attempt> {
  return request<Attempt>("/attempts", {
    method: "POST",
    body: JSON.stringify({ problemId, learnerId, code }),
  });
}

export async function getAttempt(id: string): Promise<Attempt> {
  return request<Attempt>(`/attempts/${encodeURIComponent(id)}`);
}

export async function getAttemptHistory(
  problemId: string,
  learnerId: string
): Promise<Attempt[]> {
  const params = new URLSearchParams({
    problemId,
    learnerId,
  });
  return request<Attempt[]>(`/attempts?${params.toString()}`);
}
