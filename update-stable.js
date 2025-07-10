const fs = require('fs');
const path = require('path');

// File paths
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
      } else if (line.trim() !== '' && !line.startsWith('**')) {
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

// Function to generate vulnerability cards HTML matching the stable UI structure
function generateVulnerabilityCardsHTML(vulnerabilities) {
  let html = '';
  
  vulnerabilities.forEach(vuln => {
    // Create a clean comment-safe title
    const commentTitle = vuln.title.replace(/<!--/g, '').replace(/-->/g, '');
    
    html += `
            <!-- ${commentTitle} -->
            <div class="vulnerability-card" data-category="${vuln.category.toLowerCase()}" data-severity="${vuln.severity.toLowerCase()}">
                <div class="card-header">
                    <div class="issue-title">${vuln.title}</div>
                    <span class="severity-badge severity-${vuln.severity.toLowerCase()}">${vuln.severity}</span>
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
            </div>`;
  });
  
  return html;
}

// Main function
async function updateWebsite() {
  try {
    console.log('Reading vulnerabilities.md...');
    
    // Read the markdown file
    const markdownContent = fs.readFileSync(vulnerabilitiesPath, 'utf8');
    
    // Parse vulnerabilities
    const vulnerabilities = parseVulnerabilities(markdownContent);
    console.log(`Found ${vulnerabilities.length} vulnerabilities`);
    
    // Generate HTML for vulnerability cards
    const vulnerabilityCardsHTML = generateVulnerabilityCardsHTML(vulnerabilities);
    
    console.log('Reading current index.html...');
    
    // Read the current index.html
    const currentHTML = fs.readFileSync(outputPath, 'utf8');
    
    // Find the vulnerability cards section and replace it
    // Look for the pattern: <div class="issues-grid"> ... </div> (before the list view container)
    const gridStartPattern = /<div class="issues-grid">/;
    const gridEndPattern = /<\/div>\s*<!-- List View Container -->/;
    
    const startMatch = currentHTML.match(gridStartPattern);
    const endMatch = currentHTML.match(gridEndPattern);
    
    if (!startMatch || !endMatch) {
      throw new Error('Could not find vulnerability cards section in index.html');
    }
    
    const beforeGrid = currentHTML.substring(0, startMatch.index + startMatch[0].length);
    const afterGrid = currentHTML.substring(endMatch.index);
    
    // Reconstruct the HTML with new vulnerability cards
    const updatedHTML = beforeGrid + vulnerabilityCardsHTML + '\n\n        </div>\n\n        ' + afterGrid;
    
    // Write the updated content to index.html
    fs.writeFileSync(outputPath, updatedHTML);
    
    console.log('✅ Website updated successfully!');
    console.log(`✅ Updated ${vulnerabilities.length} vulnerabilities`);
    console.log('✅ Stable UI structure preserved');
  } catch (error) {
    console.error('❌ Error updating website:', error);
    process.exit(1);
  }
}

// Run the update
updateWebsite(); 