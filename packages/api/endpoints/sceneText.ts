import { TextService } from "../text/textService";
import { renderFile } from "pug";

interface TemplateProps {
  text: string;
  sceneId: string;
  nextSceneId: string;
}

interface Params {
  sceneId: string;
}

export function getSceneText(params: Params): string | undefined {
  if (!params.sceneId) {
    return undefined;
  }

  const splitId = params.sceneId.split("_");
  const chapter = parseInt(splitId[0]);
  const scene = parseInt(splitId[1]);

  const text = new TextService().getSceneText(chapter, scene);

  if (!text) {
    return undefined;
  }

  const props: TemplateProps = {
    text,
    sceneId: params.sceneId,
    nextSceneId: `${chapter}_${scene + 1}`,
  };

  return renderFile("./endpoints/sceneText.pug", props);
}
