import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Order } from './order.entity';
import { Review } from './review.entity';
import { Exchange } from './exchange.entity';
import { Balance } from './balance.entity';
import { Country } from './country.entity';
import { UserAllergy } from './user-allergy.entity';
import { UserCoupon } from './user-coupon.entity';
import { ExchangeTransaction } from './exchange-transaction.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name!: string | null;

  @Column({ type: 'varchar', length: 200, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash', nullable: true })
  passwordHash!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone!: string | null;

  @Column({ type: 'text', nullable: true, name: 'profile_image_url' })
  profileImageUrl!: string | null;

  @ManyToOne(() => Country, { nullable: true })
  @JoinColumn({ name: 'country_id' })
  country!: Country | null;

  @Column({ type: 'decimal', name: 'balance_krw', default: 0 })
  balanceKrw!: string;

  @Column({ type: 'decimal', name: 'total_exchange_amount', default: 0 })
  totalExchangeAmount!: string;

  @Column({ type: 'integer', name: 'order_count', default: 0 })
  orderCount!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts!: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews!: Review[];

  @OneToMany(() => Exchange, (exchange) => exchange.user)
  exchanges!: Exchange[];

  @OneToMany(() => ExchangeTransaction, (transaction) => transaction.user)
  exchangeTransactions!: ExchangeTransaction[];

  @OneToMany(() => UserAllergy, (userAllergy) => userAllergy.user)
  userAllergies!: UserAllergy[];

  @OneToMany(() => UserCoupon, (userCoupon) => userCoupon.user)
  userCoupons!: UserCoupon[];

  @OneToOne(() => Balance, (balance) => balance.user)
  balance!: Balance;
}
