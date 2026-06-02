import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Coupon } from './coupon.entity';

@Entity({ name: 'user_coupons' })
export class UserCoupon {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.userCoupons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Coupon, (coupon) => coupon.userCoupons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'coupon_id' })
  coupon!: Coupon;

  @Column({ type: 'boolean', name: 'is_used', default: false })
  isUsed!: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'used_at' })
  usedAt!: Date | null;
}
