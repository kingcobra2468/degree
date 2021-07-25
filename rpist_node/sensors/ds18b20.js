const fs = require('fs');

class Ds18b20 {
    #sensorId;

    constructor(devicePath = '/sys/bus/w1/devices/') {
        if (device_path[device_path.length - 1] != '/') {
            device_path += '/'
        }

        this.devicePath = devicePath
        this.findSensorId()
    }

    findSensorId() {
        const scanner = RegExp('28-*');

        let files = fs.readdirSync(device_path);
        this.#sensorId = files.find(file => scanner.test(file))
        if (this.#sensorId == null) {
            throw new Error('Thermometer not found.')
        }
    }

    get sensorId() {
        return this.#sensorId
    }

    async getRawTemp() {
        dataStream = path.join(device_path + thermometer_id, "w1_slave")
        fs.promises.readFile(dataStream)
            .then(data => {
                const start_index = data.indexOf("t=", 0, "ascii") + 2;
                const end_index = data.length - 1;
                let temperature = data.slice(start_index, end_index).toString();
                temperature = parseInt(temperature) / 1000;

                return temp_reading;
            })
            .catch(_ => {
                throw new Error('Unable to parse temperature stream.')
            })
    }

    async getCelsius() {
        let raw_temp = await this.getRawTemp()

        return raw_temp;
    }

    async getFahrenheit() {
        let raw_temp = await this.getRawTemp()

        return (raw_temp * (9 / 5)) + 32;
    }

    async getKelvin() {
        let raw_temp = await this.getRawTemp()

        return raw_temp + 273.15;
    }
}

module.exports = Ds18b20