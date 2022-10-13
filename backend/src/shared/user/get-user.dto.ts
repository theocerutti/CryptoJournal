import { OmitType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class GetUserDto extends OmitType(UserDto, ['password'] as const) {}
