import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'exchange_rates' })
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 10, name: 'from_currency' })
  fromCurrency!: string;

  @Column({ type: 'varchar', length: 10, name: 'to_currency' })
  toCurrency!: string;

  @Column({ type: 'decimal' })
  rate!: string;

  @CreateDateColumn({ name: 'fetched_at' })
  fetchedAt!: Date;
}
