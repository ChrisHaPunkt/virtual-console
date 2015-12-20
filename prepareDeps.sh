#!/bin/bash
cd NodeServer/
echo "Cleaning up installed modules"
rm -rf node_modules/*
echo "Installing needed dependencies..."
npm install --silent
cd ../

exit 0
