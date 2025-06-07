import { Request, Response } from "express";
import { UserService } from "../services/UserService";

const userService = new UserService();

export function createUser(req: Request, res: Response) {
    try {
        const newUser = userService.createUser(req.body);
        res.status(201).json(
            {
                mensagem: "Usuário cadastrado com sucesso!",
                user: newUser
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export function listUsers(req: Request, res: Response) {
    try {
        const users = userService.listUsers(req.query);
        res.status(201).json(
            {
                mensagem: "Lista de usuários encontrada!",
                users
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};