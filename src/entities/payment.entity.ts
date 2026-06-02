import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @Column({ type: 'decimal' })
  amount!: string;

  @Column({ type: 'varchar', length: 100, name: 'card_company', nullable: true })
  cardCompany!: string | null;

  @Column({ type: 'timestamp', nullable: true, name: 'paid_at' })
  paidAt!: Date | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status!: string | null;
}
