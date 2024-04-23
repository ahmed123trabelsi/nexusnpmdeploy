import { Body, Controller, Delete, Get, HttpException, Param, Post, Put } from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateTeamsDto } from './dto/CreateTeams.dto';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @Post()
    createTeam(@Body() createTeamsDto: CreateTeamsDto) {
      return this.teamsService.createTeam(createTeamsDto);
    }
  
    @Put(':teamId/users/:userId')
    addUserToTeam(@Param('teamId') teamId: string, @Param('userId') userId: string) {
      return this.teamsService.addUserToTeam(teamId, userId);
    }
  
    @Delete(':teamId/users/:userId')
    removeUserFromTeam(@Param('teamId') teamId: string, @Param('userId') userId: string) {
      return this.teamsService.removeUserFromTeam(teamId, userId);
    }
  
    @Delete(':teamId')
    deleteTeam(@Param('teamId') teamId: string) {
      return this.teamsService.deleteTeam(teamId);
    }
    @Get('/:id')
   async getteamById(@Param('id') id:string){
   const isValid= mongoose.Types.ObjectId.isValid(id)
   if(!isValid) throw new HttpException('task not found',404) 
    const findTask= await this.teamsService.getTeamById(id);
    if(!findTask) throw new HttpException('task not found',404)
    return findTask;
   }
}
