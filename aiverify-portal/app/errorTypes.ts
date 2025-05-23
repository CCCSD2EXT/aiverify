export type PythonFastApiErrorDetail = {
  detail: string;
};

type PythonFastApiError = {
  status: number;
  data: PythonFastApiErrorDetail;
};

export type ErrorWithMessage = Error & {
  message: string;
};

export function isPythonFastApiError(
  error: unknown
): error is PythonFastApiError {
  if (typeof error !== 'object') {
    return false;
  }
  if (error === null) {
    return false;
  }
  if (
    'data' in error &&
    typeof error.data === 'object' &&
    error.data !== null
  ) {
    if ('detail' in error.data) {
      return typeof error.data.detail === 'string';
    }
  }
  return false;
}

// utils to handle try-catch error in a typed manner, because caught error is always unknown
export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

export function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isPythonFastApiError(maybeError)) {
    return new Error(maybeError.data.detail);
  }

  if (isErrorWithMessage(maybeError)) return maybeError;

  if (typeof maybeError === 'string') return new Error(maybeError);

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}
