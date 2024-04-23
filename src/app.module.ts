import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {CongesModule} from "./conges/conges.module";
import { DepartementsModule } from './departements/departements.module';
import { EntreprisesModule } from './entreprises/entreprises.module';
import { ProjectModule } from './project/project.module';
import {AttendanceModule} from "./attendance/attendance.module";
import { JobModule } from './jobs/job/job.module';
import { ApplicationModule } from './jobs/application/application.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigModule } from './multer-config/multer-config.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SkillModule } from './jobs/skill/skill.module';
import { TeamsModule } from './teams/teams.module';
import { PerformanceModule } from './performance/performance.module';
import { PaymentPolicyModule } from './payment-policy/payment-policy.module';
import { PayrollModule } from './payroll/payroll.module';
import {HolidaysModule} from "./holidays/holidays.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.DB_URI),
        AuthModule,
        CongesModule,
        DepartementsModule,
        EntreprisesModule,
        ProjectModule,
        AttendanceModule,
        JobModule,
        TeamsModule,
        PerformanceModule,
        ApplicationModule,
        MulterModule.register({
            dest: './uploads',
        }),
        MulterConfigModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
        }),
        SkillModule,
        HolidaysModule,
        PaymentPolicyModule,
        PayrollModule,



    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
