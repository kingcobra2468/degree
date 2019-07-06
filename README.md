# RaspPiThermometer
Rasberry Pi Thermometer built use NodeJS

<b>PublicRaspPi</b> - Used when working with a single Rasp Pi that allows for direct port forwarding

<b>PrivateRaspPi</b> - Used when a Rasp Pi cannot be port forwarded directly or when multiple raspberry pi's exist on a network.
A middleware server would need to be setup to "forward" the temperature of the rasp pi which would are identified by a hash and store
temperature in sqlite3. 
