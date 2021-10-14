/* eslint-disable import/no-unresolved */
const Ds18b20 = require('@sensors/ds18b20');
const { catchInternal } = require('@utils/asyncWrappers');

const tempSensor = new Ds18b20();

module.exports = (server) => {
  // Endpoint for getting temperature in Kelvin.
  server.get({ name: 'get-kelvin', path: '/api/temp/get-kelvin' },
    catchInternal(async (req, res) => {
      const temp = await tempSensor.getKelvin();
      res.send({ temperature: temp });
    }));

  // Endpoint for getting temperature in Celsius.
  server.get({ name: 'get-celsius', path: '/api/temp/get-celsius' },
    catchInternal(async (req, res) => {
      const temp = await tempSensor.getCelsius();
      res.send({ temperature: temp });
    }));

  // Endpoint for getting temperature in Fahrenheit.
  server.get({ name: 'get-fahrenheit', path: '/api/temp/get-fahrenheit' },
    catchInternal(async (req, res) => {
      const temp = await tempSensor.getFahrenheit();
      res.send({ temperature: temp });
    }));
};