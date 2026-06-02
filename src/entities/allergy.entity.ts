import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MenuAllergy } from './menu-allergy.entity';
import { UserAllergy } from './user-allergy.entity';

@Entity({ name: 'allergies' })
export class Allergy {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @OneToMany(() => MenuAllergy, (menuAllergy) => menuAllergy.allergy)
  menuAllergies!: MenuAllergy[];

  @OneToMany(() => UserAllergy, (userAllergy) => userAllergy.allergy)
  userAllergies!: UserAllergy[];
}
