import { AnnotationForm, highlightForms, sceneForms } from '../forms/forms';
import { SceneAttributes, getSceneAttributes } from '../repository/sceneAttributes';
import { TextService } from '../text/textService';
import { renderFile } from 'pug';

interface SceneAnnotationTemplateProps {
    sceneId: string;
    attributes: SceneAttributes;
    availableForms: AnnotationForm[];
}

interface TextAnnotationTemplateProps {
    sceneId: string;
    range: string;
    selection: string;
    availableForms: AnnotationForm[];
}

interface Params {
    sceneId?: string;
    range?: string;
}

export async function getSelection(params: Params): Promise<string | undefined> {
    const { sceneId, from, to } = parseParams(params);

    if (from && to && from === to) {
        return 'No content';
    }

    const text = new TextService().getSceneText(sceneId);

    if (!text) {
        return undefined;
    }

    if (from && to) {
        const props: TextAnnotationTemplateProps = {
            selection: text.slice(from, to),
            availableForms: highlightForms,
            sceneId,
            range: `${from}-${to}`,
        };

        return renderFile('./endpoints/selectionText.pug', props);
    } else {
        const props: SceneAnnotationTemplateProps = {
            sceneId,
            attributes: await getSceneAttributes(sceneId),
            availableForms: sceneForms,
        };

        return renderFile('./endpoints/selectionScene.pug', props);
    }
}

function parseParams(params: Params) {
    if (!params.sceneId) {
        throw new Error('sceneId not specified');
    }

    if (!params.range) {
        return { sceneId: params.sceneId };
    }

    const splitRange = params.range.split('-').map((strint) => parseInt(strint));
    return {
        sceneId: params.sceneId,
        from: Math.min(...splitRange),
        to: Math.max(...splitRange),
    };
}
