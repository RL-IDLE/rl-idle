import { IUser } from 'src/types/user';
import { Timestamp } from '../../generic/timestamp.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemBought } from '../../../modules/items/entities/item.entity';
import { PrestigeBought } from '../../prestiges/entities/prestige.entity';

@Entity('user')
export class User extends Timestamp implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  username: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ type: 'varchar', default: '0' })
  moneyFromClick: string;

  @Column({ type: 'varchar', default: '1' })
  moneyPerClick: string;

  @Column({ type: 'varchar', default: '0' })
  moneyUsed: string;

  @OneToMany(() => ItemBought, (itemBought) => itemBought.user, {
    eager: true,
  })
  itemsBought: ItemBought[];

  @OneToMany(() => PrestigeBought, (prestigesBought) => prestigesBought.user, {
    eager: true,
  })
  prestigesBought: PrestigeBought[];

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  lastSeen: Date;

  @Column({
    default: '0',
  })
  emeralds: string;

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @Column({
    type: 'boolean',
    default: false,
  })
  passiveNotificationSent: boolean;

  @Column({
    default: '0',
  })
  latestBalance: string; //? Used for ranking
}

@Entity('subscription')
export class Subscription extends Timestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.subscriptions)
  user: User;

  @Column({
    type: 'jsonb',
  })
  subscription: unknown;
}
