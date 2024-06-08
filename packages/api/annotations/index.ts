import { Annotation, SceneAttributes } from '../types';
import { KeyValuePairs } from '../util/dictionaries';

export interface IAnnotationsRepository {
    saveAnnotation(
        formId: string,
        sceneId: string,
        from: number,
        to: number,
        kvps: KeyValuePairs
    ): Promise<void>;
    getAnnotationsForScene(sceneId: string): Promise<Annotation[]>;
    getAnnotation(annotationId: string): Promise<Annotation | undefined>;
    deleteAnnotation(annotationId: string): Promise<boolean>;
    getSceneAttributes(sceneId: string): Promise<SceneAttributes>;
    saveSceneAttributes(sceneId: string, kvps: KeyValuePairs): Promise<void>;
}

export { MongoAnnotationsRepository } from './repository/mongoAnnotationsRepository';

export interface IAnnotationsApplication {
    processAnnotation(rawFormData: any): Promise<string>;
    getAnnotationsForScene(sceneId: string): Promise<Annotation[]>;
    getAnnotation(id: string): Promise<Annotation | undefined>;
    deleteAnnotation(id: string): Promise<void>;
    getSceneAttributes(sceneId: string): Promise<SceneAttributes>;
    getCharactersInScene(sceneId: string): Promise<string[]>;
}

export { AnnotationsApplication } from './application/annotationsApplication';

export { AnnotationsApi } from './api/annotationsApi';
