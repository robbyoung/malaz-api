import { Scene, SceneType } from "../types/scene";
import { ChapterContents, Contents } from "../types/contents";

const gotm: Scene[] = require('../../parser/output/gotm.json');
const dg: Scene[] = require('../../parser/output/dg.json');

const booksByCode: { [bookCode: string]: Scene[]; } = {
    "gotm": gotm,
    "dg": dg
 };

export class TextService {
    public getSceneText(sceneId: string): string | undefined {
        let matchingScene = gotm.find(scene => scene.id === sceneId);
        if (!matchingScene) {
            matchingScene = dg.find(scene => scene.id === sceneId);
        }


        if (!matchingScene) {
            return undefined;
        }

        return this.fromBase64(matchingScene.sceneText);
    }

    public getSceneName(sceneId: string): string | undefined {
        let matchingScene = gotm.find(scene => scene.id === sceneId);
        if (!matchingScene) {
            matchingScene = dg.find(scene => scene.id === sceneId);
        }


        if (!matchingScene) {
            return undefined;
        }

        const chapterName = this.getChapterName(matchingScene.chapterNumber, false);
        const sceneName = matchingScene.sceneType === SceneType.Excerpt ? "Excerpt" : `Scene ${matchingScene.sceneNumber}`;
        return `${chapterName} — ${sceneName}`
    }


    public getContents(bookCode: string = "gotm"): Contents {
        const scenes = booksByCode[bookCode];
        const chapterNumbers = [...new Set(scenes.map(s => s.chapterNumber))];
        const chapters: ChapterContents[] = chapterNumbers.map(chapterNumber => {
            const scenesInChapter = scenes.filter(s => s.chapterNumber === chapterNumber);

            return {
                name: this.getChapterName(chapterNumber, true),
                scenes: scenesInChapter.map((s, i) => ({
                    id: s.id,
                    name: i === 0 ? 'Excerpt' : `Scene ${i}`
                }))
            };
        });

        return {
            title: "Contents",
            chapters,
        }
    }

    public getAdjacentSceneIds(sceneId: string): [string?, string?] {
        const gotmIndex = gotm.findIndex(scene => scene.id === sceneId);
        const dgIndex = dg.findIndex(scene => scene.id === sceneId);

        if (gotmIndex === -1 && dgIndex === -1) {
            return [undefined, undefined];
        }

        let previousScene: Scene | undefined;
        let nextScene: Scene | undefined;
        if (gotmIndex !== -1) {
            previousScene = gotm[gotmIndex-1];
            nextScene = gotm[gotmIndex+1];
        } else {
            previousScene = dg[dgIndex-1];
            nextScene = dg[dgIndex+1];
        }

        return [
            previousScene === undefined ? undefined : previousScene.id,
            nextScene === undefined ? undefined : nextScene.id
        ];
    }

    private getChapterName(chapterNumber: number, abbreviate: boolean): string {
        switch (chapterNumber) {
            case 0:
                return abbreviate ? "P" : "Prologue";
            case 1000: 
                return abbreviate ? "E" : "Epilogue";
            default:
                return abbreviate ? `${chapterNumber}` : `Chapter ${chapterNumber}`;
        }
    }

    private fromBase64(text: string) {
        return decodeURIComponent(atob(text));
    }
}