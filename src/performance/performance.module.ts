import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/Shemas/User.shema';
import { PerformanceController } from './performance.controller';
import { PerformanceService } from './performance.service';
import { PerformanceSchema } from './schema/Performance.schema';

@Module({
  imports:[MongooseModule.forFeature([
    { name: Performance.name, schema: PerformanceSchema },

    { name: User.name, schema: UserSchema },
   
  
  ]),],
  controllers: [PerformanceController],
  providers: [PerformanceService]
})
export class PerformanceModule {}
