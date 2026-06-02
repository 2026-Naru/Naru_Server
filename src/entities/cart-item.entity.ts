import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { Menu } from './menu.entity';

@Entity({ name: 'cart_items' })
export class CartItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart!: Cart;

  @ManyToOne(() => Menu, (menu) => menu.cartItems, { onDelete: 'NO ACTION' })
  menu!: Menu;

  @Column({ type: 'integer', default: 1 })
  quantity!: number;
}
