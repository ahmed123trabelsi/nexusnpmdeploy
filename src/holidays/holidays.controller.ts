// holiday.controller.ts

import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { Holiday } from './schema/Holidays.Schema'; 
import { HolidayService } from './holidays.service'; 

@Controller('/holidays')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Post("/add")
  async create(@Body() createHolidayDto: Holiday): Promise<Holiday> {
    return this.holidayService.create(createHolidayDto);
  }

  @Get()
  async findAll(): Promise<Holiday[]> {
    return this.holidayService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Holiday> {
    return this.holidayService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateHolidayDto: Holiday): Promise<Holiday> {
    return this.holidayService.update(id, updateHolidayDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Holiday> {
    return this.holidayService.remove(id);
  }
}
