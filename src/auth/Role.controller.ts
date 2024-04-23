import { Body, Controller, Param, Post } from "@nestjs/common";
import { Roleservice } from "./Role.service";
import { CreateRoleDto } from "./dto/Roles.dto";
import { diskStorage } from 'multer';




@Controller('roles')
export class Rolecontroller{
   
    constructor(private readonly roleService: Roleservice) {}
      
     @Post()
     async createRole(@Body() createRoleDto: CreateRoleDto) {
        return this.roleService.createRole(createRoleDto);
     }
//      @Post('/assign-role')
//      async assignRoleToUser(@Body() body: { userId: string, roleName: string }): Promise<any> {
//      const { userId, roleName } = body;
//       return this.roleService.assignRoleToUser(userId, roleName);
// }
}
