import { BeforeInsert, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';
import { RefreshToken } from './refresh_token.entity';
import { Investment } from './investment.entity';
import { Transaction } from './transaction.entity';
import { Portfolio } from './portfolio.entity';
import { TransactionV2 } from './transactionv2.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Exclude()
  @Length(4, 16)
  @Column({ nullable: false })
  password: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Exclude()
  @OneToOne(() => RefreshToken, (refresh) => refresh.user, {
    onDelete: 'CASCADE',
  })
  refresh_token: RefreshToken;

  @OneToMany(() => Investment, (investment) => investment.user, {
    onDelete: 'CASCADE',
  })
  investments: Investment[];

  @OneToMany(() => TransactionV2, (transactionV2) => transactionV2.user, {
    onDelete: 'CASCADE',
  })
  transactionsV2: TransactionV2[];

  @OneToMany(() => Portfolio, (portfolio) => portfolio.user, {
    onDelete: 'CASCADE',
  })
  portfolios: Portfolio[];

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    onDelete: 'CASCADE',
  })
  transactions: Transaction[];

  @Column({ nullable: true })
  erc20Address: string;

  @Column({ nullable: true })
  btcAddress: string;

  @BeforeInsert()
  async hashPassword() {
    try {
      const saltRounds = bcrypt.getRounds(this.password);
      if (saltRounds === 0) {
        this.password = bcrypt.hashSync(this.password, 10);
      }
      const salt = bcrypt.genSaltSync(10);
      this.password = bcrypt.hashSync(this.password, salt);
    } catch (error) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
