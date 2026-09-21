export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'خطایی در احراز هویت رخ داد. لطفاً دوباره تلاش کنید.';
  }

  const message = error.message.toLowerCase();

  if (message.includes('invalid login credentials')) {
    return 'ایمیل یا رمز عبور صحیح نیست.';
  }

  if (message.includes('email not confirmed')) {
    return 'ایمیل شما هنوز تأیید نشده است.';
  }

  if (message.includes('user already registered')) {
    return 'این ایمیل قبلاً ثبت‌نام کرده است.';
  }

  if (message.includes('password')) {
    return 'رمز عبور واردشده معتبر نیست.';
  }

  if (message.includes('rate limit')) {
    return 'تعداد درخواست‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کنید.';
  }

  return 'خطایی در احراز هویت رخ داد. لطفاً دوباره تلاش کنید.';
}

export function mapAuthError(error: unknown): Error {
  return new Error(getAuthErrorMessage(error));
}
