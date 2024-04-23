import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { v1 as uuidv1 } from 'uuid';


@Schema({ strict: true, timestamps: true })
export class Notification {
    @Prop({ type: String, default: uuidv1})
    _id: string;

    @Prop({ type: String })
    title: string;

    @Prop({ type: String })
    description: string;

    @Prop({ type: Boolean, default: false })
    isSeen: boolean;
}



export const NotificationSchema = SchemaFactory.createForClass(Notification);