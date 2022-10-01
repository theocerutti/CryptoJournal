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
  @JoinColumn()
  user: User;

  @Column({ type: 'timestamp', nullable: false })
  buyDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  sellDate: Date;

  @Column({
    type: 'decimal',
    nullable: false,
  })
  buyPrice: number;

  @Column({
    type: 'decimal',
    nullable: true,
  })
  sellPrice: number;

  @Column({ type: 'text', nullable: true })
  buyNote: string;

  @Column({ type: 'text', nullable: true })
  sellNote: string;

  @Column({ nullable: false })
  name: string;

  @Column({
    type: 'decimal',
    nullable: false,
  })
  fees: number;

  @Column({ type: 'decimal', nullable: false })
  investedAmount: number;

  @Column({ type: 'decimal', nullable: false })
  holdings: number;

  @Column({ nullable: true })
  locationName: string;

  @Column({ nullable: true })
  primaryTag: string;

  @Column({ nullable: true })
  secondaryTag: string;

  @Column({ nullable: false })
  priceLink: string;
}
