import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Skill, SkillSchema } from '../schemas/skill.schemas';
import { SkillController } from './skill.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Skill.name, schema: SkillSchema },
      ]),
  ],
  providers: [SkillService],
  controllers: [SkillController],
})
export class SkillModule {}
