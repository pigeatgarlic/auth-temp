import { Body, Controller, Get, Param, Req } from '@nestjs/common';
import { Gameserver } from 'src/gameserver/gameserver.service';
import { User } from 'src/user/user.service';
import { AuthService, Session } from './auth.service';


export class TokenValidationResult{
    constructor(client:number,ID: number, isserver: boolean){
        this.recepient = client;
        this.id = ID;
        this.isServer = isserver;
    }
    id: number;
    recepient: number;
    isServer: boolean
}

@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Get("client/:user/:server/:secret")
  async getGameSession(@Param('secret') secret: string, @Param('user') user: string, @Param('server') name: string): Promise<string> {
    if (user == null || name == null || secret != "oneplay") {
        return "none"
    }
    return await this.appService.RequestGameSession(user, name);
  }

  @Get("terminate/:id")
  async terminateSession(@Param('id') id: string): Promise<boolean> {
    if (id == null) {
        return false;
    }
    return await this.appService.RemoveGameSession(Number.parseInt(id));
  }
  @Get("allSession")
  async allSession(): Promise<Array<Session>> {
    return await this.appService.allSession();
  }
  @Get("allServer")
  async getAllServer(): Promise<Array<Gameserver>> {
    return await this.appService.GetAllServer();
  }
  @Get("allUser")
  async getAllUser(): Promise<Array<User>> {
    return await this.appService.GetAllUser();
  }

  @Get("server/:id")
  async getServerToken(@Param('id') server: string): Promise<string> {
    if (server == null) {
        return "none"
    }
    return await this.appService.RequestServerToken(server);
  }

  @Get("validate/:token")
  async validateToken(@Param('token') token: string): Promise<TokenValidationResult | undefined> {
    if (token == null) {
        return null;
    }
    return this.appService.ValidateToken(token);
  }
}
