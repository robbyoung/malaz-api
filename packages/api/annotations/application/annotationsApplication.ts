import { IAnnotationsApplication, IAnnotationsRepository } from '..';
import { IFormsApplication } from '../../forms';
import { FormFieldType, SceneAttributes, Annotation } from '../../types';

export class AnnotationsApplication implements IAnnotationsApplication {
    constructor(
        private repository: IAnnotationsRepository,
        private forms: IFormsApplication
    ) {}

    // TODO this shouldn't need to return scene id
    async processAnnotation(rawFormData: any): Promise<string> {
        const annotationForms = await this.forms.getAnnotationForms();
        const sceneForms = await this.forms.getSceneForms();
        const allForms = [...annotationForms, ...sceneForms];
        const params = new URLSearchParams(rawFormData);
        const formId = params.get('formId');
        const sceneId = params.get('sceneId');
        const from = parseInt(params.get('from') ?? '-1');
        const to = parseInt(params.get('to') ?? '-1');
        const fields = allForms.find((f) => f.id === formId)?.fields;

        if (formId === null || fields === undefined) {
            throw new Error('bad annotation: formId missing or invalid');
        } else if (sceneId === null) {
            throw new Error('bad annotation: sceneId missing or invalid');
        }

        if (from === -1 && to === -1) {
            const kvps = Array.from(params.entries())
                .filter((entry) => entry[0] !== 'sceneId' && entry[0] !== 'formId')
                .map((entry) => ({ key: entry[0], value: entry[1] }));
            await this.repository.saveAnnotation(formId, sceneId, kvps);
            return sceneId;
        }

        if (from < 0) {
            throw new Error('bad annotation: from missing or invalid');
        } else if (to < 0) {
            throw new Error('bad annotation: to missing or invalid');
        }

        const kvps = fields.map((field) => {
            let value = params.get(field.name);

            if (!value && field.required) {
                throw new Error(`bad annotation: '${field.name}' is a required field`);
            }

            if (field.type === FormFieldType.Boolean) {
                value = `${value === 'on'}`;
            }

            return {
                key: field.name,
                value: value ?? '',
            };
        });

        await this.repository.saveAnnotation(formId, sceneId, kvps, from, to);

        return sceneId;
    }

    async getAnnotationsForScene(sceneId: string): Promise<Annotation[]> {
        const annotations = await this.repository.getAnnotationsForScene(sceneId);
        return annotations.filter((a) => a.from !== -1 && a.to !== -1);
    }

    getAnnotation(id: string): Promise<Annotation | undefined> {
        return this.repository.getAnnotation(id);
    }

    async deleteAnnotation(id: string): Promise<void> {
        await this.repository.deleteAnnotation(id);
    }

    async getSceneAttributes(sceneId: string): Promise<SceneAttributes> {
        const annotations = await this.repository.getAnnotationsForScene(sceneId);
        return annotations
            .filter((a) => a.from === -1 && a.to === -1)
            .map((a) => a.fields)
            .flat();
    }

    async getCharactersInScene(sceneId: string): Promise<string[]> {
        const occurrenceFormId = 'hf2';
        const mentionFormId = 'hf3';

        const annotations = await this.getAnnotationsForScene(sceneId);
        const occurrences = annotations
            .filter((a) => a.formId === occurrenceFormId)
            .map((a) => a.fields[0].value);
        const mentions = annotations
            .filter((a) => a.formId === mentionFormId)
            .map((a) => a.fields[0].value);

        return [...occurrences, ...mentions];
    }

    async searchCharacters(searchTerm: string): Promise<string[]> {
        const occurrenceFormId = 'hf2';
        const mentionFormId = 'hf3';
        const fieldName = 'Character Name';

        const occurrenceMatches = await this.repository.searchAnnotations(
            occurrenceFormId,
            fieldName,
            searchTerm
        );

        const mentionMatches = await this.repository.searchAnnotations(
            mentionFormId,
            fieldName,
            searchTerm
        );

        return [...new Set([...occurrenceMatches, ...mentionMatches])];
    }
}
