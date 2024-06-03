import { Submission, SceneAttributes } from '../types';
import { KeyValuePairs } from '../util/dictionaries';

export interface IAnnotationsRepository {
    saveSubmission(
        formId: string,
        sceneId: string,
        from: number,
        to: number,
        kvps: KeyValuePairs
    ): Promise<void>;
    getSubmissionsForScene(sceneId: string): Promise<Submission[]>;
    getSubmissionById(submissionId: string): Promise<Submission | undefined>;
    deleteSubmissionById(submissionId: string): Promise<boolean>;
    getSceneAttributes(sceneId: string): Promise<SceneAttributes>;
    saveSceneAttributes(sceneId: string, kvps: KeyValuePairs): Promise<void>;
}

export { MongoAnnotationsRepository } from './repository/mongoAnnotationsRepository';

export interface IAnnotationsApplication {
    processSubmission(rawFormData: any): Promise<string>;
    getSubmissionsForScene(sceneId: string): Promise<Submission[]>;
    getAnnotation(id: string): Promise<Submission | undefined>;
    deleteAnnotation(id: string): Promise<void>;
    getSceneAttributes(sceneId: string): Promise<SceneAttributes>;
    getCharactersInScene(sceneId: string): Promise<string[]>;
}

export { AnnotationsApplication } from './application/annotationsApplication';

export { AnnotationsApi } from './api/annotationsApi';
