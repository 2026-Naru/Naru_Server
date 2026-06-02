import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'exchange_transactions' })
export class ExchangeTransaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.exchangeTransactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'varchar', length: 10, name: 'from_currency' })
  fromCurrency!: string;

  @Column({ type: 'varchar', length: 10, name: 'to_currency' })
  toCurrency!: string;

  @Column({ type: 'decimal', name: 'amount_from' })
  amountFrom!: string;

  @Column({ type: 'decimal', name: 'amount_to' })
  amountTo!: string;

  @Column({ type: 'decimal', name: 'exchange_rate' })
  exchangeRate!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
