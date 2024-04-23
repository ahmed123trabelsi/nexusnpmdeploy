import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put
} from "@nestjs/common";
import {CongeService} from "./Conge.service";
import {CreateLeaveDto} from "./dto/createConge.dto";
import {Leave} from "./Schema/Leaves.schema";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/auth/Shemas/User.shema";
import { Model } from "mongoose";

@Controller('Conge')
export class CongeController {
    constructor(private readonly congeService : CongeService ,@InjectModel(User.name) private UserModel:Model<User>) {
    }

    @Get(':employeeId/leaves')
    async getLeavesByEmployee(@Param('employeeId') id: string): Promise<Leave[]> {
        return await this.congeService.getLeavesByEmployee(id);
    }

    @Post('request')
    async ajouterDemandeConge(@Body() createLeaveDto: CreateLeaveDto) {
        try {
            return await this.congeService.ajouterDemandeConge(createLeaveDto);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Put(':id/accept')
    async accepterDemandeConge(@Param('id') id: string): Promise<Leave> {
        try {
            const demandeConge = await this.congeService.accepterDemandeConge(id);
            return demandeConge;
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }
    @Put(':id/refus')
    async refuserDemandeConge(@Param('id') id: string): Promise<Leave> {
        try {
            const demandeConge = await this.congeService.refuserDemandeConge(id);
            return demandeConge;
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }
    @Put(':id')
    async updateConge(@Param('id') id: string, @Body() updateLeaveDto: CreateLeaveDto): Promise<Leave> {
        try {
            return await this.congeService.updateConge(id, updateLeaveDto);
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }
    @Get('/unapprovedcreatedAt')
    async getUnapprovedLeavesBycreatedAt(): Promise<Leave[]> {
        return await this.congeService.prioritizeUnapprovedLeavesBycreatedAt();
    }
    @Get('/notApproved')
    async getUnapprovedLeaves(): Promise<Leave[]> {
        return this.congeService.getUnapprovedLeaves() ;
    }
    @Get('getSolde/:employeeId')
    async getLeaveBalance(@Param('employeeId') employeeId: string): Promise<number> {
        return this.congeService.getLeaveBalance(employeeId);
    }
    @Get('getLeaves/:id')
    async getDemandeConge(@Param('id') congeId: string): Promise<Leave> {
        return this.congeService.getDemandeCongeById(congeId);
    }
    
    @Delete(':id')
    async supprimerDemandeConge(@Param('id') id: string) {
        this.congeService.supprimerDemandeConge(id);
    }

    @Get(':id/leaves')
    async getLeavesByEmployee1(@Param('id') id: string): Promise<Leave[]> {
        try {
            const leaves = await this.congeService.getLeavesByEmployee(id);
            return leaves;
        } catch (error) {
            throw new Error(`Failed to fetch leaves for employee ${id}: ${error.message}`);
        }
    }
    // @Get()
    // async getAllUsersWithConges(): Promise<User[]> {
    //   return this.congeService.getAllUsersWithConges();
    // }

    @Get('leaves')
  async getUsersWithLeaves(): Promise<{ name: string; leaves: Leave[] }[]> {
    return this.congeService.getUsersWithLeaves();
  }



}

