import { MongoClient, ObjectId, WithId } from 'mongodb';
import { Dictionary, toDictionary, KeyValuePairs, toKeyValuePairs } from '../util/dictionaries';
import { Submission } from '../types';

const mongoUrl = 'mongodb://localhost:27017/malazdb';

interface SubmissionDto {
    formId: string;
    sceneId: string;
    from: number;
    to: number;
    fields: Dictionary;
}

export async function saveSubmission(
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

export async function getSubmissionsForScene(sceneId: string): Promise<Submission[]> {
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

export async function getSubmissionById(submissionId: string): Promise<Submission | undefined> {
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

export async function deleteSubmissionById(submissionId: string): Promise<boolean> {
    const client = await MongoClient.connect(mongoUrl);

    const query = { _id: new ObjectId(submissionId) };
    const result = await client.db().collection('submissions').deleteOne(query);

    client.close();

    return result.deletedCount > 0;
}
