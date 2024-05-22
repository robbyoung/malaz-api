import { AnnotationForm, allForms } from '../forms/forms';
import { renderFile } from 'pug';
import { TextService } from '../text/textService';

interface TemplateProps {
    form: AnnotationForm;
    sceneId: string;
    text: string;
    from?: number;
    to?: number;
}

interface Params {
    formId?: string;
    sceneId?: string;
    range?: string;
}

export function getForm(params: Params): string | undefined {
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
    };

    return renderFile('./endpoints/form.pug', props);
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
