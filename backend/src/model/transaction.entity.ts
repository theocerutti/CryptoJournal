import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ColumnNumericTransformer } from '../utils/transformer';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column({
    type: 'decimal',
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @Column({ type: 'timestamp', nullable: false })
  date: Date;

  @Column({
    type: 'decimal',
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  fees: number;

  @Column('boolean', { default: false })
  fromBank: boolean = false;

  @Column('boolean', { default: false })
  toBank: boolean = false;
}
