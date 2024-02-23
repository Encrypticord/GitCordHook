"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionsHandler = void 0;
class FunctionsHandler {
    constructor() { }
    commitsParser(req) {
        let commits = req.body.commits;
        var commitsString = '';
        commits.forEach(async (element) => {
            if (commitsString === '') {
                commitsString += `[${(element.id).slice(0, 8)}](${element.url}): ${element.message} - ${element.author.username}`;
            }
            else {
                commitsString += `\n[${(element.id).slice(0, 8)}](${element.url}): ${element.message} - ${element.author.username}`;
            }
        });
        return commitsString;
    }
    messageConstructor(content, description, color) {
        var outColor = 5592405;
        if (color) {
            outColor = color;
        }
        let body = {
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
    async webhookPusher(body, pathing) {
        const response = await fetch(pathing.discord_webhook_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        return response.status;
    }
}
exports.FunctionsHandler = FunctionsHandler;
