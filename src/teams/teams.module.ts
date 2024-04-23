import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/Shemas/User.shema';
import { Project, ProjectSchema } from 'src/project/schema/Project.schema';
import { Tasks, TasksSchema } from 'src/project/schema/Tasks.schema';
import {  Teams, TeamsSchema } from './schema/Teams.schema';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
  imports:[MongooseModule.forFeature([
    { name: Teams.name, schema: TeamsSchema },
    { name: Project.name, schema: ProjectSchema },
    { name: Tasks.name, schema: TasksSchema },
    { name: User.name, schema: UserSchema },
   
  
  ]),],
  controllers: [TeamsController],
  providers: [TeamsService]
})
export class TeamsModule {}
