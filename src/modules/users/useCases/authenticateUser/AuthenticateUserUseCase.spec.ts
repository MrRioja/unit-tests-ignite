import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com",
      name: "User test",
      password: "123456",
    };

    await createUserUseCase.execute(user);

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(authenticatedUser).toHaveProperty("token");
  });

  it("should not be able to authenticate an non-existent user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "email@test.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with incorrect password", () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "user@test.com",
        name: "User test",
        password: "123456",
      });

      await authenticateUserUseCase.execute({
        email: "user@test.com",
        password: "invalidPassword",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
