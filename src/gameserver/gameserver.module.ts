import { Module } from '@nestjs/common';
import { TokenValidationResult } from 'src/auth/auth.controller';
import { GameserverService } from './gameserver.service';

@Module({
    imports: [TokenValidationResult],
    providers: [GameserverService],
    exports: [GameserverService]
})
export class GameserverModule {}
