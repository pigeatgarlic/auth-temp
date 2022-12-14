import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { log, time } from 'console';
import { pseudoRandomBytes, randomInt } from 'crypto';
import { Strategy } from 'passport-jwt';
import { Gameserver, GameserverService } from 'src/gameserver/gameserver.service';
import { User, UserService } from 'src/user/user.service';
import { TokenValidationResult} from './auth.controller';

export class Session {
    constructor(clientID : number, serverID: number) {
        this.clientID = clientID;
        this.serverID = serverID;
        this.ID = Date.now()
    }

    ID: number;
    clientID : number;
    serverID : number;
}

@Injectable()
export class AuthService {
    constructor(private gameserverService : GameserverService,
                private userService : UserService,
                private jwtToken: JwtService){
        this.sessions = new Array<Session>;
    }

    private sessions: Array<Session>;


    async GetAllServer() : Promise<Array<Gameserver>> {
        return this.gameserverService.All();
    }
    async GetAllUser() : Promise<Array<User>> {
        return this.userService.All();
    }


    async RequestGameSession(username : string, server: string) : Promise<string>
    {
        var res = await this.gameserverService.findOne(server);
        if (res == null) {
            return "none"
        }

        var usr = await this.userService.findOne(username)
        if (usr == null) {
            this.userService.addOne(username)
            usr = await this.userService.findOne(username)
        }

        var exist = this.sessions.find(x => x.serverID == res.serverID && x.clientID != usr.UserID)
        if (exist != null) {
            return "none"
        }

        var result = this.sessions.find(x => x.clientID == usr.UserID && x.serverID == res.serverID)
        if (result == null) { 
            this.sessions.push(new Session(usr.UserID,res.serverID)); 
            result = this.sessions.find(x => x.clientID == usr.UserID && x.serverID == res.serverID)
        }

        var payload = { clientID: result.clientID, };
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

    async allSession() : Promise<Array<Session>>{
        return this.sessions;
    }




    async RequestServerToken(name : string) : Promise<string>
    {
        var res = await this.gameserverService.findOne(name);
        if (res == null) { 
            await this.gameserverService.addOne(name); 
            return "none"; 
        }

        var ses = this.sessions.find(x => x.serverID == res.serverID);
        if (ses == null) {
            return "none"
        }

        var payload = { serverID: ses.serverID };
        var str = await this.jwtToken.signAsync(payload);
        return str;
    }

    async ValidateToken(Val: string) : Promise<undefined | TokenValidationResult>
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
        if (session == null) {
            return null;
        }

        return new TokenValidationResult(server != null? server : client ,session.ID,client == null);
    }
}
