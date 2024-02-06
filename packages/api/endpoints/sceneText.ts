import { Submission, getSubmissionsForScene } from "../forms/submissions";
import { TextService } from "../text/textService";
import { renderFile } from "pug";

interface Chunk {
  text: string;
  selectFrom: number;
  class: string;
}

interface TemplateProps {
  chunks: Chunk[];
  title: string;
  sceneId: string;
  nextSceneId?: string;
  previousSceneId?: string;
}

interface Params {
  sceneId: string;
}

export async function getSceneText(params: Params): Promise<string | undefined> {
  if (!params.sceneId) {
    return undefined;
  }

  const sceneName = new TextService().getSceneName(params.sceneId);
  const text = new TextService().getSceneText(params.sceneId);
  if (!text || !sceneName) {
    return undefined;
  }
  const adjacentSceneIds = new TextService().getAdjacentSceneIds(params.sceneId);

  const annotations = await getSubmissionsForScene(params.sceneId);

  const props: TemplateProps = {
    chunks: getChunks(text, annotations),
    title: sceneName,
    sceneId: params.sceneId,
    previousSceneId: adjacentSceneIds[0],
    nextSceneId: adjacentSceneIds[1]
  };

  return renderFile("./endpoints/sceneText.pug", props);
}

function getChunks(text: string, annotations: Submission[]): Chunk[] {
  const reversedAnnotations = [...annotations].sort((a, b) => b.from - a.from);
  const chunks: Chunk[] = [];

  let currentIndex = 0;
  while (reversedAnnotations.length > 0) {
    const annotation = reversedAnnotations.pop();

    if (annotation && annotation.from > currentIndex) {
      chunks.push({ text: text.substring(currentIndex, annotation.from), class: '', selectFrom: currentIndex });
      chunks.push({ text: text.substring(annotation.from, annotation.to), class: `annotation annotation-${annotation.formId}`, selectFrom: annotation.from });
      currentIndex = annotation.to;
    }
  }

  chunks.push({ text: text.substring(currentIndex), class: '', selectFrom: currentIndex });

  return chunks;
}
