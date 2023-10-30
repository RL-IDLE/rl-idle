import { Controller, Get } from '@nestjs/common';
import { PrestigesService } from './prestiges.service';

@Controller('prestiges')
export class PrestigesController {
  constructor(private readonly prestigeService: PrestigesService) {}

  @Get()
  findAll() {
    return this.prestigeService.findAll();
  }
}
