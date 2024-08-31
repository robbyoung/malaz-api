import { Range } from '../types';

export function parseRange(range?: string): Range {
    if (!range) {
        throw new Error(`invalid range '${range}'`);
    }

    const splitRange = range.split('-').map((strint) => parseInt(strint));
    return {
        from: Math.min(...splitRange),
        to: Math.max(...splitRange),
    };
}

export function parseOptionalRange(range?: string): { from?: number; to?: number } {
    if (!range) {
        return { from: undefined, to: undefined };
    }

    const splitRange = range.split('-').map((strint) => parseInt(strint));
    return {
        from: Math.min(...splitRange),
        to: Math.max(...splitRange),
    };
}
