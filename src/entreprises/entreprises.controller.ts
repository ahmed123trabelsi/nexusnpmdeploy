import { Body, Controller,Post, UsePipes, ValidationPipe ,Get, Param, HttpException, Put, Delete} from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateEntrepriseDto } from './dto/entreprises.dto';
import { EntreprisesService } from './entreprises.service';

@Controller('entreprise')
export class EntreprisesController {
    constructor(private entrepriseService:EntreprisesService){}
    @Post()
    @UsePipes(new ValidationPipe())//enbales validation locally
    createEntreprise(@Body() entreprisedto:CreateEntrepriseDto){
    console.log(entreprisedto);
    return this.entrepriseService.createEntreprise(entreprisedto);
   }
   @Get()
   getEntreprises(){
    return this.entrepriseService.getEntreprises();
   }
   @Get(":nom")
   async getUserByNom(@Param('nom') nom:string){
    return await this.entrepriseService.getUserByNom(nom);
   }
   @Put('update/:nom')
   @UsePipes(new ValidationPipe())
   async updateUser(@Param('nom')nom:string,@Body()createEntreprisedto:CreateEntrepriseDto){
    const isValid= mongoose.Types.ObjectId.isValid(nom)
    if(!isValid) throw new HttpException('INVALID nom',400) 
    const updatedUser= await this.entrepriseService.updateEntreprise(nom,createEntreprisedto)
    if(!updatedUser) throw new HttpException('user not found',404)
    return updatedUser;

   }
   @Delete(':id')
   async deleteEntreprise(@Param('id') id:string){
    const isValid= mongoose.Types.ObjectId.isValid(id)
    if(!isValid) throw new HttpException('INVALID id',400) 
    const deletedEntreprise=await this.entrepriseService.deleteEntreprise(id)
    console.log(deletedEntreprise)

   }
}
