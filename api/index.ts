import * as pug from 'pug';

console.log('Serving from http://localhost:3000')

Bun.serve({
    fetch(req: Request) {
        return new Response("Hello, api!");
    },
});