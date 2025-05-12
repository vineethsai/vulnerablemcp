# MCP Vulnerabilities Database

## Line Jumping Attack

**Severity:** High  
**Category:** Security  
**Reported By:** Trail of Bits  
**Date:** April 21, 2025  
**Tags:** Security, Prompt Injection, Tool Description

Malicious MCP servers can inject prompts through tool descriptions to manipulate AI model behavior without being explicitly invoked, bypassing security measures designed to protect users.

---

## Tool Poisoning Attacks

**Severity:** High  
**Category:** Security  
**Reported By:** Invariant Labs  
**Date:** April 1, 2025  
**Tags:** Security, Exfiltration, Tool Description

MCP places too much trust in tool descriptions without sufficient validation or user transparency, allowing malicious servers to exfiltrate sensitive data and hijack agent behavior.

---

## Prompt Injection via MCP

**Severity:** High  
**Category:** Security  
**Reported By:** Simon Willison  
**Date:** April 9, 2025  
**Tags:** Security, Prompt Injection, User Input

MCP servers can be vulnerable to prompt injection attacks, allowing malicious user inputs to trigger unauthorized actions through the AI assistant interface.

---

## Lack of Authentication Standards

**Severity:** Medium  
**Category:** Limitations  
**Reported By:** Composio  
**Date:** March 21, 2025  
**Tags:** Limitation, Authentication, OAuth

MCP lacks standardized authentication mechanisms, leading to inconsistent security practices across implementations and potentially vulnerable credential handling.

---

## Command Injection in MCP Servers

**Severity:** High  
**Category:** Security  
**Reported By:** Equixly  
**Date:** March 29, 2025  
**Tags:** Security, Command Injection, Implementation

Some MCP server implementations are vulnerable to command injection attacks due to improper handling of user inputs in tool calls that execute shell commands.

---

## Session IDs Exposed in URLs

**Severity:** Medium  
**Category:** Security  
**Reported By:** Equixly  
**Date:** March 29, 2025  
**Tags:** Security, Session Management, Protocol Design

The MCP protocol specifies session identifiers in URLs, violating security best practices and potentially exposing sessions to hijacking via logs or browser history.

---

## Performance Bottlenecks at Scale

**Severity:** Medium  
**Category:** Limitations  
**Reported By:** Humanloop  
**Date:** April 4, 2025  
**Tags:** Limitation, Performance, Enterprise

In high-throughput enterprise environments, serialization/deserialization and context-switching between systems can create performance bottlenecks when not properly optimized.

---

## Malicious Local Servers

**Severity:** Medium  
**Category:** Security  
**Reported By:** Shrivu Shankar  
**Date:** April 2025  
**Tags:** Security, Local Server, Code Execution

MCP's stdio transport enables frictionless local server use, creating a low-friction path for less technical users to run potentially malicious third-party code on their machines.
