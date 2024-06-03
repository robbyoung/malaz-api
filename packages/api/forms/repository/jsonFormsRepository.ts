import { IFormsRepository } from '..';
import { Form } from '../../types';

const forms: Form[] = require('./forms.json');

export class JsonFormsRepository implements IFormsRepository {
    async getFormById(id: string): Promise<Form | undefined> {
        const matchingForm = forms.find((f) => f.id === id);
        return Promise.resolve(matchingForm);
    }

    async getForms(): Promise<Form[]> {
        return Promise.resolve(forms);
    }
}
