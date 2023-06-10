import { Server, Request, Response } from 'restify';

/* eslint-disable import/no-unresolved */
const Ds18b20 = require('@lib/sensors/ds18b20');
const { catchInternal } = require('@utils/asyncWrappers');

const tempSensor = new Ds18b20();

module.exports = (server: Server) => {
  // Gets temperature in Kelvin
  server.get(
    { name: 'get-kelvin', path: '/temp/kelvin' },
    catchInternal(async (req: Request, res: Response) => {
      res.send({
        status: 'success',
        data: {
          temperature: await tempSensor.getKelvin()
        }
      });
    })
  );

  // Gets temperature in Celsius
  server.get(
    { name: 'get-celsius', path: '/temp/celsius' },
    catchInternal(async (req: Request, res: Response) => {
      res.send({
        status: 'success',
        data: {
          temperature: await tempSensor.getCelsius()
        }
      });
    })
  );

  // Gets temperature in Fahrenheit
  server.get(
    { name: 'get-fahrenheit', path: '/temp/fahrenheit' },
    catchInternal(async (req: Request, res: Response) => {
      res.send({
        status: 'success',
        data: {
          temperature: await tempSensor.getFahrenheit()
        }
      });
    })
  );
};
