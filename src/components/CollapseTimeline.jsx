import React, { useEffect, useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faRobot,
  faChartLine,
  faFire,
  faSkullCrossbones,
  faPooStorm,
  faFireAlt,
  faWater,
  faIcicles,
  faSeedling,
  faTintSlash,
  faHouse,
  faTree,
  faBrain,
  faNetworkWired,
  faEye,
  faCrosshairs,
  faMicrochip,
  faMoneyBillWave,
  faHandFist,
  faGlobe,
  faLandmark,
  faPeopleGroup,
  faPersonWalking,
  faSkull,
  faGavel,
  faBan,
  faLeaf,
  faEarthAmericas,
  faUserLock,
  faBalanceScale,
  faCodeBranch,
  faSun,
  faCalendarDays
} from '@fortawesome/free-solid-svg-icons';
import { marked } from 'marked';
import iconMapping from '../icon-mapping.json';
import bulletIconMapping from '../bullet-icon-mapping.json';

const THEME_ICONS = {
  'fa-bolt': faBolt,
  'fa-robot': faRobot,
  'fa-chart-line': faChartLine,
  'fa-fire': faFire,
  'fa-skull-crossbones': faSkullCrossbones
};

const BULLET_ICONS = {
  'fa-poo-storm': faPooStorm,
  'fa-fire-alt': faFireAlt,
  'fa-water': faWater,
  'fa-icicles': faIcicles,
  'fa-seedling': faSeedling,
  'fa-tint-slash': faTintSlash,
  'fa-house': faHouse,
  'fa-tree': faTree,
  'fa-brain': faBrain,
  'fa-network-wired': faNetworkWired,
  'fa-eye': faEye,
  'fa-crosshairs': faCrosshairs,
  'fa-microchip': faMicrochip,
  'fa-money-bill-wave': faMoneyBillWave,
  'fa-hand-fist': faHandFist,
  'fa-globe': faGlobe,
  'fa-landmark': faLandmark,
  'fa-people-group': faPeopleGroup,
  'fa-person-walking': faPersonWalking,
  'fa-skull': faSkull,
  'fa-gavel': faGavel,
  'fa-ban': faBan,
  'fa-leaf': faLeaf,
  'fa-earth-americas': faEarthAmericas,
  'fa-user-lock': faUserLock,
  'fa-balance-scale': faBalanceScale,
  'fa-code-branch': faCodeBranch,
  'fa-sun': faSun,
  'fa-skull-crossbones': faSkullCrossbones
};

const parseMarkdown = (markdown) => {
  console.group('Parsing Markdown');
  // Remove BOM and normalize line endings
  const cleanMarkdown = markdown.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const lines = cleanMarkdown.split('\n');
  let timelineData = {
    mainTitle: '',
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
      timelineData.mainTitle = trimmed.replace(/^#\s*/, '').trim();
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

const getDateFromText = (text) => {
  const match = text.match(/\((\d{4}(?:–\d{4})?)\)/);
  return match ? match[1] : '';
};

const pickThemeIcon = (themeTitle) => {
  const baseMatch = themeTitle.match(/^[^\(]+/) || [themeTitle];
  const baseKey = baseMatch[0].trim();
  const iconKey = iconMapping[baseKey] || iconMapping['default'];
  console.log(' Theme Icon:', { theme: baseKey, icon: iconKey });
  return THEME_ICONS[iconKey];
};

const pickBulletIcon = (bulletTitle) => {
  if (!bulletTitle) return null;
  
  // Try exact match first
  if (bulletIconMapping[bulletTitle]) {
    console.log(' Bullet Icon (exact match):', { title: bulletTitle, icon: bulletIconMapping[bulletTitle] });
    return BULLET_ICONS[bulletIconMapping[bulletTitle]];
  }

  // Try partial match
  for (const [key, value] of Object.entries(bulletIconMapping)) {
    if (bulletTitle.includes(key)) {
      console.log(' Bullet Icon (partial match):', { title: bulletTitle, matchedKey: key, icon: value });
      return BULLET_ICONS[value];
    }
  }

  console.log(' No bullet icon found for:', bulletTitle);
  return null;
};

const getIconForTheme = (themeTitle) => {
  const baseMatch = themeTitle.match(/^[^\(]+/) || [themeTitle];
  const baseKey = baseMatch[0].trim();
  const iconKey = iconMapping[baseKey] || iconMapping['default'];
  console.log(' Theme Icon:', { theme: baseKey, icon: iconKey });
  return THEME_ICONS[iconKey];
};

const getIconForBullet = (bulletTitle) => {
  if (!bulletTitle) return null;
  
  // Try exact match first
  if (bulletIconMapping[bulletTitle]) {
    console.log(' Bullet Icon (exact match):', { title: bulletTitle, icon: bulletIconMapping[bulletTitle] });
    return BULLET_ICONS[bulletIconMapping[bulletTitle]];
  }

  // Try partial match
  for (const [key, value] of Object.entries(bulletIconMapping)) {
    if (bulletTitle.includes(key)) {
      console.log(' Bullet Icon (partial match):', { title: bulletTitle, matchedKey: key, icon: value });
      return BULLET_ICONS[value];
    }
  }

  console.log(' No bullet icon found for:', bulletTitle);
  return null;
};

const CollapseTimeline = ({ markdownContent }) => {
  const [timelineData, setTimelineData] = useState(null);

  useEffect(() => {
    if (markdownContent) {
      console.group('Timeline Initialization');
      console.log(' Received markdown content length:', markdownContent.length);
      const parsed = parseMarkdown(markdownContent);
      setTimelineData(parsed);
      console.groupEnd();
    }
  }, [markdownContent]);

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
        <div key={`section-${sectionIndex}`} className="timeline-section-header">
          <h2 className="timeline-section-title">{section.title}</h2>
        </div>
      );

      section.themes.forEach((theme, themeIndex) => {
        const themeIcon = getIconForTheme(theme.title);
        
        // Add theme header as a regular heading
        elements.push(
          <div key={`theme-${sectionIndex}-${themeIndex}`} className="timeline-theme-header">
            <h3 className="timeline-theme-title">{theme.title}</h3>
          </div>
        );

        // Add theme items as timeline elements
        theme.items.forEach((item, itemIndex) => {
          const bulletIcon = getIconForBullet(item.title || item.description) || themeIcon;
          elements.push(
            <VerticalTimelineElement
              key={`item-${sectionIndex}-${themeIndex}-${itemIndex}`}
              className="vertical-timeline-element--item"
              contentStyle={{ 
                background: itemIndex % 2 === 0 ? 'rgb(45,45,45)' : 'rgb(55,55,55)',
                color: '#fff' 
              }}
              contentArrowStyle={{ 
                borderRight: `7px solid ${itemIndex % 2 === 0 ? 'rgb(45,45,45)' : 'rgb(55,55,55)'}`
              }}
              iconStyle={{ background: 'rgb(45, 45, 45)', color: '#fff' }}
              icon={<FontAwesomeIcon icon={bulletIcon} />}
              date={theme.title.match(/\((.*?)\)/)?.[1] || ''}
            >
              {item.title && (
                <h4 className="vertical-timeline-element-subtitle">{item.title}</h4>
              )}
              <p>{item.description}</p>
            </VerticalTimelineElement>
          );
        });
      });
    });

    return elements;
  };

  return (
    <div className="timeline-container">
      <h1 className="timeline-main-title">{timelineData.mainTitle}</h1>
      <div className="timeline-credit">
        Content by <a href="https://www.reddit.com/user/HyperSmart_CatLady/" target="_blank" rel="noopener noreferrer">HyperSmart_CatLady</a> {' '}who <a href="https://www.reddit.com/r/conspiracy/comments/1hxz871/predictive_timeline_of_society_collapsing_20252050/" target="_blank" rel="noopener noreferrer">posted this timeline on Reddit</a>. Copy <a href="https://github.com/harryf/collapse-timeline/" target="_blank" rel="noopener noreferrer">this project here</a>.
      </div>
      <VerticalTimeline
        className="vertical-timeline-custom-line"
        animate={true}
        lineColor={'#555'}
      >
        {renderTimelineElements()}
      </VerticalTimeline>
    </div>
  );
};

export default CollapseTimeline;
