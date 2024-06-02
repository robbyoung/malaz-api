import { Scene, Contents, Chunk, Submission } from '../types';

export interface IScenesRepository {
    getSceneById(id: string): Promise<Scene | undefined>;
    getScenes(bookId: string): Promise<Omit<Scene, 'sceneText'>[]>;
}

export { JsonScenesRepository } from './repository/jsonScenesRepository';

export interface IScenesApplication {
    getSceneText(sceneId: string): Promise<string | undefined>;
    getTextSelection(sceneId: string, from: number, to: number): Promise<string | undefined>;
    getContents(bookCode: string): Promise<Contents>;
    getAdjacentSceneIds(sceneId: string): Promise<[string?, string?]>;
    getChunks(sceneId: string, annotations: Submission[]): Promise<Chunk[]>;
}

export { ScenesApplication } from './application/scenesApplication';

export interface IScenesApi {}
