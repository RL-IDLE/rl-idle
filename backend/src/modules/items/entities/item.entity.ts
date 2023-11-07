import { IItem, IItemBought } from 'src/types/item';
import { Timestamp } from '../../generic/timestamp.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../../modules/users/entities/user.entity';

@Entity('item')
export class Item extends Timestamp implements IItem {
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
  moneyPerSecond: string;

  @Column()
  moneyPerClickMult: string;
}

@Entity('itemBought')
@Unique(['item', 'user'])
export class ItemBought extends Timestamp implements IItemBought {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Item, (item) => item.id, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  item: Item;

  @ManyToOne(() => User, (user) => user.itemsBought, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
    orphanedRowAction: 'delete',
  })
  user: User;
}
