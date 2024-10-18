#!/bin/bash

# Base directory for stock plugins
BASE_DIR="stock-plugins"
# Array to store the names of successfully built packages
BUILT_PACKAGES=()

# Iterate through each plugin directory
for plugin_dir in "$BASE_DIR"/aiverify.stock.*; do
    # Check if it's a directory
    if [ -d "$plugin_dir" ]; then
        # Navigate to the algorithms directory
        algo_dir="$plugin_dir/algorithms"
        for algo_subdir in "$algo_dir"/*; do
            # Check if it's a directory
            if [ -d "$algo_subdir" ]; then
                # Check if pyproject.toml exists
                if [ -f "$algo_subdir/pyproject.toml" ]; then
                    echo "Building package in $algo_subdir"
                    # Remove the dist subfolder if it exists
                    if [ -d "$algo_subdir/dist" ]; then
                        rm -rf "$algo_subdir/dist"
                    fi
                    # Navigate to the directory and build the package
                    (cd "$algo_subdir" && hatch build)
                    if [ $? -eq 0 ]; then
                        # Add the package name to the array
                        BUILT_PACKAGES+=("$algo_subdir")
                    else
                        echo "Failed to build package in $algo_subdir"
                    fi
                fi
            fi
        done
    fi
done

# List all the packages that were successfully built
echo "Packages built successfully:"
for package in "${BUILT_PACKAGES[@]}"; do
    echo "$package"
done