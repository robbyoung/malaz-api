import { saveSubmission } from "../forms/submissions";
import { renderFile } from "pug";
import { saveSceneAttributes } from "../repository/sceneAttributes";

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
  }

  if (from === -1 && to === -1) {
    var kvps = Array.from(params.entries())
      .filter(entry => entry[0] !== "sceneId" && entry[0] !== "formId")
      .map(entry => ({ key: entry[0], value: entry[1] }))
    await saveSceneAttributes(sceneId, kvps);
    return renderFile("./endpoints/submission.pug");
  }
  
  
  if (from < 0) {
    throw new Error("bad submission: from missing or invalid");
  } else if (to < 0) {
    throw new Error("bad submission: to missing or invalid");
  }

  await saveSubmission(formId, sceneId, from, to);

  return renderFile("./endpoints/submission.pug");
}
