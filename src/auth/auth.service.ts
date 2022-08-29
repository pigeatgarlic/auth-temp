import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { log, time } from 'console';
import { pseudoRandomBytes, randomInt } from 'crypto';
import { Strategy } from 'passport-jwt';
import { GameserverService } from 'src/gameserver/gameserver.service';
import { ClientTokenValidationResult, ServerTokenValidationResult } from './auth.controller';

class Session {
    constructor(clientID : number, serverID: number) {
        this.clientID = clientID;
        this.serverID = serverID;
        this.ID = randomInt(10000)
    }

    ID: number;
    clientID : number;
    serverID : number;
}

@Injectable()
export class AuthService {
    constructor(private gameserverService : GameserverService,
                private jwtToken: JwtService){
        this.sessions = new Array<Session>;
    }

    private sessions: Array<Session>;


    async RequestGameSession(clientID : number) : Promise<string>
    {
        var server = await this.gameserverService.findRandom();
        if (server == null) {
            return "none"
        }
        var result = this.sessions.find(x => x.clientID == clientID)
        if (result == null) {
            this.sessions.push(new Session(clientID,server.serverID));
        }

        var payload = { clientID: clientID, };
        var str = await this.jwtToken.signAsync(payload);
        return str;
    }
    async RemoveGameSession(clientID : number) : Promise<boolean>
    {
        var result = this.sessions.find(x => x.clientID == clientID)
        if (result == null) {
            return false;
        }
        this.sessions = this.sessions.filter(x => x.clientID != clientID);
        return true;
    }

    async RequestServerToken(serverID : number) : Promise<string>
    {
        this.sessions.forEach(x => log(`available session: client ${x.clientID} and server ${x.serverID}`))
        var ses = this.sessions.find(x => x.serverID == serverID);
        if (ses == null) {
            return "none"
        }

        var payload = { serverID: ses.serverID };
        var str = await this.jwtToken.signAsync(payload);
        return str;
    }

    async ValidateToken(Val: string) : Promise<undefined | ServerTokenValidationResult | ClientTokenValidationResult>
    {
        var payload = null;
        var client = null;
        var server = null;
        try { payload = this.jwtToken.decode(Val); } catch (error) { return null; }

        if (payload["clientID"] != null) {
            client = payload["clientID"]
        }else if (payload["serverID"] != null) {
            server = payload["serverID"]
        }else {
            return null;
        }

        var session = this.sessions.find(x => x.serverID == server || x.clientID == client );
        return server ? new ServerTokenValidationResult(server,session.ID) : new ClientTokenValidationResult(client,session.ID);
    }
}
