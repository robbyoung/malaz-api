# MalazAPI

### Introduction

This project is a parser/annotator for Steven Erikson's Malazan Book of the Fallen. The data gathered will eventually be exposed by an API that nobody will ever have the need to use.

Made with TypeScript, HTMX, Pug, and Bun.

### Dependencies

##### Bun

[Bun](https://bun.sh/) is a JavaScript package manager that is pretty neat. I like the way it manages sub-projects and can run TypeScript directly.

The simplest way to get it is via NPM (`npm install -g bun`) but there are a [bunch of other ways](https://bun.sh/docs/installation).

Once you've done this, run `bun install` in the root of the repo.

##### MongoDB

[MongoDB](https://www.mongodb.com/) is the current storage solution - just a local instance running off of my computer.

To achieve this yourself, get [MongoDB Shell](https://www.mongodb.com/try/download/shell) and run `mongod.exe --bind_ip 0.0.0.0`.

### Commands

`bun run api` will start up the application at http://localhost:3000/.

`bun run prettier` will format the codebase with [Prettier](https://prettier.io/).

`bun run parser` will try parse whatever is in the `./packages/parser/text` folder and prepare it for annotation. You shouldn't need to use this.
