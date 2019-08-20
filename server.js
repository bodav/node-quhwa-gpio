"use strict";

const express = require('express');
const chalk = require('chalk');
const http = require('http');

const app = express();

// config
const port = 8090;
const timeout = process.env.TIMEOUT || 4500;
const pin = process.env.GPIO_PIN || 7;
const webhooks = process.env.WEBHOOKS;
let raised = false;
let raisedTime = null;

log(webhooks);

const server = http.createServer(app);

server.on('error', err => {
    log(chalk.bold.red('server error: ' + err));
});

server.on('listening', () => {
    log(chalk.green('Listening on: ' + port));
});

server.listen(port);

app.use(function (req, res, next) {
    log(chalk.green('[' + new Date() + ']' + ' ' + req.method + ' ' + req.path));
    next()
});

app.get("/state", (req, res) => {
    let state = { 
        raised: raised, 
        raisedTime: raisedTime, 
        pin: pin, 
        timeout: timeout 
    };
    res.json(state);
});

function log(msg) {
    console.log(msg);
}
