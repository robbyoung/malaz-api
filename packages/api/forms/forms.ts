export interface HighlightForm {
    id: string;
    name: string;
    fields: string[];
}

export const availableForms: HighlightForm[] = [
    {
        id: 'hf2',
        name: 'Occurrence',
        fields: [
            "Character name"
        ]
    },
    {
        id: 'hf3',
        name: 'Mention',
        fields: [
            "Character name"
        ]
    },
    {
        id: 'hf5',
        name: 'Location',
        fields: [
            "Continent",
            "Region",
            "Sublocation"
        ]
    },
    {
        id: 'hf4',
        name: 'Descriptor',
        fields: [
            "Character name"
        ]
    },
    {
        id: 'hf1',
        name: 'Dialogue',
        fields: [
            "Character name"
        ]
    },
]