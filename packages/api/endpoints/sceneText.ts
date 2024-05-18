import { getSubmissionsForScene } from '../repository/submissions';
import { Chunk, ChunkService } from '../text/chunkService';
import { TextService } from '../text/textService';
import { renderFile } from 'pug';

interface TemplateProps {
    chunks: Chunk[];
    title: string;
    sceneId: string;
    nextSceneId?: string;
    previousSceneId?: string;
}

interface Params {
    sceneId: string;
}

export async function getSceneText(params: Params): Promise<string | undefined> {
    if (!params.sceneId) {
        return undefined;
    }

    const sceneName = new TextService().getSceneName(params.sceneId);
    const text = new TextService().getSceneText(params.sceneId);
    if (!text || !sceneName) {
        return undefined;
    }
    const adjacentSceneIds = new TextService().getAdjacentSceneIds(params.sceneId);

    const annotations = await getSubmissionsForScene(params.sceneId);

    const props: TemplateProps = {
        chunks: ChunkService.getChunks(text, annotations),
        title: sceneName,
        sceneId: params.sceneId,
        previousSceneId: adjacentSceneIds[0],
        nextSceneId: adjacentSceneIds[1],
    };

    return renderFile('./endpoints/sceneText.pug', props);
}
