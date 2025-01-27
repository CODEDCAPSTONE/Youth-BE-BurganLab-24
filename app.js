const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
// const path = require("path");
// const multer = require("multer");

const { handleErrors, currentUser } = require("./middleware");
const { NotFoundError } = require("./errors");

const { authRouter } = require("./auth");
const { cardsRouter } = require("./routes");
const { cardPaymentRouter } = require("./routes/payment.router");
const otpRouter = require("./otpRoutes");
const { targetCreateRouter } = require("./routes/target/targetCreateRouter");
const { targetGetRouter } = require("./routes/target/getTarget");
const { targetCancelRouter } = require("./routes/target/targetCancel");
const {
  partTimeCreateRouter,
} = require("./routes/partTime/partTimeJobCreateRoute");
const { jobGetRouter } = require("./routes/partTime/getParttime");
const { budgetGetRouter } = require("./routes/budget/getBudget");
const { budgetCreateRouter } = require("./routes/budget/bugetCreateRoute");
const { transferRouter } = require("./routes/transfar/transfar");
const { transferByWAMDRouter } = require("./routes/transfar/tranfarByWAMD");
const { offerCreateRouter } = require("./routes/offer/offerCreateRouter");
const { offerGetRouter } = require("./routes/offer/getOffer");

const {
  updateIncome,
  getIncome,
} = require("./routes/controllers/userController");

const { applyJobCreateRouter } = require("./routes/partTime/applyJob");

const { transactionsRouter } = require("./routes/getTransacions");

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

app.use("/targets", targetCreateRouter, targetGetRouter, targetCancelRouter);
app.use("/job", partTimeCreateRouter, jobGetRouter, applyJobCreateRouter);
app.use("/media", express.static(path.join(__dirname, "media")));

app.use("/targets", targetCreateRouter, targetGetRouter);
app.use("/job", partTimeCreateRouter, jobGetRouter);
// app.use("/media", express.static(path.join(__dirname, "media")));

app.use("/offer", offerCreateRouter, offerGetRouter);
app.use("/budget", budgetGetRouter, budgetCreateRouter);
app.use("/transfer", transferRouter, transferByWAMDRouter);

app.use("/user", updateIncome, getIncome); // Corrected usage

app.use("/transaction", transactionsRouter);

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
