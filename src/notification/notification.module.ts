import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';
import { ProjectService } from 'src/project/project.service';
import { Project, ProjectSchema } from 'src/project/schema/Project.schema';
import { Tasks, TasksSchema } from 'src/project/schema/Tasks.schema';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/auth/Mail.service';
import { User, UserSchema } from 'src/auth/Shemas/User.shema';
import { Role, RoleSchema } from 'src/auth/Shemas/Roles.Shema';
import { Roleservice } from 'src/auth/Role.service';
import { AttendanceService } from 'src/attendance/attendance.service';
import { Attendance, AttendanceSchema } from 'src/attendance/Schema/Attendance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Tasks.name, schema: TasksSchema },
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema},
      { name: Attendance.name, schema: AttendanceSchema },



      ])
  ],
  providers: [NotificationService,ProjectService , AuthService , Roleservice , AttendanceService  ,JwtService , MailerService],
  controllers: [NotificationController],
  exports:[NotificationService]
})
export class NotificationModule {}
