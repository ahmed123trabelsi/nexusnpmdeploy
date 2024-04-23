import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import {MongooseModule} from "@nestjs/mongoose";
import { User, UserSchema } from 'src/auth/Shemas/User.shema';
import { AuthModule } from 'src/auth/auth.module';
import { Attendance, AttendanceSchema } from './Schema/Attendance.schema';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Roleservice } from 'src/auth/Role.service';
import { MailerService } from 'src/auth/Mail.service';
import { Role, RoleSchema } from 'src/auth/Shemas/Roles.Shema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attendance.name, schema: AttendanceSchema },
      {name : User.name , schema : UserSchema},
      {name : Role.name , schema : RoleSchema},
      
    ]),
    AuthModule
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService , AuthService , JwtService , Roleservice , MailerService ]
})
export class AttendanceModule {}
