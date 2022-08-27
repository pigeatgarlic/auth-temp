import { Injectable } from '@nestjs/common';

export type Gameserver = any;

@Injectable()
export class GameserverService {
    private readonly users = [
        {
            serverID: 0,
            IPaddress: "0.0.0.0",
            using: false,
        },
    ]

    async findOne(id: number): Promise<Gameserver | undefined> {
        return this.users.find(server => server.serverID === id)
    }
    async findRandom(): Promise<Gameserver | undefined> {
        return this.users.find(i => i.using === false);
    }
}
