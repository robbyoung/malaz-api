import { MongoClient, WithId } from 'mongodb';
import { Dictionary, toDictionary, KeyValuePairs, toKeyValuePairs } from '../util/dictionaries';

const mongoUrl = "mongodb://localhost:27017/malazdb";

export interface Submission {
    id: string;
    formId: string;
    sceneId: string;
    from: number;
    to: number;
    fields: KeyValuePairs;
}

interface SubmissionDto {
    formId: string;
    sceneId: string;
    from: number;
    to: number;
    fields: Dictionary;
}

export async function saveSubmission(formId: string, sceneId: string, from: number, to: number, kvps: KeyValuePairs) {
    const client = await MongoClient.connect(mongoUrl);

    await client.db().collection<SubmissionDto>("submissions").insertOne({formId, sceneId, from, to, fields: toDictionary(kvps)});

    client.close();
}

export async function getSubmissionsForScene(sceneId: string): Promise<Submission[]> {
    const client = await MongoClient.connect(mongoUrl);

    const query = { sceneId };
    const submissionsForScene = await client.db().collection("submissions").find<WithId<SubmissionDto>>(query).toArray();

    client.close();

    return submissionsForScene.map(submission => ({
        ...submission,
        fields: toKeyValuePairs(submission.fields),
        id: submission._id.toString(),
    }));
}