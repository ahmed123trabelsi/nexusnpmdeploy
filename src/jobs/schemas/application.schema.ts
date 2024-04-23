import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Application extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Job' })
  jobId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  candidateName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true , type: String })
  cv: string;

  

  // Ajoutez d'autres propriétés au besoin
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
