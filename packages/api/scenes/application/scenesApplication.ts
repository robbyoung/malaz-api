import {
    ChapterContents,
    Contents,
    IScenesApplication,
    IScenesRepository,
    Scene,
    SceneType,
} from '../types';

export class ScenesApplication implements IScenesApplication {
    constructor(private repository: IScenesRepository) {}

    public async getSceneText(sceneId: string): Promise<string | undefined> {
        const scene = await this.repository.getSceneById(sceneId);
        return scene?.sceneText;
    }

    public async getTextSelection(
        sceneId: string,
        from: number,
        to: number
    ): Promise<string | undefined> {
        const scene = await this.repository.getSceneById(sceneId);
        return scene?.sceneText.slice(from, to).replaceAll('*', '');
    }

    public async getSceneName(sceneId: string): Promise<string | undefined> {
        const scene = await this.repository.getSceneById(sceneId);
        if (!scene) {
            return undefined;
        }

        const chapterName = this.getChapterName(scene.chapterNumber);
        const sceneName =
            scene.sceneType === SceneType.Excerpt ? 'Excerpt' : `Scene ${scene.sceneNumber}`;
        return `${chapterName} — ${sceneName}`;
    }

    public async getContents(bookCode: string = 'gotm'): Promise<Contents> {
        const scenes = await this.repository.getScenes(bookCode);
        const chapterNumbers = [...new Set(scenes.map((s) => s.chapterNumber))];
        const chapters: ChapterContents[] = chapterNumbers.map((chapterNumber) => {
            const scenesInChapter = scenes.filter((s) => s.chapterNumber === chapterNumber);

            return {
                name: this.getChapterName(chapterNumber),
                scenes: scenesInChapter.map((s, i) => ({
                    id: s.id,
                    name: i === 0 ? 'Excerpt' : `Scene ${i}`,
                })),
            };
        });

        return {
            title: 'Contents',
            chapters,
        };
    }

    public async getAdjacentSceneIds(sceneId: string): Promise<[string?, string?]> {
        const gotm = await this.repository.getScenes('gotm');
        const dg = await this.repository.getScenes('dg');
        const gotmIndex = gotm.findIndex((scene) => scene.id === sceneId);
        const dgIndex = dg.findIndex((scene) => scene.id === sceneId);

        if (gotmIndex === -1 && dgIndex === -1) {
            return [undefined, undefined];
        }

        let previousSceneId: string | undefined;
        let nextSceneId: string | undefined;
        if (gotmIndex !== -1) {
            previousSceneId = gotm[gotmIndex - 1]?.id;
            nextSceneId = gotm[gotmIndex + 1]?.id;
        } else {
            previousSceneId = dg[dgIndex - 1]?.id;
            nextSceneId = dg[dgIndex + 1]?.id;
        }

        return [previousSceneId, nextSceneId];
    }

    private getChapterName(chapterNumber: number): string {
        switch (chapterNumber) {
            case 0:
                return 'Prologue';
            case 1000:
                return 'Epilogue';
            default:
                return `Chapter ${chapterNumber}`;
        }
    }
}
