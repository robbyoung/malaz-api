import { BunRequest } from 'bunrest/src/server/request';

const SESSION_HEADER = 'malaz-session';

export function getSessionIdFromRequest(req: BunRequest): string {
    return req.headers && req.headers[SESSION_HEADER] ? req.headers[SESSION_HEADER] : generateId();
}

// https://stackoverflow.com/a/6248722
function generateId(): string {
    let firstPart = (Math.random() * 46656) | 0;
    let secondPart = (Math.random() * 46656) | 0;
    return ('000' + firstPart.toString(36)).slice(-3) + ('000' + secondPart.toString(36)).slice(-3);
}
