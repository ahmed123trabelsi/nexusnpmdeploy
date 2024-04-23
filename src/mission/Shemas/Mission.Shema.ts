import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "src/auth/Shemas/User.shema";
import { entreprise } from "src/entreprises/Schema/Entreprise.Schema";

export enum MissionStatus {
    Ongoing = 'ongoing',
    Completed = 'completed',
    Canceled = 'canceled',
    Pending = 'pending',
  }
@Schema()
export class Mission extends Document {
    @Prop({ required: true })
    title: string;
    @Prop({ required: true })
    description: string;
    @Prop({ required: true })
    startDate: string;
    @Prop({ required: true })
    endDate: string;
    @Prop({ required: true,default:MissionStatus.Pending})
    status: MissionStatus;
    @Prop( [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
    assignedTo: User[];
    @Prop({type:mongoose.Schema.Types.ObjectId ,ref:'entreprise'})
      lieu: entreprise;
      @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
      client:User;
  }
  export const MissionSchema = SchemaFactory.createForClass(Mission);

