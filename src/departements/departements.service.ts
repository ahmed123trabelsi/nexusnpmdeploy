import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDepartmentDto} from './dto/CreateDepartement.dto';
import { UpdateDepartmentDto } from './dto/UpdateDepartements.dto';
import { Department } from './Schema/Departement.schema';

@Injectable()
export class DepartementsService {
    constructor(@InjectModel(Department.name) private departmentModel: Model<Department>) {}

  async createDepartment(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const newDepartment = new this.departmentModel(createDepartmentDto);
    return newDepartment.save();
  }

  async getAllDepartments(): Promise<Department[]> {
    return this.departmentModel.find().exec();
  }

  async getDepartmentById(id: string): Promise<Department> {
    const department = await this.departmentModel.findById(id).exec();
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    return department;
  }

  async updateDepartment(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.departmentModel.findByIdAndUpdate(id, updateDepartmentDto, { new: true }).exec();
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    return department;
  }
  async findById(departmentId: string): Promise<Department> {
    const department = await this.departmentModel.findById(departmentId).exec();
    if (!department) {
      throw new NotFoundException('Département non trouvé');
    }
    return department;
  }

  async deleteDepartment(id: string): Promise<Department> {
    const department = await this.departmentModel.findByIdAndDelete(id).exec();
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    return department;
  }
  
}
