import axios from "axios";
export async function extractQuery(userQuery) {
    const prompt = `
Extract structured information from the user query.

Return ONLY valid JSON.

Fields:
- topic (uppercase string or null)
- status (string or null)
- error (string or null)
- intent (GET_PROBLEMS, GET_ERRORS, GET_MISTAKES)

Rules:
- topic must be uppercase (ARRAY, DP, GRAPH, etc.)
- If not present → null
- DO NOT explain anything
- DO NOT return text outside JSON

Examples:

User: Show array problems where I made mistakes
Output: {"topic":"ARRAY","status":null,"error":null,"intent":"GET_MISTAKES"}

User: Show hashmap runtime errors
Output: {"topic":"HASHMAP","status":"RUNTIME ERROR","error":null,"intent":"GET_ERRORS"}

User: Show graph null pointer exceptions
Output: {"topic":"GRAPH","status":null,"error":"NULL POINTER EXCEPTION","intent":"GET_ERRORS"}

User: ${userQuery}
Output:
`;
    try {
        const response = await axios.post("http://localhost:11434/api/generate", {
            model: "qwen2.5:3b",
            prompt,
            stream: false
        });

        const text = response.data.response;

        return JSON.parse(text); // IMPORTANT
    }
    catch (err) {
        console.error("Error generating Cypher:", err);
        throw err;
    }
}