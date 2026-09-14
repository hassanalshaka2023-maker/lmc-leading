import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { ReorderItemDto } from '../dto/reorder.dto';

type Filter = Record<string, unknown>;

/**
 * Shared CRUD for "ordered, publishable content" collections
 * (language programs, corporate programs, services, trainers, testimonials,
 * partners). Public reads are limited to published docs; admin reads see all.
 */
export abstract class BaseCrudService<TDoc> {
  protected constructor(protected readonly model: Model<TDoc>) {}

  findAllPublic(filter: Filter = {}) {
    return this.model
      .find({ isPublished: true, ...filter } as never)
      .sort({ order: 1, createdAt: 1 })
      .lean()
      .exec();
  }

  findAllAdmin(filter: Filter = {}) {
    return this.model
      .find(filter as never)
      .sort({ order: 1, createdAt: 1 })
      .lean()
      .exec();
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).lean().exec();
    if (!doc) throw new NotFoundException(`${this.model.modelName} not found`);
    return doc;
  }

  async create(dto: Partial<TDoc>) {
    const doc = await this.model.create(dto as never);
    // Plain object, same as the other methods.
    return doc.toObject() as unknown;
  }

  async update(id: string, dto: Partial<TDoc>) {
    const doc = await this.model
      .findByIdAndUpdate(id, dto as never, {
        returnDocument: 'after',
        runValidators: true,
      })
      .lean()
      .exec();
    if (!doc) throw new NotFoundException(`${this.model.modelName} not found`);
    return doc;
  }

  async remove(id: string) {
    const doc = await this.model.findByIdAndDelete(id).lean().exec();
    if (!doc) throw new NotFoundException(`${this.model.modelName} not found`);
    return { deleted: true, id };
  }

  async reorder(items: ReorderItemDto[]) {
    await this.model.bulkWrite(
      items.map((i) => ({
        updateOne: {
          filter: { _id: i.id },
          update: { $set: { order: i.order } },
        },
      })) as never,
    );
    return this.findAllAdmin();
  }
}
