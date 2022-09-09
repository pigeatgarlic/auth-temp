import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GameserverModule } from 'src/gameserver/gameserver.module';
import { AuthService } from './auth.service';
import { jwtConstants } from '../../constant'
import { AuthController } from './auth.controller';
import { GameserverService } from 'src/gameserver/gameserver.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[
    GameserverModule,
    UserModule,
    JwtModule.register({
      secret: jwtConstants.secret
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
  ],
})
export class AuthModule {}
