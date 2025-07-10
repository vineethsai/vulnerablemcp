# The Vulnerable MCP Project

This project tracks known vulnerabilities within Model Context Protocol (MCP) servers. The website is designed to be easily updated by modifying a markdown file instead of directly editing HTML.

## How to Update the Website

1. Edit the `vulnerabilities.md` file to add, modify, or remove vulnerability information
2. Run `npm run update` to regenerate the website (now uses stable UI-preserving script)
3. The `index.html` file will be automatically updated with your changes while preserving the stable design

**📖 For detailed instructions, see [UPDATE-GUIDE.md](UPDATE-GUIDE.md)**

## Markdown Format

Each vulnerability in the `vulnerabilities.md` file should follow this format:

```markdown
## Vulnerability Title

**Severity:** High/Medium/Low  
**Category:** Security/Limitations/Implementation  
**Reported By:** Organization or Person Name  
**Date:** Month Day, Year  
**Tags:** Tag1, Tag2, Tag3  
**URL:** https://example.com/vulnerability-details

Description of the vulnerability goes here. This can be multiple paragraphs.

---
```

The separator `---` is used to indicate the end of a vulnerability entry.

## Setup

```bash
# Install dependencies
npm install

# Update the website
npm run update
```
