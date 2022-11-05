import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.assets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @Column()
  name: string;

  @Column()
  priceTrackerUrl: string;
}
