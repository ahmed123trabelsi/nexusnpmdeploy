import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum AttendanceStatus {
    Absent = 0,
    HalfDay = 0.5,
    Present = 1,
}
export enum Etat {
    pending    = 'Pending',
    approuved = 'Approved',
    declined =  'Declined'
}

@Schema()
export class Attendance extends Document {

    @Prop({ required: false })
    date: Date;

    @Prop( {required : false})
    etat : Etat

    @Prop({ required: true, enum: AttendanceStatus })
    status: number;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
