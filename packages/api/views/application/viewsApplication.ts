import { renderFile } from 'pug';
import { IViewsApplication } from '..';
import { Chunk, Contents, Form, SceneAttributes } from '../../types';
import { KeyValuePairs } from '../../util/dictionaries';

export class ViewsApplication implements IViewsApplication {
    renderSceneText(
        chunks: Chunk[],
        title: string,
        nextSceneId?: string | undefined,
        previousSceneId?: string | undefined
    ): string {
        return renderFile('./templates/sceneText.pug', {
            chunks,
            title,
            nextSceneId,
            previousSceneId,
        });
    }

    renderAnnotation(title: string, fields: KeyValuePairs, annotationId: string): string {
        return renderFile('./templates/annotation.pug', { title, fields, annotationId });
    }

    renderTableOfContents(contents: Contents): string {
        return renderFile('./templates/contents.pug', { contents });
    }

    renderSceneTextUpdateWithMessage(sceneId: string, chunks: Chunk, message: string): string {
        return renderFile('./templates/submission.pug', { sceneId, chunks, message });
    }

    renderAnnotationForm(
        form: Form,
        sceneId: string,
        text: string,
        charactersInScene: string[],
        from?: number | undefined,
        to?: number | undefined
    ): string {
        return renderFile('./templates/form.pug', {
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
        return renderFile('./templates/selectionText.pug', { sceneId, attributes, availableForms });
    }

    renderSelectionForms(
        sceneId: string,
        range: string,
        selection: string,
        availableForms: Form[]
    ): string {
        return renderFile('./templates/selectionScene.pug', {
            sceneId,
            range,
            selection,
            availableForms,
        });
    }
}
