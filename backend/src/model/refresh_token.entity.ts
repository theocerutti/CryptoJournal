import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.refresh_token, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @Column()
  is_revoked: boolean;

  @Column()
  expires: Date;

  isExpired(): boolean {
    return this.expires < new Date();
  }
}
