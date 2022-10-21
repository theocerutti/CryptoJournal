import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { ColumnNumericTransformer } from '../utils/transformer';
import { OrderInvestmentStatus } from '../shared/investment';
import { InvestmentType } from '../shared/investment/investment';

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
      throw new Error('Buy date cannot be in the future');
    }
    if (this.sellDate && this.sellDate < this.buyDate) {
      throw new Error('Sell date cannot be before buy date');
    }
    if (this.investedAmount < 0) throw new Error('Invested amount cannot be negative');
    if (this.fees < 0) throw new Error('Fees cannot be negative');
    if (this.buyPrice < 0) throw new Error('Buy price cannot be negative');
    if (this.sellPrice && this.sellPrice < 0) throw new Error('Sell price cannot be negative');
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
      throw new Error('Invested amount cannot be 0 if it is not a gift');
    }
  }
}
