// mission.service.ts

import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { EntreprisesService } from 'src/entreprises/entreprises.service';
import { CreateMissionDto } from './Dto/CreateMission.Dto';
import { Mission } from './Shemas/Mission.Shema';
import { TaskService } from 'src/project/task/task.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/Shemas/User.shema';
import { UpdateMissionDto } from './Dto/UpdateMission.Dto';

@Injectable()
export class MissionService {
  constructor(
    @InjectModel(Mission.name) private missionModel: Model<Mission>, @InjectModel(User.name)private UserModel: Model<User>,
    private enterpriseService: EntreprisesService,private TaskService:TaskService,private UserService:AuthService
  ) {}

  async createMission(createMissionDto: CreateMissionDto): Promise<Mission> {
    const createdMission = new this.missionModel(createMissionDto);
    // const enterpriseId = await this.enterpriseService.createEntreprise(createMissionDto.enterprise);
    // createdMission.lieu = enterpriseId;
    return createdMission.save();
  }

  // async findAll(): Promise<Mission[]> {
  //   return this.missionModel.find().exec();
  // }
  async assignUserToMission(missionId: string, userId: string): Promise<Mission> {
    const mission = await this.missionModel.findById(missionId);
    console.log(mission);
    const employee =await this.UserModel.findById(userId);
    const   datemission =  mission.startDate;
    console.log(datemission);
    const isdisponible =await this.TaskService.isUserDisponible(userId,datemission);
    console.log(isdisponible);
        if(isdisponible){
    mission.assignedTo.push(employee); 
    return mission.save();
  }else{throw new HttpException('Cet employé est indisponible dans cette date',400)}
}
async updateMission(missionId: string, updateMissionDto: UpdateMissionDto): Promise<Mission> {
  const existingMission = await this.missionModel.findById(missionId);

  if (!existingMission) {
    throw new HttpException('Mission non trouvée', 404);
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
async findById(missionId: string): Promise<Mission> {
  const mission = await this.missionModel.findById(missionId);
  if (!mission) {
    throw new HttpException('Mission non trouvée', 404);
  }
  return mission;
}
async deleteMission(missionId: string): Promise<void> {
  const existingMission = await this.findById(missionId);
  if (existingMission) {
    await this.missionModel.findByIdAndDelete(missionId);
  } else {
    throw new HttpException('Mission non trouvée', 404);
  }
}
async deleteMultipleMissions(ids: string[]):Promise<void> {
    try {
    console.log(ids);
      // Supprimer les missions en utilisant l'opérateur $in pour spécifier plusieurs IDs
      const result = await this.missionModel.deleteMany({ _id: { $in: ids } }).exec();
    
    } catch (error) {
      throw new Error(`Impossible de supprimer les missions : ${error}`);
    }
  }
// async deleteMultipleMissions(missionIds: string[]): Promise<void> {
//   try {
//     console.log(missionIds);
//     for(let missionId of missionIds) {
//       // await this.missionModel.deleteMany({ _id: { $in: missionIds } });
//       await this.missionModel.findByIdAndDelete({ _id: missionId });


//     }
//   } catch (error) {
//     throw new HttpException('error', 500);
//   }
// }
async findAll(pageNumber: number, pageSize: number): Promise<Mission[]> {
  const skip = (pageNumber - 1) * pageSize;
  return this.missionModel.find().skip(skip).limit(pageSize).exec();
}

}
