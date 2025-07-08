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
  TsoaResponse
} from "tsoa";

import { CreateStockDto } from "../models/dto/CreateStockDto";
import { BasicResponseDto } from "../models/dto/BasicResponseDto";
import { StockService } from "../services/StockService";
import StockRules from "../rules/StockRules";

@Route("estoque")
@Tags("estoque")
export class StockController extends Controller {
  private stockService = new StockService();
  private stockRules = new StockRules();

  @Post()
  public async createCopy(
    @Body() dto: CreateStockDto,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>,
    @Res() success: TsoaResponse<201, BasicResponseDto>
  ): Promise<void> {
    try {
      const { isbn, codigo_exemplar } = dto;

      this.stockRules.validate(
        { ISBN: isbn, isRequiredField: true },
        { codigo_exemplar, isRequiredField: true }
      );

      const newCopy = this.stockService.createCopy(dto);
      return success(201, new BasicResponseDto("Exemplar cadastrado com sucesso!", newCopy));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, error));
    }
  }

  @Get()
  public async listCopies(
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>,
    @Res() success: TsoaResponse<200, BasicResponseDto>,
  ): Promise<BasicResponseDto> {
    try {
      const copies = this.stockService.listCopies();
      return success(200, new BasicResponseDto("Lista de exemplares encontrada!", copies));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, error));
    }
  }

  @Get("{codigo}")
  public async findCopyById(
    @Path() codigo: string,
    @Res() badRequest: TsoaResponse<404, BasicResponseDto>,
    @Res() success: TsoaResponse<200, BasicResponseDto>
  ): Promise<BasicResponseDto> {
    try {
      const copy = this.stockService.findCopyById(codigo);
      return success(200, new BasicResponseDto("Exemplar encontrado!", copy));
    } catch (error: any) {
      return badRequest(404, new BasicResponseDto(error.message, error));
    }
  }

  @Put("{codigo}")
  public async updateAvailabilityById(
    @Path() codigo: number,
    @Body() body: { disponivel: boolean },
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>,
    @Res() success: TsoaResponse<200, BasicResponseDto>
  ): Promise<void> {
    try {
      this.stockRules.validate(
        { codigo_exemplar: codigo, isRequiredField: true },
        { disponivel: body?.disponivel, isRequiredField: true }
      );

      const updatedCopy = this.stockService.updateAvailability(codigo, body.disponivel);
      return success(200, new BasicResponseDto("Exemplar atualizado!", updatedCopy));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, error));
    }
  }

  @Delete("{codigo}")
  public async deleteCopyById(
    @Path() codigo: string,
    @Res() badRequest: TsoaResponse<404, BasicResponseDto>,
    @Res() success: TsoaResponse<200, BasicResponseDto>
  ): Promise<BasicResponseDto> {
    try {
      this.stockRules.validate(
        { codigo_exemplar: codigo, isRequiredField: true }
      );

      const deletedCopy = this.stockService.deleteCopyById(codigo);
      return success(200, new BasicResponseDto("Exemplar deletado!", deletedCopy));
    } catch (error: any) {
      return badRequest(404, new BasicResponseDto(error.message, error));
    }
  }
}

