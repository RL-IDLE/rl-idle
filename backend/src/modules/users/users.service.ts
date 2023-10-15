import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { api } from 'src/types/api';

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

    let user: User;
    //? If no user id is set, create a new user
    if (!('id' in loadUser)) {
      user = await this.usersRepository.save({});
    }
    //? Otherwise, load the user
    else {
      const dbUser = await this.usersRepository.findOne({
        where: { id: loadUser.id },
      });
      if (!dbUser) throw new HttpException('User not found', 404);
      user = dbUser;
    }
    return user;
  }
}
