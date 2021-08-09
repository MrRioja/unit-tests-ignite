import { Router } from "express";

import { ensureAuthenticated } from "../shared/infra/http/middlwares/ensureAuthenticated";
import { GetBalanceController } from "../modules/statements/useCases/getBalance/GetBalanceController";
import { CreateTransferController } from "../modules/statements/useCases/createTransfer/CreateTransferController";
import { CreateStatementController } from "../modules/statements/useCases/createStatement/CreateStatementController";
import { GetStatementOperationController } from "../modules/statements/useCases/getStatementOperation/GetStatementOperationController";

const statementRouter = Router();
const getBalanceController = new GetBalanceController();
const createStatementController = new CreateStatementController();
const createTransferController = new CreateTransferController();
const getStatementOperationController = new GetStatementOperationController();

statementRouter.use(ensureAuthenticated);

statementRouter.get("/balance", getBalanceController.execute);
statementRouter.post("/deposit", createStatementController.execute);
statementRouter.post("/withdraw", createStatementController.execute);
statementRouter.post("/transfers/:user_id", createTransferController.handle);
statementRouter.get("/:statement_id", getStatementOperationController.execute);

export { statementRouter };
