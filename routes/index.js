const express = require("express");

const { cardsGetRouter } = require("./card/cardsGetRouter");
const { cardCreateRouter } = require("./card/cardCreateRouter");
const { balanceGetRouter } = require("./getBalance");

const router = express.Router();

router.use(cardsGetRouter);
router.use(cardCreateRouter);

router.use(balanceGetRouter);

module.exports = { cardsRouter: router };
