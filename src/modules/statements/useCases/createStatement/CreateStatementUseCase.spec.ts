import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a statement for an user", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "user@test.com",
      name: "User test",
      password: "123456",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: "deposit",
      amount: 100,
      description: "Test statement",
    } as ICreateStatementDTO);

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create a statement for an non-existent user", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "user-invalid-id",
        type: "withdraw",
        amount: 100,
        description: "Test statement",
      } as ICreateStatementDTO);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a statement if the user does not have enough funds", () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: "user@test.com",
        name: "User test",
        password: "123456",
      });

      await createStatementUseCase.execute({
        user_id: user.id,
        type: "withdraw",
        amount: 100,
        description: "Test statement",
      } as ICreateStatementDTO);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
