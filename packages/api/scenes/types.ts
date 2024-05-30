import { Submission } from '../repository/submissions';

export interface IScenesRepository {
    getSceneById(id: string): Promise<Scene | undefined>;
    getScenes(bookId: string): Promise<Omit<Scene, 'sceneText'>[]>;
}

export interface IScenesApplication {
    getSceneText(sceneId: string): Promise<string | undefined>;
    getTextSelection(sceneId: string, from: number, to: number): Promise<string | undefined>;
    getContents(bookCode: string): Promise<Contents>;
    getAdjacentSceneIds(sceneId: string): Promise<[string?, string?]>;
    getChunks(sceneId: string, annotations: Submission[]): Promise<Chunk[]>;
}

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
