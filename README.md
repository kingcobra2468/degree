# Degree

A Raspberry Pi enabled room temperature monitoring microservice for inexpensive room temperature monitoring.

## **Configuration**

### **Dotenv File**

A `.env` file needs to be created (or copied from `.env.template`) inside of
`/src` directory. Variables in the `.env` file include:

- **PORT=** server port for Degree
- **MODE=** protcol used with options being **http** or **https**
- **KEY_PATH=** path to the key PEM for when https used
- **CERT_PATH=** path to the cert PEM for when https used

## **REST API**

Exposed APIs:

- `/healthcheck` **[GET]** - the health status of the device.
- `/temp/kelvin` **[GET]** - the temp in Kelvin
- `/temp/celsius` **[GET]** - the temp in Celsius
- `/temp/fahrenheit` **[GET]** - the temp in Fahrenheit

_Note: As expressed, some of the endpoints are protected. To pass the JWT, pass it
via the_ **AUTHORIZATION: BEARER** _header._

## **Installation Steps (via apt)**

The following steps will walk through the complete setup of the RPI and Degree:

### **Configuring the RPI**

The following steps will guide with setting up the sensor and RPI:

1. Setup the ds18b20 temperature sensor circuit.
2. Enable one-wire interface by appending `dtoverlay=w1-gpio`
   to the bottom of **/etc/config.txt**. Then reboot the RPI.
3. Enable the following kernel modules via `sudo modprobe w1-gpio`
   and `modprobe w1-therm`.
4. Go to **/sys/bus/w1/devices** and validate that there is
   a device with the prefix _28-_.

### **Setting up Degree**

The following steps will guide with setting up Degree:

1. Install NodeJS >14.7 on the RPI. As a result of ARM support for NodeJS
   being labeled as experimental, the following template helps with setting
   up modern node environments:
   1. Get a relavent armv6 build of NodeJS via the template
   `wget https://nodejs.org/dist/vX.X.X/node-vX.X.X-linux-armv6l.tar.xz`.
   2. Upack the tarball by `tar -xf node-vX.X.X-linux-armv6l.tar.xz`.
   3. Move to **/usr/local/** via `sudo mv node-vX.X.X-linux-armv6l /usr/local/node`.
   4. Navigate to **/usr/bin/**.
   5. Create the following symbol links:
      - `sudo ln -s /usr/local/node/bin/node node`.
      - `sudo ln -s /usr/local/node/bin/npm npm`.
   6. Validate install by checking `npm -v` and `node -v` to validate that both are installed.
2. Clone the repo and install dependencies with `node install`.
3. Setup the `.env` as specified [here](#configuration).
4. Build with webpack by running `node run build`.
5. The `degree.js` microservice should now be available to run via `node run start`.
6. (Optional) To have Degree run automatically on boot, copy the `degree.js` bundle
   into `/usr/local/bin`. Also, copy `degree.service` into `/etc/systemd/system`. Finally, run
   `systemctl start degree.service` and `systemctl enable degree.service` to have Degree run
   automatically on startup.
