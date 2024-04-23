import { Body, ConsoleLogger, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Application } from '../schemas/application.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateApplicationDto } from './dto/UpdateApplication.dto';
import { UpdateDepartmentDto } from 'src/departements/dto/UpdateDepartements.dto';
import { Response } from 'express';
@Controller('application')
export class ApplicationController {

constructor(private readonly applicationservice:ApplicationService){}
private readonly logger = new ConsoleLogger(ApplicationController.name);
// @Post()
//     async applyForJob(@Body() applicationData: Application): Promise<Application> {
//         return this.applicationservice.applyForJob(applicationData);
//       }

      @Get()
      async findAll(): Promise<Application[]> {
        return this.applicationservice.findAll();
      }
      @Post()
  @UseInterceptors(FileInterceptor('cv'))
  async applyForJob(@UploadedFile() file: Express.Multer.File, @Body() applicationData: Application): Promise<Application> {
    return this.applicationservice.applyForJob(applicationData, file);
  }
  @Post('upload') // Le chemin de l'endpoint
  @UseInterceptors(FileInterceptor('file')) // 'file' est le nom du champ dans FormData
  async uploadFile(@UploadedFile() file) {
    console.log(file); // Traitez le fichier téléchargé ici
  }
  @Post('/delete-all')
  async deleteAllCandidates(): Promise<string> {
    await this.applicationservice.deleteAllCandidates();
    return 'All candidates deleted successfully';
  }
  @Delete(':id')
  async deleteCandidate(@Param('id') id: string): Promise<void> {
    await this.applicationservice.deleteCandidate(id);
  }
  // @Put(':id')
  // async updateCandidate(@Param('id') id: string, @Body() updateCandidateDto: UpdateApplicationDto) {
  //   return this.applicationservice.updateCandidate(id, updateCandidateDto);
  // }
  @Put(':id')
  updateApplication(@Param('id') id: string, @Body() UpdateApplicationDto: UpdateApplicationDto): Promise<Application> {
    return this.applicationservice.updateCandidate(id, UpdateApplicationDto);
  }
  // @Get('download')
  // async downloadSheet(): Promise<string> {
  //   try {
  //     const csvContent = await this.applicationservice.downloadSheet();
  //     return csvContent;
  //   } catch (error) {
  //     // Gérer les erreurs ici
  //     console.error('Error downloading sheet:', error);
  //     throw error;
  //   }
  // }
  @Get('download')
  async downloadExcel(@Res() res: Response): Promise<void> {
    try {
      const filePath = await this.applicationservice.exportResponsesToExcel();
      res.download(filePath, 'optiflow.xlsx', (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          res.status(500).send('Internal Server Error');
        } else {
          console.log('File downloaded successfully');
        }
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  }
  }

