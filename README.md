# Collapse Timeline Viewer

A React application that renders a vertical timeline from a Markdown file using react-vertical-timeline-component.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy your markdown file to the `public` directory and name it `collapse.md`

3. Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000

## Features

- Parses Markdown files with a specific timeline structure
- Renders an interactive vertical timeline
- Uses Font Awesome icons for different event categories
- Responsive design that works on mobile and desktop
- Supports Markdown formatting within event descriptions

## Project Structure

- `src/components/CollapseTimeline.jsx`: Main timeline component
- `src/App.jsx`: Root application component
- `src/App.css`: Application styles
- `public/collapse.md`: Your timeline content
