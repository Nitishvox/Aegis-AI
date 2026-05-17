import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory simulation of databases
  let logCounter = 100;
  let incidentCounter = 1000;
  let auditCounter = 5000;

  const incidents: any[] = [];
  const logs: any[] = [
    { id: 1, timestamp: new Date(Date.now() - 3600000).toISOString(), level: "INFO", source: "System", message: "Aegis Command Core initialized." },
    { id: 2, timestamp: new Date(Date.now() - 3500000).toISOString(), level: "INFO", source: "AuthService", message: "User session heartbeat: svc_monitor" },
    { id: 3, timestamp: new Date(Date.now() - 3400000).toISOString(), level: "INFO", source: "Network", message: "Inbound traffic scrubbed: No anomalies detected." },
  ];
  const auditTrails: any[] = [];
  let governanceSettings = {
    automaticDetection: true,
    aiInvestigationLevel: "EXTENSIVE",
    retentionDays: 90,
    complianceMode: "SOC2",
  };

  const SCENARIOS = [
    {
      title: "Ransomware Deployment Attempt",
      attackType: "Malware / Ransomware",
      affectedSystem: "FileServer-04 (Storage Cluster Alpha)",
      severity: "CRITICAL",
      message: "Mass file encryption detected on FileServer-04",
      source: "EndpointProtection",
      logs: [
        { level: "INFO", msg: "Scanning shared directory /Company/Projects/2026" },
        { level: "WARN", msg: "Unusual entropy increase detected in 450 files (Process: unknown.exe)" },
        { level: "ERROR", msg: "Execution attempt of vssadmin.exe to delete shadow copies prevented" },
        { level: "CRITICAL", msg: "Contacting Command & Control IP: 185.22.14.88 (Known Ransomware Affiliate)" },
        { level: "CRITICAL", msg: "File encryption started at /Projects/Confidential/Alpha" }
      ]
    },
    {
      title: "Mass Data Exfiltration",
      attackType: "Data Theft / Exfiltration",
      affectedSystem: "Marketing workstation WKST-429",
      severity: "HIGH",
      message: "Large outbound traffic detected to external cloud storage",
      source: "DLPEngine",
      logs: [
        { level: "INFO", msg: "User bjones_marketing accessed sensitive directory /Finance/Payroll" },
        { level: "WARN", msg: "Compressed archive project_alpha.7z created using command line" },
        { level: "ERROR", msg: "Unusual data transfer: 4.5GB uploaded to external destination (mega.nz)" },
        { level: "WARN", msg: "Bypassing workplace proxy via encrypted tunnel (Port 443)" }
      ]
    },
    {
      title: "Shadow Administrator Creation",
      attackType: "Privilege Escalation",
      affectedSystem: "Active Directory Domain Controller (DC-01)",
      severity: "CRITICAL",
      message: "Unauthorized privilege escalation in Active Directory",
      source: "IAM-Monitor",
      logs: [
        { level: "INFO", msg: "User temp_dev_88 logged into Domain Controller DC-01" },
        { level: "WARN", msg: "Audit trail cleared on machine DC-01" },
        { level: "ERROR", msg: "New Administrative user 'svc_backdoor' created without ticket ID" },
        { level: "CRITICAL", msg: "Adminsitrative privileges granted to svc_backdoor manually" }
      ]
    },
    {
      title: "SQL Injection & Database Wipe",
      attackType: "Web Application / SQLi",
      affectedSystem: "Production DB (SQL-PROD-02)",
      severity: "CRITICAL",
      message: "SQL Injection detected on login endpoint leading to DROP TABLE operation.",
      source: "Web Application Firewall",
      logs: [
        { level: "WARN", msg: "Unusual character pattern in POST /api/login: ' OR 1=1--" },
        { level: "ERROR", msg: "Database query error: Table 'users' not found." },
        { level: "CRITICAL", msg: "Mass table deletion detected in 'CustomerData' schema." },
        { level: "CRITICAL", msg: "Compromised DB credentials detected in foreign VPS." }
      ]
    },
    {
      title: "Distributed Denial of Service (DDoS)",
      attackType: "Resource Exhaustion / DDoS",
      affectedSystem: "Edge Router Cluster (ER-REGION-01)",
      severity: "HIGH",
      message: "UDP flood attack saturating bandwidth capacity (150 Gbps)",
      source: "NetFlow Analyzer",
      logs: [
        { level: "INFO", msg: "Network utilization at 40%" },
        { level: "WARN", msg: "Sudden spike in UDP traffic from 10,000+ unique IPs" },
        { level: "ERROR", msg: "Edge router CPU reaching 98% utilization" },
        { level: "CRITICAL", msg: "Packet loss exceeding 15% on public gateways" }
      ]
    },
    {
      title: "Phishing & Credential Harvest",
      attackType: "Social Engineering / Phishing",
      affectedSystem: "O365 Email Tenant",
      severity: "MEDIUM",
      message: "Multiple users clicking suspicious 'Password Reset' link from spoofed HR domain.",
      source: "EmailGateway",
      logs: [
        { level: "INFO", msg: "Email received from 'hr-portal-check.net' for 50 recipients" },
        { level: "WARN", msg: "Suspicious link detected: http://bit.ly/secure-hr-update" },
        { level: "ERROR", msg: "Successful login for user 'ceo_admin' from Geo: RU (Unusual Location)" },
        { level: "CRITICAL", msg: "External mailbox forwarding rule created for user 'finance_dir'" }
      ]
    },
    {
      title: "Infrastructure Hijack (Kernel Rootkit)",
      attackType: "Deep System Compromise",
      affectedSystem: "Mainframe Core / KERN-SYS",
      severity: "CRITICAL",
      message: "Unauthorized kernel module loading detected on host KERN-SYS",
      source: "SIEM",
      logs: [
        { level: "CRITICAL", msg: "SYSCALL HOOK detected: SYS_OPEN overwritten" },
        { level: "ERROR", msg: "Process hidden from system listing: [kworker/u2:1]" },
        { level: "CRITICAL", msg: "UI REDIRECTION ATTEMPT: System interface integrity compromised" },
        { level: "INFO", msg: "Injecting remote override commands..." }
      ]
    }
  ];

  // API Route: Get Logs
  app.get("/api/logs", (req, res) => {
    res.json(logs.slice(-100)); // Return last 100 logs
  });

  app.get("/api/scenarios", (req, res) => {
    res.json(SCENARIOS.map((s, idx) => ({ id: idx, title: s.title, severity: s.severity })));
  });

  // API Route: Get Audit Trails
  app.get("/api/audit-trails", (req, res) => {
    res.json(auditTrails.slice(-100));
  });

  // API Route: Get Governance
  app.get("/api/governance", (req, res) => {
    res.json(governanceSettings);
  });

  app.post("/api/governance", (req, res) => {
    governanceSettings = { ...governanceSettings, ...req.body };
    res.json(governanceSettings);
  });

  // API Route: Simulate Attack
  app.post("/api/simulate-attack", (req, res) => {
    const { scenarioId } = req.body;
    const timestamp = new Date().toISOString();
    
    let scenario;
    if (scenarioId !== undefined && SCENARIOS[scenarioId]) {
      scenario = SCENARIOS[scenarioId];
    } else {
      scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    }
    
    const attackLogs = scenario.logs.map((log, i) => ({
      id: ++logCounter,
      timestamp: new Date(Date.now() + i * 1000).toISOString(),
      level: log.level,
      source: scenario.source,
      message: log.msg,
    }));
    
    logs.push(...attackLogs);
    
    const newIncident = {
      id: "INC-" + (++incidentCounter),
      title: scenario.title,
      attackType: scenario.attackType,
      affectedSystem: scenario.affectedSystem,
      severity: scenario.severity,
      status: "DETECTED",
      detectedAt: timestamp,
      logs: attackLogs,
      summary: scenario.message,
    };
    
    incidents.push(newIncident);

    // Add to audit trail
    auditTrails.push({
      id: "AUD-" + (++auditCounter),
      timestamp,
      action: "INCIDENT_CREATED",
      actor: "AEGIS_MONITOR",
      description: `Incident ${newIncident.id} (${scenario.title}) flagged via ${scenario.source}.`,
    });

    res.json(newIncident);
  });

  // API Route: Execute Remediation
  app.post("/api/remediate", (req, res) => {
    const { incidentId, action } = req.body;
    const timestamp = new Date().toISOString();
    
    const incident = incidents.find(i => i.id === incidentId);
    if (incident) {
      incident.status = "REMEDIATED";
      
      auditTrails.push({
        id: "AUD-" + (++auditCounter),
        timestamp,
        action: "REMEDIATION_EXECUTED",
        actor: "SEC_ADMIN",
        description: `Action [${action}] executed for incident ${incidentId}. Endpoint isolated & credentials revoked.`,
      });

      res.json({ success: true, status: "REMEDIATED" });
    } else {
      res.status(404).json({ error: "Incident not found" });
    }
  });

  // API Route: Get Incidents
  app.get("/api/incidents", (req, res) => {
    res.json(incidents);
  });

  // Catch-all for undefined API routes to prevent falling through to SPA fallback
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: "API endpoint not found", path: req.path });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aegis Server running on http://localhost:${PORT}`);
  });
}

startServer();
