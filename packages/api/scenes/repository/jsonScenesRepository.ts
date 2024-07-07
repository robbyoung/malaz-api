import { IScenesRepository } from '..';
import { Scene } from '../../types';

const gtm: Scene[] = require('../../../parser/output/GTM.json');
const dhg: Scene[] = require('../../../parser/output/DHG.json');

const booksById: { [id: string]: Scene[] } = { GTM: gtm, DHG: dhg };

export class JsonScenesRepository implements IScenesRepository {
    public getSceneById(id: string): Promise<Scene | undefined> {
        let matchingScene = gtm.find((scene) => scene.id === id);
        if (!matchingScene) {
            matchingScene = dhg.find((scene) => scene.id === id);
        }

        if (!matchingScene) {
            return Promise.resolve(undefined);
        }

        return Promise.resolve({
            ...matchingScene,
            sceneText: this.fromBase64(matchingScene.sceneText),
        });
    }

    public async getScenes(bookId: string): Promise<Omit<Scene, 'sceneText'>[]> {
        return Promise.resolve(booksById[bookId]);
    }

    private fromBase64(text: string) {
        return decodeURIComponent(atob(text));
    }
}
