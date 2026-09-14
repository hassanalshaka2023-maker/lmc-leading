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
import { ReorderDto } from '../../common/dto/reorder.dto';
import { CorporateProgramsService } from './corporate-programs.service';
import {
  CreateCorporateProgramDto,
  UpdateCorporateProgramDto,
} from './dto/corporate-program.dto';

@ApiTags('corporate-programs')
@Controller('corporate-programs')
export class CorporateProgramsController {
  constructor(private readonly service: CorporateProgramsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List published corporate training programs' })
  findAll() {
    return this.service.findAllPublic();
  }
}

@ApiTags('admin: corporate-programs')
@ApiBearerAuth()
@Controller('admin/corporate-programs')
export class AdminCorporateProgramsController {
  constructor(private readonly service: CorporateProgramsService) {}

  @Get()
  findAll() {
    return this.service.findAllAdmin();
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
  create(@Body() dto: CreateCorporateProgramDto) {
    return this.service.create(dto as never);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCorporateProgramDto) {
    return this.service.update(id, dto as never);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
