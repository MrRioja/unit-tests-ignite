import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    user_id,
    description,
    amount,
    type,
    sender_id,
  }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(user_id);
    const sender_user = await this.usersRepository.findById(sender_id);

    if (!sender_user) {
      throw new CreateStatementError.SenderUserNotFound();
    }

    if (!user) {
      throw new CreateStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
    });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds();
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      description,
      amount,
      type,
      sender_id,
    });

    return statementOperation;
  }
}

export { CreateTransferUseCase };
