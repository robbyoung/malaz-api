import { Chapter } from "../types/chapter";

const chapters: Chapter[] = require('../../parser/output/gotm.json');

export class TextService {
    getSceneText(chapterNumber: number, sceneNumber: number): string | undefined {
        const chapter = chapters.find(c => c.chapterNumber === chapterNumber);
        if (!chapter) {
            return undefined;
        }

        return chapter.scenesText[sceneNumber - 1];
    }
}