import request from "supertest";

import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../app";
import { Connection, createConnection } from "typeorm";
import { hash } from "bcryptjs";

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, created_at, updated_at) 
      VALUES ('${id}', 'admin', 'admin@test.com', '${password}', 'now()', 'now()')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new deposit type demonstration", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@test.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Deposit test",
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(201);
  });

  it("should be able to create a new withdraw type demonstration", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@test.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "Withdraw test",
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(201);
  });
});
