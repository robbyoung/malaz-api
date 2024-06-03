import { MongoClient, ObjectId, WithId } from 'mongodb';
import { IAnnotationsRepository } from '..';
import { SceneAttributes, Submission } from '../../types';
import { Dictionary, KeyValuePairs, toDictionary, toKeyValuePairs } from '../../util/dictionaries';

interface SubmissionDto {
    formId: string;
    sceneId: string;
    from: number;
    to: number;
    fields: Dictionary;
}

interface SceneAttributesDto {
    sceneId: string;
    attributes: { [id: string]: string };
}

const mongoUrl = 'mongodb://localhost:27017/malazdb';
const sceneAttributesCollectionName = 'sceneAttributes';

export class MongoAnnotationsRepository implements IAnnotationsRepository {
    async saveSubmission(
        formId: string,
        sceneId: string,
        from: number,
        to: number,
        kvps: KeyValuePairs
    ) {
        const client = await MongoClient.connect(mongoUrl);

        await client
            .db()
            .collection<SubmissionDto>('submissions')
            .insertOne({ formId, sceneId, from, to, fields: toDictionary(kvps) });

        client.close();
    }

    async getSubmissionsForScene(sceneId: string): Promise<Submission[]> {
        const client = await MongoClient.connect(mongoUrl);

        const query = { sceneId };
        const submissionsForScene = await client
            .db()
            .collection('submissions')
            .find<WithId<SubmissionDto>>(query)
            .toArray();

        client.close();

        return submissionsForScene.map((submission) => ({
            ...submission,
            fields: toKeyValuePairs(submission.fields),
            id: submission._id.toString(),
        }));
    }

    async getSubmissionById(submissionId: string): Promise<Submission | undefined> {
        const client = await MongoClient.connect(mongoUrl);

        const query = { _id: new ObjectId(submissionId) };
        const submission = await client
            .db()
            .collection('submissions')
            .findOne<WithId<SubmissionDto>>(query);

        client.close();

        if (submission === null) {
            return undefined;
        }

        return {
            ...submission,
            fields: toKeyValuePairs(submission.fields),
            id: submission._id.toString(),
        };
    }

    async deleteSubmissionById(submissionId: string): Promise<boolean> {
        const client = await MongoClient.connect(mongoUrl);

        const query = { _id: new ObjectId(submissionId) };
        const result = await client.db().collection('submissions').deleteOne(query);

        client.close();

        return result.deletedCount > 0;
    }

    async saveSceneAttributes(sceneId: string, kvps: KeyValuePairs) {
        const client = await MongoClient.connect(mongoUrl);

        var existingAttributes = await this.getSceneAttributesInternal(client, sceneId);
        var attributes: SceneAttributesDto =
            existingAttributes === null ? { sceneId, attributes: {} } : existingAttributes;
        kvps.forEach((kvp) => {
            if (kvp.value !== '') {
                attributes.attributes[kvp.key] = kvp.value;
            }
        });

        if (existingAttributes === null) {
            await client.db().collection(sceneAttributesCollectionName).insertOne(attributes);
        } else {
            await client
                .db()
                .collection(sceneAttributesCollectionName)
                .replaceOne({ _id: existingAttributes._id }, existingAttributes);
        }

        client.close();
    }

    async getSceneAttributes(sceneId: string): Promise<SceneAttributes> {
        const client = await MongoClient.connect(mongoUrl);

        const query = { sceneId };
        const sceneAttributes = await client
            .db()
            .collection(sceneAttributesCollectionName)
            .find<WithId<SceneAttributesDto>>(query)
            .toArray();

        client.close();

        return sceneAttributes.map((sa) => toKeyValuePairs(sa.attributes))[0] ?? [];
    }

    async getSceneAttributesInternal(
        client: MongoClient,
        sceneId: string
    ): Promise<WithId<SceneAttributesDto> | null> {
        const query = { sceneId };
        return client
            .db()
            .collection(sceneAttributesCollectionName)
            .findOne<WithId<SceneAttributesDto>>(query);
    }
}
