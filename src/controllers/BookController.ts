import { Body, Controller, Post, Res, Route, Tags, TsoaResponse } from "tsoa";
import { BookService } from "../services/BookService";
import BookRules from "../rules/BookRules";
import { BookDto } from "../models/dto/BookDto";
import { BasicResponseDto } from "../models/dto/BasicResponseDto";

@Route("livros")
@Tags("livros")
export class BookController extends Controller {
  private bookService = new BookService();
  private bookRules = new BookRules();

  @Post()
  public async createBook(
    @Body() dto: BookDto,
    @Res() fail: TsoaResponse<400, BasicResponseDto>,
    @Res() success: TsoaResponse<201, BasicResponseDto>
  ): Promise<void> {
    try {
      const { titulo, autor, editora, edicao, ISBN, categoria } = dto;
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

      this.bookRules.validate(
        { titulo, isRequiredField: true },
        { autor, isRequiredField: true },
        { editora, isRequiredField: true },
        { edicao, isRequiredField: true },
        { ISBN, isRequiredField: true },
        { categoria, isRequiredField: true }
      );

      const newBook = await this.bookService.createBook(dto);

      return success(201, new BasicResponseDto("Produto criado com sucesso!", newBook));
    } catch (error: any) {
      return fail(400, new BasicResponseDto(error.messag, error));
    }
  }
}

// export function createBook(req: Request, res: Response) {
//     try {
//         const bookData = req.body;

//         const titulo = bookData?.titulo;
//         const autor = bookData?.autor;
//         const editora = bookData?.editora;
//         const edicao = bookData?.edicao;
//         const ISBN = bookData?.ISBN;
//         const categoria = bookData?.categoria;

//         bookRules.validate(
//             { titulo, isRequiredField: true },
//             { autor, isRequiredField: true },
//             { editora, isRequiredField: true },
//             { edicao, isRequiredField: true },
//             { ISBN, isRequiredField: true },
//             { categoria, isRequiredField: true }
//         )
        
//         const newbook = bookService.createBook(bookData);
//         res.status(201).json(
//             {
//                 mensagem: "Livro cadastrado com sucesso!",
//                 book: newbook
//             }
//         );
//     } catch (error: any) {
//         res.status(400).json({ message: error.message });
//     }
// };

// export function listBooks(req: Request, res: Response) {
//     try {
//         const books = bookService.listBooks(req.query);
//         res.status(201).json(
//             {
//                 mensagem: "Lista de livros encontrada!",
//                 books
//             }
//         );
//     } catch (error: any) {
//         res.status(400).json({ message: error.message });
//     }
// };

// export function findBookByIsbn(req: Request, res: Response) {
//     try {
//         const isbn = req.params.isbn;
        
//         const book = bookService.findBookByIsbn(isbn);

//         res.status(201).json(
//             {
//                 mensagem: "livro encontrado!",
//                 book
//             }
//         );
//     } catch (error: any) {
//         res.status(400).json({ message: error.message });
//     }
// };

// export function updateBookByIsbn(req: Request, res: Response) {
//     try {
//         const isbn = req.params.isbn;

//         const updateData = req.body;

//         bookRules.validate(
//             { titulo: updateData?.titulo, isRequiredField: false },
//             { autor: updateData?.autor, isRequiredField: false },
//             { editora: updateData?.editora, isRequiredField: false },
//             { edicao: updateData?.edicao, isRequiredField: false },
//             { categoria: updateData?.categoria, isRequiredField: false },
//         );

//         const updatedBook = bookService.updateBookByIsbn(isbn, req.body);

//         res.status(201).json(
//             {
//                 mensagem: "livro atualizado!",
//                 updatedBook
//             }
//         );
//     } catch (error: any) {
//         res.status(400).json({ message: error.message });
//     }
// };

// export function deleteBookByIsbn(req: Request, res: Response) {
//     try {
//         const isbn = req.params.isbn;

//         const deletedBook = bookService.deleteBookByIsbn(isbn);

//         res.status(201).json(
//             {
//                 mensagem: "Livro deletado!",
//                 deletedBook
//             }
//         );
//     } catch (error: any) {
//         res.status(400).json({ message: error.message });
//     }
// };