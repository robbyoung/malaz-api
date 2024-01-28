import { MongoClient } from 'mongodb';

export async function saveSubmission(formData: FormData) {
    const url = "mongodb://localhost:27017/malazdb";
    const client = await MongoClient.connect(url);

    await client.db().collection("submissions").insertOne(formData);
    
    console.dir(formData);

    client.close();
}