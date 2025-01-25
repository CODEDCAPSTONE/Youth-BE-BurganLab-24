const express = require("express");

const { cardsGetRouter } = require("./card/cardsGetRouter");
const { cardCreateRouter } = require("./card/cardCreateRouter");
const { balanceGetRouter } = require("./getBalance");
const { cardAdd } = require("./card/addBalance");
const { transactionsRouter } = require("./getTransacions");
const router = express.Router();

router.use(cardsGetRouter);
router.use(cardCreateRouter);
router.use(cardAdd);
router.use(balanceGetRouter);
router.use(transactionsRouter);

module.exports = { cardsRouter: router };
