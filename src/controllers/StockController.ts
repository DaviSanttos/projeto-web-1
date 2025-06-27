import { Request, Response } from "express";
import { BookService } from "../services/BookService";
import { StockService } from "../services/StockService";
import StockRules from "../rules/StockRules";


const stockService = new StockService();
const stockRules = new StockRules();

export function createCopy(req: Request, res: Response) {
    try {
        const stockData = req.body;

        const isbn = stockData?.ISBN;
        const codigo_exemplar = stockData?.codigo_exemplar;

        stockRules.validate(
            { ISBN: isbn, isRequiredField: true },
            { codigo_exemplar, isRequiredField: true }
        );

        const newCopy = stockService.createCopy(stockData);
        res.status(201).json(
            {
                mensagem: "Exemplar cadastrado com sucesso!",
                copy: newCopy
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export function listCopies(req: Request, res: Response) {
    try {
        const copies = stockService.listCopies();
        res.status(201).json(
            {
                mensagem: "Lista de exemplares encontrada!",
                copies
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export function findCopyById(req: Request, res: Response) {
    try {
        const codigo = req.params.codigo;
        
        const copy = stockService.findCopyById(codigo);

        res.status(201).json(
            {
                mensagem: "Exemplar encontrado!",
                copy
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export function updateAvailabilityById(req: Request, res: Response) {
    try {
        const codigo = parseInt(req.params.codigo);

        stockRules.validate(
            { codigo_exemplar: codigo, isRequiredField: true },
            { disponivel: req.body?.disponivel, isRequiredField: true }
        );

        const updatedCopy = stockService.updateAvailability(codigo, req.body?.disponivel);

        res.status(201).json(
            {
                mensagem: "Exemplar atualizado!",
                updatedCopy
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export function deleteCopyById(req: Request, res: Response) {
    try {
        const codigo = req.params.codigo;

        const deletedCopy = stockService.deleteCopyById(codigo);

        res.status(201).json(
            {
                mensagem: "Exemplar deletado!",
                deletedCopy
            }
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};