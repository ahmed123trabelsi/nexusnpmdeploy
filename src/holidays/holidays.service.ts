// holiday.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Holiday } from './schema/Holidays.Schema'; 

@Injectable()
export class HolidayService {
  constructor(@InjectModel(Holiday.name) private readonly holidayModel: Model<Holiday>) {}

  async create(createHolidayDto: Holiday): Promise<Holiday> {
    const createdHoliday = new this.holidayModel(createHolidayDto);
    return createdHoliday.save();
  }

  async findAll(): Promise<Holiday[]> {
    return this.holidayModel.find().exec();
  }

  async findOne(id: string): Promise<Holiday> {
    return this.holidayModel.findById(id).exec();
  }

  async update(id: string, updateHolidayDto: Holiday): Promise<Holiday> {
    return this.holidayModel.findByIdAndUpdate(id, updateHolidayDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Holiday> {
    return this.holidayModel.findByIdAndRemove(id).exec();
  }
}
