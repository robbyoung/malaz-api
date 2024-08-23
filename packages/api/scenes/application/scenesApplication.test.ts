import { describe, expect, test } from 'bun:test';
import { IScenesRepository, ScenesApplication } from '..';
import { SceneType } from '../../types';
import { IFormsApplication } from '../../forms';
import { IAnnotationsApplication } from '../../annotations';

function createMockRepository(sceneText: string): IScenesRepository {
    return {
        getSceneById: (id) => {
            return Promise.resolve({
                id,
                chapterNumber: 1,
                sceneNumber: 1,
                sceneText,
                sceneType: SceneType.Standard,
            });
        },
        getScenes: () => {
            return Promise.resolve([]);
        },
    };
}

describe('scenesApplication.stripDialogue()', () => {
    async function testDialogueStripping(text: string, baseIndex: number, expectedTexts: string[]) {
        const application = new ScenesApplication(
            createMockRepository(text),
            {} as IFormsApplication,
            {} as IAnnotationsApplication
        );

        const ranges = await application.stripDialogue('anId', baseIndex, baseIndex + text.length);
        expect(ranges.length).toBe(expectedTexts.length);
        for (let i = 0; i < ranges.length; i++) {
            const actualText = text.substring(ranges[i].from - baseIndex, ranges[i].to - baseIndex);
            expect(actualText).toBe(expectedTexts[i]);
        }
    }

    test('does not alter already-stripped dialogue', async () => {
        await testDialogueStripping('And what does that mean?', 10, ['And what does that mean?']);
    });

    test('strips interrupted dialogue correctly', async () => {
        await testDialogueStripping(
            "And so, she realized, am I. 'What,' she asked, 'will stop the Tyrant? How do we control it?'",
            203,
            ['What,', 'will stop the Tyrant? How do we control it?']
        );
    });

    test('strips dialogue with an apostrophe correctly', async () => {
        await testDialogueStripping("'We don't, Adjunct. That is the gamble we take.'", 22, [
            "We don't, Adjunct. That is the gamble we take.",
        ]);
    });

    test('strips interrupted dialogue with apostrophes and quotes correctly', async () => {
        await testDialogueStripping(
            "'I saw a man die tonight,' Challice said quietly. 'I never want to again. If that's what \"real\" means, then I don't want it. It's all yours, Crokus. Goodbye.' She turned and walked away.",
            85,
            [
                'I saw a man die tonight,',
                "I never want to again. If that's what \"real\" means, then I don't want it. It's all yours, Crokus. Goodbye.",
            ]
        );
    });

    test('strips interrupted dialogue with trailing apostrophes correctly', async () => {
        await testDialogueStripping(
            "'I saw a man die tonight,' Challice said quietly. 'I never want to again. If that's what \"real\" means, then I don't want it. It's all yours, Crokus. Goodbye.' She turned and walked away.",
            0,
            [
                "Well, there's a powerful mage living in there, ain't there? Well,",
                'you should be safe enough inside. Good luck, boy, and I mean that. But listen,',
                "if your luck goes sour, you dump that coin, y' hear?",
            ]
        );
    });
});
