import { MongoClient, ObjectId, WithId } from 'mongodb';
import { IAnnotationsRepository } from '..';
import { SceneAttributes, Annotation } from '../../types';
import { Dictionary, KeyValuePairs, toDictionary, toKeyValuePairs } from '../../util/dictionaries';

interface AnnotationDto {
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
const annotationsCollectionName = 'annotations';

export class MongoAnnotationsRepository implements IAnnotationsRepository {
    async saveAnnotation(
        formId: string,
        sceneId: string,
        from: number,
        to: number,
        kvps: KeyValuePairs
    ) {
        const client = await MongoClient.connect(mongoUrl);
        await client
            .db()
            .collection<AnnotationDto>(annotationsCollectionName)
            .insertOne({ formId, sceneId, from, to, fields: toDictionary(kvps) });

        client.close();
    }

    async getAnnotationsForScene(sceneId: string): Promise<Annotation[]> {
        const client = await MongoClient.connect(mongoUrl);

        const query = { sceneId };
        const annotationsForScene = await client
            .db()
            .collection(annotationsCollectionName)
            .find<WithId<AnnotationDto>>(query)
            .toArray();

        client.close();

        return annotationsForScene.map((annotation) => ({
            ...annotation,
            fields: toKeyValuePairs(annotation.fields),
            id: annotation._id.toString(),
        }));
    }

    async getAnnotation(annotationId: string): Promise<Annotation | undefined> {
        const client = await MongoClient.connect(mongoUrl);

        const query = { _id: new ObjectId(annotationId) };
        const annotation = await client
            .db()
            .collection(annotationsCollectionName)
            .findOne<WithId<AnnotationDto>>(query);

        client.close();

        if (annotation === null) {
            return undefined;
        }

        return {
            ...annotation,
            fields: toKeyValuePairs(annotation.fields),
            id: annotation._id.toString(),
        };
    }

    async deleteAnnotation(annotationId: string): Promise<boolean> {
        const client = await MongoClient.connect(mongoUrl);

        const query = { _id: new ObjectId(annotationId) };
        const result = await client.db().collection(annotationsCollectionName).deleteOne(query);

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
