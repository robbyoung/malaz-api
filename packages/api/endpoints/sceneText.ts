import { TextService } from "../text/textService";
import { renderFile } from "pug";

interface TemplateProps {
  text: string;
  sceneId: string;
  nextSceneId?: string;
  previousSceneId?: string;
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

  const adjacentSceneIds = new TextService().getAdjacentSceneIds(params.sceneId);

  const props: TemplateProps = {
    text,
    sceneId: params.sceneId,
    previousSceneId: adjacentSceneIds[0],
    nextSceneId: adjacentSceneIds[1]
  };

  return renderFile("./endpoints/sceneText.pug", props);
}
