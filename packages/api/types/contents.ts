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
