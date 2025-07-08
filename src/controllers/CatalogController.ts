import {
  Controller,
  Get,
  Res,
  Route,
  Tags,
  TsoaResponse
} from "tsoa";
import { BasicResponseDto } from "../models/dto/BasicResponseDto";
import UserCategoryService from "../services/UserCategoryService";
import BookCategoryService from "../services/BookCategoryService";
import CourseService from "../services/CourseService";

@Route("catalogos")
@Tags("catálogos")
export class CatalogController extends Controller {
  private userCategoryService = UserCategoryService;
  private bookCategoryService = BookCategoryService;
  private courseService = CourseService;

  @Get("/categorias-usuario")
  public async listUserCategories(
    @Res() success: TsoaResponse<200, BasicResponseDto>,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>
  ): Promise<void> {
    try {
      const list = this.userCategoryService.list();
      return success(200, new BasicResponseDto("Lista de categorias de usuários!", list));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, error));
    }
  }

  @Get("/categorias-livro")
  public async listBookCategories(
    @Res() success: TsoaResponse<200, BasicResponseDto>,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>
  ): Promise<void> {
    try {
      const list = this.bookCategoryService.list();
      return success(200, new BasicResponseDto("Lista de categorias de livros!", list));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, error));
    }
  }

  @Get("/cursos")
  public async listCourses(
    @Res() success: TsoaResponse<200, BasicResponseDto>,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>
  ): Promise<void> {
    try {
      const list = this.courseService.list();
      return success(200, new BasicResponseDto("Cursos encontrados!", list));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, error));
    }
  }
}
