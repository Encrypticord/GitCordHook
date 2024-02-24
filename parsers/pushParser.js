"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushParser = void 0;
const responses_1 = require("../models/enums/responses");
class PushParser {
    constructor(_functions) {
        this._functions = _functions;
    }
    async push(req, pathing) {
        let push = await this.pushParser(req, pathing, 'push');
        return push;
    }
    async pushParser(req, pathing, type) {
        let body = req.body;
        let commits = this._functions.commitsParser(req);
        let constructedEmbed = this._functions.messageConstructor(`${body.pusher.name} pushed to [${body.repository.full_name}](${body.repository.html_url}) ([Compare Changes](${body.compare}))`, `${commits}`);
        return this._functions.webhookPusher(constructedEmbed, pathing).then((statusCode) => {
            return statusCode;
        }).catch((error) => {
            return responses_1.responses.internalError;
        });
    }
}
exports.PushParser = PushParser;
