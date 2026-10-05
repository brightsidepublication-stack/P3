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

type SupabaseLikeError = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

function isSupabaseLikeError(
  error: unknown,
): error is SupabaseLikeError {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('code' in error || 'message' in error)
  );
}

export function toAppError(
  error: unknown,
  fallbackMessage = 'خطایی رخ داد. لطفاً دوباره تلاش کنید.',
): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (isSupabaseLikeError(error)) {
    const code = error.code;

    if (code === '42501') {
      return new AppError(
        'FORBIDDEN',
        `دسترسی به این عملیات مجاز نیست. جزئیات: ${error.message ?? 'خطای دسترسی'}`,
        { cause: error },
      );
    }

    if (code === '23503') {
      return new AppError(
        'VALIDATION',
        `یکی از اطلاعات انتخاب‌شده معتبر نیست. جزئیات: ${error.message ?? 'خطای ارتباط اطلاعات'}`,
        { cause: error },
      );
    }

    if (code === '23514') {
      return new AppError(
        'VALIDATION',
        `یکی از مقادیر واردشده با قوانین پایگاه داده سازگار نیست. جزئیات: ${error.message ?? 'خطای اعتبارسنجی'}`,
        { cause: error },
      );
    }

    if (code === '23505') {
      return new AppError(
        'VALIDATION',
        `اطلاعات تکراری است. جزئیات: ${error.message ?? 'رکورد تکراری'}`,
        { cause: error },
      );
    }

    if (code === '23502') {
      return new AppError(
        'VALIDATION',
        `یکی از اطلاعات الزامی وارد نشده است. جزئیات: ${error.message ?? 'مقدار الزامی خالی است'}`,
        { cause: error },
      );
    }

    return new AppError(
      'UNKNOWN',
      `خطای پایگاه داده: ${error.message ?? fallbackMessage}`,
      { cause: error },
    );
  }

  if (error instanceof TypeError) {
    return new AppError(
      'NETWORK',
      'ارتباط با سرور برقرار نشد.',
      { cause: error },
    );
  }

  if (error instanceof Error) {
    return new AppError(
      'UNKNOWN',
      `${fallbackMessage} جزئیات: ${error.message}`,
      { cause: error },
    );
  }

  return new AppError(
    'UNKNOWN',
    fallbackMessage,
    { cause: error },
  );
}