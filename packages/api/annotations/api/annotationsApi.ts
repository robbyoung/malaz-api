import { renderFile } from 'pug';
import { IAnnotationsApplication } from '..';
import { IFormsApplication } from '../../forms';
import { IScenesApplication } from '../../scenes';
import { Dictionary } from '../../util/dictionaries';

const TEMPLATES_PATH = './templates';

export class AnnotationsApi {
    constructor(
        private annotations: IAnnotationsApplication,
        private scenes: IScenesApplication,
        private forms: IFormsApplication
    ) {}

    async get(annotationId?: string): Promise<string | undefined> {
        if (!annotationId) {
            throw new Error('invalid annotationId');
        }

        const annotation = await this.annotations.getAnnotation(annotationId);
        if (!annotation) {
            return undefined;
        }

        const matchingForm = await this.forms.getFormById(annotation.formId);
        const title = matchingForm?.name ?? 'Unknown';

        return renderFile(`${TEMPLATES_PATH}/annotation.pug`, {
            title,
            fields: annotation.fields,
            annotationId,
        });
    }

    async post(rawFormData: any) {
        const params = new URLSearchParams(rawFormData);
        const formId = params.get('formId');
        const sceneId = params.get('sceneId');
        const from = parseInt(params.get('from') ?? '-1');
        const to = parseInt(params.get('to') ?? '-1');

        if (formId === null) {
            throw new Error('bad annotation: formId missing');
        }

        if (sceneId === null) {
            throw new Error('bad annotation: sceneId missing');
        }

        if ((from === -1 && to !== -1) || (from !== -1 && to === -1)) {
            throw new Error('bad annotation: from/to invalid');
        }

        const excludedFields = ['sceneId', 'formId', 'from', 'to'];
        const kvps = Array.from(params.entries())
            .filter((entry) => excludedFields.indexOf(entry[0]) === -1)
            .map((entry) => ({ key: entry[0], value: entry[1] }));

        try {
            await this.annotations.processAnnotation(formId, sceneId, kvps, { from, to });
        } catch (e) {
            if (e instanceof Error) {
                return renderFile(`${TEMPLATES_PATH}/error.pug`, { message: e.message });
            }

            throw e;
        }

        const text = await this.scenes.getSceneText(sceneId);
        if (!text) {
            return renderFile(`${TEMPLATES_PATH}/error.pug`, { message: 'Failed to update text' });
        }

        const chunks = await this.scenes.getChunks(sceneId);

        return renderFile(`${TEMPLATES_PATH}/updateWithMessage.pug`, {
            sceneId,
            chunks,
            message: 'Annotation saved',
        });
    }

    async delete(annotationId: string) {
        if (!annotationId) {
            throw new Error('invalid annotationId');
        }

        const annotation = await this.annotations.getAnnotation(annotationId);
        if (!annotation) {
            return renderFile(`${TEMPLATES_PATH}/error.pug`, {
                message: 'Failed to delete annotation',
            });
        }

        const sceneId = annotation.sceneId;

        await this.annotations.deleteAnnotation(annotationId);

        const text = await this.scenes.getSceneText(sceneId);
        if (!text) {
            throw new Error('Failed to update text with deleted annotation');
        }

        const chunks = await this.scenes.getChunks(sceneId);

        return renderFile(`${TEMPLATES_PATH}/updateWithMessage.pug`, {
            sceneId,
            chunks,
            message: 'Annotation deleted',
        });
    }

    async getSearchResults(query: Dictionary) {
        let results: string[] = [];

        if (query['Character name']) {
            results = await this.annotations.searchCharacters(query['Character name']);
        }

        return renderFile(`${TEMPLATES_PATH}/searchResults.pug`, { results });
    }
}
