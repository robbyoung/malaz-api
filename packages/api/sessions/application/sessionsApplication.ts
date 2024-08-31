import { HistoricAnnotation, ISessionsApplication, ISessionsRepository } from '..';
import { KeyValuePairs } from '../../util/dictionaries';

export class SessionsApplication implements ISessionsApplication {
    constructor(private repository: ISessionsRepository) {}

    // https://stackoverflow.com/a/6248722
    generateId(): string {
        let firstPart = (Math.random() * 46656) | 0;
        let secondPart = (Math.random() * 46656) | 0;
        return (
            ('000' + firstPart.toString(36)).slice(-3) + ('000' + secondPart.toString(36)).slice(-3)
        );
    }

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
