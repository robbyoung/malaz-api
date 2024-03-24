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
