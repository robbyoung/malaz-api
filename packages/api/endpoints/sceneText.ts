import { availableForms } from "../forms/forms";
import { Submission, getSubmissionsForScene } from "../forms/submissions";
import { TextService } from "../text/textService";
import { renderFile } from "pug";

interface Chunk {
  text: string;
  selectFrom: number;
  class: string;
  annotationId?: string;
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
  const chunks: Chunk[] = [];
  const indices = [0, ...new Set(annotations.map(a => [a.from, a.to]).flat().sort((a, b) => a - b)), text.length];

  for(let i = 0; i < indices.length - 1; i++) {
    const currentIndex = indices[i];
    const nextIndex = indices[i + 1];
    const annotationsBetweenIndices = annotations.filter(a => a.to > currentIndex && a.from < nextIndex);
    chunks.push(createChunk(text, currentIndex, nextIndex, annotationsBetweenIndices));
  };

  return chunks;
}

function createChunk(text: string, fromIndex: number, toIndex: number, annotations: Submission[]): Chunk {
  if (annotations.length === 0) {
    return { text: text.substring(fromIndex, toIndex), class: '', selectFrom: fromIndex }
  }

  const formOrder = annotations.sort((a, b) => availableForms.findIndex(f => a.formId === f.id) - availableForms.findIndex(f => b.formId === f.id));
  const annotation = formOrder[0];
  return { text: text.substring(fromIndex, toIndex), class: `annotation annotation-${annotation.formId}`, selectFrom: fromIndex, annotationId: annotation.id}
}
