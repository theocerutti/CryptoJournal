import { HttpException } from '@nestjs/common';

export enum HttpErrorCode {
  NONE,
  JWT_ERROR,
}

class HttpError extends HttpException {
  private readonly clientMessage: string;
  private readonly id: number;

  constructor(clientMessage: string, err: Error | null, status: number, id = HttpErrorCode.NONE) {
    super(err, status);
    this.clientMessage = clientMessage;
    this.id = id;
  }

  public getClientMessage(): string {
    return this.clientMessage;
  }

  public getId(): HttpErrorCode {
    return this.id;
  }
}

export default HttpError;
