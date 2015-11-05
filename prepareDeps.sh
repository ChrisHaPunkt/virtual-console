#!/bin/bash
cd NodeServer/
echo "Cleaning up installes modules"
rm -rf node_modules/*
echo "Installing needed dependencies..."
npm install --silent
cd ../