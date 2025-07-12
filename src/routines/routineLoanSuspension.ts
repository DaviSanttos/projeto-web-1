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
        setInterval(async () => {
            try {
                const usersWithPendingLoans = await this.loanService.getUsersWithPendingLoans();

                if (!usersWithPendingLoans || usersWithPendingLoans.length === 0) {
                    console.log(chalk.green("Nenhum usuário com empréstimos pendentes encontrado."));
                    return;
                }

                const allUsers = await this.userRepository.list();
                const suspendedOrInactiveUserIds = allUsers
                    ?.filter(u => u.ativo === userActive.SUSPENSO || u.ativo === userActive.INATIVO)
                    ?.map(u => u.id);

                const activeUsersWithLoans = usersWithPendingLoans?.filter(id => !suspendedOrInactiveUserIds.includes(id));

                const suspensionCountByUser: { [userId: number]: number } = {};
                const suspensionDaysByUser: { [userId: number]: number } = {};

                for (const userId of activeUsersWithLoans) {
                    const { totalSuspensionDays, totalSuspensionCount } = await this.getTotalSuspensionDaysToApply(userId);

                    suspensionCountByUser[userId] = totalSuspensionCount;
                    suspensionDaysByUser[userId] = totalSuspensionDays;

                    console.log(chalk.blue(`Usuário ${userId} - Suspensões: ${totalSuspensionCount}, Dias de suspensão: ${totalSuspensionDays}`));
                }

                for (const userIdStr of Object.keys(suspensionCountByUser)) {
                    const userId = Number(userIdStr);
                    const user = await this.userService.findById(userId);
                    if (!user) continue;

                    const totalDias = suspensionDaysByUser[userId];
                    const count = suspensionCountByUser[userId];

                    let novoStatus = user.ativo;
                    if (totalDias > 60) novoStatus = userActive.SUSPENSO;
                    if (count >= 3) novoStatus = userActive.INATIVO;

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

    async getTotalSuspensionDaysToApply(userId: number) {
        const today = Time.nowInBrazil();
        const loans = await this.loanService.findLoansWithoutRefund(userId);

        let totalSuspensionDays = 0;
        let totalSuspensionCount = 0;

        for (const loan of loans) {
            if (!loan.data_entrega) continue;

            const entrega = Time.toBrazilTime(loan.data_entrega);
            const devolucao = loan.data_devolucao ? Time.toBrazilTime(loan.data_devolucao) : null;

            const isLate = !devolucao && entrega < today;

            if (isLate) {
                const diasAtraso = Math.floor((today.getTime() - entrega.getTime()) / (1000 * 60 * 60 * 24));
                const diasSuspensao = diasAtraso * 3;

                const novaDataSuspensao = Time.addDays(today, diasSuspensao);

                loan.dias_atraso = diasAtraso;
                loan.suspensao_ate = novaDataSuspensao;

                await this.loanService.updateLoan(loan);

                totalSuspensionDays += diasSuspensao;
                totalSuspensionCount++;
            }
        }

        return { totalSuspensionDays, totalSuspensionCount };
    }

}
