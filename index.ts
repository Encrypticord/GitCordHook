


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



//Imports



const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const https = require('https')



//Declarations



app.use(cors())

app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('trust proxy', true)



//Main



const lightGray = '\x1b[90m';
const green = '\x1b[32m';
const red = '\x1b[31m';
const blue = '\x1b[34m';
const orange = '\x1b[33m';
const reset = '\x1b[0m';
const responses = {
    success: 200,
    requestError: 400,
    internalError: 500
}

main()

async function main() {
    if(fs.existsSync(`${__dirname}/config.json`)){
        console.log(`${blue}Loading config...${reset}`)
        try {
            let rawConfig: string = fs.readFileSync(`${__dirname}/config.json`)
            let jsonConfig: ConfigObject = JSON.parse(rawConfig)
            console.log(`${green}Loading complete!${reset}`)
            console.log(`${blue}Starting...${reset}`)
            if(jsonConfig.use_https){
                let privateKey = fs.readFileSync(`${__dirname}/keys/private_key.pem`, 'utf8')
                let certificate = fs.readFileSync(`${__dirname}/keys/certificate.pem`, 'utf8')
                let ca = fs.readFileSync(`${__dirname}/keys/chain.pem`, 'utf8')
                let credentials = { key: privateKey, cert: certificate, ca: ca }
                let httpsServer = https.createServer(credentials, app)
                await httpsServer.listen(jsonConfig.port, () => {
                    console.log(`${green}Successfully started HTTPS on port ${jsonConfig.port}${reset}`)
                })
            } else {
                await app.listen(jsonConfig.port, () => {
                    console.log(`${green}Successfully started HTTP on port ${jsonConfig.port}${reset}`)
                    console.log(`${red}WARNING! Using HTTP instead of HTTPS is a security risk and could lead to the loss of your personal GitHub data!${reset}`)
                })
            }
            console.log(`${blue}Loading webhook paths...${reset}`)
            let redirectPathArray = jsonConfig.pathings
            redirectPathArray.forEach(async (element) => {
                app.post(`${element.webhook_path}`, async (req: any, res: any) => {
                    let sendOff: number = await GitHubParser(req, element)
                    res.sendStatus(sendOff)
                })
                console.log(`${lightGray}Loaded: ${element.webhook_path}${reset}`)
            })
            console.log(`${green}Successfully loaded webhook paths!${reset}`)
        } catch (error) {
            console.error(`${red}Unable to read or parse config file${reset}`);
            process.exit();
        }
    } else {
        console.error(`${red}No config file found${reset}`)
        process.exit()
    }
}



//Data Handlers



async function GitHubParser(req: any, pathing: Pathing): Promise<number> {
    let body = req.body
    let headers = req.headers
    let event = headers['x-github-event']
    if(event){
        switch (event){
            case 'workflow_run':
                if(body.action){
                    switch (body.action) {
                        case 'requested':
                            let requested: number = await runParser(req, pathing, 'run_requested')
                            return requested
                        case 'in_progress':
                            let in_progress: number = await runParser(req, pathing, 'run_in_progress')
                            return in_progress
                        case 'completed':
                            let completed: number = await runParser(req, pathing, 'run_completion')
                            return completed
                        default:
                            return responses.requestError
                    }
                }
            case 'workflow_job':
                if(body.action){
                    switch (body.action) {
                        case 'queued':
                            let requested: number = await jobParser(req, pathing, 'job_queued')
                            return requested
                        case 'in_progress':
                            let in_progress: number = await jobParser(req, pathing, 'job_in_progress')
                            return in_progress
                        case 'completed':
                            let completed: number = await jobParser(req, pathing, 'job_completion')
                            return completed
                        default:
                            return responses.requestError
                    }
                }
                return 200
            case 'push':
                if(body.pusher){
                    let push: number = await pushParser(req, pathing, 'push')
                    return push
                } else {
                    return responses.requestError
                }
            default:
                return responses.requestError
        }
    } else {
        return responses.requestError
    }
}

async function jobParser(req: any, pathing: Pathing, type: string): Promise<number> {
    let body = req.body
    if(body.action){
        switch (body.action){
            case 'queued':
                let job_requested: sendBody = messageConstructor(`${req.body.workflow_job.name} has been queued for [${req.body.repository.full_name}](${req.body.repository.html_url}) ([View Job](${req.body.workflow_job.html_url}))`, ``)
                return webhookPusher(job_requested, pathing).then((statusCode) => {
                    return statusCode
                }).catch((error) => {
                    return responses.internalError
                })
            case 'in_progress':
                let job_in_progress: sendBody = messageConstructor(`${req.body.workflow_job.name} has been picked up by ${req.body.workflow_job.runner_name} for [${req.body.repository.full_name}](${req.body.repository.html_url}) ([View Job](${req.body.workflow_job.html_url}))`, ``)
                return webhookPusher(job_in_progress, pathing).then((statusCode) => {
                    return statusCode
                }).catch((error) => {
                    return responses.internalError
                })
            case 'completed':
                let startTime = req.body.workflow_job.started_at
                let finishTime = req.body.workflow_job.completed_at
                let startDate = new Date(startTime)
                let finishDate = new Date(finishTime)
                let calculatedTimeDiff = finishDate.getTime() - startDate.getTime()
                let minutes = Math.floor(calculatedTimeDiff / (1000 * 60))
                let seconds = Math.floor((calculatedTimeDiff % (1000 * 60)) / 1000)
                var color = 16711680
                var conclusion = ''
                if(req.body.workflow_job.conclusion === 'success'){
                    color = 1179392
                    conclusion = `Passed in ${minutes}:${seconds}`
                } else {
                    conclusion = `Failed in ${minutes}:${seconds}`
                }
                let job_completed: sendBody = messageConstructor(`${req.body.workflow_job.name} has been completed by ${req.body.workflow_job.runner_name} for [${req.body.repository.full_name}](${req.body.repository.html_url}) ([View Job](${req.body.workflow_job.html_url}))`, `${conclusion}`, color)
                return webhookPusher(job_completed, pathing).then((statusCode) => {
                    return statusCode
                }).catch((error) => {
                    return responses.internalError
                })
            default:
                return responses.requestError
        }
    } else {
        return responses.requestError
    }
}

async function runParser(req: any, pathing: Pathing, type: string): Promise<number> {
    let body = req.body
    if(body.action){
        switch (body.action){
            case 'requested':
                let run_requested: sendBody = messageConstructor(`${req.body.workflow_run.actor.login} requested a workflow run for [${req.body.repository.full_name}](${req.body.repository.html_url}) ([View Run](${req.body.workflow_run.html_url}))`, ``)
                return webhookPusher(run_requested, pathing).then((statusCode) => {
                    return statusCode
                }).catch((error) => {
                    return responses.internalError
                })
            case 'in_progress':
                let run_in_progress: sendBody = messageConstructor(`${req.body.workflow_run.actor.login} started a workflow run for [${req.body.repository.full_name}](${req.body.repository.html_url}) ([View Run](${req.body.workflow_run.html_url}))`, ``)
                return webhookPusher(run_in_progress, pathing).then((statusCode) => {
                    return statusCode
                }).catch((error) => {
                    return responses.internalError
                })
            case 'completed':
                var color = 16711680
                if(req.body.workflow_run.conclusion === 'success'){
                    color = 1179392
                }
                let run_completed: sendBody = messageConstructor(`${req.body.workflow_run.actor.login} completed a workflow run for [${req.body.repository.full_name}](${req.body.repository.html_url}) ([View Run](${req.body.workflow_run.html_url}))`, ``, color)
                return webhookPusher(run_completed, pathing).then((statusCode) => {
                    return statusCode
                }).catch((error) => {
                    return responses.internalError
                })
            default:
                return responses.requestError
        }
    } else {
        return responses.requestError
    }
}

async function pushParser(req: any, pathing: Pathing, type: string): Promise<number> {
    let commits = commitsParser(req)
    let constructedEmbed: sendBody = messageConstructor(`${req.body.pusher.name} pushed to [${req.body.repository.full_name}](${req.body.repository.html_url}) ([Compare Changes](${req.body.compare}))`, `${commits}`)
    return webhookPusher(constructedEmbed, pathing).then((statusCode) => {
        return statusCode
    }).catch((error) => {
        return responses.internalError
    })
}

function commitsParser(req: any): string {
    let commits = req.body.commits
    var commitsString: string = ''
    commits.forEach(async (element: any) => {
        if(commitsString === '') {
            commitsString += `[${(element.id).slice(0,8)}](${element.url}): ${element.message} - ${element.author.username}`
        } else {
            commitsString += `\n[${(element.id).slice(0,8)}](${element.url}): ${element.message} - ${element.author.username}`
        }
    })
    return commitsString
}

function messageConstructor(content: string, description: string, color?: number): sendBody {
    var outColor = 5592405
    if(color){
        outColor = color
    }
    let body: embedBody = {
        description: description,
        color: outColor
    }
    var sendOffBody: sendBody
    if(description !== ''){
        sendOffBody = {
            content: content,
            embeds: [body]
        }
    } else {
        sendOffBody = {
            content: content
        }
    }
    return sendOffBody
}

async function webhookPusher(body: sendBody, pathing: Pathing): Promise<number> {
    const response = await fetch(pathing.discord_webhook_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    return response.status
}



//Types

type ConfigObject = {
    port: number;
    trust_proxy: boolean;
    use_https: boolean;
    pathings: Array<Pathing>
}

type Pathing = {
    webhook_path: string;
    discord_webhook_url: string;
}

type embedBody = {
    description: string;
    color: number;
}

type sendBody = {
    content: string;
    embeds?: Array<embedBody>;
}


