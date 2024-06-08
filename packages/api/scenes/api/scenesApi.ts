import { IAnnotationsApplication } from '../../annotations';
import { IScenesApplication } from '..';
import { IViewsApplication } from '../../views';

export class ScenesApi {
    constructor(
        private scenes: IScenesApplication,
        private annotations: IAnnotationsApplication,
        private views: IViewsApplication
    ) {}

    async get(sceneId?: string): Promise<string | undefined> {
        if (!sceneId) {
            throw new Error('invalid sceneId');
        }

        const sceneName = await this.scenes.getSceneName(sceneId);
        if (!sceneName) {
            throw new Error('no scene data found');
        }

        const adjacentSceneIds = await this.scenes.getAdjacentSceneIds(sceneId);
        const annotations = await this.annotations.getAnnotationsForScene(sceneId);
        const chunks = await this.scenes.getChunks(sceneId, annotations);

        return this.views.renderSceneText(
            chunks,
            sceneName,
            sceneId,
            adjacentSceneIds[1],
            adjacentSceneIds[0]
        );
    }

    async getAll() {
        const contents = await this.scenes.getContents('dg');

        return this.views.renderTableOfContents(contents);
    }
}
