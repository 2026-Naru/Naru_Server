import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { CartItem } from './cart-item.entity';

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.carts, { onDelete: 'CASCADE' })
  user!: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => CartItem, (item) => item.cart)
  items!: CartItem[];
}
