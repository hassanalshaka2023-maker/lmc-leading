import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto';
import { Page, PageDocument } from './schemas/page.schema';

@Injectable()
export class PagesService {
  constructor(
    @InjectModel(Page.name) private readonly model: Model<PageDocument>,
  ) {}

  findAll() {
    return this.model.find().sort({ key: 1 }).lean().exec();
  }

  async findByKey(key: string) {
    const page = await this.model
      .findOne({ key: key.toLowerCase() })
      .lean()
      .exec();
    if (!page) throw new NotFoundException(`Page "${key}" not found`);
    return page;
  }

  async create(dto: CreatePageDto) {
    const exists = await this.model.exists({ key: dto.key.toLowerCase() });
    if (exists) throw new ConflictException(`Page "${dto.key}" already exists`);
    return this.model.create(dto);
  }

  async update(key: string, dto: UpdatePageDto) {
    const page = await this.model
      .findOneAndUpdate(
        { key: key.toLowerCase() },
        { $set: dto },
        {
          returnDocument: 'after',
          runValidators: true,
        },
      )
      .lean()
      .exec();
    if (!page) throw new NotFoundException(`Page "${key}" not found`);
    return page;
  }

  async remove(key: string) {
    const page = await this.model
      .findOneAndDelete({ key: key.toLowerCase() })
      .lean()
      .exec();
    if (!page) throw new NotFoundException(`Page "${key}" not found`);
    return { deleted: true, key };
  }
}
