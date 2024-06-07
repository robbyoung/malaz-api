import { Chunk, Contents, Form, SceneAttributes } from '../types';
import { KeyValuePairs } from '../util/dictionaries';

export interface IViewsApplication {
    renderSceneText(
        chunks: Chunk[],
        title: string,
        sceneId: string,
        nextSceneId?: string,
        previousSceneId?: string
    ): string;
    renderAnnotation(title: string, fields: KeyValuePairs, annotationId: string): string;
    renderTableOfContents(contents: Contents): string;
    renderSceneTextUpdateWithMessage(sceneId: string, chunks: Chunk[], message: string): string;
    renderAnnotationForm(
        form: Form,
        sceneId: string,
        charactersInScene: string[],
        text?: string,
        from?: number,
        to?: number
    ): string;
    renderSceneAttributeForms(
        sceneId: string,
        attributes: SceneAttributes,
        availableForms: Form[]
    ): string;
    renderSelectionForms(
        sceneId: string,
        range: string,
        selection: string,
        availableForms: Form[]
    ): string;
    renderErrorMessage(message: string): string;
}

export { ViewsApplication } from './application/viewsApplication';
