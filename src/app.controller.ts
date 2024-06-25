import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Default')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({ type: 'median/api/v1' })
  getHello(): string {
    return this.appService.getHello();
  }
}
