import server from 'bunrest';
import { BunResponse } from 'bunrest/src/server/response';
import { getSceneText } from './endpoints/sceneText';
import { getSelection } from './endpoints/selection';
import { getContents } from './endpoints/contents';

const app = server();

app.get('/', (_, res) => {
    respondWithHtmx(res, getContents());
});

app.get('/scene/:sceneId', (req, res) => {
    respondWithHtmx(res, getSceneText(req.params as any));
});

app.get('/selection/:sceneId/:range', (req, res) => {
    respondWithHtmx(res, getSelection(req.params as any));
});

app.get('/forms', (_, res) => {
    respondWithHtmx(res, undefined);
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

function respondWithHtmx(res: BunResponse, htmx?: string) {
    if (!htmx) {
        res.status(404).send("Not found");
    } else {
        res.status(200).setHeader('content-type', 'text/html').send(htmx);
    }
}
