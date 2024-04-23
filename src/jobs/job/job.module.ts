import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from '../schemas/job.schema';
import { ApplicationModule } from '../application/application.module';
import { Application, ApplicationSchema } from '../schemas/application.schema';

@Module({
  imports:[ MongooseModule.forFeature(
    [
      { name: Job.name, schema: JobSchema },
      { name: Application.name, schema: ApplicationSchema }
      
    ])],
  providers: [JobService],
  controllers: [JobController],
  exports:[JobService, MongooseModule.forFeature([{ name: Job.name, schema: JobSchema },])]
})
export class JobModule {

}
