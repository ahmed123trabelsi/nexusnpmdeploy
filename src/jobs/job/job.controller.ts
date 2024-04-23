import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { JobService } from './job.service';
import { Job } from '../schemas/job.schema';
import { UpdateJobDto } from './dto/UpdateJob.dto';

@Controller('job')
export class JobController {
    constructor(private readonly jobService: JobService) {}

    @Post()
    async create(@Body() jobData: Job): Promise<Job> {
        return this.jobService.create(jobData);
      }
    // @Get()
    //   async findAll(): Promise<Job[]> {
    //     return this.jobService.findAll();
    //   }
    
  @Delete(':id')
  async deleteJob(@Param('id') jobId: string) {
    return this.jobService.deleteJob(jobId);
  }
      
  @Get()
  async getAllJobsWithApplicants(): Promise<any[]> {
    return this.jobService.getAllJobsWithApplicants();
  }
  
  @Put(':id')
  async updateJob(@Param('id') jobId: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.updateJob(jobId, updateJobDto);
  }
      
      @Get(':id/title')
      async getJobTitleById(@Param('id') id: string): Promise<string> {
        const job = await this.jobService.findById(id); // Assurez-vous d'avoir une méthode findById dans votre service JobService
        return job.title;
      }
}
