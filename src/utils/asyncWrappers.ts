import { Next, Request, Response } from 'restify';

const errs = require('restify-errors');

/**
 * Callback when dealing with exceptions.
 * @typedef {function} RestifyCallback
 * @param {*} req - Request object
 * @param {*} res - Response object
 * @param {*} next - Next method in the chain
 */

/**
 * Async handler for dealing with async code that throws
 * internal errors. If internal error is thrown, then send
 * response with status code 500 along with the message thrown
 * by the exception.
 * @param {RestifyCallback} callback Callback matching signature {@link RestifyCallback}
 */
const catchInternal = (callback: any) =>
  async function errorHandler(req: Request, res: Response, next: Next) {
    try {
      await callback(req, res, next);
    } catch (err) {
      next(new errs.InternalServerError(err));
    }
  };

module.exports = {
  catchInternal
};
export {};
