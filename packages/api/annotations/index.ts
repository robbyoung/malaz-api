import { Annotation, SceneAttributes } from '../types';
import { KeyValuePairs } from '../util/dictionaries';

export interface IAnnotationsRepository {
    saveAnnotation(
        formId: string,
        sceneId: string,
        bookId: string,
        kvps: KeyValuePairs,
        from?: number,
        to?: number
    ): Promise<void>;
    getAnnotationsForScene(sceneId: string): Promise<Annotation[]>;
    getAnnotation(annotationId: string): Promise<Annotation | undefined>;
    deleteAnnotation(annotationId: string): Promise<boolean>;
    searchAnnotations(formId: string, fieldName: string, searchTerm: string): Promise<string[]>;
}

export { MongoAnnotationsRepository } from './repository/mongoAnnotationsRepository';

export interface IAnnotationsApplication {
    processAnnotation(rawFormData: any): Promise<string>;
    getAnnotationsForScene(sceneId: string): Promise<Annotation[]>;
    getAnnotation(id: string): Promise<Annotation | undefined>;
    deleteAnnotation(id: string): Promise<void>;
    getSceneAttributes(sceneId: string): Promise<SceneAttributes>;
    getCharactersInScene(sceneId: string): Promise<string[]>;
    searchCharacters(searchTerm: string): Promise<string[]>;
}

export { AnnotationsApplication } from './application/annotationsApplication';

export { AnnotationsApi } from './api/annotationsApi';
