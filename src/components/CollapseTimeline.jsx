import React, { useEffect, useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import * as mdiIcons from '@mdi/js';
import Icon from '@mdi/react'; // MDI React component for rendering icons
import iconConfig from '../icon-config.json';
import { marked } from 'marked';

const getIcon = (name) => {
  // Convert name to MDI format mdi-icon-name
  const iconName = 'mdi' + name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  return mdiIcons[iconName] || mdiIcons[iconConfig.defaults.bullet];
};

// Configure marked to open links in new tabs
marked.use({
  renderer: {
    link(href, title, text) {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" title="${title || ''}">${text}</a>`;
    }
  }
});

const pickThemeIcon = (themeTitle) => {
  const baseMatch = themeTitle.match(/^[^(]+/) || [themeTitle];
  const baseKey = baseMatch[0].trim();
  const iconName = iconConfig.themes[baseKey] || iconConfig.defaults.theme;
  console.log(' Theme Icon:', { theme: baseKey, icon: iconName });
  return getIcon(iconName);
};

const pickBulletIcon = (bulletTitle) => {
  if (!bulletTitle) return null;
  
  // Try exact match first
  if (iconConfig.bullets[bulletTitle]) {
    const iconName = iconConfig.bullets[bulletTitle];
    console.log(' Bullet Icon (exact match):', { title: bulletTitle, icon: iconName });
    return getIcon(iconName);
  }

  // Try partial match
  for (const [key, value] of Object.entries(iconConfig.bullets)) {
    if (bulletTitle.includes(key)) {
      console.log(' Bullet Icon (partial match):', { title: bulletTitle, matchedKey: key, icon: value });
      return getIcon(value);
    }
  }

  console.log(' No bullet icon found for:', bulletTitle);
  return getIcon(iconConfig.defaults.bullet);
};

// getIconForTheme is now just an alias for pickThemeIcon for backward compatibility
const getIconForTheme = pickThemeIcon;

// getIconForBullet is now just an alias for pickBulletIcon for backward compatibility
const getIconForBullet = pickBulletIcon;

const parseMarkdown = (markdown) => {
  console.group('Parsing Markdown');
  // Remove BOM and normalize line endings
  const cleanMarkdown = markdown.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const lines = cleanMarkdown.split('\n');
  let timelineData = {
    mainTitle: '',
    dateRange: '',
    sections: []
  };

  let currentSection = null;
  let currentTheme = null;
  let lineNumber = 0;

  const debugLine = (line) => {
    console.log(`Line ${lineNumber}: ${line.length > 100 ? line.slice(0, 100) + '...' : line}`);
    console.log('Hex:', Array.from(line).map(c => c.charCodeAt(0).toString(16)).join(' '));
  };

  for (let line of lines) {
    lineNumber++;
    // Remove any BOM and trim whitespace
    const trimmed = line.replace(/^\uFEFF/, '').trim();

    // Skip empty lines
    if (!trimmed) {
      console.log(`Line ${lineNumber}: [Empty line]`);
      continue;
    }

    // Skip horizontal rules
    if (trimmed.match(/^-{3,}$|^\*{3,}$|^_{3,}$/)) {
      console.log(`Line ${lineNumber}: [Horizontal rule]`);
      continue;
    }

    // Debug any line that doesn't match our patterns
    const isHeading1 = /^#\s+/.test(trimmed);
    const isHeading2 = /^#{2}\s+/.test(trimmed);
    const isHeading3 = /^#{3}\s+/.test(trimmed);
    const isBullet = /^-\s+/.test(trimmed);

    if (!isHeading1 && !isHeading2 && !isHeading3 && !isBullet && trimmed) {
      console.log('⚠️ Unrecognized line pattern:');
      debugLine(trimmed);
    }

    // Main title (H1)
    if (isHeading1) {
      const titleParts = trimmed.substring(2).split(':');
      timelineData.mainTitle = titleParts[0].trim();
      if (titleParts[1]) {
        timelineData.dateRange = titleParts[1].trim();
      }
      console.log(`📑 Line ${lineNumber} - Main Title:`, timelineData.mainTitle);
    }
    // Section (H2)
    else if (isHeading2) {
      currentSection = {
        title: trimmed.replace(/^#{2}\s*/, '').trim(),
        themes: []
      };
      console.log(`📅 Line ${lineNumber} - New Section:`, currentSection.title);
      timelineData.sections.push(currentSection);
    }
    // Theme (H3)
    else if (isHeading3) {
      if (!currentSection) {
        console.warn('⚠️ Theme found without a parent section:', trimmed);
        continue;
      }
      currentTheme = {
        title: trimmed.replace(/^#{3}\s*/, '').trim(),
        items: []
      };
      console.log(`🏷️ Line ${lineNumber} - New Theme:`, currentTheme.title);
      currentSection.themes.push(currentTheme);
    }
    // Bullet point
    else if (isBullet) {
      if (!currentTheme) {
        console.warn('⚠️ Bullet point found without a parent theme:', trimmed);
        continue;
      }
      const itemText = trimmed.replace(/^-\s*/, '').trim();
      const titleMatch = itemText.match(/\*\*(.*?):\*\*/);
      let bulletTitle = null;
      let description = itemText;

      if (titleMatch) {
        bulletTitle = titleMatch[1];
        description = itemText.slice(titleMatch[0].length).trim();
      }

      const item = {
        title: bulletTitle,
        description
      };
      console.log(`📌 Line ${lineNumber} - New Item:`, bulletTitle || description.slice(0, 30) + '...');
      currentTheme.items.push(item);
    }
  }

  // Log final structure statistics
  const stats = {
    mainTitle: timelineData.mainTitle,
    dateRange: timelineData.dateRange,
    sectionCount: timelineData.sections.length,
    sections: timelineData.sections.map(section => ({
      title: section.title,
      themeCount: section.themes.length,
      themes: section.themes.map(theme => ({
        title: theme.title,
        itemCount: theme.items.length
      }))
    }))
  };

  console.log('📊 Final Structure:', stats);
  console.groupEnd();
  return timelineData;
};

const toFileName = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
};

const makeFileName = (sectionTitle, themeTitle) => {
  const safeSection = toFileName(sectionTitle);
  const safeTheme = toFileName(themeTitle);
  return `${safeSection}__${safeTheme}.md`;
};

const Modal = ({ content, title, dateRange, icon, onClose }) => {
  if (!title) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close clickable" onClick={onClose}>×</button>
        {icon && (
          <div className="modal-icon">
            <Icon path={icon} size={1} />
          </div>
        )}
        <h2 className="modal-title">
          {title}
          {dateRange && <span className="modal-date-range">({dateRange})</span>}
        </h2>
        <div className={`modal-body ${!content ? 'empty' : ''}`}>
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
          ) : (
            <p>Coming soon...</p>
          )}
        </div>
      </div>
    </div>
  );
};

function CollapseTimeline({ markdownContent }) {
  const [timelineData, setTimelineData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalDateRange, setModalDateRange] = useState('');
  const [modalIcon, setModalIcon] = useState(null);

  const handleContentClick = async (type, sectionTitle, themeTitle = '', itemTitle = '') => {
    let fileName;
    let title;
    let icon = null;

    switch (type) {
      case 'section':
        fileName = makeFileName(sectionTitle, '');
        title = sectionTitle;
        break;
      case 'theme':
        fileName = makeFileName(sectionTitle, themeTitle);
        title = themeTitle;
        break;
      case 'item':
        fileName = makeFileName(`${sectionTitle}_${themeTitle}`, itemTitle);
        title = itemTitle;
        icon = getIconForBullet(itemTitle) || getIconForTheme(themeTitle);
        break;
      default:
        console.warn('Unknown content type:', type);
        return;
    }

    try {
      const res = await fetch(`${process.env.PUBLIC_URL}/content/${fileName}`);
      const contentType = res.headers.get('content-type');
      if (!res.ok || !contentType?.includes('text/markdown')) {
        throw new Error('Not found or invalid content type');
      }
      const content = await res.text();
      setModalContent(content || '');
    } catch (err) {
      console.log('No content found:', err.message);
      setModalContent('');
    }
    setModalTitle(title);
    setModalDateRange(title.match(/\((.*?)\)/)?.[1] || '');
    if (icon) setModalIcon(icon);
    setModalOpen(true);
  };

  useEffect(() => {
    if (markdownContent) {
      console.group('Timeline Initialization');
      console.log(' Received markdown content length:', markdownContent.length);
      const parsed = parseMarkdown(markdownContent);
      setTimelineData(parsed);
      console.groupEnd();
    }
  }, [markdownContent]);

  useEffect(() => {
    if (timelineData) {
      console.group('Timeline Icons');
      timelineData.sections.forEach(section => {
        section.themes.forEach(theme => {
          console.log(' Theme Icon:', { theme: theme.title, icon: pickThemeIcon(theme.title) });
          theme.items.forEach(item => {
            if (item.title) {
              console.log(' Bullet Icon (exact match):', { title: item.title, icon: pickBulletIcon(item.title) });
            }
          });
        });
      });
      console.groupEnd();
    }
  }, [timelineData]);

  if (!timelineData) {
    console.log(' Timeline data not ready');
    return null;
  }

  console.log(' Rendering timeline');

  const renderTimelineElements = () => {
    const elements = [];
    timelineData.sections.forEach((section, sectionIndex) => {
      // Add section header as a regular heading
      elements.push(
        <div 
          key={`section-${sectionIndex}`} 
          className="timeline-section-header clickable"
          onClick={() => handleContentClick('section', section.title)}
        >
          <h2 className="timeline-section-title">
            {section.title}
          </h2>
          <Icon path={getIcon('information-outline')} size={1} className="info-icon" />
        </div>
      );

      section.themes.forEach((theme, themeIndex) => {
        const themeIcon = getIconForTheme(theme.title);
        
        // Add theme header as a regular heading
        elements.push(
          <div 
            key={`theme-${sectionIndex}-${themeIndex}`} 
            className="timeline-theme-header clickable"
            onClick={() => handleContentClick('theme', section.title, theme.title)}
          >
            <h3 className="timeline-theme-title">
              {theme.title}
            </h3>
            <Icon path={getIcon('information-outline')} size={1} className="info-icon" />
          </div>
        );

        // Add theme items as timeline elements
        theme.items.forEach((item, itemIndex) => {
          const bulletIcon = getIconForBullet(item.title || item.description) || themeIcon;
          const backgroundColor = itemIndex % 2 === 0 ? 'rgb(45,45,45)' : 'rgb(55,55,55)';
          elements.push(
            <VerticalTimelineElement
              key={`item-${sectionIndex}-${themeIndex}-${itemIndex}`}
              className="vertical-timeline-element--item"
              contentStyle={{ 
                background: backgroundColor,
                color: '#fff',
                padding: 0,
                position: 'relative'
              }}
              contentArrowStyle={{ 
                borderRight: `7px solid ${backgroundColor}`,
                borderTop: '7px solid transparent',
                borderBottom: '7px solid transparent'
              }}
              iconStyle={{ background: 'rgb(45, 45, 45)', color: '#fff' }}
              icon={<Icon path={bulletIcon} size={1} />}
              date={theme.title.match(/\((.*?)\)/)?.[1] || ''}
            >
              <div 
                onClick={() => handleContentClick('item', section.title, theme.title, item.title || item.description)}
                className="clickable"
                style={{ 
                  padding: '24px',
                  position: 'relative',
                  minHeight: '80px'
                }}
              >
                <Icon path={getIcon('information-outline')} size={1} className="info-icon" />
                {item.title && (
                  <h4 className="vertical-timeline-element-subtitle">
                    {item.title}
                  </h4>
                )}
                <p>{item.description}</p>
              </div>
            </VerticalTimelineElement>
          );
        });
      });
    });

    return elements;
  };

  return (
    <div className="timeline-container">
      <h1 className="timeline-main-title">
        {timelineData.mainTitle}
        {timelineData.dateRange && <div className="timeline-date-range">({timelineData.dateRange})</div>}
      </h1>
      <div className="timeline-credit">
        Content by <a href="https://www.reddit.com/user/HyperSmart_CatLady/" target="_blank" rel="noopener noreferrer">HyperSmart_CatLady</a> {' '}who <a href="https://www.reddit.com/r/conspiracy/comments/1hxz871/predictive_timeline_of_society_collapsing_20252050/" target="_blank" rel="noopener noreferrer">posted this timeline on Reddit</a>. Copy <a href="https://github.com/harryf/collapse-timeline/" target="_blank" rel="noopener noreferrer">this project here</a>.
        <div className="quote-section">
          <p><i>&quot;I think the Apocalypse is round the corner and it's going to be great&quot;</i> - <a href="https://en.wikipedia.org/wiki/Alan_Moore" target="_blank" rel="noopener noreferrer">Alan Moore</a> - <a href="https://www.youtube.com/watch?v=cBc71ROdGxU" target="_blank" rel="noopener noreferrer"><Icon path={mdiIcons.mdiPlayCircle} size={0.7} /> Watch Video</a></p>
        </div>
      </div>
      <VerticalTimeline
        className="vertical-timeline-custom-line"
        animate={true}
        lineColor={'#555'}
      >
        {renderTimelineElements()}
      </VerticalTimeline>
      {modalOpen && (
        <Modal
          content={modalContent}
          title={modalTitle}
          dateRange={modalDateRange}
          icon={modalIcon}
          onClose={() => {
            setModalOpen(false);
            setModalContent('');
            setModalTitle('');
            setModalDateRange('');
            setModalIcon(null);
          }}
        />
      )}
    </div>
  );
};

export default CollapseTimeline;
