import chalk from "chalk";
import { userActive } from "../models/entity/UserEntity";
import { UserRepository } from "../repositories/UserRepository";
import { LoanService } from "../services/LoanService";
import { UserService } from "../services/UserService";
import { Time } from "../utils/Time";

export class routineUserReactivationRoutine {
    private loanService = new LoanService();
    private userService = new UserService();
    private userRepository = UserRepository.getInstance();

    start() {
        console.log("Rotina de reativação de usuários iniciada...");

        setInterval(async () => {
            try {
                const today = Time.nowInBrazil();

                const allUsers = await this.userRepository.list();
                const usersToCheck = allUsers.filter(user =>
                    user.ativo === userActive.SUSPENSO || user.ativo === userActive.INATIVO
                );

                if (usersToCheck.length === 0) {
                    console.log(chalk.yellow("Nenhum usuário suspenso ou inativo encontrado."));
                    return;
                }

                for (const user of usersToCheck) {
                    const userLoans = await this.loanService.findLoansByUserId(user.id);

                    if (userLoans.length === 0) continue;

                    const allReturned = userLoans.every(loan => !!loan.data_devolucao);
                    if (!allReturned) continue;

                    const allSuspensionsExpired = userLoans.every(loan => {
                        if (!loan.suspensao_ate) return true;
                        const suspensaoAte = Time.toBrazilTime(loan.suspensao_ate);
                        return suspensaoAte <= today;
                    });

                    if (allSuspensionsExpired) {
                        await this.userRepository.updateById(user.id, { ativo: userActive.ATIVO });
                        console.log(chalk.green(`Usuário ${user.id} reativado.`));
                    }
                }
            } catch (err) {
                console.error(chalk.red("Erro na rotina de reativação de usuários:"), err);
            }
        }, 15000);
    }
}
