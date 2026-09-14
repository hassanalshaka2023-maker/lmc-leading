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
import {
  CreateEducationalServiceDto,
  UpdateEducationalServiceDto,
} from './dto/educational-service.dto';
import { EducationalServicesService } from './educational-services.service';

@ApiTags('educational-services')
@Controller('educational-services')
export class EducationalServicesController {
  constructor(private readonly service: EducationalServicesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List published educational services' })
  findAll() {
    return this.service.findAllPublic();
  }
}

@ApiTags('admin: educational-services')
@ApiBearerAuth()
@Controller('admin/educational-services')
export class AdminEducationalServicesController {
  constructor(private readonly service: EducationalServicesService) {}

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
  create(@Body() dto: CreateEducationalServiceDto) {
    return this.service.create(dto as never);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEducationalServiceDto) {
    return this.service.update(id, dto as never);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
