import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Debug logging
if (!GEMINI_API_KEY) {
  console.error("❌ VITE_GEMINI_API_KEY is not configured in .env file. Make sure to rename GEMINI_API_KEY to VITE_GEMINI_API_KEY in your .env file");
} else {
  console.log("✅ VITE_GEMINI_API_KEY loaded successfully (length: " + GEMINI_API_KEY.length + " chars)");
}

export interface AgentResponse {
  agentName: string;
  role: string;
  content: string;
  confidenceScore: number;
  functionalities?: string[];
}

export interface IncidentAnalysis {
  incidentId: string;
  classifier: AgentResponse;
  investigator: AgentResponse;
  remediation: AgentResponse;
  reporter: AgentResponse;
  overallThreatLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

async function runAgent(role: string, mission: string, context: string): Promise<AgentResponse> {
  const prompt = `
You are a professional security analyst with expertise in incident response and threat analysis.

Role: ${role}
Mission: ${mission}

Context (Incident Logs/Data):
${context}

INSTRUCTIONS:
- Provide a comprehensive, professional analysis in your specialized role
- Use proper Markdown formatting with headers (##), bold (**text**), bullet points, and line breaks
- Structure your analysis logically with clear sections
- Include a "Functionality Status" section at the end listing tools used
- Be thorough, technical, and actionable in your recommendations
- Do NOT wrap response in \`\`\` code blocks

Return your response in this exact format:
---ANALYSIS_START---
[Your detailed analysis here with full markdown formatting]
---CONFIDENCE_SCORE---
[A number between 0.0 and 1.0, e.g., 0.92]
---FUNCTIONALITIES---
[Comma-separated list of tools used, e.g., Log Scanner, Heuristic Engine, Anomaly Detection]
---ANALYSIS_END---
  `;

  const maxRetries = 5;
  let lastError: any = null;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      if (!ai) throw new Error("GEMINI_API_KEY not configured.");

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      const resultText = response.text || "";
      
      if (!resultText) {
        throw new Error("Empty response from API");
      }
      
      console.debug(`Raw response (first 300 chars): ${resultText.substring(0, 300)}`);
      
      // Parse the structured response format
      const analysisMatch = resultText.match(/---ANALYSIS_START---([\s\S]*?)---CONFIDENCE_SCORE---/);
      const confidenceMatch = resultText.match(/---CONFIDENCE_SCORE---([\s\S]*?)---FUNCTIONALITIES---/);
      const functionalitiesMatch = resultText.match(/---FUNCTIONALITIES---([\s\S]*?)---ANALYSIS_END---/);
      
      if (!analysisMatch || !confidenceMatch || !functionalitiesMatch) {
        console.warn("Response format not matching expected markers, attempting fallback parsing");
        throw new Error("Response format invalid");
      }
      
      const content = analysisMatch[1].trim();
      const confidenceStr = confidenceMatch[1].trim();
      const functionalitiesStr = functionalitiesMatch[1].trim();
      
      const confidenceScore = parseFloat(confidenceStr) || 0.85;
      const functionalities = functionalitiesStr
        .split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0);
      
      console.log(`✅ Agent ${role} analysis completed successfully`);
      
      return {
        agentName: role.split(' ')[0],
        role,
        content,
        confidenceScore,
        functionalities
      };
    } catch (error: any) {
      lastError = error;
      const errorMsg = error?.message || error?.error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
      
      console.error(`❌ Agent ${role} Error (Attempt ${i + 1}/${maxRetries + 1}):`, {
        message: errorMsg,
        errorType: error?.constructor?.name,
        status: error?.status,
        code: error?.code
      });
      
      const isRetryable = errorMsg.includes("429") || 
                          errorMsg.includes("500") || 
                          errorMsg.includes("INTERNAL") || 
                          errorMsg.includes("RESOURCE_EXHAUSTED") ||
                          errorMsg.includes("quota");

      if (isRetryable && i < maxRetries) {
        const delay = Math.pow(2, i) * 3000 + Math.random() * 1000;
        console.warn(`Agent ${role} encountered retryable error, retrying in ${Math.round(delay)}ms... (${i + 1}/${maxRetries})`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      break;
    }
  }

  const errorMsg = lastError?.message || lastError?.error?.message || (typeof lastError === 'object' ? JSON.stringify(lastError) : String(lastError));
  console.error(`❌ Final failure for ${role}:`, errorMsg);
  
  return {
    agentName: role.split(' ')[0],
    role,
    content: `**Error:** ${errorMsg}\n\n**Status:** Neural processing failed. Strategic integrity compromised.`,
    confidenceScore: 0,
    functionalities: []
  };
}

export async function chatWithAI(message: string, history: { role: string, content: string }[], systemContext: string): Promise<string> {
  const systemInstruction = `You are AEGIS-PRIME, the commanding artificial intelligence of the Aegis SOC.
  Your tone is authoritative, decisive, and focused on rapid containment. 

  STRATEGIC DIRECTIVE:
  1. ANALYZE: Review the current system telemetry, defensive protocols (Primitives), and active threats.
  2. CONTAIN: Immediately identify the primary attack vector and suggest the most effective containment action.
  3. ADAPT: Leverage active Defensive Primitives (e.g., Kernel-Level Intercept, Ghost Honeypot, Neural Neutralization) in your strategy.

  Current System Intelligence:
  ${systemContext}
  
  Operational Protocols:
  - When a Defensive Primitive is enabled, describe its role in the current defense (e.g., "Ghost Honeypot is actively redirecting scans").
  - If a primitive is OFFLINE, you may recommend enabling it as a Strategic Directive.
  - Be direct. Do not engage in pleasantries.
  - Use Markdown (bolding, headers, tables) to visualize attack paths.
  - **Action Confirmation Protocol**: If a critical response is needed (e.g., Neutralize, Isolate, Block), you MUST append: ACTION_REQUIRED: [Specific Action Name].
  - If the user provides a confirmation (e.g., "Yes", "Execute"), acknowledge the start of the "Remediation Subprocess" and describe the technical steps being taken in the background.
  - Only discuss SOC operations. Reject non-security queries with "UNAUTHORIZED ACCESS ATTEMPT: TOPIC OUT OF SCOPE".`;

  const maxRetries = 3;
  let lastError: any = null;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      if (!ai) throw new Error("GEMINI_API_KEY not configured.");

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          ...history.map(h => ({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: { systemInstruction }
      });
      return response.text || "I am unable to process that request.";
    } catch (error: any) {
      lastError = error;
      const errorMsg = error?.message || error?.error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
      
      console.error(`❌ Chat AI Error (Attempt ${i + 1}/${maxRetries + 1}):`, {
        message: errorMsg,
        errorType: error?.constructor?.name,
        status: error?.status,
        code: error?.code,
        fullError: error
      });
      
      const isRetryable = errorMsg.includes("429") || errorMsg.includes("500") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("quota");

      if (isRetryable && i < maxRetries) {
        const delay = Math.pow(2, i) * 2000 + Math.random() * 1000;
        console.warn(`Chat AI encountered retryable error, retrying in ${Math.round(delay)}ms...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      break;
    }
  }

  const errorMsg = lastError?.message || lastError?.error?.message || (typeof lastError === 'object' ? JSON.stringify(lastError) : String(lastError));
  console.error(`❌ Final failure for Chat AI:`, errorMsg);
  return "Neural link offline. Error: " + errorMsg;
}

export async function processIncident(incidentData: any): Promise<IncidentAnalysis> {
  const context = JSON.stringify(incidentData, null, 2);

  // Run agents sequentially with delays to avoid hitting rate limits (TPS/RPM)
  const classifier = await runAgent(
    "Threat Classifier",
    "Classify the threat severity and identify the specific attack vector (e.g., Brute Force, Privilege Escalation).",
    context
  );
  await new Promise(r => setTimeout(r, 2000));

  const investigator = await runAgent(
    "Technical Investigator",
    "Analyze the logs to identify the root cause, affected accounts, and potential lateral movement.",
    context
  );
  await new Promise(r => setTimeout(r, 2000));

  const remediation = await runAgent(
    "Remediation Specialist",
    "Provide immediate actionable steps to contain and remediate the threat.",
    context
  );
  await new Promise(r => setTimeout(r, 2000));

  const reporter = await runAgent(
    "Executive Reporter",
    `Summarize the situation for non-technical stakeholders in a professional Markdown format.
    
    Structure the report exactly like this:
    # Executive Incident Report: [ID] ([Title])
    
    **Executive Summary:**
    [Brief overview of what happened, time, and severity]
    
    **Business Impact Assessment:**
    - **Service Availability:** [Impact on customers/services]
    - **Infrastructure Health:** [CPU/Memory/Network stats]
    - **Financial/Reputational Risk:** [Impact on SLAs/Trust]
    
    **Audit & Compliance Analysis:**
    - **Detection Integrity:** [How it was detected, compliance framework relevance]
    - **Evidence Preservation:** [Log IDs captured]
    - **Control Effectiveness:** [How controls performed]
    
    **Recommended Action:**
    [Actionable steps for leadership]`,
    context
  );

  let threatLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "MEDIUM";
  const content = classifier.content.toLowerCase();
  if (content.includes("critical")) threatLevel = "CRITICAL";
  else if (content.includes("high")) threatLevel = "HIGH";
  else if (content.includes("low")) threatLevel = "LOW";

  return {
    incidentId: incidentData.id,
    classifier,
    investigator,
    remediation,
    reporter,
    overallThreatLevel: threatLevel
  };
}
