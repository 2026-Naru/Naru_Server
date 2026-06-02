import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Menu } from './menu.entity';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order!: Order;

  @ManyToOne(() => Menu, (menu) => menu.orderItems, { onDelete: 'NO ACTION' })
  menu!: Menu;

  @Column({ type: 'integer', default: 1 })
  quantity!: number;

  @Column({ type: 'decimal', nullable: true })
  price!: string | null;
}
