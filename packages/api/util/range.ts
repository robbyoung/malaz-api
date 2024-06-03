export function parseRange(range?: string): { from: number; to: number } {
    if (!range) {
        throw new Error(`invalid range '${range}'`);
    }

    const splitRange = range.split('-').map((strint) => parseInt(strint));
    return {
        from: Math.min(...splitRange),
        to: Math.max(...splitRange),
    };
}
