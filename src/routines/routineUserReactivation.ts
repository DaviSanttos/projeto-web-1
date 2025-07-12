import chalk from "chalk";
import { userActive } from "../models/entity/UserEntity";
import { UserRepository } from "../repositories/UserRepository";
import { LoanService } from "../services/LoanService";
import { UserService } from "../services/UserService";
import { Time } from "../utils/Time";

export class routineUserReactivationRoutine {
    private loanService = new LoanService();
    private userRepository = UserRepository.getInstance();

    start() {
        console.log("Rotina de reativação de usuários iniciada...");

        setInterval(async () => {
            try {
                const today = Time.nowInBrazil();
                const usersToCheck = await this.userRepository.findSuspendedOrInactiveUsers();

                if (usersToCheck.length === 0) {
                    console.log(chalk.yellow("Nenhum usuário suspenso ou inativo encontrado."));
                    return;
                }

                for (const user of usersToCheck) {
                    const userLoans = await this.loanService.findLoansByUserId(user.id);

                    if (userLoans.length === 0) continue;

                    const allReturned = userLoans.every(loan => !!loan.data_devolucao);
                    const allSuspensionsExpired = userLoans.every(loan => {
                        if (!loan.suspensao_ate) return true;
                        const suspensaoAte = Time.toBrazilTime(loan.suspensao_ate);
                        return suspensaoAte <= today;
                    });

                    console.log(chalk.blue(`Usuário ${user.id} - devolveu todos: ${allReturned}, Suspensões expiradas: ${allSuspensionsExpired}`));

                    if (allReturned && allSuspensionsExpired) {
                        await this.userRepository.updateById(user.id, { ativo: userActive.ATIVO });
                        console.log(chalk.green(`Usuário ${user.id} reativado.`));

                        for (const loan of userLoans) {
                            if (!loan.reativado_em) {
                                loan.reativado_em = today;
                                await this.loanService.updateLoan(loan);
                                console.log(chalk.yellow(`Empréstimo ${loan.id} marcado como usado para reativação.`));
                            }
                        }
                    }
                }
            } catch (err) {
                console.error(chalk.red("Erro na rotina de reativação de usuários:"), err);
            }
        }, 15000);
    }
}
