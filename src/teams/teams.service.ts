import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/Shemas/User.shema';
import { CreateUserDto } from 'src/project/dto/CreateProject.dto';
import { CreateTeamsDto } from './dto/CreateTeams.dto';
import { Teams } from './schema/Teams.schema';

@Injectable()
export class TeamsService {constructor(
    @InjectModel(Teams.name)
    private  teamRepository: Model<Teams>,
    @InjectModel(User.name)
    private userRepository: Model<User>,
  ) {}

  async createTeam({Employees,...team}: CreateTeamsDto): Promise<Teams> {
 const t= await new this.teamRepository(team).save()

    // Si des identifiants d'employés sont fournis, cherchez ces employés et affectez-les à l'équipe
  for (const  i of Employees){
      const employeeEntities = await this.userRepository.findById(i);
        t.Employees.push(employeeEntities);
    // Supposons que 'Employees' est la propriété relationnelle dans votre entité Teams
    }
     t.save()
    // Sauvegardez l'équipe avec les employés assignés
    return t;
  }

  async addUserToTeam(teamId: string, userId: string): Promise<Teams> {
    const team = await this.teamRepository.findById( teamId );
    if (!team) throw new NotFoundException('Team not found');
    const user = await this.userRepository.findById(userId );
    if (!user) throw new NotFoundException('User not found');
    team.Employees.push(user);
    return new this.teamRepository(team).save();
  }

  async removeUserFromTeam(teamId: string, userId: string) {
    const team = await this.teamRepository.findById(teamId);
    if (!team) throw new NotFoundException('Team not found');
    const deletedemployye=await this.userRepository.findById(userId);
    await this.teamRepository.updateMany(
        {}, // This empty filter matches all documents in the collection.
        { $pull: { Employees: deletedemployye._id } } // Pull the deleted task's ID from the tasks array.
      );
    return  { message: 'employee deleted and references removed' };

     

  }

  async deleteTeam(teamId: string): Promise<void> {
    const result = await this.teamRepository.findByIdAndDelete(teamId);
   
  }
  getTeamById(id:string){
    return this.teamRepository.findById(id).populate(['Employees']);
}}
