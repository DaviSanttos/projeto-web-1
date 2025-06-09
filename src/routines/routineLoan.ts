import chalk from 'chalk';
import { userActive } from "../models/UserModel";
import { UserRepository } from "../repositories/UserRepository";
import { LoanService } from "../services/LoanService";
import { UserService } from "../services/UserService";
import { Time } from "../utils/Time";

export class routineLoan {
    private loanService = new LoanService();
    private userService = new UserService();
    private userRepository = UserRepository.getInstance();

    start() {
        console.log("⏱️ Loan job iniciado...");

        setInterval(() => {
            console.log(chalk.blue.bold("🔄 Atualizando status dos empréstimos..."));

            const today = Time.nowInBrazil();
 
            const suspensao70dias = Time.addDays(today, 70);
            const suspensionCountByUser: { [userId: number]: number } = {};
            const suspensionDaysByUser: { [userId: number]: number } = {};

            const loans = this.loanService.listLoans().filter((loan) =>
                !loan.data_devolucao &&
                (Time.toBrazilTime(loan.suspensao_ate) < suspensao70dias ||
                !loan.suspensao_ate
            ));

            console.log(chalk.blue.bold("Empréstimos encontrados:", loans.length));

            loans.forEach((loan) => {
                const entrega = Time.toBrazilTime(loan.data_entrega);

                console.log(chalk.yellow(`Verificando empréstimo do usuário ${loan.usuario_id} com entrega em ${entrega}`));
                const devolucao = loan.data_devolucao ? Time.toBrazilTime(loan.data_devolucao) : undefined;
                const suspensaoAte = loan.suspensao_ate ? Time.toBrazilTime(loan.suspensao_ate) : undefined;

                const vencido = !devolucao && entrega < today;

                console.log(chalk.red(`Empréstimo vencido: ${vencido}, Suspensão até: ${suspensaoAte}`));
                const suspensaoExpirada = !suspensaoAte || suspensaoAte < today;

                if (vencido && (suspensaoExpirada || !suspensaoAte)) {
                    const diasAtraso = Math.floor((today.getTime() - entrega.getTime()) / (1000 * 60 * 60 * 24));
                    const diasSuspensao = diasAtraso * 3;

                    console.log(chalk.red(`Empréstimo vencido há ${diasAtraso} dias. Suspensão de ${diasSuspensao} dias.`));
                    const novaDataSuspensao = Time.addDays(today, diasSuspensao);


                    loan.dias_atraso = diasAtraso;
                    loan.suspensao_ate = novaDataSuspensao;

                    this.loanService.updateLoan(loan);

                    // Contar quantos empréstimos suspensos o usuário tem
                    suspensionCountByUser[loan.usuario_id] = (suspensionCountByUser[loan.usuario_id] || 0) + 1;

                    // Somar dias de suspensão
                    suspensionDaysByUser[loan.usuario_id] = (suspensionDaysByUser[loan.usuario_id] || 0) + diasSuspensao;
                }
            });

            // Verificações finais por usuário
            Object.entries(suspensionCountByUser).forEach(([userIdStr, count]) => {
                const userId = Number(userIdStr);
                const user = this.userService.findById(userId);
                if (!user) return;

                const totalDias = suspensionDaysByUser[userId] || 0;

                // Se total de dias de suspensão > 60, suspende
                if (totalDias > 60) {
                    user.ativo = userActive.SUSPENSO;
                }

                // Se tiver 3 ou mais empréstimos suspensos, inativa
                if (count >= 3) {
                    user.ativo = userActive.INATIVO;
                }

                this.userRepository.updateById(user.id, user);
            });
        }, 10000);
    }
}
