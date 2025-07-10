# Vulnerability Update Guide

## Quick Update Process

To add new vulnerabilities to the website:

1. **Edit the markdown file**: Update `vulnerabilities.md` with new vulnerability entries
2. **Run the update script**: `npm run update`
3. **Done!** The HTML will be automatically updated while preserving the stable UI

## Adding Vulnerabilities to vulnerabilities.md

Follow this format for each vulnerability:

```markdown
## Vulnerability Title

**Severity:** High/Medium/Low  
**Category:** Security/Implementation  
**Reported By:** Organization or Person Name  
**Date:** Month Day, Year  
**Tags:** Tag1, Tag2, Tag3  
**URL:** https://example.com/vulnerability-details

Description of the vulnerability goes here. This can be multiple paragraphs explaining the vulnerability, its impact, and any relevant technical details.

---
```

**Important Notes:**
- Each vulnerability MUST end with `---` separator
- Keep vulnerabilities in chronological order (newest at the bottom)
- The script will automatically generate proper HTML with the correct structure

## Scripts Available

- `npm run update` - Uses the new stable script (recommended)
- `npm run update-old` - Uses the old script (may break UI - not recommended)

## What the Script Does

The `update-stable.js` script:
- ✅ Parses `vulnerabilities.md` 
- ✅ Generates proper HTML with `vulnerability-card` class structure
- ✅ Preserves the stable UI design and JavaScript functionality
- ✅ Updates only the vulnerability cards section
- ✅ Maintains chronological order
- ✅ Keeps all existing styling and interactive features

## Deployment

### For simple updates (adding vulnerabilities):
1. Edit `vulnerabilities.md`
2. `npm run update` (builds HTML)
3. `git add . && git commit -m "Add new vulnerability"`
4. `git push origin main`
5. `./rebuild_and_deploy.sh` (deploys website files to GitHub Pages)

### Repository Structure:
- **main branch**: Source files (vulnerabilities.md, scripts, documentation)
- **gh-pages branch**: Built website files only (HTML, CSS, JS, assets)

The deployment script automatically copies only the necessary website files to gh-pages, keeping the repository clean and avoiding confusion about which files to update.

## Troubleshooting

If the script fails:
- Check that `vulnerabilities.md` format is correct
- Ensure each vulnerability has all required fields
- Verify the `---` separators are present
- Make sure there are no syntax errors in the markdown

The script will show clear error messages if something goes wrong. 