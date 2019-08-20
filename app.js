
const gpio = require("rpi-gpio");
const axios = require('axios');

const pin = 7;
let bellDetected = false;
let timeoutFunc = null;
const timeoutReset = 5000;

const webhook = "http://localhost:51828/?accessoryId=doorbellSensor&state=true";

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

function gpioChange(channel, val) {
    if (!bellDetected) {
        bellDetected = true;
        console.log("Got GPIO rising edge event");

        if (timeoutFunc) clearTimeout(timeoutFunc);

        axios.get(webhook)
            .then(function (response) {
                console.log("Webhook response: " + response);
            })
            .catch(function (error) {
                console.log("Webhook error: " + error);
            });

        timeoutFunc = setTimeout(function () {
            console.log("Resetting gpio change event throttle flag");
            bellDetected = false;
            timeoutFunc = null;
        }, timeoutReset);
    }
}