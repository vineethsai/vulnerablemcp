#!/bin/bash

# Script to pull from main, rebuild the website, and push to gh-pages
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

# Step 1: Switch to main branch and pull latest changes
echo_color "blue" "=== Step 1: Pulling latest from main ==="
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
  echo_color "yellow" "Switching to main branch..."
  git checkout main
  if [ $? -ne 0 ]; then
    echo_color "red" "Error: Failed to switch to main branch."
    exit 1
  fi
fi

echo_color "yellow" "Pulling latest changes from remote..."
git pull origin main
if [ $? -ne 0 ]; then
  echo_color "red" "Error: Failed to pull changes from remote. Please resolve conflicts manually."
  exit 1
fi

# Step 2: Rebuild the website
echo_color "blue" "=== Step 2: Rebuilding the website ==="
echo_color "yellow" "Running update script to regenerate the website..."
node update.js
if [ $? -ne 0 ]; then
  echo_color "red" "Error: Failed to run update script."
  exit 1
fi

# Step 3: Switch to gh-pages and deploy
echo_color "blue" "=== Step 3: Deploying to gh-pages ==="
echo_color "yellow" "Saving any uncommitted changes on main..."
git add .
git commit -m "Auto-rebuild: Save changes before switching to gh-pages" --allow-empty
if [ $? -ne 0 ]; then
  echo_color "red" "Error: Failed to commit changes on main."
  exit 1
fi

echo_color "yellow" "Switching to gh-pages branch..."
git checkout gh-pages
if [ $? -ne 0 ]; then
  echo_color "red" "Error: Failed to switch to gh-pages branch."
  exit 1
fi

echo_color "yellow" "Pulling latest changes from gh-pages..."
git pull origin gh-pages
if [ $? -ne 0 ]; then
  echo_color "yellow" "Merge conflicts detected. Attempting to resolve conflicts..."
  git reset --hard origin/gh-pages
fi

echo_color "yellow" "Merging changes from main branch..."
git merge main -X theirs
if [ $? -ne 0 ]; then
  echo_color "yellow" "Merge conflicts detected. Attempting to resolve by using main branch version..."
  git checkout --theirs .
  git add .
  git commit -m "Resolve merge conflicts by using main branch version"
  
  if [ $? -ne 0 ]; then
    echo_color "red" "Error: Failed to resolve conflicts automatically. Please resolve conflicts manually."
    exit 1
  fi
fi

# Ensure CNAME file exists with correct domain
echo_color "yellow" "Ensuring CNAME file exists with domain: $DOMAIN"
echo "$DOMAIN" > CNAME
git add CNAME

echo_color "yellow" "Pushing changes to gh-pages..."
git push origin gh-pages
if [ $? -ne 0 ]; then
  echo_color "red" "Error: Failed to push changes to gh-pages."
  exit 1
fi

# Switch back to main branch
echo_color "yellow" "Switching back to main branch..."
git checkout main

echo_color "green" "=== Deployment completed successfully! ==="
echo_color "green" "✓ Pulled latest from main"
echo_color "green" "✓ Rebuilt the website"
echo_color "green" "✓ Deployed to gh-pages"
