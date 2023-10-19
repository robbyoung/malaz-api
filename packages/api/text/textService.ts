import { Chapter, ChapterType } from "../types/chapter";
import { Contents } from "../types/contents";
const chapters: Chapter[] = require('../../parser/output/gotm.json');

export class TextService {
    public getSceneText(sceneId: string): string | undefined {
        const splitId = sceneId.split("_");
        const sceneNumber = parseInt(splitId[1]);

        let chapter: Chapter | undefined;
        switch(splitId[0]) {
            case "p":
                chapter = chapters.find(c => c.type === ChapterType.Prologue);
                break;
            case "e":
                chapter = chapters.find(c => c.type === ChapterType.Epilogue);
                break;
            default:
                chapter = chapters.find(c => c.chapterNumber === parseInt(splitId[0]));
                break;
        }

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
                return "P";
            case ChapterType.Epilogue: 
                return "E";
            default:
                return `${chapter.chapterNumber}`;
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
}