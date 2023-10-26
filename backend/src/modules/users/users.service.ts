import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { api } from 'src/types/api';
import { getOneData, saveOneData } from 'src/lib/storage';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async load(
    loadUser: typeof api.user.load.body,
  ): Promise<typeof api.user.load.response> {
    // await sleep(10000);

    //? If no user id is set, create a new user
    let userId: string | undefined;
    if (!('id' in loadUser)) {
      const newUser = await this.usersRepository.save({});
      userId = newUser.id;
    }
    //? Otherwise, load the user
    const dbUser = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: 'id' in loadUser ? loadUser.id : (userId as string),
    });
    if (!dbUser) throw new HttpException('User not found', 404);
    const user = dbUser;
    return user;
  }

  async reset(
    resetUser: typeof api.user.reset.body,
  ): Promise<typeof api.user.reset.response> {
    const dbUser = await getOneData({
      databaseRepository: this.usersRepository,
      key: 'users',
      id: resetUser.id,
    });
    if (!dbUser) throw new HttpException('User not found', 404);
    const user = dbUser;
    user.moneyFromClick = '0';
    user.moneyPerClick = '1';
    user.moneyUsed = '0';
    user.itemsBought = [];
    user.prestigesBought = [];
    await saveOneData({
      key: 'users',
      id: user.id,
      data: user,
    });
    return user;
  }
}
