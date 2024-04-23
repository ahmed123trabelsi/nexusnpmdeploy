
import { Controller, Post, Body, HttpException, Get, Delete, Param, Put, NotFoundException, Query, HttpStatus } from '@nestjs/common';
import { MissionService } from './mission.service';
import { Mission } from './Shemas/Mission.Shema';
import { CreateMissionDto } from './Dto/CreateMission.Dto';
import { UpdateMissionDto } from './Dto/UpdateMission.Dto';
import mongoose, { Types } from 'mongoose';

@Controller('missions')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Post('assign-user')
  async assignUserToMission(
    @Body() data: { missionId: string, userId: string }
  ): Promise<Mission> {
    try {
      const { missionId, userId } = data;
      const mission = await this.missionService.assignUserToMission(missionId, userId);
      return mission;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  @Post()
  async createMission(@Body() createMissionDto: CreateMissionDto): Promise<Mission> {
    try {
      return await this.missionService.createMission(createMissionDto);
    } catch (error) {
      throw error;
    }
  }
  // @Get()
  // async getAll(): Promise<Array<Mission>>{
  //   return await this.missionService.findAll();

  // }
  @Delete('/:missionId')
  async deleteMission(@Param('missionId') missionId: string): Promise<void> {
    const existingMission = await this.missionService.findById(missionId);
    if (existingMission) {
      await this.missionService.deleteMission(missionId);
    } else {
      throw new HttpException('Mission non trouvée', 404);
    }
  }
  @Get()
  async findAll(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10): Promise<Mission[]> {
    if (page < 1 || pageSize < 1) {
      throw new HttpException('Invalid page number or page size', 400);
    }
    return this.missionService.findAll(page, pageSize);
  }
  @Put(':missionId')
  async updateMission(
    @Param('missionId') missionId: string,
    @Body() updateMissionDto: UpdateMissionDto
  ): Promise<Mission> {
    const existingMission = await this.missionService.findById(missionId);

    if (!existingMission) {
      throw new NotFoundException('Mission not found');
    }

    if (updateMissionDto.title) {
      existingMission.title = updateMissionDto.title;
    }
    if (updateMissionDto.description) {
      existingMission.description = updateMissionDto.description;
    }
    if (updateMissionDto.startDate) {
      existingMission.startDate = updateMissionDto.startDate;
    }
    if (updateMissionDto.endDate) {
      existingMission.endDate = updateMissionDto.endDate;
    }

    return existingMission.save();
  }

  // @Delete('delete-multiple')
  // async deleteMultipleMissions(@Body() missionIds: string[]): Promise<void> {
  //   try {
  //     const objectIds = missionIds.map(id => Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null).filter(id => id !== null);

  //     if (objectIds.length === 0) {
  //       throw new HttpException('Invalid missionIds', HttpStatus.BAD_REQUEST);
  //     }
      
  //     for (const objectId of objectIds) {
  //       await this.missionService.deleteMission(objectId.toHexString());
  //     }
  //   } catch (error) {
  //     throw new HttpException('Error deleting missions', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
  // @Delete('/deletemultiple')
  // async deleteMultipleMissions(@Body() missionIds: string): Promise<void> {
  //   try {
  //     // Vérifier si missionIds est un tableau non vide
  //     if (!Array.isArray(missionIds) || missionIds.length === 0) {
  //       throw new HttpException('Invalid missionIds', HttpStatus.BAD_REQUEST);
  //     }

  //     // Vérifier si tous les identifiants sont valides
  //     const objectIds = missionIds.map(id => {
  //       if (!Types.ObjectId.isValid(id)) {
  //         throw new HttpException(`Invalid missionId: ${id}`, HttpStatus.BAD_REQUEST);
  //       }
  //       return new Types.ObjectId(id);
  //     });

  //     // Supprimer chaque mission
  //     for (const objectId of objectIds) {
  //       await this.missionService.deleteMission(objectId.toHexString());
  //     }
  //   } catch (error) {
  //     // Si une erreur est survenue, la renvoyer avec le code d'erreur approprié
  //     throw new HttpException('Error deleting missions', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }

  // }
  // console.log(missionIds);

//}
@Get("/deletemissions")
async delemissions(@Query('missions') missions :string[]):Promise<void>{
  console.log(missions);

}
@Post('delete-multiple')
async deleteMultipleMissions(@Body('ids') ids: string[]): Promise <void> {
  try {
    const result = await this.missionService.deleteMultipleMissions(ids);
  } catch (error) {
  }
}
}
