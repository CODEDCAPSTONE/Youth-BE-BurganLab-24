const validateDuration = function validateDuration(duration) {
  // Check if duration is a number, positive, an integer, and not more than 12 months
  if (
    typeof duration === "number" &&
    duration > 0 &&
    Number.isInteger(duration) &&
    duration <= 12
  ) {
    return true;
  }
  return false;
};

module.exports = validateDuration;
