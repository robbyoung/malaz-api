import server from 'bunrest';
import { BunResponse } from 'bunrest/src/server/response';
import { getSceneText } from './endpoints/sceneText';
import { getSelection } from './endpoints/selection';
import { getContents } from './endpoints/contents';
import { getForm } from './endpoints/form';
import { postSubmission } from './endpoints/submission';

const app = server();

app.get('/', (_, res) => {
    respondWithHtmx(res, getContents());
});

app.get('/scene/:sceneId', async (req, res) => {
    respondWithHtmx(res, await getSceneText(req.params as any));
});

app.get('/scenes/:sceneId/annotate', (req, res) => {
    respondWithHtmx(res, getSelection({sceneId: req.params?.sceneId, range: req.query?.range}));
});

app.get('/forms', (req, res) => {
    respondWithHtmx(res, getForm(req.query as any));
});

app.post('/forms', async (req, res) => {
    respondWithHtmx(res, await postSubmission(req.body as any));
});

app.get('/favicon.ico', (_, res) => {
    res.status(404).send("Not found");
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
