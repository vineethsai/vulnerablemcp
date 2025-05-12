const fs = require('fs');
const path = require('path');
const marked = require('marked');

// Read the template file
const templatePath = path.join(__dirname, 'template.html');
const vulnerabilitiesPath = path.join(__dirname, 'vulnerabilities.md');
const outputPath = path.join(__dirname, 'index.html');

// Function to parse markdown content
function parseVulnerabilities(markdownContent) {
  // Split the markdown by the separator
  const vulnerabilitySections = markdownContent.split('---').filter(section => section.trim() !== '');
  
  const vulnerabilities = [];
  
  vulnerabilitySections.forEach(section => {
    const lines = section.trim().split('\n');
    
    // Extract title (assuming it's an h2)
    const titleMatch = lines[0].match(/^## (.+)$/);
    if (!titleMatch) return;
    
    const title = titleMatch[1];
    
    // Extract metadata
    let severity = '';
    let category = '';
    let reportedBy = '';
    let date = '';
    let tags = [];
    let url = '';
    let description = '';
    
    let inDescription = false;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('**Severity:**')) {
        severity = line.replace('**Severity:**', '').trim();
      } else if (line.startsWith('**Category:**')) {
        category = line.replace('**Category:**', '').trim();
      } else if (line.startsWith('**Reported By:**')) {
        reportedBy = line.replace('**Reported By:**', '').trim();
      } else if (line.startsWith('**Date:**')) {
        date = line.replace('**Date:**', '').trim();
      } else if (line.startsWith('**Tags:**')) {
        tags = line.replace('**Tags:**', '').trim().split(',').map(tag => tag.trim());
      } else if (line.startsWith('**URL:**')) {
        url = line.replace('**URL:**', '').trim();
      } else if (line.trim() !== '') {
        if (!inDescription) {
          inDescription = true;
        }
        description += line + '\n';
      }
    }
    
    vulnerabilities.push({
      title,
      severity,
      category,
      reportedBy,
      date,
      tags,
      url,
      description: description.trim()
    });
  });
  
  return vulnerabilities;
}

// Function to generate HTML for vulnerabilities
function generateVulnerabilitiesHTML(vulnerabilities) {
  let html = '';
  
  vulnerabilities.forEach(vuln => {
    const idSlug = vuln.title.toLowerCase().replace(/[^\w]+/g, '-');
    
    html += `
            <!-- Issue: ${vuln.title} -->
            <div class="issue-card" data-category="${vuln.category.toLowerCase()}" data-severity="${vuln.severity.toLowerCase()}">
                <div class="card-header">
                    <div class="issue-title">${vuln.title}</div>
                    <span class="severity ${vuln.severity.toLowerCase()}">${vuln.severity}</span>
                </div>
                <div class="card-body">
                    <p class="issue-description">
                        ${vuln.description}
                    </p>
                    <div class="tags">
                        ${vuln.tags.map(tag => `<span class="tag">${tag}</span>`).join('\n                        ')}
                    </div>
                    <div class="meta-info">
                        <span><i class="far fa-calendar"></i> ${vuln.date}</span>
                        <span><i class="fas fa-user"></i> ${vuln.reportedBy}</span>
                    </div>
                    <a href="${vuln.url}" class="btn" target="_blank">View Details</a>
                </div>
            </div>
`;
  });
  
  return html;
}

// Main function
async function updateWebsite() {
  try {
    // Check if template exists, if not, create it from current index.html
    if (!fs.existsSync(templatePath)) {
      console.log('Template file not found. Creating from current index.html...');
      const currentIndex = fs.readFileSync(outputPath, 'utf8');
      
      // Replace the vulnerabilities section with a placeholder
      const templateContent = currentIndex.replace(
        /(<div class="issues-grid">)[\s\S]*?(<\/div>\s*<\/main>)/m,
        '$1\n            <!-- VULNERABILITIES_PLACEHOLDER -->\n        $2'
      );
      
      fs.writeFileSync(templatePath, templateContent);
      console.log('Template created successfully.');
    }
    
    // Read the markdown file
    const markdownContent = fs.readFileSync(vulnerabilitiesPath, 'utf8');
    
    // Parse vulnerabilities
    const vulnerabilities = parseVulnerabilities(markdownContent);
    
    // Generate HTML
    const vulnerabilitiesHTML = generateVulnerabilitiesHTML(vulnerabilities);
    
    // Read the template
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    
    // Replace the placeholder with the generated HTML
    const updatedContent = templateContent.replace(
      /<!-- VULNERABILITIES_PLACEHOLDER -->/,
      vulnerabilitiesHTML
    );
    
    // Write the updated content to index.html
    fs.writeFileSync(outputPath, updatedContent);
    
    console.log('Website updated successfully!');
  } catch (error) {
    console.error('Error updating website:', error);
  }
}

// Run the update
updateWebsite();
