import { IUser } from 'src/types/user';
import { Timestamp } from '../../generic/timestamp.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User extends Timestamp implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', default: '0' })
  money: string;

  @Column({ type: 'varchar', default: '1' })
  moneyPerClick: string;
}
