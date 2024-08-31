import { MongoClient, WithId } from 'mongodb';
import { HistoricAnnotation, ISessionsRepository, Session } from '..';

const mongoUrl = 'mongodb://localhost:27017/malazdb';
const annotationsCollectionName = 'sessions';

export class MongoSessionsRepository implements ISessionsRepository {
    async saveSession(id: string, lastAnnotation: HistoricAnnotation): Promise<void> {
        const client = await MongoClient.connect(mongoUrl);

        const session: Session = {
            id,
            lastAnnotation,
            lastUpdatedDate: Date.now(),
        };

        const query = { id };

        await client
            .db()
            .collection<Session>(annotationsCollectionName)
            .updateOne(query, session, { upsert: true });

        client.close();
    }

    async getSession(id: string): Promise<Session | undefined> {
        const client = await MongoClient.connect(mongoUrl);

        const query = { id };
        const session = await client
            .db()
            .collection(annotationsCollectionName)
            .findOne<WithId<Session>>(query);

        client.close();

        return session === null ? undefined : session;
    }
}
