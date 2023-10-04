import * as pug from 'pug';
import { TextService } from './text/textService';

console.log('Serving from http://localhost:3000');

Bun.serve({
    fetch(req: Request) {
        const text = new TextService().getSceneText(1, 3);

        if (!text) {
            return new Response("Not found", {status: 404});
        }

        return new Response(text);
    },
});