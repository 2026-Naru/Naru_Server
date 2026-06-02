import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'exchanges' })
export class Exchange {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.exchanges, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'varchar', length: 20 })
  type!: string;

  @Column({ type: 'decimal' })
  amount!: string;

  @Column({ type: 'varchar', length: 10 })
  currency!: string;

  @Column({ type: 'decimal', name: 'balance_after', nullable: true })
  balanceAfter!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
