import { Identifier } from '../util/generateIdentifier';

export enum SceneType {
    Excerpt,
    Standard,
}

export interface Scene {
    id: Identifier;
    chapterNumber: number;
    sceneNumber: number;
    sceneType: SceneType;
    sceneText: string;
}
