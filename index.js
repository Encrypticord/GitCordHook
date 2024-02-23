"use strict";
/**
 *
 * Encrypticord GitCordHook - A GitHub & Discord Webhook Bridge
 *
 * Copyright © 2024 Encrypticord Services All rights reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the license, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>
 *
 * Contact Encrypticord Services
 *
 * email address:   <carternlong@encrypticord.com>
 * contact form:    <https://forms.gle/CGHwCnqSFpP8mHKB7>
 *
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const functionsHandler_1 = require("./functionsHandler");
const colors_1 = require("./models/enums/colors");
const responses_1 = require("./models/enums/responses");
const jobParser_1 = require("./parsers/jobParser");
const pushParser_1 = require("./parsers/pushParser");
const runParser_1 = require("./parsers/runParser");
const fs = __importStar(require("fs"));
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const https = require('https');
//Declarations
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('trust proxy', true);
//Main
main();
async function main() {
    if (fs.existsSync(`${__dirname}/config.json`)) {
        console.log(`${colors_1.colors.blue}Loading config...${colors_1.colors.reset}`);
        try {
            let rawConfig = fs.readFileSync(`${__dirname}/config.json`, 'utf8');
            let jsonConfig = JSON.parse(rawConfig);
            console.log(`${colors_1.colors.green}Loading complete!${colors_1.colors.reset}`);
            console.log(`${colors_1.colors.blue}Starting...${colors_1.colors.reset}`);
            if (jsonConfig.use_https) {
                let privateKey = fs.readFileSync(`${__dirname}/keys/private_key.pem`, 'utf8');
                let certificate = fs.readFileSync(`${__dirname}/keys/certificate.pem`, 'utf8');
                let ca = fs.readFileSync(`${__dirname}/keys/chain.pem`, 'utf8');
                let credentials = { key: privateKey, cert: certificate, ca: ca };
                let httpsServer = https.createServer(credentials, app);
                await httpsServer.listen(jsonConfig.port, () => {
                    console.log(`${colors_1.colors.green}Successfully started HTTPS on port ${jsonConfig.port}${colors_1.colors.reset}`);
                });
            }
            else {
                await app.listen(jsonConfig.port, () => {
                    console.log(`${colors_1.colors.green}Successfully started HTTP on port ${jsonConfig.port}${colors_1.colors.reset}`);
                    console.log(`${colors_1.colors.red}WARNING! Using HTTP instead of HTTPS is a security risk and could lead to the loss of your personal GitHub data!${colors_1.colors.reset}`);
                });
            }
            console.log(`${colors_1.colors.blue}Loading webhook paths...${colors_1.colors.reset}`);
            let redirectPathArray = jsonConfig.pathings;
            redirectPathArray.forEach(async (element) => {
                app.post(`${element.webhook_path}`, async (req, res) => {
                    let sendOff = await GitHubParser(req, element);
                    res.sendStatus(sendOff);
                });
                console.log(`${colors_1.colors.lightGray}Loaded: ${element.webhook_path}${colors_1.colors.reset}`);
            });
            console.log(`${colors_1.colors.green}Successfully loaded webhook paths!${colors_1.colors.reset}`);
        }
        catch (error) {
            console.error(`${colors_1.colors.red}Unable to read or parse config file${colors_1.colors.reset}`);
            process.exit();
        }
    }
    else {
        console.error(`${colors_1.colors.red}No config file found${colors_1.colors.reset}`);
        process.exit();
    }
}
//Data Handlers
const functionsHandler = new functionsHandler_1.FunctionsHandler();
const jobParser = new jobParser_1.JobParser(functionsHandler);
const pushParser = new pushParser_1.PushParser(functionsHandler);
const runParser = new runParser_1.RunParser(functionsHandler);
async function GitHubParser(req, pathing) {
    let body = req.body;
    let headers = req.headers;
    let event = headers['x-github-event'];
    if (event) {
        switch (event) {
            case 'workflow_run':
                runParser.run(req, pathing);
            case 'workflow_job':
                jobParser.job(req, pathing);
            case 'push':
                pushParser.push(req, pathing);
            default:
                return responses_1.responses.requestError;
        }
    }
    else {
        return responses_1.responses.requestError;
    }
}
