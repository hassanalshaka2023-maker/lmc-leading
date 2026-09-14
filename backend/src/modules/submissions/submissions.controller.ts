import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  Ip,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import {
  CreateSubmissionDto,
  QuerySubmissionsDto,
  UpdateSubmissionDto,
} from './dto/submission.dto';
import { SubmissionsService } from './submissions.service';

@ApiTags('submissions')
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly service: SubmissionsService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Submit a contact / enrolment request' })
  create(@Body() dto: CreateSubmissionDto, @Ip() ip: string) {
    return this.service.create(dto, ip);
  }
}

@ApiTags('admin: submissions')
@ApiBearerAuth()
@Controller('admin/submissions')
export class AdminSubmissionsController {
  constructor(private readonly service: SubmissionsService) {}

  @Get()
  @ApiOperation({ summary: 'List submissions (paginated, filterable)' })
  findAll(@Query() query: QuerySubmissionsDto) {
    return this.service.findAll(query);
  }

  @Get('export')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="submissions.csv"')
  @ApiOperation({ summary: 'Export filtered submissions as CSV' })
  async export(@Query() query: QuerySubmissionsDto, @Res() res: Response) {
    const csv = await this.service.exportCsv(query);
    res.send('﻿' + csv); // BOM so Excel reads UTF-8 (Arabic) correctly
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update status / notes' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSubmissionDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.service.update(id, dto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
