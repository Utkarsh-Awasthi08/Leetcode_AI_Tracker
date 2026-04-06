export function buildCypher(filters, userId) {
    const { topic, status, error } = filters;
  
    let query = `
  MATCH (u:User {id: $userId})-[:MADE]->(s:Submission)-[:FOR]->(p:Problem)
  OPTIONAL MATCH (p)-[:BELONGS_TO]->(t:Topic)
  OPTIONAL MATCH (s)-[:HAS_ERROR]->(e:Error)
  OPTIONAL MATCH (s)-[:HAS_MISTAKE]->(m:Mistake)
  `;
  
    let where = [];
  
    // ✅ Apply filters ONLY if present
    if (topic) {
      where.push(`t.name = $topic`);
    }
  
    if (status) {
      where.push(`s.status = $status`);
    }
  
    if (error) {
      where.push(`e.type = $error`);
    }
  
    // ✅ WHERE clause
    if (where.length > 0) {
      query += `\nWHERE ${where.join(" AND ")}\n`;
    }
  
    // ✅ Always return everything
    query += `
  RETURN 
    p.name AS problem,
    s.status AS status,
    e.type AS error,
    m.type AS mistake,
    p.url AS url,
    s.code AS code
  `;
  
    return query;
  }