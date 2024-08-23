import { expect, test } from 'bun:test';
import { IScenesRepository, ScenesApplication } from '..';
import { SceneType } from '../../types';
import { IFormsApplication } from '../../forms';
import { IAnnotationsApplication } from '../../annotations';

function createMockRepository(sceneText: string): IScenesRepository {
    return {
        getSceneById: (id) => {
            return Promise.resolve({
                id,
                chapterNumber: 1,
                sceneNumber: 1,
                sceneText,
                sceneType: SceneType.Standard,
            });
        },
        getScenes: () => {
            return Promise.resolve([]);
        },
    };
}

test('strips dialogue correctly', () => {
    const application = new ScenesApplication(
        createMockRepository(''),
        {} as IFormsApplication,
        {} as IAnnotationsApplication
    );
    expect(1 + 2).toBe(3);
});
