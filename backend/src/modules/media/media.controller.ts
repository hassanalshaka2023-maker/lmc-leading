import {
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { MediaService } from './media.service';

const MAX_UPLOAD_BYTES = (Number(process.env.MAX_UPLOAD_MB) || 5) * 1024 * 1024;

@ApiTags('admin: media')
@ApiBearerAuth()
@Controller('admin/media')
export class MediaController {
  constructor(private readonly service: MediaService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload an image (png/jpeg/webp/gif)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        // SVG deliberately excluded — it can carry scripts. Raster formats only.
        .addFileTypeValidator({ fileType: /^image\/(png|jpe?g|webp|gif)$/ })
        .addMaxSizeValidator({ maxSize: MAX_UPLOAD_BYTES })
        .build({ fileIsRequired: true }),
    )
    file: Express.Multer.File,
    @CurrentUser('userId') userId: string,
  ) {
    return this.service.upload(file, userId);
  }

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
