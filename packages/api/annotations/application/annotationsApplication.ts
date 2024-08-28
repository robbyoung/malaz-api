import { IAnnotationsApplication, IAnnotationsRepository } from '..';
import { IScenesApplication } from '../../scenes';
import { FormFieldType, SceneAttributes, Annotation, Range, FormType, Form } from '../../types';
import { KeyValuePairs } from '../../util/dictionaries';

export class AnnotationsApplication implements IAnnotationsApplication {
    constructor(
        private repository: IAnnotationsRepository,
        private scenes: IScenesApplication
    ) {}

    async processAnnotation(
        formId: string,
        sceneId: string,
        kvps: KeyValuePairs,
        range?: Range
    ): Promise<void> {
        const annotationForms = await this.getAnnotationForms();
        const sceneForms = await this.getSceneForms();
        const allForms = [...annotationForms, ...sceneForms];

        const form = allForms.find((f) => f.id === formId);
        if (form === undefined) {
            throw new Error('bad annotation: formId invalid');
        }

        const formIndex = forms.indexOf(form);

        const sanitisedKvps = form.fields.map((field) => {
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
            await this.repository.saveAnnotation(formId, sceneId, bookId, sanitisedKvps, formIndex);
        } else if (formId === 'dialogue') {
            const dialogueRanges = await this.scenes.stripDialogue(sceneId, range.from, range.to);
            for (let dialogueRange of dialogueRanges) {
                await this.repository.saveAnnotation(
                    formId,
                    sceneId,
                    bookId,
                    sanitisedKvps,
                    dialogueRange.from,
                    dialogueRange.to
                );
            }
        } else {
            await this.repository.saveAnnotation(
                formId,
                sceneId,
                bookId,
                sanitisedKvps,
                formIndex,
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
        const occurrenceFormId = 'occurrence';
        const mentionFormId = 'mention';

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
        const occurrenceFormId = 'occurrence';
        const mentionFormId = 'mention';
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

    async getFormById(id: string): Promise<Form | undefined> {
        return forms.find((form) => form.id === id);
    }

    async getSceneForms(): Promise<Form[]> {
        return forms.filter((form) => form.type === FormType.Scene);
    }

    async getAnnotationForms(): Promise<Form[]> {
        return forms.filter((form) => form.type === FormType.Annotation);
    }
}

const forms: Form[] = [
    {
        id: 'occurrence',
        name: 'Occurrence',
        type: FormType.Annotation,
        fields: [
            {
                name: 'Character name',
                required: true,
                type: FormFieldType.Search,
            },
            {
                name: 'POV',
                required: false,
                type: FormFieldType.Boolean,
            },
        ],
    },
    {
        id: 'mention',
        name: 'Mention',
        type: FormType.Annotation,
        fields: [
            {
                name: 'Character name',
                required: true,
                type: FormFieldType.Search,
            },
        ],
    },
    {
        id: 'location',
        name: 'Location',
        type: FormType.Annotation,
        fields: [
            { name: 'Continent', required: false, type: FormFieldType.FreeText },
            { name: 'Region', required: false, type: FormFieldType.FreeText },
            { name: 'City', required: false, type: FormFieldType.FreeText },
            { name: 'Warren', required: false, type: FormFieldType.FreeText },
        ],
    },
    {
        id: 'chardescriptor',
        name: 'Character Descriptor',
        type: FormType.Annotation,
        fields: [{ name: 'Character name', required: true, type: FormFieldType.FreeText }],
    },
    {
        id: 'locdescriptor',
        name: 'Location Descriptor',
        type: FormType.Annotation,
        fields: [{ name: 'Location name', required: true, type: FormFieldType.FreeText }],
    },
    {
        id: 'charbackground',
        name: 'Character Background',
        type: FormType.Annotation,
        fields: [{ name: 'Character name', required: true, type: FormFieldType.CharacterInScene }],
    },
    {
        id: 'dialogue',
        name: 'Dialogue',
        type: FormType.Annotation,
        fields: [{ name: 'Character name', required: true, type: FormFieldType.CharacterInScene }],
    },
    {
        id: 'arc',
        name: 'Arc',
        type: FormType.Scene,
        fields: [
            { name: 'Arc', required: true, type: FormFieldType.FreeText },
            { name: 'Sub-Arc', required: false, type: FormFieldType.FreeText },
        ],
    },
];
