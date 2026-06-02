import { Entity, OneToOne, JoinColumn, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'balances' })
export class Balance {
  @PrimaryColumn({ name: 'user_id' })
  userId!: number;

  @OneToOne(() => User, (user) => user.balance, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'decimal', name: 'balance_krw', default: 0 })
  balanceKrw!: string;

  @Column({ type: 'decimal', name: 'balance_usd', default: 0 })
  balanceUsd!: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
