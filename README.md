# Shopping Penguin Client

This application delivers an elegant, friendly system for shopping lists. Items are grouped by store (grocery, hardware, etc.) and category (produce, lumber, etc.) so that users can easily see the items they need to buy when they are in that section of the store. Items and categories can be added and changed through the intuitive interface. Lists are stored both locally on the user's browser and in a MongoDB database with encrypted user authentication for security and portability.

The system uses React, TypeScript and Tailwind on the front end with a back end combination of an Express REST API running on Node.js and MongoDB. Hosting is being done on MongoDB Atlas, Render, and Ionos.

## Table of contents

- [Overview](#overview)
  - [The functionality](#the-functionality)
  - [Screenshot](#screenshot)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The functionality

Users are able to:

- Create, modify, and delete items, categories, and stores
- Mark items as done and unmark items as necessary
- Collapse unneeded stores and categories to simplify the view
- Access all functionality from both mobile and desktop
- Save data and views between sessions for a consistent experience
- Switch between dark and light color schemes
- Login securely for data privacy

### Screenshot

![](./src/images/screenshot.png)

### Links

- Live Site URL: (https://fiel.us/shopping-penguin/)
- Client GitHub: (https://github.com/dmfiel/shopping-penguin)
- Server GitHub: (https://github.com/dmfiel/shopping-penguin-server)

## My process

### Built with

- React API fetching, asynchronous operations, event handling, data manipulation, and DOM updates.
- Tailwind CSS custom properties
- Vite / TSC transpiling and bundling
- Semantic HTML5 markup
- Mobile-first, responsive, accessible layout

### What I learned

Building a production application with React was definitely a learning experience. I really prefer the way that components can be separated to encapsulate the HTML along with the logic and styling. And then it is easy to combine them together into a cohesive application.

Many challenges came when I move the system to hosting. Between the networking configuration, authentication, and build issues, it was surprising how long it took to get the app migrated. For future projects, it will definitely be important to test on remote systems early in order to avoid re-structuring problems later in development.

## Author

David Fiel

- Website - [David Fiel](https://fiel.us)

## Acknowledgments

- Thanks to Per Scholas!
