import { AnnotationForm } from '../forms/forms';
import { SceneAttributes } from '../repository/sceneAttributes';
import { Chunk, Contents } from '../types';
import { KeyValuePairs } from '../util/dictionaries';

export interface IViewsApplication {
    renderSceneText(
        chunks: Chunk[],
        title: string,
        nextSceneId?: string,
        previousSceneId?: string
    ): string;
    renderAnnotation(title: string, fields: KeyValuePairs, annotationId: string): string;
    renderTableOfContents(contents: Contents): string;
    renderSceneTextUpdateWithMessage(sceneId: string, chunks: Chunk, message: string): string;
    renderAnnotationForm(
        form: AnnotationForm,
        sceneId: string,
        text: string,
        charactersInScene: string[],
        from?: number,
        to?: number
    ): string;
    renderSceneAttributeForms(
        sceneId: string,
        attributes: SceneAttributes,
        availableForms: AnnotationForm[]
    ): string;
    renderSelectionForms(
        sceneId: string,
        range: string,
        selection: string,
        availableForms: AnnotationForm[]
    ): string;
}

export { ViewsApplication } from './application/viewsApplication';
