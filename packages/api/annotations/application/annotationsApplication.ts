import { IAnnotationsApplication, IAnnotationsRepository } from '..';
import { IFormsApplication } from '../../forms';
import { IScenesApplication } from '../../scenes';
import { FormFieldType, SceneAttributes, Annotation, Range } from '../../types';
import { KeyValuePairs } from '../../util/dictionaries';

export class AnnotationsApplication implements IAnnotationsApplication {
    constructor(
        private repository: IAnnotationsRepository,
        private forms: IFormsApplication,
        private scenes: IScenesApplication
    ) {}

    async processAnnotation(
        formId: string,
        sceneId: string,
        kvps: KeyValuePairs,
        range?: Range
    ): Promise<void> {
        const annotationForms = await this.forms.getAnnotationForms();
        const sceneForms = await this.forms.getSceneForms();
        const allForms = [...annotationForms, ...sceneForms];
        const dialogueFormId = 'hf1';

        const fields = allForms.find((f) => f.id === formId)?.fields;

        if (fields === undefined) {
            throw new Error('bad annotation: formId invalid');
        }

        const sanitisedKvps = fields.map((field) => {
            let value = kvps.find((kvp) => kvp.key === field.name)?.value;

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

        const bookId = sceneId.substring(0, 3);

        if (range === undefined) {
            await this.repository.saveAnnotation(formId, sceneId, bookId, sanitisedKvps);
        } else if (formId !== dialogueFormId) {
            await this.repository.saveAnnotation(
                formId,
                sceneId,
                bookId,
                sanitisedKvps,
                range.from,
                range.to
            );
        }
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
        const fieldName = 'Character name';

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
