
import { renderFile } from "pug";
import { KeyValuePairs } from "../util/dictionaries";
import { getSubmissionById } from "../repository/submissions";
import { allForms } from "../forms/forms";

interface TemplateProps {
  title: string;
  fields: KeyValuePairs;
}

interface Params {
  annotationId: string;
}

export async function getAnnotation(params: Params): Promise<string | undefined> {
  if (!params.annotationId) {
    throw new Error("invalid annotationId");
  }

  const annotation = await getSubmissionById(params.annotationId);

  if (!annotation) {
    return undefined;
  }

  const title = allForms.find(f => f.id === annotation.formId)?.name ?? "Unknown"

  const props: TemplateProps = {
    title,
    fields: annotation.fields
  };

  return renderFile("./endpoints/annotation.pug", props);
}
