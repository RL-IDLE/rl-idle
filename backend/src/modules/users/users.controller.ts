import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  IConfirmPayment,
  IGive,
  IGiveItem,
  IGivePrestige,
  ILoadUser,
  IRemove,
  IRemoveItem,
  IRemovePrestige,
  IReset,
} from 'src/types/user';
import { UseOnlyDev } from 'src/decorators/use-only-dev';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('load')
  load(@Body() loadUser: ILoadUser) {
    return this.usersService.load(loadUser);
  }

  @Post('reset')
  @UseOnlyDev()
  reset(@Body() reset: IReset) {
    return this.usersService.reset(reset);
  }

  @Post('give')
  @UseOnlyDev()
  give(@Body() give: IGive) {
    return this.usersService.give(give);
  }

  @Post('remove')
  @UseOnlyDev()
  remove(@Body() remove: IRemove) {
    return this.usersService.remove(remove);
  }

  @Post('give-prestige')
  @UseOnlyDev()
  givePrestige(@Body() givePrestige: IGivePrestige) {
    return this.usersService.givePrestige(givePrestige);
  }

  @Post('remove-prestige')
  @UseOnlyDev()
  removePrestige(@Body() removePrestige: IRemovePrestige) {
    return this.usersService.removePrestige(removePrestige);
  }

  @Post('give-item')
  @UseOnlyDev()
  giveItem(@Body() giveItem: IGiveItem) {
    return this.usersService.giveItem(giveItem);
  }

  @Post('remove-item')
  @UseOnlyDev()
  removeItem(@Body() removeItem: IRemoveItem) {
    return this.usersService.removeItem(removeItem);
  }

  @Put('update-user')
  updateUser(@Body() updateUser: User) {
    return this.usersService.updateUser(updateUser);
  }

  @Post('sign-in')
  signIn(@Body() user: User) {
    return this.usersService.signIn(user);
  }

  @Post('confirm-payment')
  confirmPayment(@Body() payment: IConfirmPayment) {
    return this.usersService.confirmPayment(payment);
  }

  /**
   * NOTIFICATIONS
   */
  @Get('get-vapid-public-key')
  getVapidPublicKey() {
    return this.usersService.getVapidPublicKey();
  }

  @Post('subscribe')
  subscribe(
    @Body() subscription: { subscription: PushSubscription; userId: string },
  ) {
    return this.usersService.registerSubscription(
      subscription.subscription,
      subscription.userId,
    );
  }

  /**
   * RANKING
   */
  @Get('get-top-20-users')
  getTop20Users() {
    return this.usersService.getTop20Users();
  }
}
