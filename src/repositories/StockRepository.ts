import { Book } from "../models/BookModel";
import { Stock } from "../models/StockModel";


export class StockRepository {
    private static instance: StockRepository;
    private stocklist: Stock[] = [];

    private constructor() { }

    public static getInstance(): StockRepository {
        if (!this.instance) {
            this.instance = new StockRepository();
        }
        return this.instance;
    }

    create(stock: Stock) {
        this.stocklist.push(stock);
    }

    list(){
        return this.stocklist;
    }
    // ... outros mé todos
}