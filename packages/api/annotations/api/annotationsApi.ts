import { renderFile } from 'pug';
import { IAnnotationsApplication } from '..';
import { IScenesApplication } from '../../scenes';
import { Dictionary } from '../../util/dictionaries';
import { parseOptionalRange, parseRange } from '../../util/range';

const TEMPLATES_PATH = './templates';

export class AnnotationsApi {
    constructor(private annotations: IAnnotationsApplication) {}

    async get(annotationId?: string): Promise<string | undefined> {
        if (!annotationId) {
            throw new Error('invalid annotationId');
        }

        const annotation = await this.annotations.getAnnotation(annotationId);
        if (!annotation) {
            return undefined;
        }

        const matchingForm = await this.annotations.getFormById(annotation.formId);
        const title = matchingForm?.name ?? 'Unknown';

        return renderFile(`${TEMPLATES_PATH}/annotation.pug`, {
            title,
            fields: annotation.fields,
            annotationId,
        });
    }

    async post(rawFormData: any, sessionId: string) {
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
            await this.annotations.processAnnotation(formId, sceneId, kvps, sessionId, {
                from,
                to,
            });
        } catch (e) {
            if (e instanceof Error) {
                return renderFile(`${TEMPLATES_PATH}/components/error.pug`, { message: e.message });
            }

            throw e;
        }

        return renderFile(`${TEMPLATES_PATH}/resultMessage.pug`, {
            message: 'Annotation saved',
        });
    }

    async repost(rawFormData: any, sessionId: string) {
        const params = new URLSearchParams(rawFormData);
        const sceneId = params.get('sceneId');
        const parsedRange = parseRange(params.get('range') || '');

        if (!sceneId) {
            throw new Error('bad annotation: sceneId missing');
        }

        try {
            await this.annotations.repeatAnnotation(sceneId, parsedRange, sessionId);
        } catch (e) {
            if (e instanceof Error) {
                return renderFile(`${TEMPLATES_PATH}/components/error.pug`, { message: e.message });
            }

            throw e;
        }

        return renderFile(`${TEMPLATES_PATH}/resultMessage.pug`, {
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

        await this.annotations.deleteAnnotation(annotationId);

        return renderFile(`${TEMPLATES_PATH}/resultMessage.pug`, {
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

    async getForm(formId?: string, sceneId?: string, range?: string): Promise<string | undefined> {
        const { to, from } = parseOptionalRange(range);

        if (!formId || !sceneId) {
            throw new Error('invalid parameters');
        }

        const form = await this.annotations.getFormById(formId);

        if (!form) {
            return undefined;
        }

        const charactersInScene = await this.annotations.getCharactersInScene(sceneId);

        return renderFile(`${TEMPLATES_PATH}/form.pug`, {
            form,
            sceneId,
            charactersInScene,
            from,
            to,
        });
    }

    async getSceneForms(sceneId?: string) {
        if (!sceneId) {
            throw new Error(`invalid scene id '${sceneId}'`);
        }

        const availableForms = await this.annotations.getSceneForms();
        const existingAttributes = await this.annotations.getSceneAttributes(sceneId);
        return renderFile(`${TEMPLATES_PATH}/selectionScene.pug`, {
            sceneId,
            attributes: existingAttributes,
            availableForms,
        });
    }

    async getSelectionForms(sessionId: string, sceneId?: string, range?: string) {
        if (!sceneId) {
            throw new Error(`invalid scene id '${sceneId}'`);
        }

        const { from, to } = parseRange(range);
        if (from === to) {
            return 'No content';
        }

        const availableForms = await this.annotations.getAnnotationForms();
        const lastForm = await this.annotations.getLastForm(sessionId);
        return renderFile(`${TEMPLATES_PATH}/selectionText.pug`, {
            sceneId,
            range,
            selection: true,
            availableForms,
            lastForm,
        });
    }
}
