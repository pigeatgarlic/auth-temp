import { Body, Controller, Get, Param, Req } from '@nestjs/common';
import { Gameserver } from 'src/gameserver/gameserver.service';
import { AuthService } from './auth.service';


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

  @Get("client/:id/:server")
  async getGameSession(@Param('id') id: string, @Param('server') name: string): Promise<string> {
    if (id == null) {
        return "none"
    }
    return await this.appService.RequestGameSession(Number.parseInt(id), name);
  }

  @Get("terminate/:id")
  async terminateSession(@Param('id') id: string): Promise<boolean> {
    if (id == null) {
        return false;
    }
    return await this.appService.RemoveGameSession(Number.parseInt(id));
  }

  @Get("allServer")
  async getAllServer(): Promise<Array<Gameserver>> {
    return await this.appService.GetAllServer();
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
