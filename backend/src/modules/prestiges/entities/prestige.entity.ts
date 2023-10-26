import { IPrestige, IPrestigeBought } from 'src/types/prestige';
import { Timestamp } from '../../generic/timestamp.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('prestige')
export class Prestige extends Timestamp implements IPrestige {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  image: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column()
  price: string;

  @Column()
  moneyMult: string;
}

@Entity('prestigeBought')
export class PrestigeBought extends Timestamp implements IPrestigeBought {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Prestige, (prestige) => prestige.id, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  prestige: Prestige;

  @ManyToOne(() => User, (user) => user.prestigesBought, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    orphanedRowAction: 'delete',
  })
  user: User;
}
