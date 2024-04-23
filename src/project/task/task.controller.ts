import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { get } from 'http';
import mongoose from 'mongoose';
import { CreateTasksDto } from '../dto/CreateProject.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
    constructor(private taskService:TaskService){}
    @Post()
    @UsePipes(new ValidationPipe())//enbales validation locally
   createUser(@Body()createtaskdto:CreateTasksDto){
   
    return this.taskService.createTask(createtaskdto);
   }
   @Get()
   getTasks(){
    return this.taskService.getTasks();
   }
   @Get('/:id')
   async getTaskById(@Param('id') id:string){
   const isValid= mongoose.Types.ObjectId.isValid(id)
   if(!isValid) throw new HttpException('task id not found',404) 
    const findTask= await this. taskService.getTaskById(id);
    if(!findTask) throw new HttpException('task not found',404)
    return findTask;
   }
   @Patch(':id')
   @UsePipes(new ValidationPipe())
   async updateTask(@Param('id')id:string,@Body()taskdto:CreateTasksDto){
    const isValid= mongoose.Types.ObjectId.isValid(id)
    if(!isValid) throw new HttpException('INVALID id',400) 
    const updatedTask= await this.taskService.updateTask(id,taskdto)
    if(!updatedTask) throw new HttpException('task not found',404)
    return updatedTask;
}
@Delete(':id')
async deleteTask(@Param('id') id:string){
 const isValid= mongoose.Types.ObjectId.isValid(id)
 if(!isValid) throw new HttpException('INVALID id',400) 
 const deletedTask=await this.taskService.deleteTask(id)
 console.log(deletedTask)

}
@Post('/post')
@UsePipes(new ValidationPipe())//enbales validation locally
createtask2(@Body()createtaskdto:CreateTasksDto){

return this.taskService.createTask2(createtaskdto);
}
}
                                                                                                                            