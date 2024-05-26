export interface AnnotationForm {
    id: string;
    name: string;
    fields: FormField[];
}

export interface FormField {
    name: string;
    required: boolean;
    populateFromText?: boolean;
    type: FormFieldType;
}

export enum FormFieldType {
    FreeText = 'FreeText',
    CharacterInScene = 'CharacterInScene',
}

export const highlightForms: AnnotationForm[] = [
    {
        id: 'hf2',
        name: 'Occurrence',
        fields: [
            {
                name: 'Character name',
                required: true,
                populateFromText: true,
                type: FormFieldType.FreeText,
            },
        ],
    },
    {
        id: 'hf3',
        name: 'Mention',
        fields: [
            {
                name: 'Character name',
                required: true,
                populateFromText: true,
                type: FormFieldType.FreeText,
            },
        ],
    },
    {
        id: 'hf5',
        name: 'Location',
        fields: [
            { name: 'Continent', required: false, type: FormFieldType.FreeText },
            { name: 'Region', required: false, type: FormFieldType.FreeText },
            { name: 'Sublocation', required: false, type: FormFieldType.FreeText },
        ],
    },
    {
        id: 'hf4',
        name: 'Character Descriptor',
        fields: [{ name: 'Character name', required: true, type: FormFieldType.FreeText }],
    },
    {
        id: 'hf7',
        name: 'Location Descriptor',
        fields: [{ name: 'Location name', required: true, type: FormFieldType.FreeText }],
    },
    {
        id: 'hf6',
        name: 'Character Background',
        fields: [{ name: 'Character name', required: true, type: FormFieldType.CharacterInScene }],
    },
    {
        id: 'hf1',
        name: 'Dialogue',
        fields: [{ name: 'Character name', required: true, type: FormFieldType.CharacterInScene }],
    },
];

export const sceneForms: AnnotationForm[] = [
    {
        id: 'sf1',
        name: 'POV',
        fields: [{ name: 'POV Character', required: true, type: FormFieldType.CharacterInScene }],
    },
    {
        id: 'sf2',
        name: 'Setting',
        fields: [
            { name: 'Continent', required: false, type: FormFieldType.FreeText },
            { name: 'Region', required: false, type: FormFieldType.FreeText },
            { name: 'City', required: false, type: FormFieldType.FreeText },
            { name: 'Warren', required: false, type: FormFieldType.FreeText },
        ],
    },
    {
        id: 'sf3',
        name: 'Arc',
        fields: [
            { name: 'Arc', required: true, type: FormFieldType.FreeText },
            { name: 'Sub-Arc', required: false, type: FormFieldType.FreeText },
        ],
    },
];

export const allForms = [...highlightForms, ...sceneForms];
