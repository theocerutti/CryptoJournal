import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { TransactionInfo } from './transaction-info.entity';
import { ColumnNumericTransformer } from '../utils/transformer';

@Entity()
export class TransactionV2 {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  portfolio: Portfolio;

  @OneToOne(() => TransactionInfo)
  @JoinColumn()
  to: TransactionInfo;

  @OneToOne(() => TransactionInfo)
  @JoinColumn()
  from: TransactionInfo;

  @Column({ nullable: true })
  note: string;

  @Column({
    type: 'decimal',
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  fees: number;

  @Column()
  feesCurrency: string;

  @Column({ type: 'timestamp' })
  date: Date;
}
