import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserCoupon } from './user-coupon.entity';

@Entity({ name: 'coupons' })
export class Coupon {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'decimal', name: 'discount_amount', nullable: true })
  discountAmount!: string | null;

  @Column({ type: 'timestamp', nullable: true, name: 'expires_at' })
  expiresAt!: Date | null;

  @OneToMany(() => UserCoupon, (userCoupon) => userCoupon.coupon)
  userCoupons!: UserCoupon[];
}
