import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Investment {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAat: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.investments, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ type: 'timestamp', nullable: false })
  buyDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  sellDate: Date;

  @Column({ type: 'float', nullable: false })
  buyPrice: number;

  @Column({ type: 'float', nullable: true })
  sellPrice: number;

  @Column({ type: 'text', nullable: true })
  buyNote: string;

  @Column({ type: 'text', nullable: true })
  sellNote: string;

  @Column()
  name: string;

  @Column({ type: 'float', nullable: false })
  fees: number;

  @Column()
  investedAmount: number;

  @Column()
  holdings: number;

  @Column()
  locationName: string;

  @Column()
  primaryTag: string;

  @Column()
  secondaryTag: string;

  @Column()
  priceLink: string;
}
