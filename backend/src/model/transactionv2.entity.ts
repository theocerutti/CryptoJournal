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
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  fees: number;

  @Column()
  feesCurrency: string;

  @Column({ type: 'timestamp' })
  date: Date;
}
