import { Injectable } from '@nestjs/common';

export class Gameserver {
    serverID: number;
    name: string; 
};

@Injectable()
export class GameserverService {
    private servers: Array<Gameserver>

    constructor () {
        this.servers = new Array<Gameserver>;
    }

    async All(): Promise<Array<Gameserver>> {
        return this.servers;
    }
    async findOne(name: string): Promise<Gameserver | undefined> {
        return this.servers.find(server => server.name === name)
    }
    async addOne(name: string): Promise<void> {
        this.servers.push({
            serverID: Date.now(),
            name: name
        })
    }
}
