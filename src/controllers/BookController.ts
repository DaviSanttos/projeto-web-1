import { Request, Response } from "express";
import { BookService } from "../services/BookService";


const bookService = new BookService();

export function createBook(req: Request, res: Response) {
    try {
        const newbook = bookService.createBook(req.body);
        res.status(201).json(
            {
                mensagem: "Livro cadastrado com sucesso!",
                book: newbook
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export function listBooks(req: Request, res: Response) {
    try {
        const books = bookService.listBooks(req.query);
        res.status(201).json(
            {
                mensagem: "Lista de livros encontrada!",
                books
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export function findBookByIsbn(req: Request, res: Response) {
    try {
        const isbn = req.params.isbn;
        
        const book = bookService.findBookByIsbn(isbn);

        res.status(201).json(
            {
                mensagem: "livro encontrado!",
                book
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export function updateBookByIsbn(req: Request, res: Response) {
    try {
        const isbn = req.params.isbn;

        const updatedBook = bookService.updateBookByIsbn(isbn, req.body);

        res.status(201).json(
            {
                mensagem: "livro atualizado!",
                updatedBook
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export function deleteBookByIsbn(req: Request, res: Response) {
    try {
        const isbn = req.params.isbn;

        const deletedBook = bookService.deleteBookByIsbn(isbn);

        res.status(201).json(
            {
                mensagem: "Livro deletado!",
                deletedBook
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};