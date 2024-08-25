import { IScenesApplication, IScenesRepository } from '..';
import { IAnnotationsApplication } from '../../annotations';
import { IFormsApplication } from '../../forms';
import {
    SceneType,
    Contents,
    ChapterContents,
    Annotation,
    Chunk,
    Form,
    Book,
    Range,
} from '../../types';

export class ScenesApplication implements IScenesApplication {
    constructor(
        private repository: IScenesRepository,
        private forms: IFormsApplication
    ) {}

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

    public async getContents(bookCode: string): Promise<Contents> {
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

        const title = (await this.getBooks()).find((b) => b.id === bookCode)?.name ?? 'Unknown';

        return {
            title,
            chapters,
        };
    }

    public async getAdjacentSceneIds(sceneId: string): Promise<[string?, string?]> {
        const gtm = await this.repository.getScenes('GTM');
        const dhg = await this.repository.getScenes('DHG');
        const gtmIndex = gtm.findIndex((scene) => scene.id === sceneId);
        const dhgIndex = dhg.findIndex((scene) => scene.id === sceneId);

        if (gtmIndex === -1 && dhgIndex === -1) {
            return [undefined, undefined];
        }

        let previousSceneId: string | undefined;
        let nextSceneId: string | undefined;
        if (gtmIndex !== -1) {
            previousSceneId = gtm[gtmIndex - 1]?.id;
            nextSceneId = gtm[gtmIndex + 1]?.id;
        } else {
            previousSceneId = dhg[dhgIndex - 1]?.id;
            nextSceneId = dhg[dhgIndex + 1]?.id;
        }

        return [previousSceneId, nextSceneId];
    }

    public async getChunks(sceneId: string, annotations: Annotation[]): Promise<Chunk[]> {
        const annotationForms = await this.forms.getAnnotationForms();

        const nonBreakingSpace = String.fromCharCode(8203);
        let text = await this.getSceneText(sceneId);
        if (!text) {
            return [];
        }

        const chunks: Chunk[] = [];
        const italicsIndices = this.getItalicsIndices(text);
        const indices = [
            0,
            ...new Set(
                annotations
                    .map((a) => [a.from, a.to])
                    .concat(italicsIndices)
                    .flat()
                    .sort((a, b) => a - b)
            ),
            text.length,
        ];

        text = text.replaceAll('*', nonBreakingSpace);

        for (let i = 0; i < indices.length - 1; i++) {
            const currentIndex = indices[i];
            const nextIndex = indices[i + 1];
            const annotationsBetweenIndices = annotations.filter(
                (a) => a.to > currentIndex && a.from < nextIndex
            );

            const italicsIndex = italicsIndices.findLastIndex((i) => i <= currentIndex);

            chunks.push(
                this.createChunk(
                    text,
                    currentIndex,
                    nextIndex,
                    annotationsBetweenIndices,
                    italicsIndex % 2 == 0,
                    annotationForms
                )
            );
        }

        return chunks;
    }

    getBooks(): Promise<Book[]> {
        return Promise.resolve([
            { id: 'GTM', name: 'Gardens of the Moon' },
            { id: 'DHG', name: 'Deadhouse Gates' },
        ]);
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

    private getItalicsIndices(text: string): number[] {
        let i = -1;
        const indices: number[] = [];

        while (true) {
            i = text.indexOf('*', i + 1);
            if (i === -1) {
                break;
            }

            indices.push(i);
        }

        return indices;
    }

    private createChunk(
        text: string,
        fromIndex: number,
        toIndex: number,
        annotations: Annotation[],
        useItalics: boolean,
        highlightForms: Form[]
    ): Chunk {
        const baseClass = useItalics ? 'italics' : '';

        if (annotations.length === 0) {
            return {
                text: text.substring(fromIndex, toIndex),
                class: baseClass,
                selectFrom: fromIndex,
            };
        }

        const formOrder = annotations.sort(
            (a, b) =>
                highlightForms.findIndex((f) => a.formId === f.id) -
                highlightForms.findIndex((f) => b.formId === f.id)
        );
        const annotation = formOrder[0];
        return {
            text: text.substring(fromIndex, toIndex),
            class: `annotation annotation-${annotation.formId} ${baseClass}`,
            selectFrom: fromIndex,
            annotationId: annotation.id,
        };
    }

    public async stripDialogue(sceneId: string, from: number, to: number): Promise<Range[]> {
        const text = await this.getTextSelection(sceneId, from, to);

        if (!text) {
            return [];
        }

        // single quotes preceded by a space and ending with some kind of terminating character
        const regex = /[ ]'(.+?(?=[.,?!-]')[.,?!-])'/g;

        const matches = text.matchAll(regex);
        const dialogueRanges: Range[] = [];

        for (let match of matches) {
            const dialogueText = match[1];
            if (dialogueText) {
                const fromIndex = text.indexOf(dialogueText) + from;
                const toIndex = fromIndex + dialogueText.length;

                dialogueRanges.push({ from: fromIndex, to: toIndex });
            }
        }

        if (dialogueRanges.length === 0) {
            dialogueRanges.push({ from, to });
        }

        return dialogueRanges;
    }
}
