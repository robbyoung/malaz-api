import { IFormsRepository } from '..';
import { Form, FormType } from '../../types';

const forms: Form[] = require('./forms.json');

export class JsonFormsRepository implements IFormsRepository {
    async getFormById(id: string): Promise<Form | undefined> {
        const matchingForm = forms.find((f) => f.id === id);
        return Promise.resolve(matchingForm);
    }

    async getForms(type: FormType): Promise<Form[]> {
        return Promise.resolve(forms.filter((f) => f.type === type));
    }
}
