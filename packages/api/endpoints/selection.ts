import { HighlightForm, availableForms } from "../forms/forms";
import { TextService } from "../text/textService";
import { renderFile } from "pug";

interface TemplateProps {
  sceneId: string;
  range: string;
  selection: string;
  availableForms: HighlightForm[];
}

interface Params {
  sceneId?: string;
  range?: string;
}

export function getSelection(params: Params): string | undefined {
  const {sceneId, from, to} = parseParams(params);

  const text = new TextService().getSceneText(sceneId);

  if (!text) {
    return undefined;
  }

  const props: TemplateProps = {
    selection: text.slice(from, to),
    availableForms,
    sceneId,
    range: `${from}-${to}`
  };

  return renderFile("./endpoints/selection.pug", props);
}

function parseParams (params: Params) {
  if (!params.sceneId || !params.range) {
    throw new Error("param mismatch");
  }

  const splitRange = params.range.split("-").map(strint => parseInt(strint));
  return {
    sceneId: params.sceneId,
    from: Math.min(...splitRange),
    to: Math.max(...splitRange) 
  } 
}
