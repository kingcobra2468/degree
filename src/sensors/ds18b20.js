const fs = require('fs');
const path = require('path');

class Ds18b20 {
  constructor(devicePath = '/sys/bus/w1/devices/') {
    this.devicePath = devicePath;
    this.findSensorId();
  }

  findSensorId() {
    const scanner = RegExp('28-*');

    const files = fs.readdirSync(this.devicePath);
    this.sensorId = files.find((file) => scanner.test(file));
    if (this.sensorId == null) {
      throw new Error('Thermometer not found.');
    }
  }

  get id() {
    return this.sensorId;
  }

  async getRawTemp() {
    const dataStream = path.join(this.devicePath, this.sensorId, 'temperature');

    return fs.promises.readFile(dataStream)
      .then((data) => {
        const temperature = parseInt(data.toString(), 10) / 1000;

        return temperature;
      })
      .catch((_) => {
        throw new Error('Unable to parse temperature stream.');
      });
  }

  async getCelsius() {
    const temp = await this.getRawTemp();

    return temp;
  }

  async getFahrenheit() {
    const temp = await this.getRawTemp();

    return (temp * (9 / 5)) + 32;
  }

  async getKelvin() {
    const temp = await this.getRawTemp();

    return temp + 273.15;
  }
}

module.exports = Ds18b20;
