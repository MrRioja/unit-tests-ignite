import request from "supertest";
import { v4 as uuidV4 } from "uuid";

import { Connection, createConnection } from "typeorm";

import { app } from "../../../../app";
import { hash } from "bcryptjs";

let connection: Connection;

describe("Get Balance Controller", () => {
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

  it("should be able to get balance", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@test.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Deposit test",
      })
      .set({ Authorization: `Bearer ${token}` });

    await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 50,
        description: "Withdraw test",
      })
      .set({ Authorization: `Bearer ${token}` });

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body.balance).toBe(50);
    expect(response.body.statement.length).toBe(2);
  });
});
