import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Menu } from './menu.entity';
import { Order } from './order.entity';
import { Review } from './review.entity';
import { Category } from './category.entity';

@Entity({ name: 'stores' })
export class Store {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Category, (category) => category.stores, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category!: Category | null;

  @Column({ length: 200 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'text', nullable: true })
  address!: string | null;

  @Column({ type: 'decimal', nullable: true })
  latitude!: string | null;

  @Column({ type: 'decimal', nullable: true })
  longitude!: string | null;

  @Column({ type: 'text', nullable: true, name: 'image_url' })
  imageUrl!: string | null;

  @Column({ type: 'decimal', default: 0 })
  rating!: string;

  @Column({ type: 'integer', name: 'review_count', default: 0 })
  reviewCount!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => Menu, (menu) => menu.store)
  menus!: Menu[];

  @OneToMany(() => Order, (order) => order.store)
  orders!: Order[];

  @OneToMany(() => Review, (review) => review.store)
  reviews!: Review[];
}
