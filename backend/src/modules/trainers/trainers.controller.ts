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
import { CreateTrainerDto, UpdateTrainerDto } from './dto/trainer.dto';
import { TrainersService } from './trainers.service';

@ApiTags('trainers')
@Controller('trainers')
export class TrainersController {
  constructor(private readonly service: TrainersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List published trainers' })
  findAll() {
    return this.service.findAllPublic();
  }
}

@ApiTags('admin: trainers')
@ApiBearerAuth()
@Controller('admin/trainers')
export class AdminTrainersController {
  constructor(private readonly service: TrainersService) {}

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
  create(@Body() dto: CreateTrainerDto) {
    return this.service.create(dto as never);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTrainerDto) {
    return this.service.update(id, dto as never);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
