import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateTransferUseCase } from "./CreateTransferUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

class CreateTransferController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;
    const { id: sender_id } = request.user;
    const type = "transfer" as OperationType;
    const { amount, description } = request.body;

    const createTransfer = container.resolve(CreateTransferUseCase);

    const statement = await createTransfer.execute({
      user_id,
      description,
      amount,
      type,
      sender_id,
    });

    return response.status(201).json(statement);
  }
}

export { CreateTransferController };
