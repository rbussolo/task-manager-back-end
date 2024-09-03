export class AppError {
  public readonly code: string;
  public readonly message: string;
  public readonly statusCode: number;
  public readonly extra: string[] | undefined;

  constructor(
    message: string,
    statusCode = 400,
    code = '',
    extra: string[] | undefined = undefined,
  ) {
    this.code = code;
    this.message = message;
    this.statusCode = statusCode;
    this.extra = extra;
  }
}
