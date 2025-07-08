import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Query,
  Res,
  Route,
  Tags,
  TsoaResponse,
} from "tsoa";
import { UserService } from "../services/UserService";
import { BasicResponseDto } from "../models/dto/BasicResponseDto";
import UserRules from "../rules/UserRules";
import { userActive } from "../models/entity/UserEntity";
import { UserCategoryName } from "../models/entity/UserCategoryEntity";
import { CourseName } from "../models/entity/CourseEntity";
import { UpdateUserDto } from "../models/dto/UpdateUserDto";
import { CreateUserDto } from "../models/dto/CreateUserDto";

@Route("usuarios")
@Tags("usuarios")
export class UserController extends Controller {
  private userService = new UserService();
  private userRules = new UserRules();

  @Post()
  public async createUser(
    @Body() dto: CreateUserDto,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>,
    @Res() success: TsoaResponse<201, BasicResponseDto>
  ): Promise<void> {
    try {
      const { nome, cpf, categoria, curso } = dto;

      this.userRules.validate(
        { nome, isRequiredField: true },
        { cpf, isRequiredField: true },
        { categoria, isRequiredField: true },
        { curso, isRequiredField: true }
      );

      const newUser = this.userService.createUser(dto);
      return success(201, new BasicResponseDto("Usuário cadastrado com sucesso!", newUser));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, error));
    }
  }

  @Get()
  public async listUsers(
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>,
    @Query() nome?: string,
    @Query() cpf?: string,
    @Query() categoria?: UserCategoryName,
    @Query() curso?: CourseName,
    @Query() status?: userActive,
  ): Promise<BasicResponseDto | void> {
    try {
      const users = this.userService.listUsers({ nome, cpf, categoria, curso, status });
      return new BasicResponseDto("Lista de usuários encontrada!", users);
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, error));
    }
  }

  @Get("{cpf}")
  public async findUserByCpf(
    @Path() cpf: string,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>
  ): Promise<BasicResponseDto | void> {
    try {
      const user = this.userService.findUserByCpf(cpf);
      return new BasicResponseDto("Usuário encontrado!", user);
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, error));
    }
  }

  @Put("{cpf}")
  public async updateUserByCpf(
    @Path() cpf: string,
    @Body() updateData: UpdateUserDto,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>
  ): Promise<BasicResponseDto | void> {
    try {
      const { nome, categoria, curso, status } = updateData;

      this.userRules.validate(
        { nome, isRequiredField: false },
        { categoria, isRequiredField: false },
        { curso, isRequiredField: false },
        { status, isRequiredField: false }
      );

      const updatedUser = this.userService.updateUserByCpf(cpf, updateData);
      return new BasicResponseDto("Usuário atualizado!", updatedUser);
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, error));
    }
  }

  @Delete("{cpf}")
  public async deleteUserByCpf(
    @Path() cpf: string,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>
  ): Promise<BasicResponseDto | void> {
    try {
      const deletedUser = this.userService.deleteUserByCpf(cpf);
      return new BasicResponseDto("Usuário deletado!", deletedUser);
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, error));
    }
  }
}
