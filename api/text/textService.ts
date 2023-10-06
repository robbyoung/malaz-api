import { Chapter } from "../types/chapter";

const chapters: Chapter[] = require('../../parser/output/gotm.json');

export class TextService {
    public getSceneText(chapterNumber: number, sceneNumber: number): string | undefined {
        const chapter = chapters.find(c => c.chapterNumber === chapterNumber);
        if (!chapter) {
            return undefined;
        }

        return this.fromBase64(chapter.scenesText[sceneNumber - 1]);
    }

    public getContents() {
        return chapters.map(chapter => ({
            chapterNumber: chapter.chapterNumber,
            sceneCount: chapter.scenesText.length,
        }));
    }

    private fromBase64(text: string) {
        return decodeURIComponent(atob(text));
    }
}