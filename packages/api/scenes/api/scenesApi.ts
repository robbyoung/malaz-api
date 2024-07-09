import { IScenesApplication } from '..';
import { renderFile } from 'pug';

const TEMPLATES_PATH = './templates';

export class ScenesApi {
    constructor(private scenes: IScenesApplication) {}

    async get(sceneId?: string): Promise<string | undefined> {
        if (!sceneId) {
            throw new Error('invalid sceneId');
        }

        const sceneName = await this.scenes.getSceneName(sceneId);
        if (!sceneName) {
            throw new Error('no scene data found');
        }

        const adjacentSceneIds = await this.scenes.getAdjacentSceneIds(sceneId);
        const chunks = await this.scenes.getChunks(sceneId);

        return renderFile(`${TEMPLATES_PATH}/sceneText.pug`, {
            chunks,
            title: sceneName,
            sceneId,
            previousSceneId: adjacentSceneIds[0],
            nextSceneId: adjacentSceneIds[1],
        });
    }

    async getAll(bookId: string) {
        const contents = await this.scenes.getContents(bookId);
        const books = await this.scenes.getBooks();

        return renderFile(`${TEMPLATES_PATH}/contents.pug`, { contents, books });
    }
}
