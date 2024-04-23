import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {UpdateEtatDto} from "./dto/Attendance.dto";
import { Attendance, AttendanceStatus, Etat } from './Schema/Attendance.schema';
import { User } from 'src/auth/Shemas/User.shema';
import { AuthService } from 'src/auth/auth.service';
import * as moment from 'moment';

@Injectable()
export class AttendanceService {
    constructor(@InjectModel(Attendance.name) private attendanceModel: Model<Attendance>, @InjectModel(User.name) private userModel: Model<User> , private readonly authService : AuthService,private readonly personnelservice:AuthService) {
    }

    // async generateAttendanceTableForWeek1(): Promise<void> {
    //     const personnelList = await this.userModel.find().exec();

    //     const today = new Date();
    //     const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDay() - 1)); // Start from Monday
    //     const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6); // End on Sunday

    //     for (const personnel of personnelList) {
    //         const attendances = [];
    //         for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    //             const attendance = new this.attendanceModel({
    //                 date: currentDate,
    //                 etat: Etat.pending,
    //                 status: AttendanceStatus.Absent,
    //             });
    //             // Save the attendance
    //             await attendance.save();
    //             attendances.push(attendance); // Store the ID in the array
    //         }
    //         personnel.attendances = attendances;
    //         await personnel.save();
    //         //console.log(personnel.attendances)
    //     }
    // }
    async generateAttendanceTableForWeek(): Promise<void> {
        const personnelList = await this.userModel.find().exec();
    
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDay() - 1)); // Start from Monday
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6); // End on Sunday
    
        for (const personnel of personnelList) {
            const attendances = [];
            for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
                const formattedDate = currentDate.toISOString().split('T')[0]; // Extract YYYY-MM-DD part
                const dateParts = formattedDate.split('-');
                const formattedDateWithoutTime = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
                //console.log(formattedDateWithoutTime)
                const attendance = new this.attendanceModel({
                    date: formattedDateWithoutTime,                 

                    etat: Etat.pending,
                    status: AttendanceStatus.Absent,
                });
                // Save the attendance
                await attendance.save();
                attendances.push(attendance); // Store the ID in the array
            }
            personnel.attendances = attendances;
            await personnel.save();
        }
    }
    async generateAttendanceTableForWeek1(): Promise<void> {
        const personnelList = await this.userModel.find().exec();
        
        const today = moment();
        const startDate = today.clone().startOf('isoWeek'); // Récupère le lundi de cette semaine
        const endDate = startDate.clone().add(4, 'days'); // Ajoute 4 jours pour obtenir le vendredi de cette semaine
        
        for (const personnel of personnelList) {
            const attendances = [];
            for (let currentDate = startDate.clone(); currentDate.isSameOrBefore(endDate); currentDate.add(1, 'day')) {
                const formattedDate = currentDate.format('YYYY-MM-DD'); // Formatage de la date
                const attendance = new this.attendanceModel({
                    date: formattedDate,                 
                    etat: Etat.pending,
                    status: AttendanceStatus.Absent,
                });
                // Enregistrez la présence
                await attendance.save();
                attendances.push(attendance); // Stockez l'ID dans le tableau
            }
            personnel.attendances = attendances;
            await personnel.save();
        }
    }
    
    
    
    
    
    async getNotApprovedAttendances(personnelId: string): Promise<Attendance[]> {
        try {
            const attendanceList = await this.personnelservice.getAttendaces(personnelId);
            console.log(attendanceList);

            if (!attendanceList) {
                console.log('Impossible de récupérer la liste des présences.');
                return [];
            }

            console.log("après if");
            const notApprovedAttendances = attendanceList.filter(attendance => attendance.etat === Etat.pending);
            return notApprovedAttendances;
        } catch (error) {
            console.log('Une erreur s\'est produite lors de la récupération de la liste des présences :', error);
            return [];
        }
    }
    async getApprovedAttendances(personnelId: string): Promise<Attendance[]> {
        try {
            const attendanceList = await this.authService.getAttendaces(personnelId);
            console.log(attendanceList);

            if (!attendanceList) {
                console.log('Impossible de récupérer la liste des présences.');
                return [];
            }

            console.log("après if");
            const ApprovedAttendances = attendanceList.filter(attendance => attendance.etat !== Etat.pending);
            return ApprovedAttendances;
        } catch (error) {
            console.log('Une erreur s\'est produite lors de la récupération de la liste des présences :', error);
            return [];
        }
    }


    async getApprovedAttendancesSalaire(personnelId: string, startDate: Date, endDate: Date): Promise<Attendance[]> {
        try {
            const attendanceList = await this.authService.getAttendaces(personnelId); // Assurez-vous que getAttendaces accepte les paramètres de date
    
            console.log("Attendance List:", attendanceList);
            console.log("Start Date:", startDate);
            console.log("End Date:", endDate);
    
            console.log("après if");
            const ApprovedAttendances: Attendance[] = [];
           

    for (const attendance of attendanceList) {
        const attendanceDate = new Date(attendance.date);
        const newEndDate = new Date(endDate);
        newEndDate.setHours(23, 59, 59, 999);
        const newStartDate = new Date(startDate);
        newStartDate.setHours(23, 59, 59, 999);
        console.log(attendanceDate)
        console.log(attendanceDate >= startDate)
    if (attendance.etat != Etat.pending && attendanceDate >= newStartDate && attendanceDate <= newEndDate) {
        ApprovedAttendances.push(attendance);
    }
            }

            console.log(ApprovedAttendances)
            return ApprovedAttendances;
            
        } catch (error) {
            console.log('Une erreur s\'est produite lors de la récupération de la liste des présences :', error);
            return [];
        }}
    async validatePresence(personnelId: string, attend: UpdateEtatDto[]): Promise<void> {
        console.log(attend);
        const attendanceList = await this.getNotApprovedAttendances(personnelId);
        if (!attendanceList) {
            console.log('Impossible de récupérer la liste des présences.');
            return;
        }
        if (!Array.isArray(attend)) {
            console.log('attend doit être un tableau');
            return;
        }
        console.log(attendanceList);
        for (const attendance of attendanceList) {
            for (const att of attend) {
                const attendanceDate = new Date(attendance.date).setHours(0, 0, 0, 0);
                const attDate = new Date(att.date).setHours(0, 0, 0, 0);
                if (attendanceDate === attDate) {
                    attendance.etat = att.etat;
                    console.log(attendance.status);
                    // Mettre à jour l'objet de présence
                    await attendance.save();
                    console.log(attendance);
                }
            }
        }
    }
    async calculateAttendanceDays(personalId:string): Promise<object> {
        let presentDays = 0;
        let absentDays = 0;
        let attendanceList =  await this.getApprovedAttendances(personalId);
        for (const attendance of attendanceList) {
            console.log(attendanceList)
            if (attendance.status === 1 || attendance.status === 0.5 || attendance.status === 0.5) {
                presentDays += attendance.status;
            } else {
                absentDays +=1;
            }
            if (attendance.etat===Etat.declined){
                absentDays+=1;
            }
        }
        return { presentDays, absentDays };
    }
    async getEmployeesWithAttendances(): Promise<User[]> {
        return this.userModel.find().populate('attendances').exec();
      }

      async getAllEmployeesWithAttendances(): Promise<User[]> {
        try {
            
            const startDateOfWeek = moment().startOf('isoWeek').toDate(); // Lundi de la semaine en cours
            const endDateOfWeek = moment().endOf('isoWeek').subtract(1, 'day').toDate(); // Samedi de la semaine en cours
            console.log(startDateOfWeek);
            console.log(endDateOfWeek); 
          // Récupérer tous les utilisateurs avec leurs présences pour la semaine en cours
          const usersWithAttendances = await this.userModel
            .find()
            .populate({
              path: 'attendances',
              match: { date: { $gte: startDateOfWeek, $lte: endDateOfWeek } } // Filtrer les présences pour la semaine en cours
            })
            .exec();
    
          return usersWithAttendances;
        } catch (error) {
          throw new Error(`Unable to fetch users with attendances: ${error.message}`);
        }
      }
      async getEmployeeWithAttendancesById(userId: string): Promise<User | null> {
        try {
            const userWithAttendances = await this.userModel.findById(userId)
                .populate({
                    path: 'attendances',
                })
                .exec();
    
            return userWithAttendances;
        } catch (error) {
            throw new Error(`Unable to fetch user with attendances: ${error.message}`);
        }
    }
    async getUsersWithAttendances(): Promise<User[]> {
        try {
          const usersWithAttendances = await this.userModel.find({}, { firstName: 1, lastName: 1, attendances: 1 }).populate('attendances').exec();
          return usersWithAttendances;
        } catch (error) {
          throw new Error(`Unable to fetch users with attendances: ${error.message}`);
        }
    }
    // async generateAttendanceTableForMonth(): Promise<void> {
    //     const personnelList = await this.userModel.find({ attendances: [] }).exec();
    //     console.log('personnelList', personnelList);
    //     const today = new Date();
    //     const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    //     const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Le dernier jour du mois en cours
    
    //     for (const personnel of personnelList) {
    //         const attendances = [];
    //         for (let currentDate = new Date(firstDayOfMonth); currentDate <= lastDayOfMonth; currentDate.setDate(currentDate.getDate() + 1)) {
    //             let attendance;
    //             if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
    //                 // Jour de semaine - "approved" et "Présent"
    //                 attendance = new this.attendanceModel({
    //                       date: currentDate,
    //                     etat: Etat.pending,
    //                     status: AttendanceStatus.Absent,
                       
    //                 });
    //             } else {
    //                 // Week-end - "pending" et "Absent"
    //                 attendance = new this.attendanceModel({
    //                     date: currentDate,
    //                     etat: Etat.approuved,
    //                     status: AttendanceStatus.Present,
    //                 });
    //             }
    //             await attendance.save();
    //             attendances.push(attendance); // Stocker l'ID dans le tableau
    //         }
    //         personnel.attendances = attendances;
    //         await personnel.save();
    //     }
    // }
    
    async generateAttendanceTableForMonth(): Promise<void> {
        const personnelList = await this.userModel.find( { attendances: []  }).exec();
        console.log('personnelList',personnelList)
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Le dernier jour du mois en cours
    
        for (const personnel of personnelList) {
            const attendances = [];
            for (let currentDate = new Date(firstDayOfMonth); currentDate <= lastDayOfMonth; currentDate.setDate(currentDate.getDate() + 1)) {
                const attendance = new this.attendanceModel({
                    date: currentDate,
                    etat: Etat.pending,
                    status: AttendanceStatus.Absent,
                });
                // Enregistrer la présence
                await attendance.save();
                attendances.push(attendance); // Stocker l'ID dans le tableau
            }
            personnel.attendances = attendances;
            await personnel.save();
        }
    }
    
    async calculateAttendanceDaysSalaire(personalId: string, startDate: Date, endDate: Date): Promise<{ presentDays: number; absentDays: number }> {
        let presentDays = 0;
        let absentDays = 0;
        let attendanceList =  await this.getApprovedAttendancesSalaire(personalId, startDate, endDate);
        console.log('attendance',attendanceList)
        for (const attendance of attendanceList) {
            // Vérifier si l'état de l'assiduité est "Approuvé"
            if (attendance.etat === 'Approved') {
                // Incrémenter le nombre de jours présents en fonction du statut
                if (attendance.status === 1) {
                    presentDays++;
                } else if (attendance.status === 0.5) {
                    presentDays += 0.5;
                    absentDays  += 0.5;
                }
                else if (attendance.status === 0) {
                    absentDays += 1;
                }

            } else if (attendance.etat === 'Declined') {
                // Si l'assiduité est rejetée, incrémenter le nombre de jours absents
                absentDays++;
            }
        }
       
        return { presentDays, absentDays };
    }
}
