import { Prop, Schema, SchemaFactory  } from "@nestjs/mongoose";
import mongoose from "mongoose";

import { Project, TaskPriority, TypeStatutTache } from "./Project.schema";
import { User } from "src/auth/Shemas/User.shema";
;


@Schema()
export  class Tasks{
    @Prop({required:true})
    NomTask:string;
    @Prop()
    description:string;
    @Prop()
    startDate:Date;
    // Changed finish date to string by Aymen because it caused an error in the function checkAndRemoveUserFromTask since the date format parameter takes a string type and not a date type.
    @Prop()
    FinishDate?:string
    // @Prop()
    // FinishDate?:Date
    @Prop()
    statut?:TypeStatutTache
    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'Project'})
    Project?:Project;
    @Prop()
    priority?:TaskPriority;
    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'User'})
    User?:User;
    @Prop()
    statusChangedDate?:Date


}


export const TasksSchema= SchemaFactory.createForClass(Tasks)
TasksSchema.pre('save', function(next) {
    if (this.isModified('statut') && this.statut === TypeStatutTache.FINISHED) {
      this.statusChangedDate = new Date();
    }
    next();
  });