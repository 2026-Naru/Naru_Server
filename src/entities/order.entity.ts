import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Store } from './store.entity';
import { Cart } from './cart.entity';
import { OrderItem } from './order-item.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.orders, { nullable: true, onDelete: 'SET NULL' })
  user!: User | null;

  @ManyToOne(() => Store, (store) => store.orders, { onDelete: 'NO ACTION' })
  store!: Store;

  @ManyToOne(() => Cart, { onDelete: 'NO ACTION', nullable: true })
  cart!: Cart | null;

  @Column({ type: 'text', nullable: true, name: 'delivery_address' })
  deliveryAddress!: string | null;

  @Column({ type: 'decimal', name: 'total_amount', default: 0 })
  totalAmount!: string;

  @Column({ type: 'varchar', length: 50, default: 'PAID' })
  status!: string;

  @CreateDateColumn({ name: 'ordered_at' })
  orderedAt!: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completedAt!: Date | null;

  @OneToMany(() => OrderItem, (item) => item.order)
  items!: OrderItem[];
}
