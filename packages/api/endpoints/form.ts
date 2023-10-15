import { HighlightForm, availableForms } from "../forms/forms";
import { TextService } from "../text/textService";
import { renderFile } from "pug";

interface TemplateProps {
  form: HighlightForm;
  chapter: number;
  scene: number;
  from: number;
  to: number;
}

interface Params {
  formId?: string; 
  sceneId?: string;
  range?: string;
}

export function getForm(params: Params): string | undefined {
  const {chapter, scene, from, to, formId} = parseParams(params);
  const form = availableForms.find(f => f.id === formId);

  if (!form) {
    return undefined;
  }

  const props: TemplateProps = {
    form,
    chapter,
    scene,
    from,
    to
  };

  return renderFile("./endpoints/form.pug", props);
}

function parseParams (params: Params) {
  if (!params.sceneId || !params.range || !params.formId) {
    throw new Error("param mismatch");
  }

  const splitId = params.sceneId.split("_");
  const splitRange = params.range.split("-").map(strint => parseInt(strint));
  return {
    formId: params.formId,
    chapter: parseInt(splitId[0]),
    scene: parseInt(splitId[1]),
    from: Math.min(...splitRange),
    to: Math.max(...splitRange)
  } 
}
