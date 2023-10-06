import server from 'bunrest';
import { TextService } from './text/textService';

const app = server();

app.get('/scenes/:chapter/:scene', (req, res) => {
    const chapter = parseInt(req.params?.chapter);
    const scene = parseInt(req.params?.scene);
    const text = new TextService().getSceneText(chapter, scene);

    if (!text) {
        res.status(404).json("Not found");
    } else {
        res.status(200).json(text);
    }
});

app.get('/contents', (req, res) => {
    const contents = new TextService().getContents();
    
    res.status(200).json({ contents });
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});