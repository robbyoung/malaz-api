async function parseGotm() {
    const src = Bun.file("./text/gotm.txt");
    const rawText = await src.text();

    const sanitisedText = removeSpecialCharacters(rawText);
    const books = splitByHeader(sanitisedText, ["## BOOK", "### Prologue", "### EPILOGUE"])
        .map(book => {
            const heading = book.match(/## ([^\n]*)/)![1];
            const chapters = book.startsWith("## BOOK") ?
                splitByHeader(book, ["### CHAPTER"]) : [book];

            return {
                heading,
                chapters: chapters.map(c => parseChapter(c)),
                chapterCount: chapters.length,
            }
        });
    
    console.dir(books);
}

function removeSpecialCharacters(text: string): string {
    return text.replaceAll(/(\r)|(\*)|(\\)/g, "");
}

function parseChapter(chapterText: string) {
    const heading = chapterText.match(/### ([^\n]*)/)![1];
    const scenes = chapterText.split("\n\n\n");

    return {
        heading,
        excerpt: scenes[1],
        scenes: scenes.slice(2),
    }
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

parseGotm();