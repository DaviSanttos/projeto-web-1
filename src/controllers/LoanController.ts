import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Put,
  Res,
  Route,
  Tags,
  TsoaResponse
} from "tsoa";

import { LoanService } from "../services/LoanService";
import LoanRules from "../rules/LoanRules";
import { CreateLoanDto } from "../models/dto/CreateLoanDto";
import { BasicResponseDto } from "../models/dto/BasicResponseDto";

@Route("emprestimos")
@Tags("emprestimos")
export class LoanController extends Controller {
  private loanService = new LoanService();
  private loanRules = new LoanRules();

  @Post()
  public async createLoan(
    @Body() dto: CreateLoanDto,
    @Res() badRequest: TsoaResponse<400, BasicResponseDto>,
    @Res() success: TsoaResponse<201, BasicResponseDto>
  ): Promise<void> {
    try {
      const { cpf, codigo_exemplar } = dto;

      this.loanRules.validate(
        { cpf, isRequiredField: true },
        { codigo_exemplar, isRequiredField: true }
      );

      const newLoan = this.loanService.createLoan(dto);
      return success(201, new BasicResponseDto("Empréstimo cadastrado com sucesso!", newLoan));
    } catch (error: any) {
      return badRequest(400, new BasicResponseDto(error.message, error));
    }
  }

  @Get()
  public async listLoans(
    @Res() badRequest: TsoaResponse<404, BasicResponseDto>,
    @Res() success: TsoaResponse<200, BasicResponseDto>
  ): Promise<BasicResponseDto> {
    try {
      const loans = this.loanService.listLoans();
      return success(200, new BasicResponseDto("Lista de empréstimos encontrada!", loans));
    } catch (error: any) {
      return badRequest(404, new BasicResponseDto(error.message, error));
    }
  }

  @Put("{id}/devolucao")
  public async updateReturnDateById(
    @Path() id: string,
    @Res() badRequest: TsoaResponse<404, BasicResponseDto>,
    @Res() success: TsoaResponse<200, BasicResponseDto>
  ): Promise<void> {
    try {
      this.loanRules.validate(
        { id, isRequiredField: true }
      );

      const updatedLoan = this.loanService.updateReturnDateById(id);
      return success(200, new BasicResponseDto("Empréstimo atualizado!", updatedLoan));
    } catch (error: any) {
      return badRequest(404, new BasicResponseDto(error.message, error));
    }
  }
}

