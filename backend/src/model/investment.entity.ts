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
import { OrderInvestmentStatus } from '../shared/investment';
import { InvestmentType } from '../shared/investment/investment';
import HttpError from '../exceptions/http.error';
import { HttpStatus } from '@nestjs/common';

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
    enum: OrderInvestmentStatus,
    default: OrderInvestmentStatus.OPEN,
  })
  orderStatus: OrderInvestmentStatus;

  @Column({
    type: 'enum',
    enum: InvestmentType,
    default: InvestmentType.NONE,
  })
  type: InvestmentType;

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

  @Column({ nullable: true })
  description: string;

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
  checkDate() {
    if (this.buyDate > new Date()) {
      throw new HttpError('Buy date cannot be in the future', null, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (this.sellDate && this.sellDate < this.buyDate) {
      throw new HttpError('Sell date cannot be before buy date', null, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (this.investedAmount < 0)
      throw new HttpError('Invested amount cannot be negative', null, HttpStatus.UNPROCESSABLE_ENTITY);
    if (this.fees < 0) throw new HttpError('Fees cannot be negative', null, HttpStatus.UNPROCESSABLE_ENTITY);
    if (this.buyPrice < 0) throw new HttpError('Buy price cannot be negative', null, HttpStatus.UNPROCESSABLE_ENTITY);
    if (this.sellPrice && this.sellPrice < 0)
      throw new HttpError('Sell price cannot be negative', null, HttpStatus.UNPROCESSABLE_ENTITY);
  }

  @BeforeInsert()
  @BeforeUpdate()
  recalculateHoldings() {
    this.holdings = this.investedAmount / this.buyPrice;
  }

  @BeforeInsert()
  @BeforeUpdate()
  updateStatus() {
    if (this.sellPrice) {
      this.orderStatus = OrderInvestmentStatus.CLOSED;
    } else {
      this.orderStatus = OrderInvestmentStatus.OPEN;
    }

    if (this.investedAmount === 0 && this.type !== InvestmentType.GIFT) {
      throw new HttpError('Invested amount cannot be 0 if it is not a gift', null, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
