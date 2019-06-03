#!/bin/sh
cd C:\\Users\\mac\\vsProject\\node-blog\\blog1\\src\\logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log