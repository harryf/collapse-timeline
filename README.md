# Collapse Timeline Viewer

A React application that renders a vertical timeline from a Markdown file using react-vertical-timeline-component. Perfect for visualizing historical events, project milestones, or any chronological data in an attractive, interactive format.

## Prerequisites

Before you begin, make sure you have the following installed on your computer:

1. **Node.js and npm** (Node Package Manager)
   - Download and install from [Node.js official website](https://nodejs.org/)
   - Recommended version: 14.x or higher

2. **Git**
   - Download and install from [Git official website](https://git-scm.com/)
   - Required for version control and deploying to GitHub Pages

## Getting Started

1. **Clone or Download this Repository**
   ```bash
   git clone https://github.com/yourusername/collapse-timeline.git
   cd collapse-timeline
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Add Your Timeline Content**
   - Create a Markdown file named `collapse.md`
   - Place it in the `public` directory
   - Format your timeline entries following this structure:
     ```markdown
     # Event Title
     ## 2024-01-01
     Event description here
     ```

4. **Start the Development Server**
   ```bash
   npm start
   ```
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - The page will automatically reload when you make changes

## Publishing to GitHub Pages

1. **Create a GitHub Repository**
   - Go to [GitHub](https://github.com)
   - Click the "+" icon in the top right and select "New repository"
   - Name your repository and make it public
   - Don't initialize it with any files if you're pushing an existing project

2. **Update package.json**
   - Open `package.json`
   - Change the "homepage" field to match your GitHub Pages URL:
     ```json
     "homepage": "https://yourusername.github.io/repository-name"
     ```

3. **Push Your Code to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/repository-name.git
   git branch -M main
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

4. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```
   - This will build your project and publish it to the `gh-pages` branch
   - Your timeline will be available at `https://yourusername.github.io/repository-name`

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

## Troubleshooting

1. **Timeline Not Updating**
   - Make sure your `collapse.md` file is in the correct format
   - Check that the file is in the `public` directory
   - Clear your browser cache and reload

2. **Deployment Issues**
   - Verify your repository settings under Settings > Pages
   - Ensure the "homepage" in package.json matches your GitHub Pages URL
   - Check that the `gh-pages` branch is set as the source in repository settings

## Need Help?

- For React.js issues: [React Documentation](https://reactjs.org/docs/getting-started.html)
- For GitHub Pages help: [GitHub Pages Documentation](https://docs.github.com/en/pages)
- For timeline component details: [react-vertical-timeline-component](https://www.npmjs.com/package/react-vertical-timeline-component)

## License

This project is open source and available under the MIT License.
