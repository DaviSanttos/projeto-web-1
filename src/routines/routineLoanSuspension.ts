import chalk from 'chalk';
import { userActive } from "../models/entity/UserEntity";
import { UserRepository } from "../repositories/UserRepository";
import { LoanService } from "../services/LoanService";
import { UserService } from "../services/UserService";
import { Time } from "../utils/Time";

export class routineLoanSuspension {
    private loanService = new LoanService();
    private userService = new UserService();
    private userRepository = UserRepository.getInstance();

    start() {
        console.log("Rotina de Suspensão job iniciado...");

        setInterval(async () => {
            try {
                const today = Time.nowInBrazil();

                const suspensionCountByUser: { [userId: number]: number } = {};
                const suspensionDaysByUser: { [userId: number]: number } = {};

                const allUsers = await this.userRepository.list();
                const usersIdsInSuspensionOrInactive = allUsers
                    .filter(user =>
                        user.ativo === userActive.SUSPENSO || user.ativo === userActive.INATIVO
                    )
                    .map(user => user.id);

                const loans = (await this.loanService.listLoans()).filter((loan) =>
                    !loan.data_devolucao &&
                    (Time.toBrazilTime(loan.suspensao_ate) <= today || !loan.suspensao_ate) &&
                    !usersIdsInSuspensionOrInactive.includes(loan.usuario_id) &&
                    Time.toBrazilTime(loan.data_entrega) <= today
                );

                console.log(chalk.blue.bold("Empréstimos encontrados:", loans.length));

                if (!loans.length) return;

                for (const loan of loans) {
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

                        await this.loanService.updateLoan(loan);

                        suspensionCountByUser[loan.usuario_id] = (suspensionCountByUser[loan.usuario_id] || 0) + 1;
                        suspensionDaysByUser[loan.usuario_id] = (suspensionDaysByUser[loan.usuario_id] || 0) + diasSuspensao;
                    }
                }

                for (const [userIdStr, count] of Object.entries(suspensionCountByUser)) {
                    const userId = Number(userIdStr);
                    const user = await this.userService.findById(userId);
                    if (!user) continue;

                    const totalDias = suspensionDaysByUser[userId] || 0;

                    let novoStatus = user.ativo;

                    if (totalDias > 60) {
                        novoStatus = userActive.SUSPENSO;
                    }

                    if (count >= 3) {
                        novoStatus = userActive.INATIVO;
                    }

                    if (novoStatus !== user.ativo) {
                        await this.userRepository.updateById(user.id, { ativo: novoStatus });
                        console.log(chalk.magenta(`Usuário ${user.id} atualizado para status ${novoStatus}`));
                    }
                }
            } catch (error) {
                console.error(chalk.red("Erro na rotina de suspensão:"), error);
            }
        }, 10000);
    }
}
