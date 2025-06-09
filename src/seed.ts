import { UserService } from "./services/UserService";
import { BookService } from "./services/BookService";
import { LoanService } from "./services/LoanService";
import { Time } from "./utils/Time";
import { StockService } from "./services/StockService";
import { LoanRepository } from "./repositories/LoanRepository";
import { Loan } from "./models/LoanModel";

export function seedData() {
    const userService = new UserService();
    const bookService = new BookService();
    const strockService = new StockService();
    const loanRepository = LoanRepository.getInstance();

    // Usuários
    const user1 = userService.createUser({
        nome: "João",
        cpf: "20632816023",
        email: "joao@email.com",
        categoria: "Aluno",
        curso: "ADS"
    });

    const user2 = userService.createUser({
        nome: "Maria",
        cpf: "21743349092",
        email: "maria@email.com",
        categoria: "Aluno",
        curso: "Pedagogia"
    });

    const user3 = userService.createUser({
        nome: "Davizeira",
        cpf: "10653753012",
        email: "davi@email.com",
        categoria: "Professor",
        curso: "ADS"
    });

    // Livros
    const book1 = bookService.createBook({
        titulo: "Clean Code",
        autor: "Robert C. Martin",
        editora: "Prentice Hall",
        edicao: "1",
        ISBN: "9780132350884",
        categoria: "Romance"
    });

    const book2 = bookService.createBook({
        titulo: "Design Patterns",
        autor: "GoF",
        editora: "Addison-Wesley",
        edicao: "1",
        ISBN: "9780201633610",
        categoria: "Computação"
    });

    // Exemplares
    const copy1 = strockService.createCopy({ ISBN: book2.isbn, codigo_exemplar: '001' });
    const copy2 = strockService.createCopy({ ISBN: book2.isbn, codigo_exemplar: '002' });
    const copy3 = strockService.createCopy({ ISBN: book2.isbn, codigo_exemplar: '003' });
    const copy4 = strockService.createCopy({ ISBN: book1.isbn, codigo_exemplar: '004' });
    const copy5 = strockService.createCopy({ ISBN: book1.isbn, codigo_exemplar: '005' });
    const copy6 = strockService.createCopy({ ISBN: book1.isbn, codigo_exemplar: '006' });
    const copy7 = strockService.createCopy({ ISBN: book1.isbn, codigo_exemplar: '007' });
    const copy8 = strockService.createCopy({ ISBN: book1.isbn, codigo_exemplar: '008' });


    // Empréstimos vencidos e não devolvidos
    const vencido20dias = Time.addDays(Time.nowInBrazil(), -20);
    const vencido30dias = Time.addDays(Time.nowInBrazil(), -30);
    const vencido5dias = Time.addDays(Time.nowInBrazil(), -5);

    loanRepository.create(new Loan(
        user1.id,
        copy1.id,
        vencido20dias
    ));

    loanRepository.create(new Loan(
        user1.id,
        copy2.id,
        vencido20dias
    ));

    loanRepository.create(new Loan(
        user1.id,
        copy3.id,
        vencido20dias
    ));


    loanRepository.create(new Loan(
        user2.id,
        copy4.id,
        vencido30dias
    ));

    loanRepository.create(new Loan(
        user2.id,
        copy5.id,
        vencido30dias
    ));

    sleep(25000).then(() => {
        console.log("⏳ Aguardando 25 segundo para simular atraso...");

        const user4 = userService.createUser({
            nome: "Otavio",
            cpf: "82098206054",
            email: "otavio@email.com",
            categoria: "Professor",
            curso: "Administração"
        });

        loanRepository.create(new Loan(
            user4.id,
            copy6.id,
            vencido30dias
        ));

    });

    loanRepository.create(new Loan(
        user3.id,
        copy7.id,
        vencido5dias
    ));

    loanRepository.create(new Loan(
        user3.id,
        copy8.id,
        vencido5dias
    ));

    console.log("✅ Seed de dados concluído");
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

