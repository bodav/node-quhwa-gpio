
const gpio = require("rpi-gpio");
const pin = 7;

let bellDetected = false;
let timeoutFunc = null;
const timeoutReset = 4500;

gpio.setup(pin, gpio.DIR_IN, gpio.EDGE_RISING, function (err) {
    if (err != undefined) {
        console.log("Error setting up gpio pin: " + pin);
        console.log(err);
    }

    console.log("GPIO setup completed");

    gpio.on("change", function (channel, val) {
        gpioChange(channel, val);
    });
});

function gpioChange(channel, val) 
{
    if (!bellDetected) {
        bellDetected = true;
        console.log("Got GPIO rising edge event");

        if (timeoutFunc) clearTimeout(timeoutFunc);

        timeoutFunc = setTimeout(function () {
            console.log("Resetting gpio change event throttle flag");
            bellDetected = false;
            that.timeout = null;
        }, timeoutReset);
    }
}