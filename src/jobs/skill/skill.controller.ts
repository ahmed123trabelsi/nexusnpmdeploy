import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { SkillService } from './skill.service';
import { Skill } from '../schemas/skill.schemas';

@Controller('skill')
export class SkillController {
    constructor(private readonly skillsService: SkillService) {}

    @Post()
    async create(@Body() jobData: Skill): Promise<Skill> {
      return this.skillsService.create(jobData);
    }
    // async createSkills(@Body() skills: string[]): Promise<Skill[]> {
    //   return this.skillsService.createSkills(skills);
    // }
  
    @Get()
    async getSkills(): Promise<Skill[]> {
      return this.skillsService.findAll();
    }
    
    @Delete()
    async deleteSkills(): Promise<Skill> {
      return this.skillsService.deleteAll();
    }
    // getCreatedSkills(): Skill[] {
    //   return this.skillsService.getCreatedSkills();
    // }
}
