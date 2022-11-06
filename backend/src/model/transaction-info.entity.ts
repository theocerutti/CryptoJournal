import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ColumnNumericTransformer } from '../utils/transformer';
import { Portfolio } from './portfolio.entity';
import { Asset } from './asset.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class TransactionInfo {
  @PrimaryGeneratedColumn()
  id: number;

  // TODO: ugly to make the CASCADE work, makes column to be null 1/2
  @OneToOne(() => Transaction, (transaction) => transaction.to, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  transactionTo: Transaction;
  @OneToOne(() => Transaction, (transaction) => transaction.from, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  transactionFrom: Transaction;

  @OneToOne(() => Asset, {
    nullable: false,
    createForeignKeyConstraints: false,
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
  })
  @JoinColumn()
  asset: Asset;

  @OneToOne(() => Portfolio, {
    nullable: false,
    createForeignKeyConstraints: false,
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
  })
  @JoinColumn()
  portfolio: Portfolio;

  @Column({
    type: 'decimal',
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @Column({
    type: 'decimal',
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  price: number;
}
