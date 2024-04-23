import { Module } from '@nestjs/common';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { EntreprisesModule } from 'src/entreprises/entreprises.module';
import { AuthModule } from 'src/auth/auth.module';
import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';
import { Mission, MissionSchema } from './Shemas/Mission.Shema';
import { ProjectModule } from 'src/project/project.module';
import { AuthService } from 'src/auth/auth.service';
import { EntreprisesService } from 'src/entreprises/entreprises.service';
import { JwtService } from '@nestjs/jwt';
import { CongeService } from 'src/conges/Conge.service';
import { TaskService } from 'src/project/task/task.service';
import { ProjectService } from 'src/project/project.service';
import { MailerService } from 'src/auth/Mail.service';
import { User, UserSchema } from 'src/auth/Shemas/User.shema';
import { EntrepriseSchema, entreprise } from 'src/entreprises/Schema/Entreprise.Schema';
import { Tasks, TasksSchema } from 'src/project/schema/Tasks.schema';
import { Project, ProjectSchema } from 'src/project/schema/Project.schema';
import { Leave, LeaveSchema } from 'src/conges/Schema/Leaves.schema';
import { Roleservice } from 'src/auth/Role.service';
import { Role, RoleSchema } from 'src/auth/Shemas/Roles.Shema';
import { Attendance, AttendanceSchema } from 'src/attendance/Schema/Attendance.schema';


@Module({
  imports: [
  MongooseModule.forFeature([
    { name: Mission.name, schema: MissionSchema},
    {name:User.name,schema:UserSchema},
    {name:entreprise.name,schema:EntrepriseSchema},
    {name:Tasks.name,schema:TasksSchema},
    {name:Project.name,schema:ProjectSchema},
    {name:Leave.name,schema:LeaveSchema},
    {name:Role.name,schema:RoleSchema},
    {name:Attendance.name,schema:AttendanceSchema}
]),
    EntreprisesModule,
    ProjectModule,
    AuthModule,
  ],
  controllers: [MissionController],
  providers: [MissionService,EntreprisesService,ProjectService, TaskService,CongeService,AuthService,JwtService,MailerService,Roleservice],
})
export class MissionModule {}
