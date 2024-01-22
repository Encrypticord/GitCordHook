# GitCordHook

## Introduction

This software is designed to integrate GitHub webhooks with Discord webhooks. GitHub webhooks and Discord webhooks are not inherently compatible, and this software is an easy to setup bridge between the two.

## Installation

Once you have installed GitHubDiscordHook, extract the zip and place the contents in a folder on the machine you want it to be hosted on. I would recommend using the latest version of Node and NPM on your machine, but version shouldn't be a major issue.

Install the dependancies with `npm i` and then open the config.json file. Once you have setup the config file, enter `node .` in your terminal and it should start automatically.

## Software Configuration

#### Port: number

This is the port your webhook bridge will be running on.

#### trust_proxy: true | false

If you are hosting this service behind a proxy setup in something like Apache or NGINX, you'll want to set this to be true. If you aren't, setting it to false is recommended for security.

#### use_https: true | false

If you are hosting this service under a domain name, and you are able to get the certificates necessary, you can run this service on HTTPS. This is HIGHLY recommended, as HTTPS is much more secure than just HTTP.

Place the content of your certificates in the template files already existing, and enable `use_https`. The service will automatically start on HTTPS when it boots next.

#### secret: string

In Development

~~This is where you setup your security. You will enter this in both the config here and in the GitHub webhook setup, which will be what authenticates GitHub in your bridge.~~

#### pathings: array

Within this array you will setup all of your webhook paths and Discord webhook links. Two examples are provided. For the webhook_path, it should look something like `/webhook` or `/webhook/servicename`. What you name the paths is up to you, but start with a `/` and don't end with one. Then, in discord_webhook_url you will place the link for your Discord webhook.

You can have as many of these pairs as you want, so long as each path has a webhook link, and each pair is separated by a comma, similar to how the template is setup.

## GitHub Configuration

In order to ensure people don't find the url of your webhook bridge and start creating fake events, you need to setup a secret. The secret can be whatever you'd like, but longer and more random secrets tend to be more secure. Whatever they are, both the bridge config file and the GitHub webhook configuration need to have the identical secret.

## Currently Supported Events

- push
- workflow runs (Functioning - To Be Improved)
- workflow jobs (Functioning - To Be Improved)

## Building

If you would like to develop your own version of GitCordHook (following the licensing and copyright agreement), or just build the JavaScript on your own, you can use the already setup command.

Ensure that you have TypeScript installed globally. To do this, run `npm i typescript -g`. Once you have TypeScript installed globally, run `npm run build` and the service will automatically build. Once built, you can start your newly built version with `node .` and it will run.



*Copyright © 2024 Encrypticord Services. All rights reserved.*
