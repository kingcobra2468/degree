const fs = require('fs');
const path = require('path');

/**
 * Driver for reading temperature data from ds18b20
 * temperature sensor.
 */
class Ds18b20 {
  devicePath: string;

  sensorId: string;

  /**
   * Initializes instance of sensor reader.
   * @param {string} [devicePath='/sys/bus/w1/devices/'] Path to device
   */
  constructor(devicePath = '/sys/bus/w1/devices/') {
    this.devicePath = devicePath;
    this.findSensorId();
  }

  /**
   * Find the sensor id at the specified directory.
   * @throws Exception when there is a failure is finding the sensor
   */
  findSensorId() {
    const scanner = RegExp('28-*'); // Signature of sensor.

    const files = fs.readdirSync(this.devicePath);
    this.sensorId = files.find((file: string) => scanner.test(file));
    if (this.sensorId == null) {
      throw new Error('Thermometer not found.');
    }
  }

  /**
   * Retrives the sensor id of the sensor.
   */
  get id() {
    return this.sensorId;
  }

  /**
   * Retrieves the "raw" temperature value from the sensor. Note
   * the raw value is in Celsius.
   * @async
   * @throws Exception if there is a failure to read temperature data
   * @returns {int} temperature
   */
  async getRawTemp() {
    const dataStream = path.join(this.devicePath, this.sensorId, 'temperature');

    return fs.promises
      .readFile(dataStream)
      .then((data: number) => {
        const temperature = parseInt(data.toString(), 10) / 1000;

        return temperature;
      })
      .catch((_: any) => {
        throw new Error('Unable to parse temperature stream.');
      });
  }

  /**
   * Retrieves the temperature(C) value from the sensor.
   * @async
   * @throws Exception if there is a failure to read temperature data
   * @returns {int} temperature
   */
  async getCelsius() {
    const temp = await this.getRawTemp();

    return temp;
  }

  /**
   * Retrieves the temperature(F) value from the sensor.
   * @async
   * @throws Exception if there is a failure to read temperature data
   * @returns {int} temperature
   */
  async getFahrenheit() {
    const temp = await this.getRawTemp();

    return temp * (9 / 5) + 32;
  }

  /**
   * Retrieves the temperature(K) value from the sensor.
   * @async
   * @throws Exception if there is a failure to read temperature data
   * @returns {int} temperature
   */
  async getKelvin() {
    const temp = await this.getRawTemp();

    return temp + 273.15;
  }
}

module.exports = Ds18b20;
export {};
