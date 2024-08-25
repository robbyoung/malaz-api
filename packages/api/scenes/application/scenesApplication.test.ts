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
    async function testDialogueStripping(text: string, expectedTexts: string[]) {
        const padding = '---arbitraryPadding---';
        const paddedText = `${padding}${text}${padding}`;

        const application = new ScenesApplication(
            createMockRepository(paddedText),
            {} as IFormsApplication,
            {} as IAnnotationsApplication
        );

        const ranges = await application.stripDialogue(
            'anId',
            padding.length,
            text.length + padding.length
        );
        expect(ranges.length).toBe(expectedTexts.length);
        for (let i = 0; i < ranges.length; i++) {
            const actualText = text.substring(
                ranges[i].from - padding.length,
                ranges[i].to - padding.length
            );
            expect(actualText).toBe(expectedTexts[i]);
        }
    }

    test('does not alter already-stripped dialogue', async () => {
        await testDialogueStripping('And what does that mean?', ['And what does that mean?']);
    });

    test('strips dialogue preceded by a newline', async () => {
        await testDialogueStripping(
            `
            'And what does that mean?'`,
            ['And what does that mean?']
        );
    });

    test('strips interrupted dialogue correctly', async () => {
        await testDialogueStripping(
            " And so, she realized, am I. 'What,' she asked, 'will stop the Tyrant? How do we control it?'",
            ['What,', 'will stop the Tyrant? How do we control it?']
        );
    });

    test('strips dialogue with an apostrophe correctly', async () => {
        await testDialogueStripping(" 'We don't, Adjunct. That is the gamble we take.'", [
            "We don't, Adjunct. That is the gamble we take.",
        ]);
    });

    test('strips interrupted dialogue with apostrophes and quotes correctly', async () => {
        await testDialogueStripping(
            " 'I saw a man die tonight,' Challice said quietly. 'I never want to again. If that's what \"real\" means, then I don't want it. It's all yours, Crokus. Goodbye.' She turned and walked away.",
            [
                'I saw a man die tonight,',
                "I never want to again. If that's what \"real\" means, then I don't want it. It's all yours, Crokus. Goodbye.",
            ]
        );
    });

    test('strips interrupted dialogue with trailing apostrophes correctly', async () => {
        await testDialogueStripping(
            " 'Well, there's a powerful mage living in there, ain't there? Well,' he released the thief's arm, 'you should be safe enough inside. Good luck, boy, and I mean that. But listen,' Fingers' eyes hardened, 'if your luck goes sour, you dump that coin, y' hear?'",
            [
                "Well, there's a powerful mage living in there, ain't there? Well,",
                'you should be safe enough inside. Good luck, boy, and I mean that. But listen,',
                "if your luck goes sour, you dump that coin, y' hear?",
            ]
        );
    });
});
