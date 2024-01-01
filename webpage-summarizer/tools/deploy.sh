#!/bin/bash

set -e

function deploy() {
  source .env

  setup_file="src/modules/setup.ts"

  sed -i '' -e "s/YOUR_GITHUB_USERNAME/$GITHUB_OWNER/g" $setup_file
  sed -i '' -e "s/YOUR_GITHUB_REPO/$GITHUB_REPO/g" $setup_file
  sed -i '' -e "s/YOUR_GITHUB_TOKEN/$GITHUB_TOKEN/g" $setup_file
  sed -i '' -e "s/YOUR_GITHUB_WORKFLOW_ID/$GITHUB_WORKFLOW_ID/g" $setup_file
  sed -i '' -e "s/YOUR_OPENAI_API_KEY/$OPENAI_API_KEY/g" $setup_file
  sed -i '' -e "s/YOUR_WEBPAGE_SUMMARIZER_API_KEY/$WEBPAGE_SUMMARIZER_API_KEY/g" $setup_file
  echo "Substituted the environment variables in $setup_file"

  echo "clasp push --force"
  clasp push --force

  sed -i '' -e "s/$GITHUB_OWNER/YOUR_GITHUB_USERNAME/g" $setup_file
  sed -i '' -e "s/$GITHUB_REPO/YOUR_GITHUB_REPO/g" $setup_file
  sed -i '' -e "s/$GITHUB_TOKEN/YOUR_GITHUB_TOKEN/g" $setup_file
  sed -i '' -e "s/$GITHUB_WORKFLOW_ID/YOUR_GITHUB_WORKFLOW_ID/g" $setup_file
  sed -i '' -e "s/$OPENAI_API_KEY/YOUR_OPENAI_API_KEY/g" $setup_file
  sed -i '' -e "s/$WEBPAGE_SUMMARIZER_API_KEY/YOUR_WEBPAGE_SUMMARIZER_API_KEY/g" $setup_file
  echo "Reverted the environment variables in $setup_file"
}

if [ ! -e .clasp.json.$1 ]; then
  deploy
  exit 0
fi

filename=".clasp.json.$1"
echo $filename

echo "Rename $filename to .clasp.json"
mv $filename .clasp.json

set +e
deploy

echo "Revert filename from .clasp.json to $filename"
mv .clasp.json $filename
