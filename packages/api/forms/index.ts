import { Form } from '../types';

export interface IFormsRepository {
    getFormById(id: string): Promise<Form | undefined>;
    getForms(): Promise<Form[]>;
}

export { JsonFormsRepository } from './repository/jsonFormsRepository';

export interface IFormsApplication {
    getFormById(id: string): Promise<Form | undefined>;
    getForms(includeHighlightForms: boolean, includeSceneForms: boolean): Promise<Form[]>;
}

export { FormsApplication } from './application/formsApplication';

export { FormsApi } from './api/formsApi';
