"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobParser = void 0;
const responses_1 = require("../models/enums/responses");
class JobParser {
    constructor(_functions) {
        this._functions = _functions;
    }
    async job(req, pathing) {
        let body = req.body;
        switch (body.action) {
            case 'queued':
                let requested = await this.jobParser(req, pathing);
                return requested;
            case 'in_progress':
                let in_progress = await this.jobParser(req, pathing);
                return in_progress;
            case 'completed':
                let completed = await this.jobParser(req, pathing);
                return completed;
            default:
                return responses_1.responses.requestError;
        }
    }
    async jobParser(req, pathing) {
        let body = req.body;
        switch (body.action) {
            case 'queued':
                let job_requested = this._functions.messageConstructor(`${body.workflow_job.name} has been queued for [${body.repository.full_name}](${body.repository.html_url}) ([View Job](${body.workflow_job.html_url}))`, ``);
                return this._functions.webhookPusher(job_requested, pathing).then((statusCode) => {
                    return statusCode;
                }).catch((error) => {
                    return responses_1.responses.internalError;
                });
            case 'in_progress':
                let job_in_progress = this._functions.messageConstructor(`${body.workflow_job.name} has been picked up by ${body.workflow_job.runner_name} for [${body.repository.full_name}](${body.repository.html_url}) ([View Job](${body.workflow_job.html_url}))`, ``);
                return this._functions.webhookPusher(job_in_progress, pathing).then((statusCode) => {
                    return statusCode;
                }).catch((error) => {
                    return responses_1.responses.internalError;
                });
            case 'completed':
                let startDate = new Date(body.workflow_job.started_at);
                let finishDate = new Date(body.workflow_job.completed_at);
                let calculatedTimeDiff = finishDate.getTime() - startDate.getTime();
                let minutes = Math.floor(calculatedTimeDiff / (1000 * 60));
                let seconds = Math.floor((calculatedTimeDiff % (1000 * 60)) / 1000);
                var color = 16711680;
                var conclusion = '';
                if (body.workflow_job.conclusion === 'success') {
                    color = 1179392;
                    conclusion = `Passed in ${minutes}:${seconds}`;
                }
                else {
                    conclusion = `Failed in ${minutes}:${seconds}`;
                }
                let job_completed = this._functions.messageConstructor(`${body.workflow_job.name} has been completed by ${body.workflow_job.runner_name} for [${body.repository.full_name}](${body.repository.html_url}) ([View Job](${body.workflow_job.html_url}))`, `${conclusion}`, color);
                return this._functions.webhookPusher(job_completed, pathing).then((statusCode) => {
                    return statusCode;
                }).catch((error) => {
                    return responses_1.responses.internalError;
                });
            default:
                return responses_1.responses.requestError;
        }
    }
}
exports.JobParser = JobParser;
