import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy ,ExtractJwt} from "passport-jwt";
import { User } from "./Shemas/User.shema";
import { Model } from "mongoose";
import { Request } from "express";
import { Observable } from "rxjs";
import { Request as RequestType } from 'express';


@Injectable()
export class jwtstrategy extends  PassportStrategy(Strategy) {
    constructor(
        @InjectModel(User.name)
        private UserModel :Model<User>
    ){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                jwtstrategy.extractJWT
                ,
                ExtractJwt.fromAuthHeaderAsBearerToken()]),
            secretOrKey: process.env.JWT_SECRET
        })
        
    }
    
async validate(payload){
    const {id}=payload;
     let user=await this.UserModel.findById(id);
      if(!user) throw new Error( "You must be login to access ");
       return user ;

}
private static extractJWT(req: RequestType): string | null {
    if (
      req.cookies &&
      'user_token' in req.cookies &&
      req.cookies.user_token.length > 0
    ) {
      return req.cookies.user_token;
    }
    return null;
  }



}

// @Injectable()
// export class AuthenticatedGuard implements CanActivate {
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest();
//     return request.user; 
//   }
// }