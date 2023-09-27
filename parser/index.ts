async function parseGotm() {
    const src = Bun.file("./text/gotm.txt");
    const rawText = await src.text();

    const books = splitByHeader(rawText, ["## BOOK", "### Prologue", "### EPILOGUE"])
        .map(book => {
            const heading = book.match(/## ([^\r?\n]*)/)![1];
            const chapters = book.startsWith("## BOOK") ?
                splitByHeader(book, ["### CHAPTER"]) : [book];

            return {
                heading,
                chapters,
                chapterCount: chapters.length,
            }
        });
    
    console.dir(books);
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