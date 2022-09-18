import { EntityRepository, Repository } from 'typeorm';
import { User } from '../model/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {}
