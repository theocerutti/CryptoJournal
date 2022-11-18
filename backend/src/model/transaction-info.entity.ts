import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ColumnNumericTransformer } from '../utils/transformer';
import { Portfolio } from './portfolio.entity';

@Entity()
export class TransactionInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  assetId: number;

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
