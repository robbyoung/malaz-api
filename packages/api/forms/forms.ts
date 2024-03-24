export interface AnnotationForm {
    id: string;
    name: string;
    fields: string[];
}

export const highlightForms: AnnotationForm[] = [
    {
        id: 'hf2',
        name: 'Occurrence',
        fields: ['Character name'],
    },
    {
        id: 'hf3',
        name: 'Mention',
        fields: ['Character name'],
    },
    {
        id: 'hf5',
        name: 'Location',
        fields: ['Continent', 'Region', 'Sublocation'],
    },
    {
        id: 'hf4',
        name: 'Descriptor',
        fields: ['Character name'],
    },
    {
        id: 'hf1',
        name: 'Dialogue',
        fields: ['Character name'],
    },
];

export const sceneForms: AnnotationForm[] = [
    {
        id: 'sf1',
        name: 'POV',
        fields: ['POV Character'],
    },
    {
        id: 'sf2',
        name: 'Setting',
        fields: ['Continent', 'Region', 'City', 'Warren'],
    },
    {
        id: 'sf3',
        name: 'Arc',
        fields: ['Arc', 'Sub-Arc'],
    },
];

export const allForms = [...highlightForms, ...sceneForms];
