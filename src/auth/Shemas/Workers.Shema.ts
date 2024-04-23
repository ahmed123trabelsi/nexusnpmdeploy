/* import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "./User.shema";

@Schema()
export class Workers extends Document {
  @Prop({type:mongoose.Schema.Types.ObjectId,ref:'User'})
  admin: User;

}
export const  WorkersSchema=SchemaFactory.createForClass(Workers); */