import { Module } from '@nestjs/common';
import { ClientTokenValidationResult, ServerTokenValidationResult } from 'src/auth/auth.controller';
import { GameserverService } from './gameserver.service';

@Module({
    imports: [ClientTokenValidationResult,ServerTokenValidationResult],
    providers: [GameserverService],
    exports: [GameserverService]
})
export class GameserverModule {}
