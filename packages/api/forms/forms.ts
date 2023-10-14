export interface HighlightForm {
    id: string;
    name: string;
    fields: string[];
}

export const availableForms: HighlightForm[] = [
    {
        id: 'hf1',
        name: 'Dialogue',
        fields: [
            "Character name"
        ],
    },
    {
        id: 'hf2',
        name: 'Occurrence',
        fields: [
            "Character name"
        ],
    },
    {
        id: 'hf3',
        name: 'Mention',
        fields: [
            "Character name"
        ],
    }
]