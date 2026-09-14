import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { UpdateSiteStatsDto } from './dto/site-stats.dto';
import { StatsService } from './stats.service';

@ApiTags('stats')
@Controller()
export class StatsController {
  constructor(private readonly service: StatsService) {}

  @Public()
  @Get('stats')
  @ApiOperation({ summary: 'Site-wide statistics (single source of truth)' })
  get() {
    return this.service.get();
  }

  @Get('admin/stats')
  @ApiBearerAuth()
  getAdmin() {
    return this.service.get();
  }

  @Patch('admin/stats')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the site statistics' })
  update(@Body() dto: UpdateSiteStatsDto) {
    return this.service.update(dto);
  }
}
