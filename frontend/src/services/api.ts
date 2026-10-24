import Constants from "expo-constants";

const DEFAULT_API_BASE_URL = "http://10.0.2.2:3000/api";
const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");
let hasLoggedRuntime = false;

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
};

type ApiErrorResponse = {
  error?: {
    message?: unknown;
  };
};

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type UnauthorizedHandler = () => Promise<void> | void;

let unauthorizedHandler: UnauthorizedHandler | undefined;

export function setUnauthorizedHandler(handler?: UnauthorizedHandler): void {
  unauthorizedHandler = handler;
}

function readErrorMessage(payload: unknown): string | undefined {
  if (typeof payload === "object" && payload !== null && "error" in payload) {
    const error = (payload as ApiErrorResponse).error;
    if (error && typeof error.message === "string") {
      return error.message;
    }
  }

  return undefined;
}

function getRuntimeName(): string {
  switch (Constants.executionEnvironment) {
    case "storeClient":
      return Constants.expoGoConfig
        ? "Expo Go or development client"
        : "Expo development client";
    case "standalone":
      return "standalone build";
    case "bare":
      return "bare/custom native app";
    default:
      return "unknown Expo runtime";
  }
}

function logRuntimeOnce(): void {
  if (!__DEV__ || hasLoggedRuntime) {
    return;
  }

  hasLoggedRuntime = true;
  console.info("[API diagnostics] Runtime", {
    runtime: getRuntimeName(),
    executionEnvironment: Constants.executionEnvironment,
    expoGoConfigPresent: Constants.expoGoConfig !== null,
    baseUrl: API_BASE_URL,
  });
}

export async function apiRequest(
  path: string,
  options: ApiRequestOptions = {}
): Promise<unknown> {
  logRuntimeOnce();

  const headers: Record<string, string> = {};
  const method = options.method ?? "GET";
  const url = `${API_BASE_URL}${path}`;
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  let response: Response;
  try {
    if (__DEV__) {
      console.info("[API request]", { method, url });
    }

    response = await fetch(url, {
      method,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch (error) {
    if (__DEV__) {
      console.error("[API network failure]", {
        method,
        url,
        runtime: getRuntimeName(),
        errorName: error instanceof Error ? error.name : "UnknownError",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });
    }

    throw new ApiError(
      0,
      `Unable to connect to the server at ${API_BASE_URL}. Check the backend and Android HTTP configuration.`
    );
  }

  let responseText: string;
  try {
    responseText = await response.text();
  } catch (error) {
    if (__DEV__) {
      console.error("[API network failure while reading response]", {
        method,
        url,
        status: response.status,
        errorName: error instanceof Error ? error.name : "UnknownError",
      });
    }
    throw new ApiError(0, "The connection ended before the server response was read.");
  }

  let payload: unknown;
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch (error) {
      if (__DEV__) {
        console.error("[API JSON parse error]", {
          method,
          url,
          status: response.status,
          responseOk: response.ok,
          errorName: error instanceof Error ? error.name : "UnknownError",
        });
      }
      if (response.ok) {
        throw new ApiError(response.status, "The server returned an invalid response.");
      }
    }
  }

  if (!response.ok) {
    if (__DEV__) {
      console.warn("[API HTTP error]", {
        method,
        url,
        status: response.status,
      });
    }

    if (response.status === 401 && options.token) {
      await unauthorizedHandler?.();
    }

    throw new ApiError(
      response.status,
      readErrorMessage(payload) ?? "The request could not be completed."
    );
  }

  return payload;
}
