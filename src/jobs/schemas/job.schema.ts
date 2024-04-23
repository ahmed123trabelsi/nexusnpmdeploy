import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Job extends Document {
    @Prop()
  jobId: string;
  @Prop({  })
  title: string;

  @Prop({ })
  description: string;

  @Prop({  })
  requiredSkills: string[];

  @Prop({ })
  location: string;

  @Prop({ })
  contractType: string;

  @Prop({  })
  salary: number;

  @Prop({ })
  applicationDeadline: Date;

  @Prop({  })
  status: string;

  @Prop({ })
  publicationDate: Date;

  @Prop({  })
  recruitingManager: string;
  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }] })
  // applicants: string[];

}

export const JobSchema = SchemaFactory.createForClass(Job);
