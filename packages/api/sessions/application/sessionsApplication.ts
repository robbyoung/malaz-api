import { HistoricAnnotation, ISessionsApplication, ISessionsRepository } from '..';
import { KeyValuePairs } from '../../util/dictionaries';

export class SessionsApplication implements ISessionsApplication {
    constructor(private repository: ISessionsRepository) {}

    async getLastAnnotation(sessionId: string): Promise<HistoricAnnotation | undefined> {
        const session = await this.repository.getSession(sessionId);

        return session?.lastAnnotation;
    }

    async saveLastAnnotation(
        sessionId: string,
        formId: string,
        kvps: KeyValuePairs
    ): Promise<void> {
        await this.repository.saveSession(sessionId, { formId, kvps });
    }
}
