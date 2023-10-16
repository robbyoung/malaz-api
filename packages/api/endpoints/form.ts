import { HighlightForm, availableForms } from "../forms/forms";
import { TextService } from "../text/textService";
import { renderFile } from "pug";

interface TemplateProps {
  form: HighlightForm;
  sceneId: string;
  from: number;
  to: number;
}

interface Params {
  formId?: string; 
  sceneId?: string;
  range?: string;
}

export function getForm(params: Params): string | undefined {
  const {sceneId, from, to, formId} = parseParams(params);
  const form = availableForms.find(f => f.id === formId);

  if (!form) {
    return undefined;
  }

  const props: TemplateProps = {
    form,
    sceneId,
    from,
    to
  };

  return renderFile("./endpoints/form.pug", props);
}

function parseParams (params: Params) {
  if (!params.sceneId || !params.range || !params.formId) {
    throw new Error("param mismatch");
  }

  const splitRange = params.range.split("-").map(strint => parseInt(strint));
  return {
    formId: params.formId,
    sceneId: params.sceneId,
    from: Math.min(...splitRange),
    to: Math.max(...splitRange)
  } 
}
