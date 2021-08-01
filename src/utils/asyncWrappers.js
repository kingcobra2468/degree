const errs = require('restify-errors');

const catchInternal = (callback) => async function errorHandler(req, res, next) {
  try {
    await callback(req, res, next);
  } catch (err) {
    next(new errs.InternalServerError(err));
  }
};

module.exports = {
  catchInternal,
};
