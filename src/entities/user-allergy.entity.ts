import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Allergy } from './allergy.entity';

@Entity({ name: 'user_allergies' })
export class UserAllergy {
  @PrimaryColumn({ name: 'user_id' })
  userId!: number;

  @PrimaryColumn({ name: 'allergy_id' })
  allergyId!: number;

  @ManyToOne(() => User, (user) => user.userAllergies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Allergy, (allergy) => allergy.userAllergies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'allergy_id' })
  allergy!: Allergy;
}
