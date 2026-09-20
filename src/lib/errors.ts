export type AppErrorCode =
  | 'UNKNOWN'
  | 'NETWORK'
  | 'AUTH'
  | 'VALIDATION'
  | 'NOT_FOUND'
  | 'FORBIDDEN';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly userMessage: string;
  readonly cause?: unknown;

  constructor(
    code: AppErrorCode,
    userMessage: string,
    options?: {
      cause?: unknown;
    },
  ) {
    super(userMessage);
    this.name = 'AppError';
    this.code = code;
    this.userMessage = userMessage;
    this.cause = options?.cause;
  }
}

export function toAppError(
  error: unknown,
  fallbackMessage = 'خطایی رخ داد. لطفاً دوباره تلاش کنید.',
): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof TypeError) {
    return new AppError('NETWORK', 'ارتباط با سرور برقرار نشد.', {
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new AppError('UNKNOWN', fallbackMessage, {
      cause: error,
    });
  }

  return new AppError('UNKNOWN', fallbackMessage, {
    cause: error,
  });
}
