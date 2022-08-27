import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GameserverService } from './gameserver/gameserver.service';
import { GameserverModule } from './gameserver/gameserver.module';

@Module({
  imports: [AuthModule, GameserverModule],
  controllers: [AppController],
  providers: [AppService, GameserverService],
})
export class AppModule {}
