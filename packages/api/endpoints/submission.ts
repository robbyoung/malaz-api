import { saveSubmission } from "../forms/submissions";
import { renderFile } from "pug";

export async function postSubmission(rawFormData: any): Promise<string> {
  const params = new URLSearchParams(rawFormData);
  const formId = params.get("formId");
  const sceneId = params.get("sceneId");
  const from = parseInt(params.get("from") ?? '-1');
  const to = parseInt(params.get("to") ?? '-1');

  if (formId === null) {
    throw new Error("bad submission: formId missing or invalid");
  } else if (sceneId === null) {
    throw new Error("bad submission: sceneId missing or invalid");
  } else if (from < 0) {
    throw new Error("bad submission: from missing or invalid");
  } else if (to < 0) {
    throw new Error("bad submission: to missing or invalid");
  }

  await saveSubmission({formId, sceneId, from, to});

  return renderFile("./endpoints/submission.pug");
}
