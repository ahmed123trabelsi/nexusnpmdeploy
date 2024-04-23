import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Project, ProjectSchema } from './schema/Project.schema';
import { Tasks, TasksSchema } from './schema/Tasks.schema';
import { TaskController } from './task/task.controller';
import { TaskService } from './task/task.service';
import { User, UserSchema } from 'src/auth/Shemas/User.shema';
import { CongeService } from 'src/conges/Conge.service';
import { Leave, LeaveSchema } from 'src/conges/Schema/Leaves.schema';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/auth/Mail.service';
import { Roleservice } from 'src/auth/Role.service';
import { Attendance, AttendanceSchema } from 'src/attendance/Schema/Attendance.schema';
import { Role, RoleSchema } from 'src/auth/Shemas/Roles.Shema';
import { NotificationService } from 'src/notification/notification.service';
import { Notification, NotificationSchema } from 'src/notification/notification.schema';

@Module({
  imports:[MongooseModule.forFeature([
    { name: Project.name, schema: ProjectSchema },
    { name: Tasks.name, schema: TasksSchema },
    { name: User.name, schema: UserSchema },
    { name: Leave.name, schema: LeaveSchema},
    { name: Attendance.name, schema: AttendanceSchema},
    { name: Role.name, schema: RoleSchema},
    { name: Notification.name, schema: NotificationSchema},

  
  ]),],
  controllers: [ProjectController, TaskController],
  providers: [ProjectService, TaskService,CongeService,AuthService,JwtService,MailerService,Roleservice , NotificationService],
  exports:[ProjectService]
})
export class ProjectModule {}
