import { Prop, Schema, SchemaFactory  } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/auth/Shemas/User.shema";
import { Tasks } from "./Tasks.schema";
export enum TypeStatutProjet {
  New= 0,
  RUNNING = 1,
  FINISHED  = 3,
}



@Schema()
export  class Project {
@Prop({required:true})
NomProject:string;
@Prop()
description:string;
@Prop()
StartDate?:string;
@Prop()
FinishDate?:string;
@Prop({
     
  default: TypeStatutProjet.New
})
 statut?:TypeStatutProjet;
 @Prop()
 projectUrl?: string;
@Prop([{ type: mongoose.Schema.Types.ObjectId, ref: ()=>Tasks }] )
tasks:Tasks[]; 
@Prop()
 NomChefProjet?:string
@Prop()
priority?:ProjectPriority;
@Prop()
progress?:number
@Prop()
type?:ProjectType
@Prop({type:mongoose.Schema.Types.ObjectId,ref:'User'})
User?:User;
}
export const ProjectSchema= SchemaFactory.createForClass(Project)

  export enum TypeStatutTache {
    A_FAIRE = 'To Do',
    RUNNING = 'RUNNING',
    FINISHED  = 'FINISHED',
  }
  export enum ProjectPriority {
    LOW = -1,
    MEDIUM = 0,
    HIGH = 1,
  }
  export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
  }
  export enum ProjectType {
    WEB = 'Website',
    ANDROID = 'Android',
    IPHONE = 'IPhone',
    TESTING = 'Testing',
    otherType='other type'
  }