import { IFormsApplication, IFormsRepository } from '..';
import { Form } from '../../types';

export class FormsApplication implements IFormsApplication {
    constructor(private repository: IFormsRepository) {}

    async getFormById(id: string): Promise<Form | undefined> {
        return this.repository.getFormById(id);
    }

    async getForms(includeHighlightForms: boolean, includeSceneForms: boolean): Promise<Form[]> {
        const forms = await this.repository.getForms();
        return forms.filter(
            (f) =>
                (includeHighlightForms && f.id.startsWith('hf')) ||
                (includeSceneForms && f.id.startsWith('sf'))
        );
    }
}
