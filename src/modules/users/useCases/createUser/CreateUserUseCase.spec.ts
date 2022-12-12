import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "user@test.com",
      name: "User test",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a user if there is already a user with the same email", () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "user@test.com",
        name: "User test",
        password: "123456",
      });

      await createUserUseCase.execute({
        email: "user@test.com",
        name: "User test",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
