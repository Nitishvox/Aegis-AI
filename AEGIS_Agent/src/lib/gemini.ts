import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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
    Role: ${role}
    Mission: ${mission}
    
    Context (Incident Logs/Data):
    ${context}
    
    Instructions:
    - Provide a professional, technical analysis in your specialized role.
    - Use Markdown formatting in the "content" field (e.g., use bold for emphasis, headers for sections, and bullet points for lists).
    - Include a "Functionality Status" section at the end of your content showing which of your internal tools were used (e.g., [OK] Log Scanner, [OK] Heuristic Engine).
    - Include a structured "Automation Workflow" section if remediation or investigation steps are required.
    - Return your response as a JSON object with the following fields:
    {
      "content": "Your detailed analysis, findings, and workflows...",
      "confidenceScore": 0.0 to 1.0,
      "functionalities": ["Tool A: Active", "Tool B: Synchronized"] 
    }
  `;

  const maxRetries = 5;
  let lastError: any = null;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      if (!ai) throw new Error("GEMINI_API_KEY not configured.");

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash", // High-performance neural model
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const resultText = response.text || "{}";
      const jsonContent = resultText.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      const result = JSON.parse(jsonContent);

      return {
        agentName: role.split(' ')[0],
        role,
        content: result.content || "Analysis incomplete.",
        confidenceScore: result.confidenceScore || 0.8,
        functionalities: result.functionalities || []
      };
    } catch (error: any) {
      lastError = error;
      const errorMsg = typeof error === 'object' ? JSON.stringify(error) : String(error);
      
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

  return {
    agentName: role.split(' ')[0],
    role,
    content: `Neural processing failed. Strategic integrity compromised. ${typeof lastError === 'object' ? JSON.stringify(lastError) : lastError}`,
    confidenceScore: 0
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
        model: "gemini-2.0-flash", // Using 2.0 Flash for optimized SOC command interface
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
      const errorMsg = typeof error === 'object' ? JSON.stringify(error) : String(error);
      const isRetryable = errorMsg.includes("429") || errorMsg.includes("500") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("quota");

      if (isRetryable && i < maxRetries) {
        const delay = Math.pow(2, i) * 2000 + Math.random() * 1000;
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      break;
    }
  }

  return "Neural link offline. Quota limit reached or network instability detected. Strategic fallback recommended.";
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
