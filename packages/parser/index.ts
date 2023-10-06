import { Chapter, ChapterType } from "./types/chapter";
import { toNumber } from "./util/toNumber";

async function parseGotm() {
    const src = Bun.file("./text/gotm.txt");
    const rawText = await src.text();

    const sanitisedText = removeSpecialCharacters(rawText);
    const chapters = splitByHeader(sanitisedText, ["## BOOK", "### Prologue", "### EPILOGUE"])
        .map(book => {
            const heading = book.match(/## ([^\n]*)/)![1];
            const bookNumber = parseBookNumber(heading);
            const chapters =  book.startsWith("## BOOK") ?
                splitByHeader(book, ["### CHAPTER"]) : [book];

            return chapters.map(c => parseChapter(c, bookNumber))
        }).flat();
    
    const outputPath = './output/gotm.json';
    await Bun.write(outputPath, JSON.stringify(chapters))

    console.log(`Parsed ${chapters.length} chapters, wrote to ${outputPath}`);

}

function removeSpecialCharacters(text: string): string {
    return text.replaceAll(/(\r)|(\*)|(\\)/g, "");
}

function parseChapter(chapterText: string, bookNumber: number | undefined): Chapter {
    const heading = chapterText.match(/### ([^\n]*)/)![1];
    const scenes = chapterText
        .split("\n\n\n")
        .filter(scene => scene.length > 0)
        .map(toBase64);

    const type = getChapterType(heading);

    return {
        type,
        bookNumber,
        chapterNumber: type === ChapterType.Chapter ? toNumber(heading.match(/CHAPTER (.*)/)![1]) : undefined,
        excerptText: scenes[1],
        scenesText: scenes.slice(2),
    }
}

function parseBookNumber(heading: string): number | undefined {
    const lower = heading.toLowerCase();

    if (lower.includes("prologue")) {
        return undefined;
    }
    
    if (lower.includes("epilogue")) {
        return undefined;
    }

    return toNumber(heading.match(/BOOK (.*)/)![1]);
}

function getChapterType(header: string): ChapterType {
    const lower = header.toLowerCase();

    if (lower.includes("prologue")) {
        return ChapterType.Prologue;
    }
    
    if (lower.includes("epilogue")) {
        return ChapterType.Epilogue;
    }

    return ChapterType.Chapter;
}

function splitByHeader(text: string, headers: string[]): string[] {
    const chunks: string[] = [];

    while (true) {
        const index = Math.max(...headers.map(header => text.lastIndexOf(header)));

        if (index === -1) {
            return chunks.reverse();
        }

        chunks.push(text.slice(index));
        text = text.slice(0, index);
    }
}

function toBase64(text: string) {
    return btoa(encodeURIComponent(text));
}

parseGotm();