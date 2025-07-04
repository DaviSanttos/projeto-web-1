export class ProductDto {
    titulo: string;
    autor: number;
    editora: string;
    edicao: string;
    isbn: string;
    categoria: string;

    constructor(
        titulo: string,
        autor: number,
        editora: string,
        edicao: string,
        isbn: string,
        categoria: string
    ) {
        this.titulo = titulo;
        this.autor = autor;
        this.editora = editora;
        this.edicao = edicao;
        this.isbn = isbn;
        this.categoria = categoria;
    }
}