import { IScenesApplication } from '..';
import { renderFile } from 'pug';
import { IAnnotationsApplication } from '../../annotations';

const TEMPLATES_PATH = './templates';

export class ScenesApi {
    constructor(
        private scenes: IScenesApplication,
        private annotations: IAnnotationsApplication
    ) {}

    async getText(sceneId: string) {
        if (!sceneId) {
            throw new Error('invalid sceneId');
        }

        const annotations = await this.annotations.getAnnotationsForScene(sceneId);
        const chunks = await this.scenes.getChunks(sceneId, annotations);

        return renderFile(`${TEMPLATES_PATH}/sceneText.pug`, {
            chunks,
            sceneId,
        });
    }

    async getNav(sceneId: string) {
        if (!sceneId) {
            throw new Error('invalid sceneId');
        }

        const sceneName = await this.scenes.getSceneName(sceneId);
        if (!sceneName) {
            throw new Error('no scene data found');
        }

        const adjacentSceneIds = await this.scenes.getAdjacentSceneIds(sceneId);

        return renderFile(`${TEMPLATES_PATH}/sceneNav.pug`, {
            title: sceneName,
            sceneId,
            previousSceneId: adjacentSceneIds[0],
            nextSceneId: adjacentSceneIds[1],
        });
    }

    async getContents(bookId: string) {
        const contents = await this.scenes.getContents(bookId);
        const books = await this.scenes.getBooks();

        return renderFile(`${TEMPLATES_PATH}/contents.pug`, { contents, books });
    }
}
