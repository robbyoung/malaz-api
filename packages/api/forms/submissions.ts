const submissions: any[] = require('./submissions.json');

export async function saveSubmission(formData: FormData) {
    submissions.push(formData);

    await Bun.write("./submissions.json", JSON.stringify(submissions));
}