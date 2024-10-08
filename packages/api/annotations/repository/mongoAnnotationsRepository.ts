import { MongoClient, ObjectId, WithId } from 'mongodb';
import { IAnnotationsRepository } from '..';
import { Annotation } from '../../types';
import { Dictionary, KeyValuePairs, toDictionary, toKeyValuePairs } from '../../util/dictionaries';

interface AnnotationDto {
    formId: string;
    sceneId: string;
    priority: number;
    from?: number;
    to?: number;
    bookId?: string;
    fields: Dictionary;
}

const mongoUrl = 'mongodb://localhost:27017/malazdb';
const annotationsCollectionName = 'annotations';

export class MongoAnnotationsRepository implements IAnnotationsRepository {
    async saveAnnotation(
        formId: string,
        sceneId: string,
        bookId: string,
        kvps: KeyValuePairs,
        priority: number,
        from?: number,
        to?: number
    ) {
        const client = await MongoClient.connect(mongoUrl);
        await client
            .db()
            .collection<AnnotationDto>(annotationsCollectionName)
            .insertOne({
                formId,
                sceneId,
                from,
                to,
                priority,
                bookId,
                fields: toDictionary(kvps),
            });

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
            from: annotation.from ?? -1,
            to: annotation.to ?? -1,
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
            from: annotation.from ?? -1,
            to: annotation.to ?? -1,
        };
    }

    async deleteAnnotation(annotationId: string): Promise<boolean> {
        const client = await MongoClient.connect(mongoUrl);

        const query = { _id: new ObjectId(annotationId) };
        const result = await client.db().collection(annotationsCollectionName).deleteOne(query);

        client.close();

        return result.deletedCount > 0;
    }

    async searchAnnotations(
        formId: string,
        fieldName: string,
        searchTerm: string
    ): Promise<string[]> {
        const client = await MongoClient.connect(mongoUrl);
        const query = {
            formId,
            [`fields.${fieldName}`]: { $regex: searchTerm },
        };

        const matches = await client
            .db()
            .collection(annotationsCollectionName)
            .find<WithId<AnnotationDto>>(query)
            .toArray();

        client.close();

        return matches.map((annotation) => annotation.fields[fieldName]);
    }
}
