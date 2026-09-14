import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { ReorderDto } from '../../common/dto/reorder.dto';
import {
  CreateLanguageProgramDto,
  UpdateLanguageProgramDto,
} from './dto/language-program.dto';
import { QueryLanguageProgramsDto } from './dto/query-language-programs.dto';
import { LanguageProgramsService } from './language-programs.service';

@ApiTags('language-programs')
@Controller('language-programs')
export class LanguageProgramsController {
  constructor(private readonly service: LanguageProgramsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List published language programs' })
  findAll(@Query() query: QueryLanguageProgramsDto) {
    return this.service.listPublic(query.category);
  }
}

@ApiTags('admin: language-programs')
@ApiBearerAuth()
@Controller('admin/language-programs')
export class AdminLanguageProgramsController {
  constructor(private readonly service: LanguageProgramsService) {}

  @Get()
  findAll(@Query() query: QueryLanguageProgramsDto) {
    return this.service.listAdmin(query.category);
  }

  @Patch('reorder')
  reorder(@Body() dto: ReorderDto) {
    return this.service.reorder(dto.items);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateLanguageProgramDto) {
    return this.service.create(dto as never);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLanguageProgramDto) {
    return this.service.update(id, dto as never);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
