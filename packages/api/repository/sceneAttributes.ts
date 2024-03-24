import { MongoClient, WithId } from 'mongodb';
import { toKeyValuePairs } from '../util/dictionaries';

const mongoUrl = 'mongodb://localhost:27017/malazdb';
const collectionName = 'sceneAttributes';

export type SceneAttributes = { key: string; value: string }[];

interface SceneAttributesDto {
    sceneId: string;
    attributes: { [id: string]: string };
}

export async function saveSceneAttributes(sceneId: string, kvps: { key: string; value: string }[]) {
    const client = await MongoClient.connect(mongoUrl);

    var existingAttributes = await getSceneAttributesInternal(client, sceneId);
    var attributes: SceneAttributesDto =
        existingAttributes === null ? { sceneId, attributes: {} } : existingAttributes;
    kvps.forEach((kvp) => {
        if (kvp.value !== '') {
            attributes.attributes[kvp.key] = kvp.value;
        }
    });

    if (existingAttributes === null) {
        await client.db().collection(collectionName).insertOne(attributes);
    } else {
        await client
            .db()
            .collection(collectionName)
            .replaceOne({ _id: existingAttributes._id }, existingAttributes);
    }

    client.close();
}

export async function getSceneAttributes(sceneId: string): Promise<SceneAttributes> {
    const client = await MongoClient.connect(mongoUrl);

    const query = { sceneId };
    const sceneAttributes = await client
        .db()
        .collection(collectionName)
        .find<WithId<SceneAttributesDto>>(query)
        .toArray();

    client.close();

    return sceneAttributes.map((sa) => toKeyValuePairs(sa.attributes))[0] ?? [];
}

async function getSceneAttributesInternal(
    client: MongoClient,
    sceneId: string
): Promise<WithId<SceneAttributesDto> | null> {
    const query = { sceneId };
    return client.db().collection(collectionName).findOne<WithId<SceneAttributesDto>>(query);
}
