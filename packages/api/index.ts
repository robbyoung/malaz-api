import server from 'bunrest';
import { BunResponse } from 'bunrest/src/server/response';
import {
    FormsApi,
    FormsApplication,
    IFormsApplication,
    IFormsRepository,
    JsonFormsRepository,
} from './forms';
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

const PAGE_TEMPLATES_PATH = './templates/pages';

const formsRepository: IFormsRepository = new JsonFormsRepository();
const formsApplication: IFormsApplication = new FormsApplication(formsRepository);

const scenesRepository: IScenesRepository = new JsonScenesRepository();
const scenesApplication: IScenesApplication = new ScenesApplication(
    scenesRepository,
    formsApplication
);

const annotationsRepository: IAnnotationsRepository = new MongoAnnotationsRepository();
const annotationsApplication: IAnnotationsApplication = new AnnotationsApplication(
    annotationsRepository,
    formsApplication,
    scenesApplication
);

const formsApi = new FormsApi(formsApplication, scenesApplication, annotationsApplication);

const annotationsApi = new AnnotationsApi(
    annotationsApplication,
    scenesApplication,
    formsApplication
);

const scenesApi = new ScenesApi(scenesApplication, annotationsApplication);

const app = server();

app.get('/', async (_, res) => {
    res.redirect('/books/GTM', 301);
});

app.get('/scenes/:id', async (req, res) => {
    const scenesPage = renderFile(`${PAGE_TEMPLATES_PATH}/scene.pug`, {
        sceneId: req.params?.id,
    });

    respondWithHtmx(res, scenesPage);
});

app.get('/books/:id', async (req, res) => {
    const contentsPage = renderFile(`${PAGE_TEMPLATES_PATH}/contents.pug`, {
        bookId: req.params?.id,
    });

    respondWithHtmx(res, contentsPage);
});

app.get('/books/:id/contents', async (req, res) => {
    respondWithHtmx(res, await scenesApi.getContents(req.params?.id));
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

app.get('/forms/scene', async (req, res) => {
    respondWithHtmx(res, await formsApi.getSceneForms(req.query?.sceneId));
});

app.get('/forms/selection', async (req, res) => {
    respondWithHtmx(res, await formsApi.getSelectionForms(req.query?.sceneId, req.query?.range));
});

app.get('/forms/:id', async (req, res) => {
    respondWithHtmx(res, await formsApi.get(req.params?.id, req.query?.sceneId, req.query?.range));
});

app.post('/forms', async (req, res) => {
    respondWithHtmx(res, await annotationsApi.post(req.body));
});

app.get('/annotations/search', async (req, res) => {
    respondWithHtmx(res, await annotationsApi.getSearchResults(req.query as Dictionary));
});

app.get('/annotations/:id', async (req, res) => {
    respondWithHtmx(res, await annotationsApi.get(req.params?.id));
});

app.delete('/annotations/:id', async (req, res) => {
    respondWithHtmx(res, await annotationsApi.delete(req.params?.id));
});

app.get('/favicon.ico', (_, res) => {
    res.status(404).send('Not found');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

function respondWithHtmx(res: BunResponse, htmx?: string) {
    if (!htmx) {
        res.status(404).send('Not found');
    } else if (htmx === 'No content') {
        res.status(204).send('No content');
    } else {
        res.status(200).setHeader('content-type', 'text/html').send(htmx);
    }
}
