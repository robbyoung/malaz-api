import server from 'bunrest';
import { BunResponse } from 'bunrest/src/server/response';
import {
    IScenesApplication,
    IScenesRepository,
    JsonScenesRepository,
    ScenesApi,
    ScenesApplication,
} from './scenes';
import {
    AnnotationsApi,
    AnnotationsApplication,
    IAnnotationsApplication,
    IAnnotationsRepository,
    MongoAnnotationsRepository,
} from './annotations';
import { Dictionary } from './util/dictionaries';
import { renderFile } from 'pug';
import {
    ISessionsApplication,
    ISessionsRepository,
    MongoSessionsRepository,
    SessionsApplication,
} from './sessions';
import { getSessionIdFromRequest } from './util/getSessionFromRequest';

const PAGE_TEMPLATES_PATH = './templates/pages';

const sessionsRepository: ISessionsRepository = new MongoSessionsRepository();
const sessionsApplication: ISessionsApplication = new SessionsApplication(sessionsRepository);

const scenesRepository: IScenesRepository = new JsonScenesRepository();
const scenesApplication: IScenesApplication = new ScenesApplication(scenesRepository);

const annotationsRepository: IAnnotationsRepository = new MongoAnnotationsRepository();
const annotationsApplication: IAnnotationsApplication = new AnnotationsApplication(
    annotationsRepository,
    scenesApplication,
    sessionsApplication
);

const annotationsApi = new AnnotationsApi(annotationsApplication);

const scenesApi = new ScenesApi(scenesApplication, annotationsApplication);

const app = server();

// const refreshTextTrigger = "{'refresh':{'target' : '#text-container'}}";
const refreshTextTrigger = 'refresh';

app.get('/', async (_, res) => {
    res.redirect('/books/GTM', 301);
});

app.get('/scenes/:id', (req, res) => {
    const scenesPage = renderFile(`${PAGE_TEMPLATES_PATH}/scene.pug`, {
        sceneId: req.params?.id,
        sessionId: getSessionIdFromRequest(req),
    });

    respondWithHtmx(res, scenesPage);
});

app.get('/books/:id', (req, res) => {
    const contentsPage = renderFile(`${PAGE_TEMPLATES_PATH}/contents.pug`, {
        bookId: req.params?.id,
        sessionId: getSessionIdFromRequest(req),
    });

    respondWithHtmx(res, contentsPage);
});

app.get('/books/:id/contents', async (req, res) => {
    respondWithHtmx(res, await scenesApi.getContents(req.params?.id));
});

app.get('/scenes/:id/text', async (req, res) => {
    respondWithHtmx(res, await scenesApi.getText(req.params?.id));
});

app.get('/scenes/:id/nav', async (req, res) => {
    respondWithHtmx(res, await scenesApi.getNav(req.params?.id));
});

app.get('/forms/selection', async (req, res) => {
    respondWithHtmx(
        res,
        await annotationsApi.getSelectionForms(
            getSessionIdFromRequest(req),
            req.query?.sceneId,
            req.query?.range
        )
    );
});

app.get('/forms/scene', async (req, res) => {
    respondWithHtmx(res, await annotationsApi.getSceneForms(req.query?.sceneId));
});

app.get('/forms/:id', async (req, res) => {
    respondWithHtmx(
        res,
        await annotationsApi.getForm(req.params?.id, req.query?.sceneId, req.query?.range)
    );
});

app.post('/forms', async (req, res) => {
    respondWithHtmx(
        res,
        await annotationsApi.post(req.body, getSessionIdFromRequest(req)),
        refreshTextTrigger
    );
});

app.post('/forms/repeat', async (req, res) => {
    respondWithHtmx(
        res,
        await annotationsApi.repost(req.body, getSessionIdFromRequest(req)),
        refreshTextTrigger
    );
});

app.get('/annotations/search', async (req, res) => {
    respondWithHtmx(res, await annotationsApi.getSearchResults(req.query as Dictionary));
});

app.get('/annotations/:id', async (req, res) => {
    respondWithHtmx(res, await annotationsApi.get(req.params?.id));
});

app.delete('/annotations/:id', async (req, res) => {
    respondWithHtmx(res, await annotationsApi.delete(req.params?.id), refreshTextTrigger);
});

app.get('/favicon.ico', (_, res) => {
    res.status(404).send('Not found');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

function respondWithHtmx(res: BunResponse, htmx?: string, trigger?: string) {
    if (trigger) {
        res.setHeader('hx-trigger', trigger);
    }

    if (!htmx) {
        res.status(404).send('Not found');
    } else if (htmx === 'No content') {
        res.status(204).send('No content');
    } else {
        res.status(200).setHeader('content-type', 'text/html').send(htmx);
    }
}
