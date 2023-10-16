import { TextService } from "../text/textService";
import { renderFile } from "pug";

interface TemplateProps {
  text: string;
  sceneId: string;
}

interface Params {
  sceneId: string;
}

export function getSceneText(params: Params): string | undefined {
  if (!params.sceneId) {
    return undefined;
  }

  const text = new TextService().getSceneText(params.sceneId);
  if (!text) {
    return undefined;
  }

  const props: TemplateProps = {
    text,
    sceneId: params.sceneId,
  };

  return renderFile("./endpoints/sceneText.pug", props);
}
