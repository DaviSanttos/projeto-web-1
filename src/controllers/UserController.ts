import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { UserCategoryRepository } from "../repositories/UserCategoryRepository";
import { CourseRepository } from "../repositories/CourseRepository";
import UserRules from "../rules/UserRules";

const userService = new UserService();
const userRules = new UserRules();

export function createUser(req: Request, res: Response) {
    try {
        const userData = req.body;

        const nome = userData?.nome;
        const cpf = userData?.cpf;
        const categoria = userData?.categoria;
        const curso = userData?.curso;

        userRules.validate(
            { nome, isRequiredField: true },
            { cpf, isRequiredField: true },
            { categoria, isRequiredField: true },
            { curso, isRequiredField: true }
        );
        
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

export function findUserByCpf(req: Request, res: Response) {
    try {
        const cpf = req.params.cpf;
        
        const user = userService.findUserByCpf(cpf);

        res.status(201).json(
            {
                mensagem: "usuário encontrada!",
                user
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export function updateUserByCpf(req: Request, res: Response) {
    try {
        const cpf = req.params.cpf;

        const updatedUser = userService.updateUserByCpf(cpf, req.body);

        res.status(201).json(
            {
                mensagem: "usuário atualizado!",
                updatedUser
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export function deleteUserByCpf(req: Request, res: Response) {
    try {
        const cpf = req.params.cpf;

        const deletedUser = userService.deleteUserByCpf(cpf);

        res.status(201).json(
            {
                mensagem: "usuário edeletado!",
                deletedUser
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};