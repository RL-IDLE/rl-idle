import {
  CanActivate,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { env } from 'src/env';

@Injectable()
export class OnlyDevGuard implements CanActivate {
  canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    if (env.ENV !== 'development')
      throw new HttpException(
        'Reset is only allowed in development mode',
        HttpStatus.BAD_REQUEST,
      );

    return true;
  }
}
