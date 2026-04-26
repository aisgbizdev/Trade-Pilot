import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import analysesRouter from "./analyses";
import notificationsRouter from "./notifications";
import adminRouter from "./admin";
import quotesRouter from "./quotes";
import historicalRouter from "./historical";
import newsRouter from "./news";
import calendarRouter from "./calendar";
import pushRouter from "./push";
import eventsRouter from "./events";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(analysesRouter);
router.use(notificationsRouter);
router.use(adminRouter);
router.use(quotesRouter);
router.use(historicalRouter);
router.use(newsRouter);
router.use(calendarRouter);
router.use(pushRouter);
router.use(eventsRouter);

export default router;
