import { saveSubmission } from '../repository/submissions';
import { renderFile } from 'pug';
import { saveSceneAttributes } from '../repository/sceneAttributes';
import { allForms } from '../forms/forms';

export async function postSubmission(rawFormData: any): Promise<string> {
    try {
        await processSubmission(rawFormData);
    } catch (e) {
        if (e instanceof Error) {
            return renderFile('./components/error.pug', { message: e.message });
        }

        throw e;
    }

    return renderFile('./endpoints/submission.pug');
}

async function processSubmission(rawFormData: any) {
    const params = new URLSearchParams(rawFormData);
    const formId = params.get('formId');
    const sceneId = params.get('sceneId');
    const from = parseInt(params.get('from') ?? '-1');
    const to = parseInt(params.get('to') ?? '-1');
    const fields = allForms.find((f) => f.id === formId)?.fields;

    if (formId === null || fields === undefined) {
        throw new Error('bad submission: formId missing or invalid');
    } else if (sceneId === null) {
        throw new Error('bad submission: sceneId missing or invalid');
    }

    if (from === -1 && to === -1) {
        const kvps = Array.from(params.entries())
            .filter((entry) => entry[0] !== 'sceneId' && entry[0] !== 'formId')
            .map((entry) => ({ key: entry[0], value: entry[1] }));
        await saveSceneAttributes(sceneId, kvps);
        return renderFile('./endpoints/submission.pug');
    }

    if (from < 0) {
        throw new Error('bad submission: from missing or invalid');
    } else if (to < 0) {
        throw new Error('bad submission: to missing or invalid');
    }

    const kvps = fields.map((field) => {
        const value = params.get(field.name);

        if (!value && field.required) {
            throw new Error(`bad submission: '${field.name}' is a required field`);
        }

        return {
            key: field.name,
            value: params.get(field.name) ?? '',
        };
    });

    await saveSubmission(formId, sceneId, from, to, kvps);
}
