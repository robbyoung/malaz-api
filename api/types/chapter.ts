export enum ChapterType {
    Prologue,
    Chapter,
    Epilogue,
}

export interface Chapter {
    bookNumber: number | undefined;
    chapterNumber: number | undefined;
    type: ChapterType;
    scenesText: string[];
    excerptText: string;
}