import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto';
import { PagesService } from './pages.service';

@ApiTags('pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly service: PagesService) {}

  @Public()
  @Get(':key')
  @ApiOperation({ summary: 'Get an editable page by key (home, about, …)' })
  findByKey(@Param('key') key: string) {
    return this.service.findByKey(key);
  }
}

@ApiTags('admin: pages')
@ApiBearerAuth()
@Controller('admin/pages')
export class AdminPagesController {
  constructor(private readonly service: PagesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':key')
  findByKey(@Param('key') key: string) {
    return this.service.findByKey(key);
  }

  @Post()
  create(@Body() dto: CreatePageDto) {
    return this.service.create(dto);
  }

  @Patch(':key')
  update(@Param('key') key: string, @Body() dto: UpdatePageDto) {
    return this.service.update(key, dto);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.service.remove(key);
  }
}
