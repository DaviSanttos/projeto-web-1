import { Request, Response } from "express";
import UserCategoryService from "../services/UserCategoryService";
import BookCategoryService from "../services/BookCategoryService";
import CourseService from "../services/CourseService";


const userCategoryService = UserCategoryService
const bookCategoryService = BookCategoryService
const courseService = CourseService

export function listUserCategories(req: Request, res: Response) {
    try {
        const list = userCategoryService.list();
        res.status(201).json(
            {
                mensagem: "Lista de categorias de usuários!",
                userCategories: list
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export function listBookCategories(req: Request, res: Response) {
    try {
        const list = bookCategoryService.list();
        res.status(201).json(
            {
                mensagem: "Lista de categorias de livros!",
                bookCategories: list
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export function listCourses(req: Request, res: Response) {
    try {
        const list = courseService.list();

        res.status(201).json(
            {
                mensagem: "Cursos encontrados!",
                coures: list
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};