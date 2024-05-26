export interface AnnotationForm {
    id: string;
    name: string;
    fields: FormField[];
}

export interface FormField {
    name: string;
    required: boolean;
    populateFromText?: boolean;
}

export const highlightForms: AnnotationForm[] = [
    {
        id: 'hf2',
        name: 'Occurrence',
        fields: [{ name: 'Character name', required: true, populateFromText: true }],
    },
    {
        id: 'hf3',
        name: 'Mention',
        fields: [{ name: 'Character name', required: true, populateFromText: true }],
    },
    {
        id: 'hf5',
        name: 'Location',
        fields: [
            { name: 'Continent', required: false },
            { name: 'Region', required: false },
            { name: 'Sublocation', required: false },
        ],
    },
    {
        id: 'hf4',
        name: 'Character Descriptor',
        fields: [{ name: 'Character name', required: true }],
    },
    {
        id: 'hf7',
        name: 'Location Descriptor',
        fields: [{ name: 'Location name', required: true }],
    },
    {
        id: 'hf6',
        name: 'Character Background',
        fields: [{ name: 'Character name', required: true }],
    },
    {
        id: 'hf1',
        name: 'Dialogue',
        fields: [{ name: 'Character name', required: true }],
    },
];

export const sceneForms: AnnotationForm[] = [
    {
        id: 'sf1',
        name: 'POV',
        fields: [{ name: 'POV Character', required: true }],
    },
    {
        id: 'sf2',
        name: 'Setting',
        fields: [
            { name: 'Continent', required: false },
            { name: 'Region', required: false },
            { name: 'City', required: false },
            { name: 'Warren', required: false },
        ],
    },
    {
        id: 'sf3',
        name: 'Arc',
        fields: [
            { name: 'Arc', required: true },
            { name: 'Sub-Arc', required: false },
        ],
    },
];

export const allForms = [...highlightForms, ...sceneForms];
