import { highlightForms } from '../forms/forms';
import { Submission } from '../repository/submissions';

const nonBreakingSpace = String.fromCharCode(8203);

export interface Chunk {
    text: string;
    selectFrom: number;
    class: string;
    annotationId?: string;
}

export abstract class ChunkService {
    public static getChunks(text: string, annotations: Submission[]): Chunk[] {
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
                    italicsIndex % 2 == 0
                )
            );
        }

        return chunks;
    }

    private static getItalicsIndices(text: string): number[] {
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

    private static createChunk(
        text: string,
        fromIndex: number,
        toIndex: number,
        annotations: Submission[],
        useItalics: boolean
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
}
