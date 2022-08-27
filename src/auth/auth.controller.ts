import { Body, Controller, Get, Param, Req } from '@nestjs/common';
import { AuthService } from './auth.service';


export class TokenValidationResult{
    constructor(server:string,client:string){
        this.serverToken = server;
        this.clientToken = client;
    }
    serverToken: string;
    clientToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Get("client/:id")
  async getGameSession(@Param('id') id: string): Promise<string> {
    if (id == null) {
        return "none"
    }
    return await this.appService.RequestGameSession(Number.parseInt(id));
  }

  @Get("server/:id")
  async getServerToken(@Param('id') id: string): Promise<string> {
    if (id == null) {
        return "none"
    }
    return await this.appService.RequestServerToken(Number.parseInt(id));
  }

  @Get("validate/:token")
  async validateToken(@Param('token') token: string): Promise<undefined | TokenValidationResult> {
    if (token == null) {
        return null;
    }
    return this.appService.ValidateToken(token);
  }
}
