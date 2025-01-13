const { NotFoundError } = require("../errors");
const Card = require("../model/card");

const findCard = async function (req, res, next, id) {
  const foundCard = await Card.findById(id);

  if (!foundCard) return next(NotFoundError("card not found"));

  req.card = foundCard;

  next();
};

module.exports = findCard;
