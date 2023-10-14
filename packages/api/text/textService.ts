import { Chapter, ChapterType } from "../types/chapter";
import { Contents } from "../types/contents";
const chapters: Chapter[] = require('../../parser/output/gotm.json');

export class TextService {
    public getSceneText(chapterNumber: number, sceneNumber: number): string | undefined {
        const chapter = chapters.find(c => c.chapterNumber === chapterNumber);
        if (!chapter) {
            return undefined;
        }

        return this.fromBase64(chapter.scenesText[sceneNumber - 1]);
    }

    public getContents(): Contents {
        return {
            title: "Gardens of the Moon",
            chapters: chapters.map(chapter => {                
                return {
                    name: this.getChapterName(chapter),
                    scenes: chapter.scenesText.map((_, index) => ({
                        id: this.toSceneId(chapter, index + 1),
                        name: `Scene ${index + 1}`
                    })),
                };
            })
        }
    }

    private getChapterName(chapter: Chapter): string {
        switch (chapter.type) {
            case ChapterType.Prologue:
                return "Prologue";
            case ChapterType.Epilogue: 
                return "Epilogue";
            default:
                return `Chapter ${chapter.chapterNumber}`;
        }
    }

    private fromBase64(text: string) {
        return decodeURIComponent(atob(text));
    }

    private toSceneId(chapter: Chapter, sceneNumber: number) {
        switch (chapter.type) {
            case ChapterType.Prologue:
                return `p_${sceneNumber}`;
            case ChapterType.Epilogue: 
                return `e_${sceneNumber}`;
            default:
                return `${chapter.chapterNumber}_${sceneNumber}`;
        }
    }

    private parseSceneId(sceneId: string) {
        // todo prologue & epilogue
        const splitId = sceneId.split("_");
        const chapter = parseInt(splitId[0]);
        const scene = parseInt(splitId[1]);

        return { chapter, scene }
    }
}