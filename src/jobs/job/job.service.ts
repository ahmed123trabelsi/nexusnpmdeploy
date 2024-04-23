import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from '../schemas/job.schema';
import { Model } from 'mongoose';
import { Application } from '../schemas/application.schema';
import { UpdateJobDto } from './dto/UpdateJob.dto';

@Injectable()
export class JobService {
constructor(@InjectModel(Job.name) private readonly jobModel: Model<Job>,
@InjectModel(Application.name) private readonly applicationModel: Model<Application>){}
    async create(jobData: Job): Promise<Job> {
        const createdJob = new this.jobModel(jobData);
        return createdJob.save();
      }

      async findAll(): Promise<any[]> {
        return this.jobModel.find().exec();
     
        
      }
      async findById(id: string): Promise<Job> {
        const job = await this.jobModel.findById(id).exec();
        if (!job) {
          throw new NotFoundException('Job not found');
        }
        return job;
      }
      async getAllJobsWithApplicants(): Promise<any[]> {
        const jobs = await this.jobModel.find().exec();
        const jobsWithApplicants = await Promise.all(jobs.map(async (job) => {
          const applicants = await this.applicationModel.find({ jobId: job._id }).select('candidateName').exec();
          return { ...job.toObject(), applicants: applicants.map(applicant => applicant.candidateName) };
        }));
        return jobsWithApplicants;
      }
      async updateJob(jobId: string, updateJobDto: UpdateJobDto): Promise<Job> {
        return await this.jobModel.findByIdAndUpdate(jobId, updateJobDto, { new: true });
      }
      // async deleteJob(jobId: string): Promise<Job> {
      //   return this.jobModel.findByIdAndDelete(jobId).exec();
      // }
      async deleteJob(jobId: string): Promise<Job> {
        // 1. Récupérer les candidats qui ont appliqué pour cet emploi
        const candidates = await this.applicationModel.find({ jobId }).exec();
    
        // 2. Supprimer les candidats de la base de données
        const candidateIds = candidates.map(candidate => candidate._id);
        await this.applicationModel.deleteMany({ _id: { $in: candidateIds } }).exec();
    
        // 3. Supprimer l'emploi
        return this.jobModel.findByIdAndDelete(jobId).exec();
    }
    
}
interface JobWithApplicants {
    job: Job;
    applicants: Application[];
}
