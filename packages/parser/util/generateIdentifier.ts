export type Identifier = string;

// https://stackoverflow.com/a/6248722
export function generateIdentifier(): Identifier {
    let firstPart = (Math.random() * 46656) | 0;
    let secondPart = (Math.random() * 46656) | 0;
    return ('000' + firstPart.toString(36)).slice(-3) + ('000' + secondPart.toString(36)).slice(-3);
}
