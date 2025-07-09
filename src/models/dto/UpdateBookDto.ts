import { BookCategoryEnum } from "../entity/BookCategoryEntity";

export class UpdateBookDto {
  titulo?: string;
  autor?: string;
  editora?: string;
  edicao?: string;
  categoria?: BookCategoryEnum;
}