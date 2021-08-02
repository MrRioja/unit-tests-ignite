import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to get a user's balance", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "user@test.com",
      name: "User test",
      password: "123456",
    });

    await inMemoryStatementsRepository.create({
      user_id: user.id,
      type: "deposit",
      amount: 100,
      description: "Test statement",
    } as ICreateStatementDTO);

    const balance = await getBalanceUseCase.execute({ user_id: user.id });

    expect(balance).toHaveProperty("statement");
  });

  it("should not be able to take the balance of a non-existent user", () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "invalid-user-id" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
