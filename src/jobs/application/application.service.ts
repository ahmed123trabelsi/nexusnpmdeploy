import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Application } from '../schemas/application.schema';
import { Model, Types } from 'mongoose';
import { Job, JobSchema } from '../schemas/job.schema';
import * as fs from 'fs';
import { UpdateApplicationDto } from './dto/UpdateApplication.dto';

import { UpdateDepartmentDto } from 'src/departements/dto/UpdateDepartements.dto';
import { MailerService } from 'src/auth/Mail.service';
import * as path from 'path';
import { google } from 'googleapis';
import * as exceljs from 'exceljs';
import * as excel from 'exceljs';



@Injectable()
export class ApplicationService {
  
  private auth;
     constructor(
    @InjectModel(Application.name) private readonly applicationmodel:Model<Application>,
    @InjectModel(Job.name) private readonly jobModel:Model<Job>,
    private readonly mailerService: MailerService){
      this.auth = new google.auth.GoogleAuth({
        keyFile: '../../../uploads/myproject-52722-edf5ca8d9f2d.json', // chemin vers le fichier de compte de service
        scopes: ['https://www.googleapis.com/auth/drive'],
      });
    }
    private readonly logger = new ConsoleLogger(ApplicationService.name);
      async findAll(): Promise<Application[]> {
        return this.applicationmodel.find().exec();
      }
      async applyForJob(applicationData: Application, file: Express.Multer.File): Promise<Application> {
        try {
          
            // Gérer le fichier CV téléchargé ici
            console.log('File received:', file);
            
            // const filePath = 'uploads/' + file.originalname; // Définissez le chemin de destination souhaité
            const filePath = file ? 'uploads/' + file.originalname : '';
            
            fs.writeFileSync(filePath, file.buffer); // Cette opération peut nécessiter des vérifications supplémentaires pour la gestion des erreurs
           
            console.log('Searching for job with ID:', applicationData.jobId);
            const job = await this.jobModel.findById(applicationData.jobId);
            if (!job) {
                console.log('Job not found');
                throw new Error('Job not found');
            }
            const existingApplication = await this.applicationmodel.findOne({
              jobId: applicationData.jobId,
              email: applicationData.email // Vérification par email
          });
          if (existingApplication) {
            console.log('Candidate has already applied for this job');
            throw new Error('Vous avez déjà postulé pour ce job.');
        }
    
           
                const newApplication  = new this.applicationmodel({

                jobId: applicationData.jobId,
                title: job.title,
                candidateName: applicationData.candidateName,
                email: applicationData.email,
                cv: filePath, // Enregistrer le chemin du fichier dans la base de données
            });
            console.log('Saving application:', newApplication);
            const savedApplication = await newApplication.save();

            // await this.applyForJobAndNotify(applicationData, filePath);
            const googleFormsLink = 'https://docs.google.com/forms/d/e/1FAIpQLSdK4jHnnXSfSMxGdVlWxr4Vtsr-5kduzoWhbj-WWLpkwDDwcA/viewform?usp=sf_link';
               
            // Construisez le contenu de l'e-mail à envoyer au candidat
            const emailSubject = 'Votre candidature a été acceptée';
            const emailBody = `Félicitations ! Votre candidature a été acceptée. Veuillez remplir ce formulaire pour fournir plus d'informations : ${googleFormsLink}`;
            // Envoyez un e-mail de confirmation au candidat
            await this.mailerService.sendEmail(applicationData.email, emailSubject, emailBody);
    
            // Renvoyer la candidature enregistrée


            console.log('Application saved successfully:', savedApplication);
            return savedApplication;
        } catch (error) {
         
            console.error('Error applying for job:', error);
            throw error;
        }
      }
      async deleteAllCandidates(): Promise<void> {
        try {
          await this.applicationmodel.deleteMany({});
        } catch (error) {
          throw new Error(`Unable to delete all candidates: ${error}`);
        }
      }
      async deleteCandidate(id: string): Promise<void> {
        await this.applicationmodel.findByIdAndDelete(id).exec();
      }
      async updateCandidate(id: string, updateDepartmentDto: UpdateApplicationDto): Promise<Application> {
        const department = await this.applicationmodel.findByIdAndUpdate(id, updateDepartmentDto, { new: true }).exec();
        if (!department) {
          throw new NotFoundException('Department not found');
        }
        return department;
      }
      async findCandidateByEmail(email: string): Promise<Application | null> {
        // Recherchez le candidat dans la base de données par e-mail
        const candidate = await this.applicationmodel.findOne({ email }).exec();
        return candidate;
      }

      async applyForJobAndNotify(applicationData: Application, cvFilePath: string): Promise<Application> {
        try {
            // Vérifiez si l'e-mail du candidat existe dans la base de données
            const candidate = await this.findCandidateByEmail(applicationData.email);
    
            // Si l'e-mail du candidat existe, créez une nouvelle candidature et envoyez un e-mail de confirmation
            if (candidate) {
                // Ajoutez le chemin du fichier CV aux données d'application
                applicationData.cv = cvFilePath;
    
                // Créez une nouvelle instance de candidature
                const newApplication = new this.applicationmodel(applicationData);
    
                // Enregistrez la nouvelle candidature dans la base de données
                const savedApplication = await newApplication.save();
                const googleFormsLink = 'https://docs.google.com/forms/d/e/1FAIpQLSdK4jHnnXSfSMxGdVlWxr4Vtsr-5kduzoWhbj-WWLpkwDDwcA/viewform?usp=sf_link';
               
                // Construisez le contenu de l'e-mail à envoyer au candidat
                const emailSubject = 'Votre candidature a été acceptée';
                const emailBody = `Félicitations ! Votre candidature a été acceptée. Veuillez remplir ce formulaire pour fournir plus d'informations : ${googleFormsLink}`;
                // Envoyez un e-mail de confirmation au candidat
                await this.mailerService.sendEmail(applicationData.email, emailSubject, emailBody);
    
                return savedApplication;
            } else {
                // Si l'e-mail du candidat n'existe pas, lancez une exception
                throw new Error('Candidat non trouvé.');
            }
        } catch (error) {
            console.error('Error applying for job and notifying candidate:', error);
            throw error;
        }
    }
    
  
  async downloadExcel(): Promise<string> {
    const serviceAccountFilePath = path.join(__dirname, 'C:/Users/ALA AISSA/Desktop/PI-HR/HR_Managment_application_Backend-/uploads/myproject-52722-edf5ca8d9f2d.json')
    const auth = new google.auth.GoogleAuth({
      // keyFile: '../../../uploads/myproject-52722-edf5ca8d9f2d.json', // Chemin vers le fichier de compte de service
      keyFile:serviceAccountFilePath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    try {
      const spreadsheetId = '1B7zjcsU0t4V4zJOQI2abPgweQi9osKD1YbPlSeHFuN4'; // ID de la feuille de calcul Google Sheets
      const range = 'Sheet1!A1:L10'; // Plage de données à télécharger

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const rows = response.data.values;

      // Création du fichier Excel
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Sheet1');
      rows.forEach(row => {
        worksheet.addRow(row);
      });

      const filePath = 'temp.xlsx';
      await workbook.xlsx.writeFile(filePath);

      return filePath;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Unable to download Excel file');
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    await fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Erreur lors de la suppression du fichier :', err);
      } else {
        console.log('Le fichier a été supprimé avec succès !');
      }
    });
  }
  async exportResponsesToExcel(): Promise<string> {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'uploads/myproject-52722-edf5ca8d9f2d.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = '1B7zjcsU0t4V4zJOQI2abPgweQi9osKD1YbPlSeHFuN4';
    // const range = 'Sheet1!A1:Z100';
    const range = `A:L` // Adjust range as needed

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      throw new Error('No data found.');
    }

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Responses');

    rows.forEach((row) => {
      worksheet.addRow(row);
    });

    const filePath = path.join(__dirname, '..', '../../uploads', 'optiflow.xlsx');
    await workbook.xlsx.writeFile(filePath);

    return filePath;
  }
  
}