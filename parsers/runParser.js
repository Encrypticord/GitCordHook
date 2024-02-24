"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunParser = void 0;
const responses_1 = require("../models/enums/responses");
class RunParser {
    constructor(_functions) {
        this._functions = _functions;
    }
    async run(req, pathing) {
        let body = req.body;
        switch (body.action) {
            case 'requested':
                let requested = await this.runParser(req, pathing);
                return requested;
            case 'in_progress':
                let in_progress = await this.runParser(req, pathing);
                return in_progress;
            case 'completed':
                let completed = await this.runParser(req, pathing);
                return completed;
            default:
                return responses_1.responses.requestError;
        }
    }
    async runParser(req, pathing) {
        let body = req.body;
        switch (body.action) {
            case 'requested':
                let run_requested = this._functions.messageConstructor(`${body.workflow_run.actor.login} requested a workflow run for [${body.repository.full_name}](${body.repository.html_url}) ([View Run](${body.workflow_run.html_url}))`, ``);
                return this._functions.webhookPusher(run_requested, pathing).then((statusCode) => {
                    return statusCode;
                }).catch((error) => {
                    return responses_1.responses.internalError;
                });
            case 'in_progress':
                let run_in_progress = this._functions.messageConstructor(`${body.workflow_run.actor.login} started a workflow run for [${body.repository.full_name}](${body.repository.html_url}) ([View Run](${body.workflow_run.html_url}))`, ``);
                return this._functions.webhookPusher(run_in_progress, pathing).then((statusCode) => {
                    return statusCode;
                }).catch((error) => {
                    return responses_1.responses.internalError;
                });
            case 'completed':
                var color = 16711680;
                if (body.workflow_run.conclusion === 'success') {
                    color = 1179392;
                }
                let run_completed = this._functions.messageConstructor(`${body.workflow_run.actor.login} completed a workflow run for [${body.repository.full_name}](${body.repository.html_url}) ([View Run](${body.workflow_run.html_url}))`, ``, color);
                return this._functions.webhookPusher(run_completed, pathing).then((statusCode) => {
                    return statusCode;
                }).catch((error) => {
                    return responses_1.responses.internalError;
                });
            default:
                return responses_1.responses.requestError;
        }
    }
}
exports.RunParser = RunParser;
