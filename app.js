const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const { handleErrors, currentUser } = require("./middleware");
const { NotFoundError } = require("./errors");

const { authRouter } = require("./auth");
const { cardsRouter } = require("./routes");
const { cardPaymentRouter } = require("./routes/payment.router");
const otpRouter = require("./otpRoutes");
const { targetCreateRouter } = require("./routes/target/targetCreateRouter");
const { targetGetRouter } = require("./routes/target/getTarget");
const {
  partTimeCreateRouter,
} = require("./routes/partTime/partTimeJobCreateRoute");
const { jobGetRouter } = require("./routes/partTime/getParttime");
const { budgetGetRouter } = require("./routes/budget/getBudget");
const { budgetCreateRouter } = require("./routes/budget/bugetCreateRoute");
const { transfarRouter } = require("./routes/transfar/transfar");
const { transferByWAMDRouter } = require("./routes/transfar/tranfarByWAMD");
const app = express();

/**
 * Middleware
 */
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(currentUser);

/**
 * Routers
 */
app.use("/auth", authRouter);
app.use("/otp", otpRouter);
app.use("/cards", cardsRouter, cardPaymentRouter);
app.use("/targets", targetCreateRouter, targetGetRouter);
app.use("/job", partTimeCreateRouter, jobGetRouter);
app.use("/budget", budgetGetRouter, budgetCreateRouter);
app.use("/trasfar", transfarRouter, transferByWAMDRouter);
/**
 * Not Found Catchall
 */
app.all("*", (req) => {
  throw NotFoundError(`${req.method} ${req.url}: Route not found`);
});

/**
 * Error Handling
 */
app.use(handleErrors);

module.exports = app;
