export type Dictionary = { [id: string]: string; };
export type KeyValuePairs = {key: string, value: string}[];

export function toKeyValuePairs(dictionary: Dictionary): KeyValuePairs {
    if (dictionary === undefined) {
        return [];
    }

    return Object.keys(dictionary).map(key => ({ key, value: dictionary[key] }))
}

export function toDictionary(kvps: KeyValuePairs): Dictionary {
    if (kvps === undefined) {
        return {};
    }

    const dictionary: Dictionary = {};

    kvps.forEach(kvp => {
        dictionary[kvp.key] = kvp.value;
    });

    return dictionary;
}