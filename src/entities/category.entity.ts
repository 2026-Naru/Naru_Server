import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Store } from './store.entity';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'text', nullable: true, name: 'image_url' })
  imageUrl!: string | null;

  @OneToMany(() => Store, (store) => store.category)
  stores!: Store[];
}
