import { Scene, Contents, Chunk, Annotation, Book, Range } from '../types';

export interface IScenesRepository {
    getSceneById(id: string): Promise<Scene | undefined>;
    getScenes(bookId: string): Promise<Omit<Scene, 'sceneText'>[]>;
}

export { JsonScenesRepository } from './repository/jsonScenesRepository';

export interface IScenesApplication {
    getSceneText(sceneId: string): Promise<string | undefined>;
    getTextSelection(sceneId: string, from: number, to: number): Promise<string | undefined>;
    getSceneName(sceneId: string): Promise<string | undefined>;
    getContents(bookCode: string): Promise<Contents>;
    getAdjacentSceneIds(sceneId: string): Promise<[string?, string?]>;
    getChunks(sceneId: string, annotations: Annotation[]): Promise<Chunk[]>;
    getBooks(): Promise<Book[]>;
    stripDialogue(sceneId: string, from: number, to: number): Promise<Range[]>;
}

export { ScenesApplication } from './application/scenesApplication';

export { ScenesApi } from './api/scenesApi';
