import { KeyValuePairs } from '../util/dictionaries';

export enum SceneType {
    Excerpt,
    Standard,
}

export interface Scene {
    id: string;
    chapterNumber: number;
    sceneNumber: number;
    sceneType: SceneType;
    sceneText: string;
}

export interface Chunk {
    text: string;
    selectFrom: number;
    class: string;
    annotationId?: string;
}

export enum ChapterType {
    Prologue,
    Chapter,
    Epilogue,
}

export interface Contents {
    title: string;
    chapters: ChapterContents[];
}

export interface ChapterContents {
    name: string;
    scenes: SceneContents[];
}

interface SceneContents {
    id: string;
    name: string;
}

export type SceneAttributes = KeyValuePairs;

export interface Annotation {
    id: string;
    formId: string;
    sceneId: string;
    from: number;
    to: number;
    fields: KeyValuePairs;
}

export interface Form {
    id: string;
    name: string;
    type: FormType;
    fields: FormField[];
}

export interface FormField {
    name: string;
    required: boolean;
    populateFromText?: boolean;
    type: FormFieldType;
}

export enum FormType {
    Annotation = 'Annotation',
    Scene = 'Scene',
}

export enum FormFieldType {
    FreeText = 'FreeText',
    CharacterInScene = 'CharacterInScene',
    Boolean = 'Boolean',
    Search = 'Search',
}
