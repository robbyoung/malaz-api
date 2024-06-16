import { Form, FormType } from '../types';

export interface IFormsRepository {
    getFormById(id: string): Promise<Form | undefined>;
    getForms(type: FormType): Promise<Form[]>;
}

export { JsonFormsRepository } from './repository/jsonFormsRepository';

export interface IFormsApplication {
    getFormById(id: string): Promise<Form | undefined>;
    getSceneForms(): Promise<Form[]>;
    getAnnotationForms(): Promise<Form[]>;
}

export { FormsApplication } from './application/formsApplication';

export { FormsApi } from './api/formsApi';
