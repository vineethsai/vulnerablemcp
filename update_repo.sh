#!/bin/bash

# Script to update the vulnerablemcp repository
# This script will pull, rebase, commit, and push changes to both main and gh-pages branches

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

# Function to check if there are any changes to commit
function has_changes() {
  git status --porcelain | grep -q "."
  return $?
}

# Get the commit message from the user
if [ -z "$1" ]; then
  echo_color "yellow" "Please provide a commit message:"
  read commit_message
else
  commit_message="$1"
fi

# Check if the commit message is provided
if [ -z "$commit_message" ]; then
  echo_color "red" "Error: Commit message is required."
  exit 1
fi

# Store the current directory
repo_dir=$(pwd)

# Check if we're in the right repository
if [[ ! "$repo_dir" =~ "vulnerablemcp" ]]; then
  echo_color "red" "Error: Please run this script from the vulnerablemcp repository."
  exit 1
fi

# Update the main branch
echo_color "blue" "\n=== Updating main branch ==="

# Check which branch we're on and switch to main if needed
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
  echo_color "yellow" "Switching to main branch..."
  git checkout main
  if [ $? -ne 0 ]; then
    echo_color "red" "Error: Failed to switch to main branch."
    exit 1
  fi
fi

# Check for uncommitted changes and commit them if needed
if has_changes; then
  echo_color "yellow" "Uncommitted changes detected. Staging changes..."
  git add .
  echo_color "yellow" "Committing changes with message: $commit_message"
  git commit -m "$commit_message"
  if [ $? -ne 0 ]; then
    echo_color "red" "Error: Failed to commit changes."
    exit 1
  fi
fi

# Pull latest changes from remote
echo_color "yellow" "Pulling latest changes from remote..."
git pull --rebase origin main
if [ $? -ne 0 ]; then
  echo_color "red" "Error: Failed to pull changes from remote. Please resolve conflicts manually."
  exit 1
fi

# Run the update script to regenerate index.html
echo_color "yellow" "Running update script to regenerate index.html..."
node update.js
if [ $? -ne 0 ]; then
  echo_color "red" "Error: Failed to run update script."
  exit 1
fi

# Check if there are any changes to commit
if has_changes; then
  # Add all changes
  echo_color "yellow" "Adding changes..."
  git add .
  
  # Commit changes
  echo_color "yellow" "Committing changes..."
  git commit -m "$commit_message"
  if [ $? -ne 0 ]; then
    echo_color "red" "Error: Failed to commit changes."
    exit 1
  fi
  
  # Push changes to remote
  echo_color "yellow" "Pushing changes to remote..."
  git push origin main
  if [ $? -ne 0 ]; then
    echo_color "red" "Error: Failed to push changes to remote."
    exit 1
  fi
  
  echo_color "green" "Successfully updated main branch."
else
  echo_color "green" "No changes to commit on main branch."
fi

# Update the gh-pages branch
echo_color "blue" "\n=== Updating gh-pages branch ==="

# Switch to gh-pages branch
echo_color "yellow" "Switching to gh-pages branch..."
git checkout gh-pages
if [ $? -ne 0 ]; then
  echo_color "red" "Error: Failed to switch to gh-pages branch."
  exit 1
fi

# Check for uncommitted changes and commit them if needed
if has_changes; then
  echo_color "yellow" "Uncommitted changes detected. Staging changes..."
  git add .
  echo_color "yellow" "Committing changes with message: $commit_message"
  git commit -m "$commit_message"
  if [ $? -ne 0 ]; then
    echo_color "red" "Error: Failed to commit changes."
    exit 1
  fi
fi

# Pull latest changes from remote
echo_color "yellow" "Pulling latest changes from remote..."
git pull --rebase origin gh-pages
if [ $? -ne 0 ]; then
  echo_color "yellow" "Merge conflicts detected. Attempting to resolve by using main branch version..."
  git checkout --theirs .
  git add .
  git rebase --continue
  
  if [ $? -ne 0 ]; then
    echo_color "red" "Error: Failed to resolve conflicts automatically. Please resolve conflicts manually."
    exit 1
  fi
fi

# Merge changes from main branch
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

# Push changes to remote
echo_color "yellow" "Pushing changes to remote..."
git push origin gh-pages
if [ $? -ne 0 ]; then
  echo_color "red" "Error: Failed to push changes to remote."
  exit 1
fi

echo_color "green" "Successfully updated gh-pages branch."

# Switch back to main branch
echo_color "yellow" "Switching back to main branch..."
git checkout main

echo_color "green" "\n=== Repository update completed successfully! ==="
echo_color "green" "Main branch: Updated and pushed"
echo_color "green" "gh-pages branch: Updated and pushed"
