import { getSubmissionsForScene, saveSubmission } from '../repository/submissions';
import { renderFile } from 'pug';
import { saveSceneAttributes } from '../repository/sceneAttributes';
import { allForms } from '../forms/forms';
import { TextService } from '../text/textService';
import { Chunk, ChunkService } from '../text/chunkService';

interface TemplateProps {
    chunks: Chunk[];
    sceneId: string;
}

export async function postSubmission(rawFormData: any): Promise<string> {
    let sceneId: string;

    try {
        sceneId = await processSubmission(rawFormData);
    } catch (e) {
        if (e instanceof Error) {
            return renderFile('./components/error.pug', { message: e.message });
        }

        throw e;
    }

    const text = new TextService().getSceneText(sceneId);
    if (!text) {
        return renderFile('./components/error.pug', { message: 'Failed to update text' });
    }

    const annotations = await getSubmissionsForScene(sceneId);
    const chunks = ChunkService.getChunks(text, annotations);

    const props: TemplateProps = {
        sceneId,
        chunks,
    };

    return renderFile('./endpoints/submission.pug', props);
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

    return sceneId;
}
