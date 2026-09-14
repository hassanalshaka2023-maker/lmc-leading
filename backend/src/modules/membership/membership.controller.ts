import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { UpdateMembershipContentDto } from './dto/membership-content.dto';
import { MembershipService } from './membership.service';

@ApiTags('membership')
@Controller()
export class MembershipController {
  constructor(private readonly service: MembershipService) {}

  @Public()
  @Get('membership')
  @ApiOperation({
    summary: 'Membership page content (static, no points engine)',
  })
  get() {
    return this.service.get();
  }

  @Get('admin/membership')
  @ApiBearerAuth()
  getAdmin() {
    return this.service.get();
  }

  @Patch('admin/membership')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update membership page content' })
  update(@Body() dto: UpdateMembershipContentDto) {
    return this.service.update(dto);
  }
}
