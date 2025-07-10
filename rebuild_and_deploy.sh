#!/bin/bash

# Script to build website from main and deploy only built files to gh-pages
# Usage: ./rebuild_and_deploy.sh

# Domain for GitHub Pages CNAME
DOMAIN="vulnerablemcp.info"

# Function to display messages with color
function echo_color() {
  local color=$1
  local message=$2
  
  case $color in
    "green") echo -e "\033[0;32m$message\033[0m" ;;
    "red") echo -e "\033[0;31m$message\033[0m" ;;
    "yellow") echo -e "\033[0;33m$message\033[0m" ;;
    "blue") echo -e "\033[0;34m$message\033[0m" ;;
    *) echo "$message" ;;
  esac
}

# Check if we're in the right repository
repo_dir=$(pwd)
if [[ ! "$repo_dir" =~ "vulnerablemcp" ]]; then
  echo_color "red" "Error: Please run this script from the vulnerablemcp repository."
  exit 1
fi

# Step 1: Ensure we're on main and pull latest changes
echo_color "blue" "=== Step 1: Preparing main branch ==="
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
  echo_color "yellow" "Switching to main branch..."
  git checkout main
  if [ $? -ne 0 ]; then
    echo_color "red" "Error: Failed to switch to main branch."
    exit 1
  fi
fi

echo_color "yellow" "Pulling latest changes from remote main..."
git pull origin main
if [ $? -ne 0 ]; then
  echo_color "red" "Error: Failed to pull changes from remote. Please resolve conflicts manually."
  exit 1
fi

# Step 2: Build the website
echo_color "blue" "=== Step 2: Building website ==="
echo_color "yellow" "Running build script to generate HTML..."
npm run update
if [ $? -ne 0 ]; then
  echo_color "red" "Error: Failed to build website."
  exit 1
fi

# Step 3: Commit any changes to main
echo_color "yellow" "Committing any changes to main..."
git add .
git commit -m "Build: Update website files" --allow-empty

# Step 4: Deploy to gh-pages
echo_color "blue" "=== Step 3: Deploying to gh-pages ==="
echo_color "yellow" "Switching to gh-pages branch..."
git checkout gh-pages
if [ $? -ne 0 ]; then
  echo_color "red" "Error: Failed to switch to gh-pages branch."
  exit 1
fi

echo_color "yellow" "Pulling latest gh-pages..."
git pull origin gh-pages --allow-unrelated-histories

# Step 5: Copy only the built website files from main
echo_color "yellow" "Copying built website files from main..."

# Copy website files
git checkout main -- index.html
git checkout main -- assets/
git checkout main -- about.html
git checkout main -- security.html
git checkout main -- etdi-security.html
git checkout main -- *.css 2>/dev/null || true
git checkout main -- *.js 2>/dev/null || true
git checkout main -- *.png
git checkout main -- *.svg
git checkout main -- *.ico
git checkout main -- favicon.*

# Ensure CNAME file exists
echo_color "yellow" "Setting up CNAME for domain: $DOMAIN"
echo "$DOMAIN" > CNAME

# Step 6: Commit and push to gh-pages
echo_color "yellow" "Committing website files to gh-pages..."
git add .
git commit -m "Deploy: Update website from main branch $(date '+%Y-%m-%d %H:%M:%S')"

echo_color "yellow" "Pushing to gh-pages..."
git push origin gh-pages
if [ $? -ne 0 ]; then
  echo_color "red" "Error: Failed to push to gh-pages."
  exit 1
fi

# Step 7: Switch back to main
echo_color "yellow" "Switching back to main branch..."
git checkout main

echo_color "green" "=== Deployment completed successfully! ==="
echo_color "green" "✓ Built website on main branch"
echo_color "green" "✓ Deployed only website files to gh-pages"
echo_color "green" "✓ Website available at: https://$DOMAIN"
echo_color "blue" "📁 Source files (vulnerabilities.md, scripts) remain on main"
echo_color "blue" "🌐 Website files (HTML, CSS, JS) deployed to gh-pages"
