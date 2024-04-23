import { Prop, Schema, SchemaFactory  } from "@nestjs/mongoose";
import mongoose from "mongoose";

import { User } from "src/auth/Shemas/User.shema";


export enum SatisfactionLevel {
    VeryDissatisfied,
    Dissatisfied,
    Neutral,
    Satisfied,
    VerySatisfied
  }
@Schema()
export  class Performance{
    @Prop()
    Objective?:string;
    @Prop()
    score?:number;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    Employee?:User; 
    
    @Prop({
     
        default: SatisfactionLevel.Neutral
      })
    satisfactionLevel: SatisfactionLevel;



}
export const PerformanceSchema= SchemaFactory.createForClass(Performance)



