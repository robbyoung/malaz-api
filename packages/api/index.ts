import server from 'bunrest';
import pug from 'pug';
import { TextService } from './text/textService';

const app = server();

app.get('/', (_, res) => {
    const text = new TextService().getSceneText(1, 1);

    if (!text) {
        res.status(404).json("Not found");
    } else {
        res.status(200).setHeader('content-type', 'text/html').send(pug.renderFile('./templates/index.pug', { text }));
    }
});

app.get('/scenes/:chapter/:scene', (req, res) => {
    const chapter = parseInt(req.params?.chapter);
    const scene = parseInt(req.params?.scene);
    const text = new TextService().getSceneText(chapter, scene);

    if (!text) {
        res.status(404).json("Not found");
    } else {
        res.status(200).setHeader('content-type', 'text/html').send(pug.renderFile('./templates/_text.pug', { text, chapter, scene, nextChapter: chapter, nextScene: scene + 1 }));
    }
});

app.get('/contents', (req, res) => {
    const contents = new TextService().getContents();
    
    res.status(200).send({ contents });
});

app.get('/selection', (req, res) => {
    console.dir(req.query);

    res.status(204).send({});
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});