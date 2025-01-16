const express = require("express");

const { cardsGetRouter } = require("./cardsGetRouter");
const { cardCreateRouter } = require("./cardCreateRouter");
const { balanceGetRouter } = require("./getBalance");
const { targetCreateRouter } = require("./targetCreateRouter");

const router = express.Router();

router.use(cardsGetRouter);
router.use(cardCreateRouter);
router.use(balanceGetRouter);
router.use(targetCreateRouter);

// router.use(postUpdateRouter);

module.exports = { cardsRouter: router };
