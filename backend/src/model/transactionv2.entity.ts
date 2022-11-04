import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionInfo } from './transaction-info.entity';
import { ColumnNumericTransformer } from '../utils/transformer';
import { User } from './user.entity';

@Entity()
export class TransactionV2 {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.transactionsV2, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

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
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  fees: number; // TODO: MUST not be null if feesCurrency is not null

  @Column({ nullable: true })
  feesCurrency: string; // TODO: MUST not be null if fees is not null

  @Column({ type: 'timestamp' })
  date: Date;
}
