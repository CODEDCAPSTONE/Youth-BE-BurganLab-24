const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const { handleErrors, currentUser } = require("./middleware");
const { NotFoundError } = require("./errors");

const { authRouter } = require("./auth");
const { cardsRouter } = require("./routes");
const { cardPaymentRouter } = require("./routes/payment.router");
const otpRouter = require("./otpRoutes");
const auth = require("./authRoutes");
const target = require("./model/target");
const { targetCreateRouter } = require("./routes/targetCreateRouter");
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
app.use("/cards", cardsRouter, cardPaymentRouter);
app.use("/target", targetCreateRouter);

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
