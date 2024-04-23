import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePayrollDto } from './dto/CreatePayroll.dto';
import { PaymentP } from 'src/payment-policy/Schema/PaymentPolicyschema';
import { Payroll } from './Schema/Payroll.schema';
import { Poste } from './Schema/Poste.schema';
import { User } from 'src/auth/Shemas/User.shema';
import { AttendanceService } from 'src/attendance/attendance.service';
import { AuthService } from 'src/auth/auth.service';
import { PaymentPolicyService } from 'src/payment-policy/payment-policy.service';
import { CongeService } from 'src/conges/Conge.service';
import { Cron } from '@nestjs/schedule';
import { Role } from 'src/auth/Shemas/Roles.Shema';


@Injectable()
export class PayrollService {


    constructor(
        @InjectModel(PaymentP.name) private PayPolicyModel: Model<PaymentP>,
        @InjectModel(Payroll.name) private PayrollModel: Model<Payroll>,
        @InjectModel(Poste.name) private posteModel: Model<Poste>,
        @InjectModel(User.name) private userModel:Model<User>,
        private readonly AttendanceS : AttendanceService,
        private readonly authSer : AuthService,
        private readonly PaymentPSer: PaymentPolicyService,
        private readonly CongeSer: CongeService

      ) {
      

      }
    
      async createPayrollP({ ...payrollDTO }: CreatePayrollDto) {
        try {
          // Récupérer tous les documents de PaymentP
          const allPaymentP = await this.PayPolicyModel.find({});
      
          // Créer le Payroll avec les objets PaymentP
          const paymentPObjects = allPaymentP.map((paymentP) => paymentP);
      
          const newPayroll = new this.PayrollModel({
            ...payrollDTO,
            paymentPolicy: paymentPObjects,
          });
      
          const savedPayroll = await newPayroll.save();
      
          return savedPayroll;
        } catch (error) {
          console.error('Error creating payroll:', error);
          throw new HttpException(`Error creating payroll: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
      
      

      
    
      async getAllPayrollsWithUsersAndPoste(): Promise<any[]> {
        try {
          const payrolle = await this.PayrollModel
            .find()
            .populate({
              path: 'user',
              select: 'firstName lastName email Matricule',
              populate: { path: 'poste', 
              select: 'PostName' ,},
            }).lean() // Convertit les résultats en objets JavaScript simples
            .select({
              _id: 1,
              netSalary: 1,
              'user.firstName': "",
              'user.lastName': "",
              'user.email': "",
              'user.Matricule': "",
              'user.poste.PostName': "",
            })
            .exec();
    
            
           
           console.log('Payrolls',payrolle) 
      
          return payrolle;
        } catch (error) {
          console.error('Error retrieving payrolls with users and poste:', error);
          throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }


      async createPayroll(createPayrollDto: CreatePayrollDto): Promise<any> {
        const { month, year, basicSalary, deductions, netSalary } = createPayrollDto;
      
        try {
          // Crée une nouvelle instance de payroll avec les données fournies
          const newPayroll = new this.PayrollModel({
            month,
            year,
            basicSalary,
            deductions,
            netSalary,
          });
      
          console.log(newPayroll);
      
          // Enregistre le nouveau payroll dans la base de données
          const createdPayroll = await newPayroll.save();
          console.log(createdPayroll);
      
          // Vérification si l'enregistrement a réussi
          if (!createdPayroll) {
            throw new Error("L'enregistrement de la paie a échoué.");
          }
      
          return createdPayroll;
        } catch (error) {
          
          console.error("Une erreur est survenue lors de la création de la paie :", error);
          throw error; 
        }
      }
      
      
      async createPayrollAndAssociateWithUser(createPayrollDto: CreatePayrollDto, userId: string): Promise<Payroll> {
        const { month, year, basicSalary, deductions, netSalary } = createPayrollDto;
        
        // Créer une nouvelle instance de paie avec les données fournies
        const newPayroll = new this.PayrollModel({
          month,
          year,
          basicSalary,
          deductions,
          netSalary,
        });
        console.log(newPayroll)       
        const user = await this.userModel.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
    
        
        user.payrolls.push(newPayroll._id);
        console.log(user)
        await user.save();
    
       
        await newPayroll.save();
        
    
        return newPayroll;
      }
    
    
     

  //     async createDefaultPayrollsForNewUsers(): Promise<void> {
        

  //       const currentDate = new Date();

  //      const usersWithoutPayroll = await this.userModel.find(
  //  {
  //           $or: [
  //           { payrolls: { $eq: null } }, 
  //           { payrolls: { $size: 0 } }, 
  //         ],
         
        
       
  //      }).exec();
      
      
  //       for (const user of usersWithoutPayroll) {
         
  //           // Créer un nouveau payroll avec des valeurs par défaut
  //           const newPayroll = new this.PayrollModel({
  //               month: new Date().getMonth() + 1,
  //               year: new Date().getFullYear(),
  //               basicSalary: 0,
  //               deductions: 0,
  //               netSalary: 0,
  //               user:user._id,  // Associer l'utilisateur au payroll
  //           });
            
  //           await user.payrolls.push(newPayroll._id);
           
           
  //           await user.save();
  //           await newPayroll.save();
            
            
            
  //       }
  //   }
  async createDefaultPayrollsForNewUsers(): Promise<void> {
    const currentDate = new Date();

    const usersWithoutPayroll = await this.userModel.find({
        $or: [
            { payrolls: { $eq: null } },
            { payrolls: { $size: 0 } },
        ],
        role: 'Employee', // Filtre par rôle "employee"
        poste: {
            $exists: true,
            $nin: [null, []], // Poste n'est ni null ni un tableau vide
        },
    }).exec();

    for (const user of usersWithoutPayroll) {
        // Créer un nouveau payroll avec des valeurs par défaut
        const newPayroll = new this.PayrollModel({
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            basicSalary: 0,
            deductions: 0,
            netSalary: 0,
            user: user._id,  // Associer l'utilisateur au payroll
        });

        await user.payrolls.push(newPayroll._id);

        await user.save();
        await newPayroll.save();
    }
}
async getPayrollWithPaymentPolicy(payrollId: string): Promise<{ payroll: any, deductions: number[] }> {
  try {
    // Recherche de la payroll avec l'ID spécifié
    const payroll = await this.PayrollModel
      .findById(payrollId)
      .populate({
        path: 'user',
        model: 'User', // Assurez-vous que c'est le bon nom du modèle
      })
      .exec();

    // Vérifier si la payroll existe
    if (!payroll) {
      console.log('Payroll not found');
      throw new HttpException('Payroll not found', 404);
    }

    // Récupérer les informations de la politique de paiement
    const paymentPolicy = await this.PaymentPSer.findAll();
    const taxRate = (paymentPolicy[0].taxRate / 100) * payroll.basicSalary;
    const socialSecurityRate = (paymentPolicy[0].socialSecurityRate / 100) * payroll.basicSalary;
    const otherDeductions = paymentPolicy[0].otherDeductions;
    const deductions: number[] = [taxRate, socialSecurityRate, otherDeductions];

    return { payroll, deductions };
  } catch (error) {
    console.error('Error retrieving payroll:', error);
    throw new HttpException('Error retrieving payroll', 500);
  }
}
    

         
      async handleCron() {
        await this.schedulePayrollGeneration();
        
      }
      @Cron('0 */2 * * * *') 
      async schedulePayrollGeneration() {
        const paymentPolicy = await this.PayPolicyModel.findOne().sort({ createdAt: -1 });
        if (!paymentPolicy || !paymentPolicy.paymentDay) {
            throw new Error('PaymentPolicy, la date ou le jour de paiement est manquant.');
        }
    
        const today = new Date();
        console.log('Today',today)
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1; // Les mois commencent à 0, donc on ajoute 1
        const paymentDay = paymentPolicy.paymentDay;
    
        const targetDate = new Date(currentYear, currentMonth - 1, paymentDay);
       

        // Vérifier si la date actuelle correspond à la date spécifiée dans paymentDay
        if (today.getDate() === paymentDay && today.getMonth() + 1 === currentMonth) {
            // Calculer les dates de début et de fin
            const startDate = new Date(targetDate);
            // startDate.setDate(startDate.getDate() - 30); // Soustraire 30 jours
            startDate.setDate(startDate.getDate() - 24); 
            const endDate = new Date(targetDate);
            console.log('startDate   endDate',startDate,endDate)

            await this.createDefaultPayrollsForNewUsers();
            // Générer la paie
           await this.generatePayroll(startDate, endDate);
        }
    }
    
    async calculateNetSalary(id: string,startDate: Date, endDate: Date): Promise<Payroll>{
      
      const payrollWithUser = await this.PayrollModel
      .findById(id)
      .populate({
          path: 'user',
          populate: [
              { path: 'poste' },
              { path: 'leaves' }
          ]
      })
.exec();
      console.log('payrollWithUser:', payrollWithUser); // Ajouter cette ligne
      let excessDays=0;
      let absentDays=0;
      let presentDays=0;
      let PaymentPolicy: PaymentP[] = await this.PaymentPSer.findAll();
      console.log('PaymentPolicy:', PaymentPolicy); // Ajouter cette ligne
      
      let NetSalary: number = 0; // Initialiser netSalary à 0
  
      if (payrollWithUser) {
        let UserP=payrollWithUser.user;
        console.log("UserP",UserP)
        
          let PosteUser = payrollWithUser.user.poste;
          
          console.log('PosteUser:', PosteUser); // Ajouter cette ligne
 
                   const result = await this.AttendanceS.calculateAttendanceDaysSalaire(payrollWithUser.user._id,startDate, endDate);
                  
                  console.log('result:', result); // Ajouter cette ligne
  
                  presentDays = result.presentDays;
                   absentDays = result.absentDays;

                   NetSalary=PosteUser.BasicSalary;
                   console.log(NetSalary)
                  
                  for (const leave of payrollWithUser.user.leaves) {
                    console.log('user.leave:',leave)
                      const paymentPolicy = PaymentPolicy.find(policy => {
                        return policy.allowedDays.has(leave.leaveType);
                        
                      });

                      console.log('leave:', leave); // Ajouter cette ligne
                      console.log('paymentPolicy:', paymentPolicy); // Ajouter cette ligne
                          console.log('leave.status' ,leave.status)
                     
                          if (leave.status === 'Approved') {
                              let Congedays = this.CongeSer.calculateLeaveDuration(leave.startDate, leave.endDate, leave.startTime, leave.endTime)
                              console.log('Congedays:', await Congedays); // Ajouter cette ligne
                              const allowedDuration = paymentPolicy.allowedDays.get(leave.leaveType);
                              console.log('allowedDuration',allowedDuration !== undefined && (await Congedays).days <= allowedDuration);
                                if (allowedDuration !== undefined && (await Congedays).days <= allowedDuration) {
                                  if(absentDays>=(await Congedays).duration ){
                                    absentDays -= (await Congedays).duration;
                                  }
                                  else{
                                    absentDays = 0;
                                  }
                                  
                                  console.log('absentday,',absentDays)
                              } else {
                                if(absentDays>=(await Congedays).duration ){
                                  absentDays -= (await Congedays).duration;
                                }
                                else{
                                  absentDays = 0;
                                }
                                
                                   console.log('absentday,',absentDays)
                                // if((await Congedays).days>allowedDuration){
                                   excessDays = (await Congedays).days -allowedDuration;
                                 
                                  console.log('ecess', excessDays)
                                  NetSalary -=(PosteUser.BasicSalary / 30) * excessDays *paymentPolicy.exessDayPay;
                                  console.log('netsalaryecess',NetSalary )
                                 
                                 
                              }
                              
                          // }
                      
                  }}
                  console.log('ABSENTDaysRestant',absentDays)
                  NetSalary -= (PosteUser.BasicSalary / 30) * absentDays;
                  NetSalary -= ((PaymentPolicy[0].taxRate/100)*PosteUser.BasicSalary+(PaymentPolicy[0].socialSecurityRate/100)*PosteUser.BasicSalary+PaymentPolicy[0].otherDeductions)
                  
                  payrollWithUser.netSalary = NetSalary;
                  
                  payrollWithUser.deductions=((PaymentPolicy[0].taxRate/100)*PosteUser.BasicSalary+(PaymentPolicy[0].socialSecurityRate/100)*PosteUser.BasicSalary+PaymentPolicy[0].otherDeductions);
                 
                  console.log('DEDUCTIONS,',payrollWithUser.deductions);
                  payrollWithUser.basicSalary = PosteUser.BasicSalary;


                  
                  await payrollWithUser.save();
                  console.log('payrollWithUser',payrollWithUser )
                  return payrollWithUser;
                  
              }
      
     
            }
            async getUsersWithPost(): Promise<User[]> {
              const usersWithPost = await this.userModel.aggregate([
                  {
                      $match: {
                          role: 'Employee', // Filtre par rôle "employee"
                          poste: {
                              $exists: true,
                              $nin: [null, []], // Poste n'est ni null ni un tableau vide
                          },
                      },
                  },
              ]);
          
              return usersWithPost;
          }
          
          
    
            async generatePayroll(startDate: Date, endDate: Date): Promise<void> {
              const users = await this.getUsersWithPost(); 
              // Suppose que vous avez une méthode getAllUserIds() pour récupérer les IDs des utilisateurs
            console.log('USERS',users)
            
              for (const user of users) {
      
                if (!user ) {
                  console.log(`Utilisateur avec l'ID ${user} non trouvé.`);
                  continue; // Passez à l'utilisateur suivant s'il n'existe pas
                }
               
                console.log('user,',user)
                    const currentDate = new Date();
                const currentMonth = currentDate.getMonth() + 1; // Mois actuel (de 1 à 12)
                const currentYear = currentDate.getFullYear(); // Année actuelle
                const usersWithPayrolls = this.getUsersWithPayrolls();
                
                for (let pay of user.payrolls) {
                  console.log(user.payrolls.toString())
                  
                  let payroll = await this.PayrollModel.findById(pay.toString())
                  console.log('PAYROLL',payroll)
                  if (payroll.month === currentMonth && payroll.year === currentYear) {
                    console.log(payroll.month === currentMonth && payroll.year === currentYear)
                        let payrollId = payroll._id;
                        console.log(payrollId);
                        const payrolle = await this.calculateNetSalary(payrollId, startDate, endDate);
                        console.log('Payroll,',payrolle)
                    }
            
              console.log('La paie a été générée avec succès pour le mois courant.');
                }}}
      
      

      async getUsersWithPayrolls(): Promise<any[]> {
        const usersWithPayrolls = await this.userModel
          .find()
          .populate('payrolls')
          .exec();
      
        const payrollsOnly = usersWithPayrolls.map(user => user.payrolls);
      
        return payrollsOnly;
      }
      

              
   

     }
