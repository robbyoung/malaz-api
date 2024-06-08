import { IScenesRepository } from '..';
import { Scene } from '../../types';

const gotm: Scene[] = require('../../../parser/output/gotm.json');
const dg: Scene[] = require('../../../parser/output/dg.json');

const booksById: { [id: string]: Scene[] } = {
    gotm: gotm,
    dg: dg,
};

export class JsonScenesRepository implements IScenesRepository {
    public getSceneById(id: string): Promise<Scene | undefined> {
        let matchingScene = gotm.find((scene) => scene.id === id);
        if (!matchingScene) {
            matchingScene = dg.find((scene) => scene.id === id);
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
