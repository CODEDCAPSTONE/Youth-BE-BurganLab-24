const express = require("express");

const { cardsGetRouter } = require("./cardsGetRouter");
const { cardCreateRouter } = require("./cardCreateRouter");
const { balanceGetRouter } = require("./getBalance");

const router = express.Router();

router.use(cardsGetRouter);
router.use(cardCreateRouter);

router.use(balanceGetRouter);

module.exports = { cardsRouter: router };
