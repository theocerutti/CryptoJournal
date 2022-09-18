import { HttpException, HttpStatus } from '@nestjs/common';

export class ExpiredJwtToken extends HttpException {
  constructor() {
    super(
      {
        message: 'JwtToken: expired',
        statusCode: HttpStatus.UNAUTHORIZED,
        type: 'ExpiredJwtToken', // important: it is to identify which type of "401 error" it is
      },
      HttpStatus.UNAUTHORIZED
    );
  }
}
