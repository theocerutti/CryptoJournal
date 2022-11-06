import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionInfo } from './transaction-info.entity';
import { ColumnNumericTransformer } from '../utils/transformer';
import { User } from './user.entity';
import { Asset } from './asset.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.transactions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @OneToOne(() => TransactionInfo, (info) => info.transactionTo, {
    nullable: false,
    cascade: true,
  })
  to: TransactionInfo;

  @OneToOne(() => TransactionInfo, (info) => info.transactionFrom, {
    nullable: false,
    cascade: true,
  })
  from: TransactionInfo;

  @Column({ nullable: true })
  note: string;

  @Column({
    type: 'decimal',
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  feeAmount: number;

  @Column({
    type: 'decimal',
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  feePrice: number;

  @OneToOne(() => Asset, {
    nullable: false,
    createForeignKeyConstraints: false,
    onUpdate: 'NO ACTION',
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  feeAsset: Asset;

  @Column({ type: 'timestamp' })
  date: Date;
}
