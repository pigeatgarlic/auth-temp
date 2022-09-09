import { Injectable } from '@nestjs/common';

export class User {
    UserID: number;
    name: string; 
};

@Injectable()
export class UserService {
    private servers: Array<User>

    constructor () {
        this.servers = new Array<User>;
    }

    async All(): Promise<Array<User>> {
        return this.servers;
    }
    async findOne(name: string): Promise<User | undefined> {
        return this.servers.find(user => user.name === name)
    }
    async addOne(name: string): Promise<void> {
        this.servers.push({
            UserID: Date.now(),
            name: name
        })
    }
}
