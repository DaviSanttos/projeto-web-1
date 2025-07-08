export class CreateStockDto {
  codigo_exemplar: number;
  isbn: string;

  constructor(
    codigo_exemplar: number,
    isbn: string,
  ) {
    this.codigo_exemplar = codigo_exemplar;
    this.isbn = isbn;
  }
}