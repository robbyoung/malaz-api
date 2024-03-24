import { TextService } from '../text/textService';
import { renderFile } from 'pug';
import { Contents } from '../types/contents';

interface TemplateProps {
    contents: Contents;
}

export function getContents(): string {
    const contents = new TextService().getContents('dg');
    const props: TemplateProps = {
        contents,
    };

    return renderFile('./endpoints/contents.pug', props);
}
