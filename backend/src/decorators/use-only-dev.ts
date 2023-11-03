import { UseGuards } from '@nestjs/common';
import { OnlyDevGuard } from 'src/guards/only-dev.guard';

export const UseOnlyDev = () => UseGuards(OnlyDevGuard);
