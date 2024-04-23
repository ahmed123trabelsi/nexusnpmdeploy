// entreprises.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntreprisesController } from './entreprises.controller';
import { EntreprisesService } from './entreprises.service';
import { EntrepriseSchema, entreprise } from './Schema/Entreprise.Schema';
import { Department, DepartmentSchema } from 'src/departements/Schema/Departement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: entreprise.name, schema: EntrepriseSchema },
      { name: Department.name, schema: DepartmentSchema }, // Assurez-vous que cette ligne est décommentée
    ]),
  ],
  controllers: [EntreprisesController],
  providers: [EntreprisesService],
})
export class EntreprisesModule {}
