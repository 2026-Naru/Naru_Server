import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Store } from './store.entity';
import { User } from './user.entity';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Store, (store) => store.reviews, { onDelete: 'CASCADE' })
  store!: Store;

  @ManyToOne(() => User, (user) => user.reviews, { nullable: true, onDelete: 'SET NULL' })
  user!: User | null;

  @Column({ type: 'integer' })
  rating!: number;

  @Column({ type: 'text', nullable: true })
  content!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
