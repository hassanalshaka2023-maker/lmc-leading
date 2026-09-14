import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseCrudService } from '../../common/crud/base-crud.service';
import { Testimonial, TestimonialDocument } from './schemas/testimonial.schema';

@Injectable()
export class TestimonialsService extends BaseCrudService<TestimonialDocument> {
  constructor(
    @InjectModel(Testimonial.name) model: Model<TestimonialDocument>,
  ) {
    super(model);
  }
}
