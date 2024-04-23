import { Module } from '@nestjs/common';
import { DepartementsService } from './departements.service';
import { DepartementsController } from './departements.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Department, DepartmentSchema } from './Schema/Departement.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Department.name, schema: DepartmentSchema },
      ]),
  ],
  providers: [DepartementsService],
  controllers: [DepartementsController],
  exports: [DepartementsService],
})
export class DepartementsModule {}
