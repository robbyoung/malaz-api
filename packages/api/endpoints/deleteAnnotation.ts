import { renderFile } from 'pug';
import {
    deleteSubmissionById,
    getSubmissionById,
    getSubmissionsForScene,
} from '../repository/submissions';
import { TextService } from '../text/textService';
import { Chunk, ChunkService } from '../text/chunkService';

interface TemplateProps {
    sceneId: string;
    chunks: Chunk[];
}

interface Params {
    annotationId: string;
}

export async function deleteAnnotation(params: Params): Promise<string | undefined> {
    if (!params.annotationId) {
        throw new Error('invalid annotationId');
    }

    const annotation = await getSubmissionById(params.annotationId);
    if (!annotation) {
        return renderFile('./components/error.pug', { message: 'Failed to delete annotation' });
    }

    const sceneId = annotation.sceneId;

    await deleteSubmissionById(params.annotationId);

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

    return renderFile('./endpoints/deleteAnnotation.pug', props);
}
