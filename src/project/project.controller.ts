import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Query, Sse, UsePipes, ValidationPipe } from '@nestjs/common';
import mongoose from 'mongoose';

import { CreateProjectDto } from './dto/CreateProject.dto';
import { ProjectService } from './project.service';
import { Project, TypeStatutProjet } from './schema/Project.schema';

@Controller('project')
export class ProjectController {
    constructor(private projectService:ProjectService){}
   
    @Post()
    @UsePipes(new ValidationPipe())//enbales validation locally
   createUser(@Body()createuserdto:CreateProjectDto){
    console.log(createuserdto);
    return this. projectService.createProject(createuserdto);
   }
   @Get()
   getUsers(){
    return this. projectService.getProject();
   }
   @Get('/:id')
   async getProjectById(@Param('id') id:string){
   const isValid= mongoose.Types.ObjectId.isValid(id)
   if(!isValid) throw new HttpException('project id is not valid not found',404) 
    const findUser= await this. projectService.getProjectById(id);
    if(!findUser) throw new HttpException('project not found',404)
    return findUser;
   }
   @Patch(':id')
   @UsePipes(new ValidationPipe())
   async updateProject(@Param('id')id:string,@Body()projectdto:CreateProjectDto){
    const isValid= mongoose.Types.ObjectId.isValid(id)
    if(!isValid) throw new HttpException('INVALID id',400) 
    const updatedUser= await this.projectService.updateProject(id,projectdto)
    if(!updatedUser) throw new HttpException('user not found',404)
    return updatedUser;
}
@Delete(':id')
async deleteProject(@Param('id') id:string){
 const isValid= mongoose.Types.ObjectId.isValid(id)
 if(!isValid) throw new HttpException('INVALID id',400) 
 const deletedEntreprise=await this.projectService.deleteProject(id)
 console.log(deletedEntreprise)

}
@Patch(':id/statut')
async updateStatut(
  @Param('id') id: string,
  @Body('statut') statut: TypeStatutProjet,
): Promise<Project> {
  return this.projectService.updateStatut(id, statut);
}
 @Post('/by-tasks/jj')

 async getProjectsByTaskIds(@Body('taskIds') taskIds:  string[]) {
   // Ensure taskIds is treated as an array, whether it comes as a single string or an array of strings
  
   
   try {
     const projects = await this.projectService.findProjectsByTaskIds(taskIds);
     return projects;
   } catch (error) {
     throw error;
   }
 }
}