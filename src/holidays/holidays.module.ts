import { Module } from '@nestjs/common';
import { HolidayController } from './holidays.controller';
import { HolidayService } from './holidays.service';
import { Holiday, HolidaySchema } from './schema/Holidays.Schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: Holiday.name, schema: HolidaySchema },
      ]),
    ],
    controllers: [HolidayController],
    providers: [HolidayService],
  })
export class HolidaysModule {}
