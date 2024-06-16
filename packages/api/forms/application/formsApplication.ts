import { IFormsApplication, IFormsRepository } from '..';
import { Form, FormType } from '../../types';

export class FormsApplication implements IFormsApplication {
    constructor(private repository: IFormsRepository) {}

    async getFormById(id: string): Promise<Form | undefined> {
        return this.repository.getFormById(id);
    }

    async getSceneForms(): Promise<Form[]> {
        return this.repository.getForms(FormType.Scene);
    }

    async getAnnotationForms(): Promise<Form[]> {
        return this.repository.getForms(FormType.Annotation);
    }
}
