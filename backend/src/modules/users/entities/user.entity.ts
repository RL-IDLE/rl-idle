import { IUser } from 'src/types/user';
import { Timestamp } from '../../generic/timestamp.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ItemBought } from '../../../modules/items/entities/item.entity';
import { Prestige, PrestigeBought } from 'src/modules/prestige/prestige/prestige.entity';

@Entity('user')
export class User extends Timestamp implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @OneToMany(() => PrestigeBought, (prestigeBought) => prestigeBought.user, {
    eager: true,
  })
  prestigeBought: PrestigeBought[];
}
