import chalk from "chalk";
import { userActive } from "../models/UserModel";
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

        setInterval(() => {
            const today = Time.nowInBrazil();

            const usersToCheck = this.userRepository.list().filter(user =>
                user.ativo === userActive.SUSPENSO || user.ativo === userActive.INATIVO
            );

            usersToCheck.forEach(user => {
                const userLoans = this.loanService.listLoans().filter(
                    loan => loan.usuario_id === user.id
                );

                // Se não houver empréstimos, pula
                if (userLoans.length === 0) return;

                // Todos os empréstimos foram entregues?
                const allReturned = userLoans.every(loan => !!loan.data_devolucao);

                if(!allReturned) return;

                // Todos possuem suspensão expirada (ou nenhuma suspensão)?
                const allSuspensionsExpired = userLoans.every(loan => {
                    if (!loan.suspensao_ate) return true;
                    const suspensaoAte = Time.toBrazilTime(loan.suspensao_ate);
                    return suspensaoAte <= today;
                });

                if (allReturned && allSuspensionsExpired) {
                    user.ativo = userActive.ATIVO;
                    this.userRepository.updateById(user.id, user);
                    console.log(chalk.green(`Usuário ${user.id} reativado.`));
                }
            });
        }, 15000);
    }
}