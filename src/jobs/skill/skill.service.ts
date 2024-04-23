import { ConflictException, Injectable } from '@nestjs/common';
import { Skill } from '../schemas/skill.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SkillService {
    private createdSkills: Skill[] = [];

    constructor(@InjectModel(Skill.name) private readonly skillModel: Model<Skill>) {}

    // async createSkills(skills: string[]): Promise<Skill[]> {
    //     const newSkills = [];
    //     for (const name of skills) {
    //       const createdSkill = await this.skillModel.create({ name });
    //       newSkills.push({name:createdSkill.name});
    //       this.createdSkills.push(createdSkill); // Ajouter la compétence créée à la liste des compétences créées
    //     }
    //     return newSkills;
    //   }
    //   getCreatedSkills(): Skill[] {
    //     return this.createdSkills;
    //   }
    // async create(jobData: Skill): Promise<Skill> {
    //   const createdJob = new this.skillModel(jobData);
    //   return createdJob.save();
    // }
   
  async create(skillData: Skill): Promise<Skill> {
    const existingSkill = await this.skillModel.findOne({ name: skillData.name });
    if (existingSkill) {
      throw new ConflictException('Skill with the same name already exists');
    }
    const createdSkill = new this.skillModel(skillData);
    return createdSkill.save();
  }

    
    async findAll(): Promise<any[]> {
      return this.skillModel.find().exec();
  }
  async deleteAll(): Promise<any> {
    return this.skillModel.deleteMany().exec();
}
      
}
