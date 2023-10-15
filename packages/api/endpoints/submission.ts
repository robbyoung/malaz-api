import { saveSubmission } from "../forms/submissions";
import { render } from "pug";

export async function postSubmission(rawFormData: any): Promise<string> {
  const formData = new URLSearchParams(rawFormData);

  await saveSubmission(formData);

  return render("div#form");
}
