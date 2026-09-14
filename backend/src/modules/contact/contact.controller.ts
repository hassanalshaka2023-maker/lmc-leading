import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { ContactService } from './contact.service';
import { UpdateContactInfoDto } from './dto/contact-info.dto';

@ApiTags('contact')
@Controller()
export class ContactController {
  constructor(private readonly service: ContactService) {}

  @Public()
  @Get('contact-info')
  @ApiOperation({ summary: 'Structured contact details (phone, WhatsApp, …)' })
  get() {
    return this.service.get();
  }

  @Get('admin/contact-info')
  @ApiBearerAuth()
  getAdmin() {
    return this.service.get();
  }

  @Patch('admin/contact-info')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the contact details' })
  update(@Body() dto: UpdateContactInfoDto) {
    return this.service.update(dto);
  }
}
