import request from "supertest";

import { Connection, createConnection } from "typeorm";

import { app } from "../../../../app";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create an user", async () => {
    const user = await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "user@test.com",
      password: "user",
    });

    expect(user.status).toBe(201);
    expect(user.body).toHaveProperty("id");
  });
});
