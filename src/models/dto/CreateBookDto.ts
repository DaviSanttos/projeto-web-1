import { BookCategoryEnum } from "../entity/BookCategoryEntity";

export class CreateBookDto {
    titulo: string;
    autor: string;
    editora: string;
    edicao: string;
    ISBN: string;
    categoria: BookCategoryEnum;

    constructor(
        titulo: string,
        autor: string,
        editora: string,
        edicao: string,
        ISBN: string,
        categoria: BookCategoryEnum
    ) {
        this.titulo = titulo;
        this.autor = autor;
        this.editora = editora;
        this.edicao = edicao;
        this.ISBN = ISBN;
        this.categoria = categoria;
    }
}