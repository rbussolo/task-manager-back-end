export class AppError {
  public readonly code: string;
  public readonly message: string;
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400, code = '') {
    this.code = code;
    this.message = message;
    this.statusCode = statusCode;
  }
}
