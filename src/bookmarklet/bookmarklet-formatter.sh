#!/bin/bash

set -e

# Read the content of the JavaScript file
content="$(cat webpage-summary-bookmarklet.js)"

# URI encode the content and prepend the javascript: scheme
encoded_content="$(printf "%s" "${content}" | jq -s -R -r @uri)"
bookmarklet="javascript:${encoded_content}"

# Save the bookmarklet to a file
echo "${bookmarklet}" > webpage-summary-bookmarklet.txt

# Print the bookmarklet
echo "Generated Bookmarklet:"
echo "${bookmarklet}"
echo "Please use it in your browser."
echo "Enjoy!"
