export interface BookFilter {
  autor?: string;
  categoria?: string;
  titulo?: string;
  // adicione outros filtros que sua API aceitar
}

export class BookDto {
    titulo: string;
    autor: string;
    editora: string;
    edicao: string;
    ISBN: string;
    categoria: string;

    constructor(
        titulo: string,
        autor: string,
        editora: string,
        edicao: string,
        ISBN: string,
        categoria: string
    ) {
        this.titulo = titulo;
        this.autor = autor;
        this.editora = editora;
        this.edicao = edicao;
        this.ISBN = ISBN;
        this.categoria = categoria;
    }
}