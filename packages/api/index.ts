import server from 'bunrest';
import { BunResponse } from 'bunrest/src/server/response';
import { getSceneText } from './endpoints/sceneText';
import { getSelection } from './endpoints/selection';
import { getContents } from './endpoints/contents';
import { getForm } from './endpoints/form';
import { postSubmission } from './endpoints/submission';
import { getAnnotation } from './endpoints/annotation';
import { deleteAnnotation } from './endpoints/deleteAnnotation';
import {
    FormsApplication,
    IFormsApplication,
    IFormsRepository,
    JsonFormsRepository,
} from './forms';
import {
    IScenesApplication,
    IScenesRepository,
    JsonScenesRepository,
    ScenesApplication,
} from './scenes';
import {
    AnnotationsApi,
    AnnotationsApplication,
    IAnnotationsApplication,
    IAnnotationsRepository,
    MongoAnnotationsRepository,
} from './annotations';
import { IViewsApplication, ViewsApplication } from './views';

const viewsApplication: IViewsApplication = new ViewsApplication();

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
    formsApplication
);
const annotationsApi = new AnnotationsApi(
    annotationsApplication,
    scenesApplication,
    formsApplication,
    viewsApplication
);

const app = server();

app.get('/', (_, res) => {
    respondWithHtmx(res, getContents());
});

app.get('/scene/:sceneId', async (req, res) => {
    respondWithHtmx(res, await getSceneText(req.params as any));
});

app.get('/scenes/:sceneId/annotate', async (req, res) => {
    respondWithHtmx(
        res,
        await getSelection({ sceneId: req.params?.sceneId, range: req.query?.range })
    );
});

app.get('/forms', async (req, res) => {
    respondWithHtmx(res, await getForm(req.query as any));
});

app.post('/forms', async (req, res) => {
    respondWithHtmx(res, await annotationsApi.post(req.body));
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
