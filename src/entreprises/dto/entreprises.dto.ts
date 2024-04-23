import { IsBoolean, IsNotEmpty,IsOptional,IsString, ValidateNested } from "class-validator";
export class DomainDto{

    @IsNotEmpty()
    @IsOptional()
    @IsString()
NomService:string;
@IsOptional()
@IsString()
Description:string;
}
export class CreateEntrepriseDto{
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    NomEntreprise:string;
    @IsOptional()
    @IsString()
    secteurEntreprise?:string;
    @IsOptional()
    @IsString()
    numeroTelephone?:string;
    @IsOptional()
    @IsString()
    adresse?:string;
    @IsOptional()
    @IsString()
typeEntreprise?:string;
@IsNotEmpty()
@IsString()
email?:string;
@IsOptional()
@IsString()
@ValidateNested()
domaines: DomainDto[];
@IsOptional()
@IsString()
 codePostal?:string;
 @IsNotEmpty()
 @IsString()
 CEO:string;
 @IsNotEmpty()
 @IsString()
 NumeroRegistreCommercial:string;
}