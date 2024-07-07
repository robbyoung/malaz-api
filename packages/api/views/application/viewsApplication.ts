import { renderFile } from 'pug';
import { IViewsApplication } from '..';
import { Book, Chunk, Contents, Form, SceneAttributes } from '../../types';
import { KeyValuePairs } from '../../util/dictionaries';

const TEMPLATES_PATH = './views/templates';

export class ViewsApplication implements IViewsApplication {
    renderSceneText(
        chunks: Chunk[],
        title: string,
        sceneId: string,
        nextSceneId?: string | undefined,
        previousSceneId?: string | undefined
    ): string {
        return renderFile(`${TEMPLATES_PATH}/sceneText.pug`, {
            chunks,
            title,
            sceneId,
            nextSceneId,
            previousSceneId,
        });
    }

    renderAnnotation(title: string, fields: KeyValuePairs, annotationId: string): string {
        return renderFile(`${TEMPLATES_PATH}/annotation.pug`, { title, fields, annotationId });
    }

    renderTableOfContents(contents: Contents, books: Book[]): string {
        return renderFile(`${TEMPLATES_PATH}/contents.pug`, { contents, books });
    }

    renderSceneTextUpdateWithMessage(sceneId: string, chunks: Chunk[], message: string): string {
        return renderFile(`${TEMPLATES_PATH}/updateWithMessage.pug`, { sceneId, chunks, message });
    }

    renderAnnotationForm(
        form: Form,
        sceneId: string,
        charactersInScene: string[],
        text?: string,
        from?: number | undefined,
        to?: number | undefined
    ): string {
        return renderFile(`${TEMPLATES_PATH}/form.pug`, {
            form,
            sceneId,
            text,
            charactersInScene,
            from,
            to,
        });
    }

    renderSceneAttributeForms(
        sceneId: string,
        attributes: SceneAttributes,
        availableForms: Form[]
    ): string {
        return renderFile(`${TEMPLATES_PATH}/selectionScene.pug`, {
            sceneId,
            attributes,
            availableForms,
        });
    }

    renderSelectionForms(
        sceneId: string,
        range: string,
        selection: string,
        availableForms: Form[]
    ): string {
        return renderFile(`${TEMPLATES_PATH}/selectionText.pug`, {
            sceneId,
            range,
            selection,
            availableForms,
        });
    }

    renderErrorMessage(message: string): string {
        return renderFile(`${TEMPLATES_PATH}/error.pug`, { message });
    }

    renderSearchResults(results: string[]): string {
        return renderFile(`${TEMPLATES_PATH}/searchResults.pug`, { results });
    }
}
