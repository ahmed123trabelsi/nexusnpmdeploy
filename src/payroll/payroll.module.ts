import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';
import { PaymentPolicyController } from 'src/payment-policy/payment-policy.controller';
import { PayrollService } from './payroll.service';
import { UserSchema } from 'src/auth/Shemas/User.shema';

import { PaymentPolicyService } from 'src/payment-policy/payment-policy.service';
import { PayrollController } from './payroll.controller';
import { AttendanceSchema } from 'src/attendance/Schema/Attendance.schema';
import { LeaveSchema } from 'src/conges/Schema/Leaves.schema';
import { DepartmentSchema } from 'src/departements/Schema/Departement.schema';
import { PaymentPSchema } from 'src/payment-policy/Schema/PaymentPolicyschema';
import { PayrollSchema } from './Schema/Payroll.schema';
import { PostSchema } from './Schema/Poste.schema';
import { AttendanceService } from 'src/attendance/attendance.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/auth/Mail.service';
import { Roleservice } from 'src/auth/Role.service';
import { RoleSchema } from 'src/auth/Shemas/Roles.Shema';
import { CongeService } from 'src/conges/Conge.service';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Payroll', schema: PayrollSchema },
      { name: 'Department', schema: DepartmentSchema },
      // Ajoutez d'autres schémas si nécessaire
      { name: 'Poste', schema: PostSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Attendance', schema: AttendanceSchema },
      { name: 'Leave', schema: LeaveSchema },
      { name: 'PaymentP', schema: PaymentPSchema },
      { name: 'Role', schema: RoleSchema },

      
    ]),ScheduleModule.forRoot(), 
  ],
  controllers: [PostController,PaymentPolicyController, PayrollController],
  providers: [ PostService,PaymentPolicyService,PayrollService,AttendanceService,AuthService,JwtService,MailerService,Roleservice,CongeService],
  exports:[]
        
})
export class PayrollModule {}
