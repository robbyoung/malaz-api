import { saveSubmission } from "../forms/submissions";
import { renderFile } from "pug";

export async function postSubmission(rawFormData: any): Promise<string> {
  const formData = new URLSearchParams(rawFormData);

  await saveSubmission(formData);

  return renderFile("./endpoints/submission.pug");
}
