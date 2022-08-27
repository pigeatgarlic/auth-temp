import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GameserverModule } from 'src/gameserver/gameserver.module';
import { AuthService } from './auth.service';
import { jwtConstants } from '../../constant'
import { AuthController, TokenValidationResult } from './auth.controller';
import { GameserverService } from 'src/gameserver/gameserver.service';

@Module({
  imports:[
    GameserverModule,
    JwtModule.register({
      secret: jwtConstants.secret
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    TokenValidationResult
  ],
})
export class AuthModule {}
