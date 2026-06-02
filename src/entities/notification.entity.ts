import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Order, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'order_id' })
  order!: Order | null;

  @Column({ type: 'varchar', length: 300 })
  title!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'boolean', name: 'is_read', default: false })
  isRead!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'expires_at' })
  expiresAt!: Date | null;
}
