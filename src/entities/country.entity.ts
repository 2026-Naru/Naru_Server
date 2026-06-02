import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'countries' })
export class Country {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 10, nullable: true, name: 'currency_code' })
  currencyCode!: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true, name: 'currency_symbol' })
  currencySymbol!: string | null;

  @OneToMany(() => User, (user) => user.country)
  users!: User[];
}
