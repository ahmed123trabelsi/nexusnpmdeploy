import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../Shemas/User.shema';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
  //   console.log(requiredRoles);
  //   if (!requiredRoles) {
  //     return true; 
  //   }
  //   const request: Request = context.switchToHttp().getRequest();
  //   const token = request.headers.authorization.split(' ')[1];
  //   console.log(token); // Récupérer le token du header Authorization

  //   if (!token) {
  //     return false; 
  //   }

  //   try {
  //     const decodedToken: any = jwt.verify(token, 'bahazaidi'); // Décoder le token avec votre clé secrète
  //     const userId = decodedToken.id;
  //     console.log(userId);

  //     if (!userId) {
  //       return false; 
  //     }

  //     const user = await this.userService.findByIdWithRole(userId);
  //     console.log(user);

  //     if (!user || !user.role || !user.role.length) {
  //       return false; 
  //     }

  //     const userRoles = user.role.map(role => role.name);
  //     console.log(userRoles);

  //     return requiredRoles.some(role => userRoles.includes(role));
  //   } catch (error) {
      return false;
     }
  // }
}