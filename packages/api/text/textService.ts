import { Chapter, ChapterType } from "../types/chapter";
import { Contents } from "../types/contents";

const gotm: Chapter[] = require('../../parser/output/gotm.json');
const dg: Chapter[] = require('../../parser/output/dg.json');

const booksByCode: { [bookCode: string]: Chapter[]; } = {
    "gotm": gotm,
    "dg": dg
 };

export class TextService {
    public getSceneText(sceneId: string): string | undefined {
        const {chapters, chapterCode, sceneNumber} = this.fromSceneId(sceneId);

        let chapter: Chapter | undefined;
        switch(chapterCode) {
            case "p":
                chapter = chapters.find(c => c.type === ChapterType.Prologue);
                break;
            case "e":
                chapter = chapters.find(c => c.type === ChapterType.Epilogue);
                break;
            default:
                const chapterNumber = parseInt(chapterCode);
                chapter = chapters.find(c => c.chapterNumber === chapterNumber);
                break;
        }

        if (!chapter) {
            return undefined;
        }

        return this.fromBase64(chapter.scenesText[sceneNumber - 1]);
    }

    public getContents(bookCode: string = "gotm"): Contents {
        const chapters = booksByCode[bookCode];

        return {
            title: "Contents",
            chapters: chapters.map(chapter => {                
                return {
                    name: this.getChapterName(chapter),
                    scenes: chapter.scenesText.map((_, index) => ({
                        id: this.toSceneId(bookCode, chapter, index + 1),
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

    private toSceneId(bookCode: string, chapter: Chapter, sceneNumber: number) {
        switch (chapter.type) {
            case ChapterType.Prologue:
                return `${bookCode}_p_${sceneNumber}`;
            case ChapterType.Epilogue: 
                return `${bookCode}_e_${sceneNumber}`;
            default:
                return `${bookCode}_${chapter.chapterNumber}_${sceneNumber}`;
        }
    }

    private fromSceneId(sceneId: string) {
        const splitId = sceneId.split("_");

        const bookCode = splitId[0];
        const chapters = booksByCode[bookCode];

        if (!chapters) {
            throw (`Invalid book code ${bookCode}`);
        }
        
        return {
            chapters,
            chapterCode: splitId[1],
            sceneNumber: parseInt(splitId[2]),
        }
    }
}