import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Store } from './store.entity';
import { CartItem } from './cart-item.entity';
import { OrderItem } from './order-item.entity';
import { MenuAllergy } from './menu-allergy.entity';

@Entity({ name: 'menus' })
export class Menu {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Store, (store) => store.menus, { onDelete: 'CASCADE' })
  store!: Store;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'integer' })
  price!: number;

  @Column({ type: 'text', nullable: true, name: 'image_url' })
  imageUrl!: string | null;

  @Column({ type: 'text', nullable: true, name: 'allergy_notice' })
  allergyNotice!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @OneToMany(() => CartItem, (item) => item.menu)
  cartItems!: CartItem[];

  @OneToMany(() => OrderItem, (item) => item.menu)
  orderItems!: OrderItem[];

  @OneToMany(() => MenuAllergy, (menuAllergy) => menuAllergy.menu)
  menuAllergies!: MenuAllergy[];
}
