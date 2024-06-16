import { IFormsApplication } from '..';
import { IAnnotationsApplication } from '../../annotations';
import { IScenesApplication } from '../../scenes';
import { parseOptionalRange, parseRange } from '../../util/range';
import { IViewsApplication } from '../../views';

export class FormsApi {
    constructor(
        private forms: IFormsApplication,
        private scenes: IScenesApplication,
        private annotations: IAnnotationsApplication,
        private views: IViewsApplication
    ) {}

    async getAll(sceneId?: string, range?: string): Promise<string | undefined> {
        if (!sceneId) {
            throw new Error(`invalid scene id '${sceneId}'`);
        }

        // If range isn't specified, return scene-level forms
        if (!range) {
            const availableForms = await this.forms.getSceneForms();
            const existingAttributes = await this.annotations.getSceneAttributes(sceneId);
            return this.views.renderSceneAttributeForms(
                sceneId,
                existingAttributes,
                availableForms
            );
        }

        // If range is zero-length, no selection was made (defer to /annotations)
        const { from, to } = parseRange(range);
        if (from === to) {
            return 'No content';
        }

        const selection = await this.scenes.getTextSelection(sceneId, from, to);
        if (!selection) {
            return undefined;
        }

        const availableForms = await this.forms.getAnnotationForms();
        return this.views.renderSelectionForms(sceneId, range, selection, availableForms);
    }

    async get(formId?: string, sceneId?: string, range?: string): Promise<string | undefined> {
        const { to, from } = parseOptionalRange(range);

        if (!formId || !sceneId) {
            throw new Error('invalid parameters');
        }

        const form = await this.forms.getFormById(formId);

        if (!form) {
            return undefined;
        }

        let text: string | undefined = undefined;
        if (from && to) {
            text = await this.scenes.getTextSelection(sceneId, from, to);

            if (!text) {
                throw new Error('Text location invalid');
            }

            text = text?.trim();
        }

        const charactersInScene = await this.annotations.getCharactersInScene(sceneId);

        return this.views.renderAnnotationForm(form, sceneId, charactersInScene, text, from, to);
    }
}
