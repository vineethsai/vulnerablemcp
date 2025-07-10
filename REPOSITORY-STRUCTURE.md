# Repository Structure

This repository uses a clean separation between source files and built website files across two branches.

## Main Branch (Source & Development)

Contains all source files and development tools:

### Source Files
- `vulnerabilities.md` - Vulnerability database (edit this to add vulnerabilities)
- `README.md` - Repository documentation  
- `UPDATE-GUIDE.md` - Instructions for adding vulnerabilities
- `REPOSITORY-STRUCTURE.md` - This file

### Build Scripts & Tools
- `update-stable.js` - Script to generate HTML from markdown
- `package.json` - Node.js dependencies and scripts
- `package-lock.json` - Dependency lockfile
- `rebuild_and_deploy.sh` - Deployment script
- `server.js` - Local development server

### Development Files
- `node_modules/` - Node.js dependencies (ignored by git)
- `.gitignore` - Git ignore rules
- `.git/` - Git repository data

## GH-Pages Branch (Website Files Only)

Contains only the built website files served at https://vulnerablemcp.info:

### Website Files
- `index.html` - Generated main page
- `about.html` - About page
- `security.html` - Security page  
- `etdi-security.html` - ETDI security page
- `assets/` - CSS, JS, and other assets
- `CNAME` - Domain configuration

### Images & Media
- `*.png` - Diagrams and images
- `favicon.ico` / `favicon.svg` - Site icons

## Workflow

1. **Edit source**: Work on `main` branch, edit `vulnerabilities.md`
2. **Build**: Run `npm run update` to generate HTML
3. **Commit**: Commit changes to `main` branch
4. **Deploy**: Run `./rebuild_and_deploy.sh` to copy website files to `gh-pages`

## Important Notes

- ✅ **DO**: Edit files on `main` branch
- ❌ **DON'T**: Manually edit files on `gh-pages` branch
- ✅ **DO**: Use the deployment script to update the website
- ❌ **DON'T**: Mix source and built files on the same branch

This structure keeps the repository clean and prevents confusion about which files need to be updated. 