---
title: Bookmark Quick Save
description: A Chrome extension that saves the current page straight into a chosen bookmark position.
label: Chrome extension · React / TypeScript
---

## About the project

Bookmark Quick Save is a Chrome Manifest V3 extension built with React, TypeScript and Vite. One pick is enough to save the current page.

It merges the target folder and insertion position into a single bookmark tree, cutting down the repeated opening of folders and confirming of positions when saving bookmarks.

## Features

- Reads the active tab’s title, URL and favicon automatically
- Choose both folder and insertion position in a tree picker
- Expands the most-used Bookmarks Bar by default
- Single-click a folder to save at the top, double-click to expand or collapse
- Click an existing bookmark to insert the new one before it, or choose the end of the folder
- Follows the system language, with Simplified Chinese and English
- Remembers the last chosen position and language preference
- Moves an existing bookmark when the current folder already contains the same URL

## Stack

React · TypeScript · Vite · Chrome Extension Manifest V3
