import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Menu } from './menu.entity';
import { Allergy } from './allergy.entity';

@Entity({ name: 'menu_allergies' })
export class MenuAllergy {
  @PrimaryColumn({ name: 'menu_id' })
  menuId!: number;

  @PrimaryColumn({ name: 'allergy_id' })
  allergyId!: number;

  @ManyToOne(() => Menu, (menu) => menu.menuAllergies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_id' })
  menu!: Menu;

  @ManyToOne(() => Allergy, (allergy) => allergy.menuAllergies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'allergy_id' })
  allergy!: Allergy;
}
