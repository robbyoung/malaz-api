import { KeyValuePairs } from '../util/dictionaries';

export interface Session {
    id: string;
    lastAnnotation?: HistoricAnnotation;
    lastUpdatedDate: number;
}

export interface HistoricAnnotation {
    formId: string;
    kvps: KeyValuePairs;
}

export interface ISessionsRepository {
    saveSession(id: string, lastAnnotation: HistoricAnnotation): Promise<void>;
    getSession(id: string): Promise<Session | undefined>;
}

export { MongoSessionsRepository } from './repository/mongoSessionsRepository';

export interface ISessionsApplication {
    generateId(): string;
    getLastAnnotation(sessionId: string): Promise<HistoricAnnotation | undefined>;
    saveLastAnnotation(sessionId: string, formId: string, kvps: KeyValuePairs): Promise<void>;
}

export { SessionsApplication } from './application/sessionsApplication';
