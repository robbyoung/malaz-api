import { Scene } from "../types/scene";
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

    public getContents(bookCode: string = "gotm"): Contents {
        const scenes = booksByCode[bookCode];
        const chapterNumbers = [...new Set(scenes.map(s => s.chapterNumber))];
        const chapters: ChapterContents[] = chapterNumbers.map(chapterNumber => {
            const scenesInChapter = scenes.filter(s => s.chapterNumber === chapterNumber);

            return {
                name: this.getChapterName(chapterNumber),
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

    private getChapterName(chapterNumber: number): string {
        switch (chapterNumber) {
            case 0:
                return "P";
            case 1000: 
                return "E";
            default:
                return `${chapterNumber}`;
        }
    }

    private fromBase64(text: string) {
        return decodeURIComponent(atob(text));
    }
}