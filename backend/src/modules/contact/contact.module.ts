import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactInfo, ContactInfoSchema } from './schemas/contact-info.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContactInfo.name, schema: ContactInfoSchema },
    ]),
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
