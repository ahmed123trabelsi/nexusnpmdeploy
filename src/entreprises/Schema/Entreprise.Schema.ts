import { Prop, Schema, SchemaFactory  } from "@nestjs/mongoose";
import mongoose from "mongoose";


@Schema()
export  class entreprise {
@Prop({unique:true,required:true})
NomEntreprise:string;
@Prop({unique:false})
secteurEntreprise:string;
@Prop({unique:false})
numeroTelephone:string;
@Prop()
adresse?:string;
@Prop()
typeEntreprise?:string;
@Prop()
email?:string;

 @Prop()
 codePostal?:string;
 @Prop()
 CEO:string;
 @Prop()
 NumeroRegistreCommercial?:string;



}
export const EntrepriseSchema= SchemaFactory.createForClass(entreprise)