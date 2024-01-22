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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
//Imports
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var app = express();
var https = require('https');
//Declarations
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('trust proxy', true);
//Main
var lightGray = '\x1b[90m';
var green = '\x1b[32m';
var red = '\x1b[31m';
var blue = '\x1b[34m';
var orange = '\x1b[33m';
var reset = '\x1b[0m';
var responses = {
    success: 200,
    requestError: 400,
    internalError: 500
};
main();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var rawConfig, jsonConfig_1, privateKey, certificate, ca, credentials, httpsServer, redirectPathArray, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fs.existsSync("".concat(__dirname, "/config.json"))) return [3 /*break*/, 8];
                    console.log("".concat(blue, "Loading config...").concat(reset));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    rawConfig = fs.readFileSync("".concat(__dirname, "/config.json"));
                    jsonConfig_1 = JSON.parse(rawConfig);
                    console.log("".concat(green, "Loading complete!").concat(reset));
                    console.log("".concat(blue, "Starting...").concat(reset));
                    if (!jsonConfig_1.use_https) return [3 /*break*/, 3];
                    privateKey = fs.readFileSync("".concat(__dirname, "/keys/private_key.pem"), 'utf8');
                    certificate = fs.readFileSync("".concat(__dirname, "/keys/certificate.pem"), 'utf8');
                    ca = fs.readFileSync("".concat(__dirname, "/keys/chain.pem"), 'utf8');
                    credentials = { key: privateKey, cert: certificate, ca: ca };
                    httpsServer = https.createServer(credentials, app);
                    return [4 /*yield*/, httpsServer.listen(jsonConfig_1.port, function () {
                            console.log("".concat(green, "Successfully started HTTPS on port ").concat(jsonConfig_1.port).concat(reset));
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, app.listen(jsonConfig_1.port, function () {
                        console.log("".concat(green, "Successfully started HTTP on port ").concat(jsonConfig_1.port).concat(reset));
                        console.log("".concat(red, "WARNING! Using HTTP instead of HTTPS is a security risk and could lead to the loss of your personal GitHub data!").concat(reset));
                    })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    console.log("".concat(blue, "Loading webhook paths...").concat(reset));
                    redirectPathArray = jsonConfig_1.pathings;
                    redirectPathArray.forEach(function (element) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            app.post("".concat(element.webhook_path), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                                var sendOff;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, GitHubParser(req, element)];
                                        case 1:
                                            sendOff = _a.sent();
                                            res.sendStatus(sendOff);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            console.log("".concat(lightGray, "Loaded: ").concat(element.webhook_path).concat(reset));
                            return [2 /*return*/];
                        });
                    }); });
                    console.log("".concat(green, "Successfully loaded webhook paths!").concat(reset));
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error("".concat(red, "Unable to read or parse config file").concat(reset));
                    process.exit();
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 9];
                case 8:
                    console.error("".concat(red, "No config file found").concat(reset));
                    process.exit();
                    _a.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
}
//Data Handlers
function GitHubParser(req, pathing) {
    return __awaiter(this, void 0, void 0, function () {
        var body, headers, event, _a, _b, requested, in_progress, completed, _c, requested, in_progress, completed, push;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    body = req.body;
                    headers = req.headers;
                    event = headers['x-github-event'];
                    if (!event) return [3 /*break*/, 23];
                    _a = event;
                    switch (_a) {
                        case 'workflow_run': return [3 /*break*/, 1];
                        case 'workflow_job': return [3 /*break*/, 9];
                        case 'push': return [3 /*break*/, 18];
                    }
                    return [3 /*break*/, 21];
                case 1:
                    if (!body.action) return [3 /*break*/, 9];
                    _b = body.action;
                    switch (_b) {
                        case 'requested': return [3 /*break*/, 2];
                        case 'in_progress': return [3 /*break*/, 4];
                        case 'completed': return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 8];
                case 2: return [4 /*yield*/, runParser(req, pathing, 'run_requested')];
                case 3:
                    requested = _d.sent();
                    return [2 /*return*/, requested];
                case 4: return [4 /*yield*/, runParser(req, pathing, 'run_in_progress')];
                case 5:
                    in_progress = _d.sent();
                    return [2 /*return*/, in_progress];
                case 6: return [4 /*yield*/, runParser(req, pathing, 'run_completion')];
                case 7:
                    completed = _d.sent();
                    return [2 /*return*/, completed];
                case 8: return [2 /*return*/, responses.requestError];
                case 9:
                    if (!body.action) return [3 /*break*/, 17];
                    _c = body.action;
                    switch (_c) {
                        case 'queued': return [3 /*break*/, 10];
                        case 'in_progress': return [3 /*break*/, 12];
                        case 'completed': return [3 /*break*/, 14];
                    }
                    return [3 /*break*/, 16];
                case 10: return [4 /*yield*/, jobParser(req, pathing, 'job_queued')];
                case 11:
                    requested = _d.sent();
                    return [2 /*return*/, requested];
                case 12: return [4 /*yield*/, jobParser(req, pathing, 'job_in_progress')];
                case 13:
                    in_progress = _d.sent();
                    return [2 /*return*/, in_progress];
                case 14: return [4 /*yield*/, jobParser(req, pathing, 'job_completion')];
                case 15:
                    completed = _d.sent();
                    return [2 /*return*/, completed];
                case 16: return [2 /*return*/, responses.requestError];
                case 17: return [2 /*return*/, 200];
                case 18:
                    if (!body.pusher) return [3 /*break*/, 20];
                    return [4 /*yield*/, pushParser(req, pathing, 'push')];
                case 19:
                    push = _d.sent();
                    return [2 /*return*/, push];
                case 20: return [2 /*return*/, responses.requestError];
                case 21: return [2 /*return*/, responses.requestError];
                case 22: return [3 /*break*/, 24];
                case 23: return [2 /*return*/, responses.requestError];
                case 24: return [2 /*return*/];
            }
        });
    });
}
function jobParser(req, pathing, type) {
    return __awaiter(this, void 0, void 0, function () {
        var body, job_requested, job_in_progress, startTime, finishTime, startDate, finishDate, calculatedTimeDiff, minutes, seconds, color, conclusion, job_completed;
        return __generator(this, function (_a) {
            body = req.body;
            if (body.action) {
                switch (body.action) {
                    case 'queued':
                        job_requested = messageConstructor("".concat(req.body.workflow_job.name, " has been queued for [").concat(req.body.repository.full_name, "](").concat(req.body.repository.html_url, ") ([View Job](").concat(req.body.workflow_job.html_url, "))"), "");
                        return [2 /*return*/, webhookPusher(job_requested, pathing).then(function (statusCode) {
                                return statusCode;
                            }).catch(function (error) {
                                return responses.internalError;
                            })];
                    case 'in_progress':
                        job_in_progress = messageConstructor("".concat(req.body.workflow_job.name, " has been picked up by ").concat(req.body.workflow_job.runner_name, " for [").concat(req.body.repository.full_name, "](").concat(req.body.repository.html_url, ") ([View Job](").concat(req.body.workflow_job.html_url, "))"), "");
                        return [2 /*return*/, webhookPusher(job_in_progress, pathing).then(function (statusCode) {
                                return statusCode;
                            }).catch(function (error) {
                                return responses.internalError;
                            })];
                    case 'completed':
                        startTime = req.body.workflow_job.started_at;
                        finishTime = req.body.workflow_job.completed_at;
                        startDate = new Date(startTime);
                        finishDate = new Date(finishTime);
                        calculatedTimeDiff = finishDate.getTime() - startDate.getTime();
                        minutes = Math.floor(calculatedTimeDiff / (1000 * 60));
                        seconds = Math.floor((calculatedTimeDiff % (1000 * 60)) / 1000);
                        color = 16711680;
                        conclusion = '';
                        if (req.body.workflow_job.conclusion === 'success') {
                            color = 1179392;
                            conclusion = "Passed in ".concat(minutes, ":").concat(seconds);
                        }
                        else {
                            conclusion = "Failed in ".concat(minutes, ":").concat(seconds);
                        }
                        job_completed = messageConstructor("".concat(req.body.workflow_job.name, " has been completed by ").concat(req.body.workflow_job.runner_name, " for [").concat(req.body.repository.full_name, "](").concat(req.body.repository.html_url, ") ([View Job](").concat(req.body.workflow_job.html_url, "))"), "".concat(conclusion), color);
                        return [2 /*return*/, webhookPusher(job_completed, pathing).then(function (statusCode) {
                                return statusCode;
                            }).catch(function (error) {
                                return responses.internalError;
                            })];
                    default:
                        return [2 /*return*/, responses.requestError];
                }
            }
            else {
                return [2 /*return*/, responses.requestError];
            }
            return [2 /*return*/];
        });
    });
}
function runParser(req, pathing, type) {
    return __awaiter(this, void 0, void 0, function () {
        var body, run_requested, run_in_progress, color, run_completed;
        return __generator(this, function (_a) {
            body = req.body;
            if (body.action) {
                switch (body.action) {
                    case 'requested':
                        run_requested = messageConstructor("".concat(req.body.workflow_run.actor.login, " requested a workflow run for [").concat(req.body.repository.full_name, "](").concat(req.body.repository.html_url, ") ([View Run](").concat(req.body.workflow_run.html_url, "))"), "");
                        return [2 /*return*/, webhookPusher(run_requested, pathing).then(function (statusCode) {
                                return statusCode;
                            }).catch(function (error) {
                                return responses.internalError;
                            })];
                    case 'in_progress':
                        run_in_progress = messageConstructor("".concat(req.body.workflow_run.actor.login, " started a workflow run for [").concat(req.body.repository.full_name, "](").concat(req.body.repository.html_url, ") ([View Run](").concat(req.body.workflow_run.html_url, "))"), "");
                        return [2 /*return*/, webhookPusher(run_in_progress, pathing).then(function (statusCode) {
                                return statusCode;
                            }).catch(function (error) {
                                return responses.internalError;
                            })];
                    case 'completed':
                        color = 16711680;
                        if (req.body.workflow_run.conclusion === 'success') {
                            color = 1179392;
                        }
                        run_completed = messageConstructor("".concat(req.body.workflow_run.actor.login, " completed a workflow run for [").concat(req.body.repository.full_name, "](").concat(req.body.repository.html_url, ") ([View Run](").concat(req.body.workflow_run.html_url, "))"), "", color);
                        return [2 /*return*/, webhookPusher(run_completed, pathing).then(function (statusCode) {
                                return statusCode;
                            }).catch(function (error) {
                                return responses.internalError;
                            })];
                    default:
                        return [2 /*return*/, responses.requestError];
                }
            }
            else {
                return [2 /*return*/, responses.requestError];
            }
            return [2 /*return*/];
        });
    });
}
function pushParser(req, pathing, type) {
    return __awaiter(this, void 0, void 0, function () {
        var commits, constructedEmbed;
        return __generator(this, function (_a) {
            commits = commitsParser(req);
            constructedEmbed = messageConstructor("".concat(req.body.pusher.name, " pushed to [").concat(req.body.repository.full_name, "](").concat(req.body.repository.html_url, ") ([Compare Changes](").concat(req.body.compare, "))"), "".concat(commits));
            return [2 /*return*/, webhookPusher(constructedEmbed, pathing).then(function (statusCode) {
                    return statusCode;
                }).catch(function (error) {
                    return responses.internalError;
                })];
        });
    });
}
function commitsParser(req) {
    var _this = this;
    var commits = req.body.commits;
    var commitsString = '';
    commits.forEach(function (element) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (commitsString === '') {
                commitsString += "[".concat((element.id).slice(0, 8), "](").concat(element.url, "): ").concat(element.message, " - ").concat(element.author.username);
            }
            else {
                commitsString += "\n[".concat((element.id).slice(0, 8), "](").concat(element.url, "): ").concat(element.message, " - ").concat(element.author.username);
            }
            return [2 /*return*/];
        });
    }); });
    return commitsString;
}
function messageConstructor(content, description, color) {
    var outColor = 5592405;
    if (color) {
        outColor = color;
    }
    var body = {
        description: description,
        color: outColor
    };
    var sendOffBody;
    if (description !== '') {
        sendOffBody = {
            content: content,
            embeds: [body]
        };
    }
    else {
        sendOffBody = {
            content: content
        };
    }
    return sendOffBody;
}
function webhookPusher(body, pathing) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(pathing.discord_webhook_url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(body)
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.status];
            }
        });
    });
}
