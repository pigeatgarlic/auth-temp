import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { log } from 'console';
import { Strategy } from 'passport-jwt';
import { GameserverService } from 'src/gameserver/gameserver.service';
import { TokenValidationResult } from './auth.controller';

class Session {
    constructor(clientID : number, serverID: number) {
        this.clientID = clientID;
        this.serverID = serverID;
    }
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
        this.sessions.push(new Session(clientID,server.serverID));
        var payload = {
            clientID: clientID,
        };

        var str = await this.jwtToken.signAsync(payload);
        return str;
    }

    async RequestServerToken(serverID : number) : Promise<string>
    {
        this.sessions.forEach(x => log(`available session: client ${x.clientID} and server ${x.serverID}`))
        var ses = this.sessions.find(x => x.serverID == serverID);
        if (ses == null) {
            return "none"
        }
        var payload = {
            serverID: ses.serverID
        };

        var str = await this.jwtToken.signAsync(payload);
        return str;
    }

    async ValidateToken(Val: string) : Promise<undefined | TokenValidationResult>
    {
        var client = null;
        var server = null;

        try {
            var payload = this.jwtToken.decode(Val);
            if (payload["clientID"] != null) {
                client = payload["clientID"]
            }else if (payload["serverID"] != null) {
                server = payload["serverID"]
            }else {
                return null;
            }
        } catch (error) {
           return null; 
        }

        if (client == null) {
            this.sessions.forEach(element => {
                if (element.serverID == server) {
                    client = element.clientID
                }
            });
        } else if (server == null) {
            this.sessions.forEach(element => {
                if (element.clientID == client) {
                    server = element.serverID
                }
            });
        }

        if (client == null || server == null) {
            return null;
        }

        
        return new TokenValidationResult(server,client);
    }
}
