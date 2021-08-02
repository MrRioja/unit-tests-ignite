import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to list an statement operation", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "user@test.com",
      name: "User test",
      password: "123456",
    });

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id,
      type: "deposit",
      amount: 100,
      description: "Test statement",
    } as ICreateStatementDTO);

    const statementFound =
      await inMemoryStatementsRepository.findStatementOperation({
        statement_id: statement.id,
        user_id: user.id,
      });

    expect(statementFound).toHaveProperty("id");
    expect(statementFound).toHaveProperty("user_id");
    expect(statementFound).toHaveProperty("type");
  });

  it("should not be able to list an statement operation of a non-existent user", () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: "user@test.com",
        name: "User test",
        password: "123456",
      });

      const statement = await inMemoryStatementsRepository.create({
        user_id: user.id,
        type: "deposit",
        amount: 100,
        description: "Test statement",
      } as ICreateStatementDTO);

      await getStatementOperationUseCase.execute({
        user_id: "invalid-user",
        statement_id: statement.id,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to list an non-existent statement operation", () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: "user@test.com",
        name: "User test",
        password: "123456",
      });

      const statement = await inMemoryStatementsRepository.create({
        user_id: user.id,
        type: "deposit",
        amount: 100,
        description: "Test statement",
      } as ICreateStatementDTO);

      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "invalid-statementId",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
