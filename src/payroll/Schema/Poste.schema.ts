import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Mongoose, Types } from 'mongoose';
import { User } from 'src/auth/Shemas/User.shema';



@Schema()
export class Poste {


    @Prop({ required: true })
    BasicSalary:number;
    @Prop({required: true ,unique:true})
    PostName:string;
    @Prop({required: true })
    Workshour:number;
    // 
    @Prop({ type: [{ type: 'ObjectId', ref: 'User' }] })
    Users: User[];
    
      
}

  
export const PostSchema = SchemaFactory.createForClass(Poste);

