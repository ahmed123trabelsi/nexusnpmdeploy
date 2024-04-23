import {HttpException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from '@nestjs/mongoose'
import {Model} from 'mongoose'
import {CreateLeaveDto} from "./dto/createConge.dto";
import {Leave, TimeOfDay} from "./Schema/Leaves.schema";
import {User} from "../auth/Shemas/User.shema";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class CongeService {
    constructor(@InjectModel(Leave.name) private leaveModel:Model<Leave> , private readonly personelService :AuthService , @InjectModel(User.name) private personnelModel:Model<User>) {
    }
    async accepterDemandeConge(id: string): Promise<Leave> {
        const demandeConge = await this.leaveModel.findById(id);
        if (!demandeConge) {
            throw new NotFoundException('Demande de congé introuvable');
        }

        demandeConge.status = 'Approved';
        const personnelId = demandeConge.personnel;
        const personnel = await this.personnelModel.findById(personnelId);
        if (!personnel) {
            throw new NotFoundException('Employé introuvable');
        }

        // Utiliser calculateLeaveDuration pour obtenir la durée du congee
        const { duration } = await this.calculateLeaveDuration(demandeConge.startDate, demandeConge.endDate, demandeConge.startTime, demandeConge.endTime);

        personnel.soldeConges -= duration;
        await Promise.all([demandeConge.save(), personnel.save()]);

        return demandeConge;
    }
    async refuserDemandeConge(id: string): Promise<Leave> {
        const demandeConge = await this.leaveModel.findById(id);
        if (!demandeConge) {
            throw new NotFoundException('Demande de congé introuvable');
        }
        demandeConge.status = 'Declined';
        //demandeConge.motifRefus = motifRefus;
        return demandeConge.save();

    }
    async supprimerDemandeConge(id: string): Promise<void> {
        const demandeConge = await this.leaveModel.findByIdAndDelete(id);
        if (!demandeConge) {
            throw new NotFoundException('Demande de congé introuvable');
        }
        await this.personnelModel.updateOne({ Leave: id }, { $pull: { Conges: id } });
    }
    // @Cron('0 0 1 1 * *')
    // //@Cron(CronExpression.EVERY_5_SECONDS)
    // async updateCongeBalance() {
    //     try {
    //         console.log('Updating conge balance for all employees...');
    //         const employees = await this.personnelModel.find();
    //         for (const employee of employees) {
    //             employee.soldeConges += 30;
    //             await employee.save();
    //         }
    //
    //         console.log('Conge balance updated for all employees.');
    //     } catch (error) {
    //         console.error('Error updating conge balance:', error);
    //     }
    // }
    async updateConge(id: string, updateLeaveDto: CreateLeaveDto): Promise<Leave> {
        const existingConge = await this.leaveModel.findById(id);
        if (!existingConge) {
            throw new NotFoundException('Demande de congé introuvable');
        }
        if (existingConge.status !== 'Approved') {
            if (updateLeaveDto.leaveType) {
                existingConge.leaveType = updateLeaveDto.leaveType;
            }
            if (updateLeaveDto.startDate) {
                existingConge.startDate = updateLeaveDto.startDate.toString();;
            }
            if (updateLeaveDto.endDate) {
                existingConge.endDate = updateLeaveDto.endDate.toString();;
            }

            if (updateLeaveDto.reason) {
                existingConge.reason = updateLeaveDto.reason;
            }
            return await existingConge.save();
        } else {
            throw new NotFoundException('Impossible de mettre à jour une demande de congé déjà approuvée');
        }
    }
   
    async getDemandeCongeById(congeId: string): Promise<Leave> {
        const conge = await this.leaveModel.findById(congeId);
        if (!conge) {
            throw new NotFoundException('Demande de congé introuvable');
        }
        return conge;
    }

    async getAllUsers(): Promise<User[]> {
        const users = await this.personnelModel.find().populate('congés').exec();
      
        if (!users || users.length === 0) {
          throw new NotFoundException('Aucun utilisateur trouvé');
        }
      
        return users;
      }
    async getLeavesByEmployee(id: string): Promise<Leave[]> {
        try {
            const user = await this.personnelModel.findById(id).populate('leaves'); // Utilisez populate pour récupérer les congés associés à l'employé
            if (!user) {
                throw new Error(`Employee not found with id ${id}`);
            }
            return user.leaves; // Renvoie les congés de l'employé
        } catch (error) {
            throw new Error(`Failed to fetch leaves for employee ${id}: ${error.message}`);
        }
    }
   async getLeaveBalance(id: string): Promise<number> {
        const personnel = await this.personnelModel.findOne({ _id: id });
        if (!personnel) {
            throw new Error('Employee not found');
        }
        return personnel.soldeConges ;
    }
    async getUnapprovedLeaves(): Promise<Leave[]> {
        return this.leaveModel.find({ status: { $ne: 'Approved' } }).exec();
    }
    async prioritizeUnapprovedLeavesBycreatedAt(): Promise<Leave[]> {
        return await this.leaveModel.find({status: 'Pending'}).sort({createdAt : 1})
    }
    async calculateLeaveDuration(startDate: string, endDate: string, startTime: TimeOfDay, endTime: TimeOfDay): Promise<{ days: number; duration: number }> {
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);
        const startUtcDateTime = new Date(Date.UTC(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate()));
        const endUtcDateTime = new Date(Date.UTC(endDateTime.getFullYear(), endDateTime.getMonth(), endDateTime.getDate()));
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const days = Math.floor((endUtcDateTime.getTime() - startUtcDateTime.getTime()) / millisecondsPerDay) + 1;
        let duration: number = 0;
        if (days > 1) {
            duration += days;
             if (startTime === TimeOfDay.Afternoon) {
                duration -= 0.5;
                 if (endTime === TimeOfDay.Morning  || endTime === TimeOfDay.Afternoon) {
                         duration -= 0.5;
                }
             }
             else if (startTime === TimeOfDay.Morning){
                 if (endTime === TimeOfDay.Morning  || endTime === TimeOfDay.Afternoon) {
                     duration -= 0.5;
                 }
             }
        }
        else if (days === 1) {
            duration+=days;
            if(startTime === TimeOfDay.noone && endTime ===TimeOfDay.noone){
                duration =days;
            }
            else if (startTime === TimeOfDay.Morning && endTime === TimeOfDay.Morning && duration != days) {
                throw  new HttpException( 'auccune date',404);
            }
            else if(  startTime=== TimeOfDay.Morning  && endTime === TimeOfDay.noone || startTime === TimeOfDay.noone && endTime === TimeOfDay.Afternoon && duration != days) {
                duration -= 0.5 ;
            }
        } else if (days === 0) {
            duration = 0;
        }
        console.log(days , duration);
        return { days: days >= 0 ? days : 0, duration };
        }

    async ajouterDemandeConge(createLeaveDto: CreateLeaveDto) {
        const { personnelId, ...leaveData } = createLeaveDto;
        const findPersonnel = await this.personnelModel.findById(personnelId);
        if (!findPersonnel) {
            throw new HttpException('Employee not found', 404);
        }
        console.log(findPersonnel)
        const { startDate, endDate, startTime, endTime } = leaveData;
        const { days, duration } = await this.calculateLeaveDuration(startDate, endDate, startTime, endTime);
        const numOfDays = duration;

        if (leaveData.leaveType === 'paid leave') {
            const soldeConges = await this.personelService.getSoldesConges(personnelId);

            if (numOfDays > soldeConges) {
                throw new NotFoundException('Solde de congés insuffisant');
            }
        }
        const newConge = new this.leaveModel({ ...leaveData, personnel: findPersonnel._id, numOfDays });
        const savedConge = await newConge.save();
        await this.personnelModel.updateOne({ _id: personnelId }, { $push: { leaves: savedConge._id } });
        return savedConge;
        };
    
    async getAllUsersWithConges1(): Promise<User[]> {
        const users = await this.personnelModel.find().populate(['leaves']).exec();
      
        if (!users || users.length === 0) {
          throw new NotFoundException('Aucun utilisateur trouvé');
        }
      
        return users;
      }

   
    async getUsersWithLeaves(): Promise<{ name: string; leaves: Leave[] }[]> {
        const usersWithLeaves = await this.personnelModel
          .find()
          .populate('leaves')
          .exec();
    
        return usersWithLeaves.map((user) => ({
          name: user.firstName + ' ' + user.lastName,
          id : user._id,
          leaves: user.leaves,
        }));
      }
      async ifLeave(dateLeave: string, personalId: string): Promise<boolean> {
        const leaves = await this.getLeaves(personalId);
        const leaveDate = dateLeave;
        for (const leave of leaves) {
            const startDate = leave.startDate;
            const endDate =leave.endDate;
            console.log(leaveDate + "#" , startDate  + "#" , endDate);

            if (leaveDate >= startDate && leaveDate <= endDate) {
                return true; 
            }
        }
        return false;
    }
    async getLeaves(personalId: string): Promise<Leave[]> {
        try {
            const personal = await this.personnelModel
                .findById(personalId)
                .populate('leaves')
                .exec();

            const personalLeaves = personal?.leaves ?? [];
            return personalLeaves;
        } catch (error) {
            throw new Error('Une erreur s\'est produite lors de la récupération des congés.');
        }
    }
}
