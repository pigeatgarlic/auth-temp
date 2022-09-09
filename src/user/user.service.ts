import { Injectable } from '@nestjs/common';

export class User {
    UserID: number;
    name: string; 
};

@Injectable()
export class UserService {
    private users: Array<User>

    constructor () {
        this.users = new Array<User>;
    }

    async All(): Promise<Array<User>> {
        return this.users;
    }
    async findOne(name: string): Promise<User | undefined> {
        return this.users.find(user => user.name === name)
    }
    async addOne(name: string): Promise<void> {
        this.users.push({
            UserID: Date.now(),
            name: name
        })
    }
}
