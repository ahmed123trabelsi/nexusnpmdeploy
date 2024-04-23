import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/CreateDepartement.dto';
import { DepartementsService } from './departements.service';
import { UpdateDepartmentDto } from './dto/UpdateDepartements.dto';
import { Department } from './Schema/Departement.schema';

@Controller('departements')
export class DepartementsController {
    constructor(private readonly departmentService:  DepartementsService) {}

    @Post()
    createDepartment(@Body() createDepartmentDto: CreateDepartmentDto): Promise<Department> {
      return this.departmentService.createDepartment(createDepartmentDto);
    }
  
    @Get()
    getAllDepartments(): Promise<Department[]> {
      return this.departmentService.getAllDepartments();
    }
  
    @Get(':id')
    getDepartmentById(@Param('id') id: string): Promise<Department> {
      return this.departmentService.getDepartmentById(id);
    }
  
    @Put(':id')
    updateDepartment(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
      return this.departmentService.updateDepartment(id, updateDepartmentDto);
    }
  
    @Delete(':id')
    deleteDepartment(@Param('id') id: string): Promise<Department> {
      return this.departmentService.deleteDepartment(id);
    }
    
}
