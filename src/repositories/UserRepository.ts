import { User, userActive } from "../models/UserModel";

export class UserRepository {
    private static instance: UserRepository;
    private userList: User[] =  [];
    // [
    //     {
    //         "ativo": userActive.ATIVO,
    //         "nome": "davi",
    //         "cpf": "12345678909",
    //         "categoria_id": 1,
    //         "curso_id": 1,
    //         "email": "3",
    //         "id": 1749302865474
    //     },
    //     {
    //         "ativo": userActive.SUSPENSO,
    //         "nome": "fe",
    //         "cpf": "12345678909",
    //         "categoria_id": 1,
    //         "curso_id": 1,
    //         "email": "3",
    //         "id": 1749302876384
    //     },
    //     {
    //         "ativo": userActive.INATIVO,
    //         "nome": "ads",
    //         "cpf": "12345678909",
    //         "categoria_id": 2,
    //         "curso_id": 1,
    //         "email": "3",
    //         "id": 1749302877183
    //     },
    //     {
    //         "ativo": "ativo",
    //         "nome": "ads",
    //         "cpf": "12345678909",
    //         "categoria_id": 1,
    //         "curso_id": 1,
    //         "email": "3",
    //         "id": 1749302877973
    //     },
    //     {
    //         "ativo": "ativo",
    //         "nome": "ads",
    //         "cpf": "12345678909",
    //         "categoria_id": 1,
    //         "curso_id": 1,
    //         "email": "3",
    //         "id": 1749302878800
    //     }
    // ];

    private constructor() { }

    public static getInstance(): UserRepository {
        if (!this.instance) {
            this.instance = new UserRepository();
        }
        return this.instance;
    }

    create(user: User) {
        this.userList.push(user);
    }

    list() {
        return this.userList;
    }

    findByCpf(cpf: string): User | undefined {
        return this.userList.find((user: User) => user.cpf === cpf);
    }

    updateById(id: number, updates: any): User {
        const index = this.userList.findIndex((u: User) => u.id === id);
        
        this.userList[index] = { 
            ...this.userList[index],
            ...updates
        };

        return this.userList[index];
    }

    deleteUserById(id: number): User {
        const index = this.userList.findIndex((u: User) => u.id === id);

        const deletedUser = this.userList[index];
        this.userList.splice(index, 1);
        
        return deletedUser;
    }

    existsByCpf(cpf: string): boolean {
        return this.userList.some((user: User) => user.cpf === cpf);
    }
}