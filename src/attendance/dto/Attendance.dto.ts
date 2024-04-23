import {IsDate, IsNotEmpty, IsEnum, IsOptional} from 'class-validator';
import { AttendanceStatus, Etat } from '../Schema/Attendance.schema';

export class CreateAttendanceDto {

    @IsDate()
    @IsOptional()
    date: Date;

    @IsNotEmpty()
    @IsEnum(AttendanceStatus)
    status: number;

    @IsOptional()
    @IsEnum(Etat)
    etat : Etat
}
export class UpdateAttendanceDto{
    @IsNotEmpty()
    @IsEnum(AttendanceStatus)
    status: number;
    @IsDate()
    @IsNotEmpty()
    date: Date;



}
export class  UpdateEtatDto {
    @IsDate()
    @IsNotEmpty()
    date: Date;
    @IsNotEmpty()
    @IsEnum(Etat)
    etat : Etat


}

