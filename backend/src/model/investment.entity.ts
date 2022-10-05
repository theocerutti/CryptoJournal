import {
  BeforeInsert,
  BeforeUpdate,
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
import { InvestmentStatus } from '../shared/investment';

@Entity()
export class Investment {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.investments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @Column({
    type: 'enum',
    enum: InvestmentStatus,
    default: InvestmentStatus.OPEN,
  })
  status: InvestmentStatus;

  @Column({ type: 'timestamp', nullable: false })
  buyDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  sellDate: Date;

  @Column({
    type: 'decimal',
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  buyPrice: number;

  @Column({
    type: 'decimal',
    nullable: true,
    transformer: new ColumnNumericTransformer(),
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
    transformer: new ColumnNumericTransformer(),
  })
  fees: number;

  @Column({
    type: 'decimal',
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  investedAmount: number;

  @Column({
    type: 'decimal',
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  holdings: number;

  @Column({ nullable: true })
  locationName: string;

  @Column({ nullable: true })
  primaryTag: string;

  @Column({ nullable: true })
  secondaryTag: string;

  @Column({ nullable: false })
  priceLink: string;

  @BeforeInsert()
  @BeforeUpdate()
  recalculateHoldings() {
    this.holdings = this.investedAmount / this.buyPrice;
  }

  @BeforeInsert()
  @BeforeUpdate()
  updateStatus() {
    if (this.sellPrice) {
      this.status = InvestmentStatus.CLOSED;
    } else {
      this.status = InvestmentStatus.OPEN;
    }
  }
}
