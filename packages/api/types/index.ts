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

export type SceneAttributes = { key: string; value: string }[];

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
    fields: FormField[];
}

export interface FormField {
    name: string;
    required: boolean;
    populateFromText?: boolean;
    type: FormFieldType;
}

export enum FormFieldType {
    FreeText = 'FreeText',
    CharacterInScene = 'CharacterInScene',
    Boolean = 'Boolean',
}
