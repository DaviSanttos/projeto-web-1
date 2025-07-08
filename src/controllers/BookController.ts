import { 
  Body, Controller, Delete, Get, Path, Post, Put, 
  Res, Route, Tags, TsoaResponse, Query 
} from "tsoa";
import { BookService } from "../services/BookService";
import BookRules from "../rules/BookRules";
import { BasicResponseDto } from "../models/dto/BasicResponseDto";
import { BookDto } from "../models/dto/BookDto";

@Route("livros")
@Tags("livros")
export class BookController extends Controller {
  private bookService = new BookService();
  private bookRules = new BookRules();

  @Post()
  public async createBook(
    @Body() dto: BookDto,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>,
    @Res() success: TsoaResponse<201, BasicResponseDto>
  ): Promise<void> {
    try {
      this.bookRules.validate(
        { titulo: dto.titulo, isRequiredField: true },
        { autor: dto.autor, isRequiredField: true },
        { editora: dto.editora, isRequiredField: true },
        { edicao: dto.edicao, isRequiredField: true },
        { ISBN: dto.ISBN, isRequiredField: true },
        { categoria: dto.categoria, isRequiredField: true }
      );

      const newBook = await this.bookService.createBook(dto);
      return success(201, new BasicResponseDto("Livro criado com sucesso!", newBook));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, error));
    }
  }

  @Get()
  public async listBooks(
    @Res() notFound: TsoaResponse<404, BasicResponseDto>,
    @Res() success: TsoaResponse<200, BasicResponseDto>,
    @Query() filter?: any
  ): Promise<void> {
    try {
      const books = await this.bookService.listBooks(filter);

      return success(200, new BasicResponseDto("Lista de livros encontrada!", books));
    } catch (error: any) {
      return notFound(404, new BasicResponseDto(error.message, error));
    }
  }

  @Get("{isbn}")
  public async findBookByIsbn(
    @Path() isbn: string,
    @Res() notFound: TsoaResponse<404, BasicResponseDto>,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>,
    @Res() success: TsoaResponse<200, BasicResponseDto>
  ): Promise<void> {
    try {
      const book = await this.bookService.findBookByIsbn(isbn);

      if (!book) {
        return notFound(404, new BasicResponseDto("Livro não encontrado", null));
      }

      return success(200, new BasicResponseDto("Livro encontrado!", book));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, error));
    }
  }

  @Put("{isbn}")
  public async updateBookByIsbn(
    @Path() isbn: string,
    @Body() updateData: Partial<BookDto>,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>,
    @Res() success: TsoaResponse<200, BasicResponseDto>
  ): Promise<void> {
    try {
      this.bookRules.validate(
        { titulo: updateData?.titulo, isRequiredField: false },
        { autor: updateData?.autor, isRequiredField: false },
        { editora: updateData?.editora, isRequiredField: false },
        { edicao: updateData?.edicao, isRequiredField: false },
        { categoria: updateData?.categoria, isRequiredField: false }
      );

      const updatedBook = await this.bookService.updateBookByIsbn(isbn, updateData);
      return success(200, new BasicResponseDto("Livro atualizado!", updatedBook));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, error));
    }
  }

  @Delete("{isbn}")
  public async deleteBookByIsbn(
    @Path() isbn: string,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>,
    @Res() success: TsoaResponse<200, BasicResponseDto>
  ): Promise<void> {
    try {
      const deletedBook = await this.bookService.deleteBookByIsbn(isbn);
      return success(200, new BasicResponseDto("Livro deletado!", deletedBook));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, error));
    }
  }
}
