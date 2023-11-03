import { Timestamp } from '../../generic/timestamp.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('payment')
export class Payment extends Timestamp {
  @Column({
    primary: true,
  })
  id: string; //? Checkout id

  @ManyToOne(() => User, (user) => user.prestigesBought, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    orphanedRowAction: 'delete',
  })
  user: User;
}
