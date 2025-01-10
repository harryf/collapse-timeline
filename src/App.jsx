import React, { useEffect, useState } from 'react';
import CollapseTimeline from './components/CollapseTimeline';
import './App.css';

function App() {
  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    // Get the base URL from the homepage in package.json
    const baseUrl = process.env.PUBLIC_URL || '';
    fetch(`${baseUrl}/collapse.md`)
      .then(response => response.text())
      .then(content => setMarkdownContent(content))
      .catch(error => console.error('Error loading markdown:', error));
  }, []);

  return (
    <div className="App">
      <CollapseTimeline markdownContent={markdownContent} />
    </div>
  );
}

export default App;
