import { HttpException } from '@nestjs/common';

class HttpError extends HttpException {
  private readonly clientMessage: string;

  constructor(clientMessage, err: Error | null, status: number) {
    super(err, status);
    this.clientMessage = clientMessage;
  }

  public getClientMessage(): string {
    return this.clientMessage;
  }
}

export default HttpError;
