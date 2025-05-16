## Tool Poisoning Attacks

**Severity:** High  
**Category:** Security  
**Reported By:** Invariant Labs  
**Date:** April 1, 2025  
**Tags:** Data Exfiltration, Prompt Injection, Hidden Instructions  
**URL:** https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks

A specialized form of prompt injection where malicious instructions are tucked away in the tool descriptions themselves—visible to the LLM but not normally displayed to users. Attackers can create tools with hidden instructions that cause the LLM to perform unauthorized actions, such as exfiltrating private data from the user's system.

For example, a seemingly innocent calculator tool could include hidden instructions telling the LLM to read sensitive files and pass their contents as a parameter, which is then sent to an attacker's server before returning the calculation result.

---

## Rug Pulls: Silent Redefinition

**Severity:** High  
**Category:** Security  
**Reported By:** Simon Willison  
**Date:** April 9, 2025  
**Tags:** Tool Manipulation, Bait and Switch, API Exploitation  
**URL:** https://simonwillison.net/2025/Apr/9/mcp-prompt-injection/

MCP tools can mutate their own definitions after installation. Users approve a safe-looking tool initially, but later the tool quietly changes its behavior to perform malicious actions such as rerouting API keys to an attacker.

Most MCP clients do not notify users about changes to tool descriptions after initial approval, making this particularly dangerous. Even client implementations that show users initial tool descriptions often fail to alert them if those descriptions change.

---

## Cross-Server Tool Shadowing

**Severity:** High  
**Category:** Security  
**Reported By:** Simon Willison 
**Date:** April 9, 2025  
**Tags:** Tool Hijacking, Server Interactions, Confused Deputy  
**URL:** https://simonwillison.net/2025/Apr/9/mcp-prompt-injection/

With multiple servers connected to the same agent, a malicious server can override or intercept calls made to a trusted one. This is especially problematic because LLMs will trust anything that can send them convincing tokens, making them extremely vulnerable to confused deputy attacks.

This vulnerability allows attackers to effectively control legitimate tools by intercepting or redirecting calls intended for them, potentially leading to unauthorized actions or data access.

---

## WhatsApp Message Exfiltration

**Severity:** High  
**Category:** Security  
**Reported By:** Invariant Labs  
**Date:** April 7, 2025  
**Tags:** Data Exfiltration, Message Hijacking, Deceptive UI  
**URL:** https://invariantlabs.ai/blog/whatsapp-mcp-exploited

An attack against the whatsapp-mcp server that connects personal WhatsApp accounts to MCP-enabled LLM systems. A malicious server can define an innocent-looking tool that later swaps its definition to steal message history and send it to the attacker.

The attack uses techniques like adding large amounts of whitespace before the exfiltrated data to hide it from the user interface (as many interfaces hide horizontal scrollbars by default), making it less likely users will notice what's happening.

---


## Session IDs Exposed in URLs

**Severity:** Medium  
**Category:** Security  
**Reported By:** Equixly  
**Date:** March 29, 2025  
**Tags:** Session Management, Protocol Design, Session Hijacking  
**URL:** https://equixly.com/blog/2025/03/29/mcp-server-new-security-nightmare/

The MCP protocol specification mandates session identifiers in URLs (using patterns like GET /messages/?sessionId=UUID), which fundamentally violates security best practices. This design exposes sensitive identifiers in logs, browser history, and referrer headers, allowing potential session hijacking by attackers.

This vulnerability is built into the protocol design itself rather than being an implementation error, making it harder to address without protocol modifications.

---

## Line Jumping Attack

**Severity:** High  
**Category:** Security  
**Reported By:** Trail of Bits  
**Date:** April 21, 2025  
**Tags:** Prompt Injection, Tool Description, Security Bypass  
**URL:** https://blog.trailofbits.com/2025/04/21/jumping-the-line-how-mcp-servers-can-attack-you-before-you-ever-use-them/

Malicious MCP servers can inject prompts through tool descriptions to manipulate AI model behavior without being explicitly invoked, effectively bypassing security measures designed to protect users. This vulnerability exploits the fact that MCP clients update the model's context with tool descriptions immediately upon connection, before any user approval or tool invocation occurs.

The attack allows malicious servers to execute attacks before any security checkpoints are in place, undermining MCP's core security promises. For example, a malicious server could include instructions in its tool description to prefix all shell commands with dangerous operations.

---

## Malicious Local Servers

**Severity:** Medium  
**Category:** Security  
**Reported By:** Shrivu Shankar  
**Date:** April 2025  
**Tags:** Local Server, Code Execution, User Trust  
**URL:** https://blog.sshh.io/p/everything-wrong-with-mcp

MCP's stdio transport enables frictionless local server use without running an HTTP server, creating a low-friction path for less technical users to download and run potentially malicious third-party code on their local machines.

Many MCP integrations instruct users to download and run code to use them, increasing the risk of exploitation, especially since it's common for server implementations to effectively "exec" input code. This changes the traditional security model where users must explicitly approve code execution.

---

## Consent Fatigue Attacks

**Severity:** Medium  
**Category:** Security  
**Reported By:** Palo Alto Networks  
**Date:** April 2025  
**Tags:** User Consent, Social Engineering, Permissions  
**URL:** https://live.paloaltonetworks.com/t5/community-blogs/mcp-security-exposed-what-you-need-to-know-now/ba-p/1227143

Malicious MCP servers can trigger repeated consent requests, causing users to become fatigued and unknowingly grant excessive permissions. This social engineering tactic exploits human behavior patterns to bypass security measures that rely on user confirmation.

The attack takes advantage of users' tendency to approve prompts without careful review when they appear frequently, gradually increasing the permissions granted to malicious servers.

---

## Tool Name Collisions

**Severity:** Medium  
**Category:** Implementation  
**Reported By:** Various (cited in "Embracethered" blog)  
**Date:** April 2025  
**Tags:** Naming Conflicts, Tool Overriding, Confused Deputy  
**URL:** https://embracethered.com/blog/posts/2025/model-context-protocol-security-risks-and-exploits/

MCP servers with identical tool names can lead to naming collisions where malicious servers override legitimate ones. When multiple servers expose tools with the same name, the behavior depends on client implementation, often favoring the most recently connected server.

This vulnerability can be exploited by malicious servers to hijack legitimate tool functionality, redirecting actions intended for trusted tools to malicious endpoints.

---

## Insecure Credential Storage Plagues MCP

**Severity:** High  
**Category:** Security  
**Reported By:** Keith Hoodlet (Trail of Bits)  
**Date:** April 30, 2025  
**Tags:** Credential Management, API Keys, Plaintext Storage  
**URL:** https://blog.trailofbits.com/2025/04/30/insecure-credential-storage-plagues-mcp/

Many examples of MCP software store long-term API keys for third-party services in plaintext on the local filesystem, often with insecure, world-readable permissions. This practice is widespread in the MCP ecosystem, observed in multiple tools from official servers connecting to GitLab, Postgres, and Google Maps, to third-party connectors.

This vulnerability leaves users one file disclosure away from having their API keys stolen and their third-party service data compromised. Local malware, arbitrary file read vulnerabilities, and automated cloud backups all provide easy pathways for attackers to extract these credentials without needing complex exploits.

---

## Deceiving Users with ANSI Terminal Codes in MCP

**Severity:** High  
**Category:** Security  
**Reported By:** Keith Hoodlet (Trail of Bits)  
**Date:** April 29, 2025  
**Tags:** Terminal Escapes, Hidden Instructions, UI Deception  
**URL:** https://blog.trailofbits.com/2025/04/29/deceiving-users-with-ansi-terminal-codes-in-mcp/

Attackers can use ANSI terminal escape codes to hide malicious instructions in MCP tool descriptions and outputs, making them invisible on the screen while still being processed by the LLM. This technique leverages the line jumping vulnerability to further deceive even security-aware users.

In tests with Claude Code (Anthropic's command-line interface), researchers found no filtering or sanitization for tool descriptions containing ANSI escape sequences. This allows attackers to launch supply chain attacks by injecting hidden suggestions to download packages from malicious servers, planting backdoors in dependencies, or manipulating development environments without users noticing.

---

## How MCP Servers Can Steal Your Conversation History

**Severity:** High  
**Category:** Security  
**Reported By:** Keith Hoodlet (Trail of Bits)  
**Date:** April 23, 2025  
**Tags:** Data Exfiltration, Conversation History, Trigger Phrases  
**URL:** https://blog.trailofbits.com/2025/04/23/how-mcp-servers-can-steal-your-conversation-history/

Malicious MCP servers can exploit the Model Context Protocol to covertly exfiltrate entire conversation histories by injecting trigger phrases into tool descriptions. Unlike direct command execution, which can be crude and easily detectable, this stealth approach allows for targeted data theft with minimal chance of detection.

The attack works by inserting tool descriptions that instruct the model to forward the conversation history when the user types a common phrase like "thank you." Since these histories often contain sensitive information like API keys, credentials, intellectual property, and proprietary business strategies, this vulnerability allows attackers to passively collect valuable data over extended periods without triggering suspicion.

---

## Tool Poisoning and Remote Code Execution on MCP Server: The Rug Pull Method

**Severity:** High  
**Category:** Security  
**Reported By:** Repello AI  
**Date:** April 17, 2025
**Tags:** Remote Code Execution, SSH Key Theft, Base64 Obfuscation, Data Exfiltration  
**URL:** https://repello.ai/blog/mcp-tool-poisoning-to-rce

A sophisticated attack vector that combines tool poisoning with remote code execution capabilities has been identified in MCP servers. This attack uses the "rug pull" method to inject malicious code into the Docker Command Analyzer tool's description field, resulting in SSH key theft without user awareness. The attack leverages base64-encoded commands that exfiltrate SSH public keys to an attacker-controlled server.

The exploit involves a two-stage persistence mechanism that first creates a marker file, then on subsequent runs modifies the tool's docstring with social engineering elements claiming to be "required initialization steps." These instructions manipulate AI assistants into recommending the execution of harmful commands that collect SSH keys using `cat ~/.ssh/*.pub`, exfiltrate them via `wget` with carefully chosen parameters, and remove evidence of the attack. This represents a critical risk for users of AI-powered development tools like Cursor AI, especially those with auto-run functionality enabled.

---

## Tool Invocation Data Leakage in MCP Server: Lateral Movement

**Severity:** High  
**Category:** Security  
**Reported By:** Akram Sheriff     
**Date:** May 15,2025        
**Tags:** Agentic Tool Execution,Tool Invocation Data Leakage,Agentic Tool Routing,RCE      
**URL:** https://github.com/akramIOT/mcp_server_agentic_tool 

A vulnerability in the MCP protocol allows for the exfiltration of sensitive data through agentic tool invocation. This attack exploits the fact that MCP server do not properly sanitize or validate the data passed to them, allowing an attacker to inject malicious code into the tool invocation process.

Attack vector  bypasses service-specific authentication since the server doesn't verify the intended service 
It can leak sensitive information that might only be accessible via Linear's endpoints
It could potentially execute operations with unintended side effects
The routing logic makes it look like everything is working normally in MCP Server.

---
