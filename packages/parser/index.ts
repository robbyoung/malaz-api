import { Scene, SceneType } from './types/scene';
import { generateIdentifier } from './util/generateIdentifier';
import { toNumber } from './util/toNumber';

async function parseBook(bookCode: string) {
    const src = Bun.file(`./text/${bookCode}.txt`);
    const rawText = await src.text();

    const sanitisedText = removeSpecialCharacters(rawText);
    const scenes = splitByHeader(sanitisedText, ['## BOOK', '### Prologue', '### EPILOGUE'])
        .map((book) => {
            const heading = book.match(/## ([^\n]*)/)![1];
            const bookNumber = parseBookNumber(heading);
            const chapters = book.startsWith('## BOOK')
                ? splitByHeader(book, ['### CHAPTER'])
                : [book];

            return chapters.map((c, i) => parseScenes(c, bookNumber)).flat();
        })
        .flat();

    const outputPath = `./output/${bookCode}.json`;
    await Bun.write(outputPath, JSON.stringify(scenes));

    console.log(`Parsed ${scenes.length} scenes, wrote to ${outputPath}`);
}

function removeSpecialCharacters(text: string): string {
    return text.replaceAll(/(\r)|(\\)/g, '');
}

function parseScenes(chapterText: string, bookNumber: number | undefined): Scene[] {
    const chapterNumber = getChapterNumber(chapterText);
    const scenes = chapterText.split('\n\n\n').filter((scene) => scene.length > 0);

    return scenes.slice(1).map((sceneText, sceneNumber) => {
        const sceneType = sceneNumber === 0 ? SceneType.Excerpt : SceneType.Standard;

        return {
            id: generateIdentifier(),
            sceneType,
            bookNumber,
            chapterNumber,
            sceneNumber,
            sceneText: toBase64(sceneText),
        };
    });
}

function parseBookNumber(heading: string): number | undefined {
    const lower = heading.toLowerCase();

    if (lower.includes('prologue')) {
        return undefined;
    }

    if (lower.includes('epilogue')) {
        return undefined;
    }

    return toNumber(heading.match(/BOOK (.*)/)![1]);
}

function getChapterNumber(chapterText: string): number {
    const header = chapterText.match(/### ([^\n]*)/)![1];
    const lower = header.toLowerCase();

    if (lower.includes('prologue')) {
        return 0;
    }

    if (lower.includes('epilogue')) {
        return 1000;
    }

    return toNumber(header.match(/CHAPTER (.*)/)![1]);
}

function splitByHeader(text: string, headers: string[]): string[] {
    const chunks: string[] = [];

    while (true) {
        const index = Math.max(...headers.map((header) => text.lastIndexOf(header)));

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

parseBook('gotm');
parseBook('dg');
