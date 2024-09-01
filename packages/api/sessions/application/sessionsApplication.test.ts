import { describe, expect, test } from 'bun:test';
import { ISessionsRepository, Session, SessionsApplication } from '..';

const testSession: Session = {
    id: 'anId',
    lastAnnotation: {
        formId: 'aFormId',
        kvps: [
            {
                key: 'aKey',
                value: 'aValue',
            },
        ],
    },
    lastUpdatedDate: Date.now() - 60 * 60 * 1000, // one hour ago
};

function createMockRepository(session: Session | undefined): ISessionsRepository {
    return {
        getSession: (id) => Promise.resolve(id === session?.id ? session : undefined),
        saveSession: () => Promise.resolve(),
    };
}

describe('sessionsApplication.getLastAnnotation()', () => {
    test('can retrieve the last annotation for a session', async () => {
        const repository = createMockRepository(testSession);
        const application = new SessionsApplication(repository);

        const session = await application.getLastAnnotation('anId');

        expect(session?.formId).toBe('aFormId');
        expect(session?.kvps[0].key).toBe('aKey');
        expect(session?.kvps[0].value).toBe('aValue');
    });

    test('returns undefined if no annotation exists', async () => {
        const repository = createMockRepository(undefined);
        const application = new SessionsApplication(repository);

        const session = await application.getLastAnnotation('anId');

        expect(session).toBeUndefined();
    });
});
