import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import analysesRouter from "./analyses";
import notificationsRouter from "./notifications";
import adminRouter from "./admin";
import quotesRouter from "./quotes";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(analysesRouter);
router.use(notificationsRouter);
router.use(adminRouter);
router.use(quotesRouter);

export default router;
