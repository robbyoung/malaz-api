import { getSubmissionsForScene, saveSubmission } from '../repository/submissions';
import { renderFile } from 'pug';
import { saveSceneAttributes } from '../repository/sceneAttributes';
import { Chunk } from '../types';

interface TemplateProps {
    chunks: Chunk[];
    sceneId: string;
}

export async function postSubmission(rawFormData: any): Promise<string> {
    let sceneId: string;

    try {
        sceneId = await processSubmission(rawFormData);
    } catch (e) {
        if (e instanceof Error) {
            return renderFile('./components/error.pug', { message: e.message });
        }

        throw e;
    }

    const text = TextService.getSceneText(sceneId);
    if (!text) {
        return renderFile('./components/error.pug', { message: 'Failed to update text' });
    }

    const annotations = await getSubmissionsForScene(sceneId);
    const chunks = ChunkService.getChunks(text, annotations);

    const props: TemplateProps = {
        sceneId,
        chunks,
    };

    return renderFile('./endpoints/submission.pug', props);
}
