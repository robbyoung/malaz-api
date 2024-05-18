import { highlightForms } from '../forms/forms';
import { Submission } from '../repository/submissions';

export interface Chunk {
    text: string;
    selectFrom: number;
    class: string;
    annotationId?: string;
}

export abstract class ChunkService {
    public static getChunks(text: string, annotations: Submission[]): Chunk[] {
        const chunks: Chunk[] = [];
        const indices = [
            0,
            ...new Set(
                annotations
                    .map((a) => [a.from, a.to])
                    .flat()
                    .sort((a, b) => a - b)
            ),
            text.length,
        ];

        for (let i = 0; i < indices.length - 1; i++) {
            const currentIndex = indices[i];
            const nextIndex = indices[i + 1];
            const annotationsBetweenIndices = annotations.filter(
                (a) => a.to > currentIndex && a.from < nextIndex
            );
            chunks.push(this.createChunk(text, currentIndex, nextIndex, annotationsBetweenIndices));
        }

        return chunks;
    }

    private static createChunk(
        text: string,
        fromIndex: number,
        toIndex: number,
        annotations: Submission[]
    ): Chunk {
        if (annotations.length === 0) {
            return { text: text.substring(fromIndex, toIndex), class: '', selectFrom: fromIndex };
        }

        const formOrder = annotations.sort(
            (a, b) =>
                highlightForms.findIndex((f) => a.formId === f.id) -
                highlightForms.findIndex((f) => b.formId === f.id)
        );
        const annotation = formOrder[0];
        return {
            text: text.substring(fromIndex, toIndex),
            class: `annotation annotation-${annotation.formId}`,
            selectFrom: fromIndex,
            annotationId: annotation.id,
        };
    }
}
