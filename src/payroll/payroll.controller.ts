import { Body, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Post } from '@nestjs/common';
import { CreatePayrollDto, EmployeeSalaryDto } from './dto/CreatePayroll.dto';
import { PayrollService } from './payroll.service';
import { Payroll } from './Schema/Payroll.schema';
import { User } from 'src/auth/Shemas/User.shema';

@Controller('payroll')
export class PayrollController {
    
  constructor(private readonly payrollService: PayrollService) {}

  @Post('/create')
  async createPayroll(@Body() payrollDTO: CreatePayrollDto) {
    try {
      const createdPayroll = await this.payrollService.createPayroll(payrollDTO);
      return {
        success: true,
        data: createdPayroll,
      };
    } catch (error) {
      console.error('Error creating payroll:', error);
      throw new HttpException('Error creating payroll', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  

  

   
    @Post('/CreatePayroll')
    async createPayrollC(@Body() createPayrollDto: CreatePayrollDto,) {
      try {
        const newPayroll = await this.payrollService.createPayroll(createPayrollDto);
        return {
          status: 'success',
          data: newPayroll,
        };
      } catch (error) {
        return {
          status: 'error',
          message: 'Failed to create payroll',
        };
      }
    }
    @Get('/withUsersAndPoste')
    async getAllPayrollsWithUsersAndPoste(): Promise<EmployeeSalaryDto[]> {
      try {
        const payrolls = await this.payrollService.getAllPayrollsWithUsersAndPoste();
        console.log('get avec succes',payrolls)
        return payrolls;
      } catch (error) {
        console.error('Error retrieving payrolls with users and poste:', error);
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }


    @Get('calculateNetSalary/:id/startDate/:startDate/endDate/:endDate')
    async calculateNetSalary(@Param('id') id: string,
    @Param('startDate') startDate: Date,
    @Param('endDate') endDate: Date): Promise<Payroll> {
        try {
            const payroll = await this.payrollService.calculateNetSalary(id,startDate,endDate);
            if (payroll) {
                return payroll;
            } else {
                throw new Error("Le calcul du salaire net a échoué.");
            }
        } catch (error) {
            throw new Error ("Une erreur est survenue lors du calcul du salaire net : " + error.message);
        }
    }


    @Post('create-default-for-new-users')
    async createDefaultPayrollsForNewUsers(): Promise<{ message: string }> {
        try {
            await this.payrollService.createDefaultPayrollsForNewUsers();
            return { message: 'Default payrolls created for new users successfully.' };
        } catch (error) {
            return { message: error.message };
        }
    }
  async triggerCron(): Promise<string> {
    await this.payrollService.handleCron();
    return 'CRON déclenché avec succès.';
  }
  @Post('generate')
  async generatePayroll() {
    try {
      await this.payrollService.schedulePayrollGeneration();
      return { message: 'La génération de la paie a été planifiée avec succès.' };
    } catch (error) {
      return { error: error.message };
    }
  }


  // @Get('with-post')
  //   async getUsersWithPost(): Promise<User[]> {
  //       return await this.payrollService.getUsersWithPost();
  //   }
  @Post('/payrolls/:userId')
  async createPayrollAndAssociateWithUser(@Body() createPayrollDto: CreatePayrollDto, @Param('userId') userId: string) {
    try {
      const newPayroll = await this.payrollService.createPayrollAndAssociateWithUser(createPayrollDto, userId);
      return {
        status: 'success',
        data: newPayroll,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  @Post('/generateP')
  async generatePayrollP(@Body() { startDate, endDate }: { startDate: Date, endDate: Date }): Promise<void> {
    try {
      await this.payrollService.generatePayroll(startDate, endDate);
      console.log('La paie a été générée avec succès.');
    } catch (error) {
      console.error('Une erreur est survenue lors de la génération de la paie:', error);
    }
  }


  @Get('/withUsers')
  async getUsersWithPayrolls(): Promise<any> {
    try {
      const User = await this.payrollService.getUsersWithPayrolls();
      console.log('get avec succes',User)
      return User;
    } catch (error) {
      console.error('Error retrieving payrolls with users and poste:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('getPayrollWithPayP/:id')
    async getPayrollWithPaymentPolicy(@Param('id') payrollId: string): Promise<{  payroll: any, deductions: number[] }> {
      try {
        const payroll = await this.payrollService.getPayrollWithPaymentPolicy(payrollId);
        return payroll;
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

  
}
