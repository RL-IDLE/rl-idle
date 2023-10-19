import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ILoadUser } from 'src/types/user';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('load')
  load(@Body() loadUser: ILoadUser) {
    return this.usersService.load(loadUser);
  }
}
