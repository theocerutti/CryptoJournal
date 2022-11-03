import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { TransactionV2 } from './transactionv2.entity';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.portfolios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => TransactionV2, (transaction) => transaction.portfolio, {
    onDelete: 'CASCADE',
  })
  transactions: TransactionV2[];

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;
}
