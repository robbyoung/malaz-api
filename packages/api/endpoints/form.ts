import { AnnotationForm, allForms, sceneForms } from '../forms/forms';
import { renderFile } from 'pug';
import { TextService } from '../text/textService';
import { getSubmissionsForScene } from '../repository/submissions';

interface TemplateProps {
    form: AnnotationForm;
    sceneId: string;
    text: string;
    charactersInScene: string[];
    from?: number;
    to?: number;
}

interface Params {
    formId?: string;
    sceneId?: string;
    range?: string;
}

export async function getForm(params: Params): Promise<string | undefined> {
    const { sceneId, from, to, formId } = parseParams(params);
    const form = allForms.find((f) => f.id === formId);

    if (!form || from === undefined || to === undefined) {
        return undefined;
    }

    const text = TextService.getTextSelection(sceneId, from, to)?.trim();
    if (!text) {
        throw new Error('Text location invalid');
    }

    const props: TemplateProps = {
        form,
        text,
        sceneId,
        from,
        to,
        charactersInScene: await getCharactersInScene(sceneId),
    };

    return renderFile('./endpoints/form.pug', props);
}

async function getCharactersInScene(sceneId: string): Promise<string[]> {
    const occurrenceFormId = 'hf2';
    const mentionFormId = 'hf3';

    const annotations = await getSubmissionsForScene(sceneId);
    const occurrences = annotations
        .filter((a) => a.formId === occurrenceFormId)
        .map((a) => a.fields[0].value);
    const mentions = annotations
        .filter((a) => a.formId === mentionFormId)
        .map((a) => a.fields[0].value);

    return [...occurrences, ...mentions];
}

function parseParams(params: Params) {
    if (!params.sceneId || !params.formId) {
        throw new Error('param mismatch');
    }

    if (!params.range) {
        return { formId: params.formId, sceneId: params.sceneId };
    }

    const splitRange = params.range.split('-').map((strint) => parseInt(strint));
    return {
        formId: params.formId,
        sceneId: params.sceneId,
        from: Math.min(...splitRange),
        to: Math.max(...splitRange),
    };
}
