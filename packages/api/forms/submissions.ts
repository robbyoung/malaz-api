import { MongoClient } from 'mongodb';

const mongoUrl = "mongodb://localhost:27017/malazdb";

export interface Submission {
    formId: string;
    sceneId: string;
    from: number;
    to: number;
}

export async function saveSubmission(submission: Submission) {
    const client = await MongoClient.connect(mongoUrl);

    await client.db().collection("submissions").insertOne(submission);

    client.close();
}

export async function getSubmissionsForScene(sceneId: string): Promise<Submission[]> {
    const client = await MongoClient.connect(mongoUrl);

    const query = { sceneId };
    const submissionsForScene = await client.db().collection("submissions").find<Submission>(query).toArray();

    client.close();

    return submissionsForScene;
}