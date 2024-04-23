import { Prop, Schema, SchemaFactory  } from "@nestjs/mongoose";
import mongoose from "mongoose";

import { User } from "src/auth/Shemas/User.shema";
;


@Schema()
export  class Teams{
    @Prop()
    TeamsName?:string;

 
    @Prop( [{ type: mongoose.Schema.Types.ObjectId, ref: ()=>User }])
    Employees:User[]; 



}
export const TeamsSchema= SchemaFactory.createForClass(Teams)