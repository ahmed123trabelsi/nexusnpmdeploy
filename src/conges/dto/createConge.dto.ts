import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import {LeaveType, TimeOfDay} from "../Schema/Leaves.schema";

export class CreateLeaveDto {
    @IsNotEmpty()
    @IsEnum(LeaveType)
    leaveType: LeaveType;

    @IsNotEmpty()
    @IsString()
    startDate: string;

    @IsNotEmpty()
    @IsString()
    endDate: string;

    @IsOptional()
    @IsString()
    reason?: string;

    @IsNotEmpty()
    @IsEnum(TimeOfDay)
    endTime: TimeOfDay;

    @IsNotEmpty()
    @IsEnum(TimeOfDay)
    startTime: TimeOfDay;

    @IsOptional()
    @IsString()
    motifRefus?: string;

    @IsNotEmpty()
    @IsString()
    personnelId: string;

}



