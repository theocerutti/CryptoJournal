import {
  BeforeInsert,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';
import { RefreshToken } from './refresh_token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Exclude()
  @Length(4, 16)
  @Column({ nullable: false })
  password: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Exclude()
  @OneToOne(() => RefreshToken, (refresh) => refresh.user, {
    onDelete: 'CASCADE',
  })
  refresh_token: RefreshToken;

  @BeforeInsert()
  async hashPassword() {
    try {
      const saltRounds = bcrypt.getRounds(this.password);
      if (saltRounds === 0) {
        this.password = bcrypt.hashSync(this.password, 10);
      }
      const salt = bcrypt.genSaltSync(10);
      this.password = bcrypt.hashSync(this.password, salt);
    } catch (error) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
