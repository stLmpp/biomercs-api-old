import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { DefaultsDto } from './app.dto';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get('defaults')
  async defaults(): Promise<DefaultsDto> {
    return this.appService.defaults();
  }
}
