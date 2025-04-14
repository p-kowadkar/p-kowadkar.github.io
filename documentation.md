# Netflix-Inspired Portfolio Website Documentation

## Overview

This documentation provides comprehensive information about the Netflix-inspired portfolio website created for Pranav Shridhar Kowadkar. The website features a modern Netflix-style UI with a Flask backend, DeepSeek API integration for the chatbot, and enhanced user experience elements.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Setup Instructions](#setup-instructions)
3. [DeepSeek API Integration](#deepseek-api-integration)
4. [Chatbot Functionality](#chatbot-functionality)
5. [Netflix-Inspired Design](#netflix-inspired-design)
6. [Enhanced UX Features](#enhanced-ux-features)
7. [Deployment Guide](#deployment-guide)
8. [Maintenance and Updates](#maintenance-and-updates)

## Project Structure

```
netflix_portfolio_project/
├── app/
│   ├── static/
│   │   ├── css/
│   │   │   ├── netflix-style.css
│   │   │   ├── enhanced-ux.css
│   │   │   └── chatbot.css
│   │   ├── js/
│   │   │   ├── netflix-main.js
│   │   │   ├── enhanced-ux.js
│   │   │   └── chatbot.js
│   │   ├── images/
│   │   │   └── [image files]
│   │   └── media/
│   │       └── netflix-sound.mp3
│   ├── templates/
│   │   ├── index.html
│   │   └── chatbot_test.html
│   ├── data/
│   │   ├── resume.txt
│   │   └── linkedin_data.json
│   ├── app.py
│   ├── deepseek_api.py
│   ├── .env
│   └── README.md
└── requirements.txt
```

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- DeepSeek API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/p-kowadkar/netflix-portfolio.git
   cd netflix-portfolio
   ```

2. Install required packages:
   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the app directory with your DeepSeek API key:
   ```
   DEEPSEEK_API_KEY=your_api_key_here
   FLASK_ENV=development
   ```

4. Create the data directory and add your resume and LinkedIn data:
   ```
   mkdir -p app/data
   ```
   - Add your resume text to `app/data/resume.txt`
   - Add your LinkedIn data to `app/data/linkedin_data.json`

5. Run the Flask application:
   ```
   cd app
   python app.py
   ```

6. Access the website at `http://localhost:5000`

## DeepSeek API Integration

The website integrates with the DeepSeek API to power the chatbot functionality. The integration is handled securely through the Flask backend, keeping the API key private.

### Key Components

- **deepseek_api.py**: A wrapper class for the DeepSeek API that handles authentication, request formatting, and error handling.
- **.env file**: Stores the DeepSeek API key securely.
- **Flask API endpoints**: Routes requests from the frontend to the DeepSeek API.

### API Configuration

The DeepSeek API is configured with the following parameters:

- **Model**: deepseek-chat
- **Temperature**: 0.7 (controls randomness)
- **Max Tokens**: 250 (limits response length)

### Conversation Management

The backend maintains conversation history for each user session, allowing the chatbot to remember context and provide more relevant responses. The conversation history is stored in memory and limited to the 10 most recent messages to prevent token limit issues.

## Chatbot Functionality

The chatbot is designed to answer questions about Pranav's background, skills, experience, projects, and contact information based on the resume and LinkedIn data.

### Features

- **Session Management**: Each user gets a unique session ID for personalized conversations.
- **Suggestion Chips**: Pre-defined suggestions guide users on what to ask.
- **Follow-up Questions**: The chatbot suggests related questions based on the conversation.
- **Fallback Mechanism**: If the chatbot can't answer a question, it directs users to the Contact page.
- **Conversation Reset**: Users can reset the conversation history.

### Integration with Frontend

The chatbot is implemented as a popup/widget that appears in the bottom-right corner of the screen. The frontend communicates with the Flask backend through API endpoints:

- `/api/deepseek`: Sends user messages to the DeepSeek API and returns responses.
- `/api/reset_conversation`: Resets the conversation history.
- `/api/health`: Checks if the API is running.

## Netflix-Inspired Design

The website features a Netflix-inspired design with the characteristic red and black color scheme, card-based content layout, and responsive design.

### Design Elements

- **Netflix Logo Animation**: An intro animation similar to Netflix's.
- **Billboard Section**: A hero section with a background image and call-to-action buttons.
- **Content Rows**: Horizontal sliders with cards for different sections (Experience, Education, Projects).
- **Detail Views**: Expanded views for each card with additional information.
- **Netflix Typography**: Font styles and sizes similar to Netflix's UI.

### Responsive Design

The website is fully responsive and works well on all device sizes:

- **Desktop**: Full layout with horizontal sliders and expanded cards.
- **Tablet**: Adjusted layout with slightly smaller cards and simplified navigation.
- **Mobile**: Stacked layout with mobile-friendly navigation and touch-optimized interactions.

## Enhanced UX Features

The website includes several enhanced UX features to provide a modern, interactive experience.

### Features

- **Loading Animation**: A spinner that appears while the page is loading.
- **Scroll to Top Button**: A button that appears when scrolling down and allows users to quickly return to the top.
- **Parallax Effect**: The billboard background moves at a different speed than the content when scrolling.
- **Smooth Scrolling**: Navigation links smoothly scroll to the corresponding sections.
- **Active Navigation Highlighting**: The current section is highlighted in the navigation menu.
- **Form Validation**: Real-time validation feedback for the contact form.
- **Card Hover Effects**: Cards expand and show additional information when hovered.
- **Animations**: Various animations for page elements as they come into view.

## Deployment Guide

### GitHub Pages Deployment

1. Create a GitHub repository named `pkowadkar.github.io`.
2. Push the static files to the repository:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/p-kowadkar/pkowadkar.github.io.git
   git push -u origin main
   ```
3. Enable GitHub Pages in the repository settings:
   - Go to Settings > Pages
   - Set the source to the main branch
   - Save the settings

4. Your website will be available at `https://pkowadkar.github.io`

### Custom Domain (Optional)

1. Purchase a domain name from a domain registrar.
2. Add a CNAME file to your repository with your domain name.
3. Configure your domain's DNS settings to point to GitHub Pages.
4. Add your custom domain in the GitHub Pages settings.

## Maintenance and Updates

### Updating Content

1. **Profile Information**: Update the resume.txt and linkedin_data.json files in the data directory.
2. **Images**: Replace images in the static/images directory.
3. **Text Content**: Modify the HTML files in the templates directory.

### Updating the DeepSeek API Key

If you need to update your DeepSeek API key:

1. Edit the `.env` file in the app directory.
2. Replace the value of `DEEPSEEK_API_KEY` with your new API key.
3. Restart the Flask application.

### Adding New Sections

To add a new section to the website:

1. Add a new section to the index.html file following the existing pattern.
2. Create any necessary CSS styles in netflix-style.css or enhanced-ux.css.
3. Add JavaScript functionality in netflix-main.js or enhanced-ux.js if needed.

### Troubleshooting

- **Chatbot Not Working**: Check that your DeepSeek API key is valid and properly set in the .env file.
- **Images Not Loading**: Ensure image paths are correct and images are in the static/images directory.
- **Styling Issues**: Check browser console for CSS errors and ensure all CSS files are properly linked.
- **JavaScript Errors**: Check browser console for JavaScript errors and ensure all script files are properly linked.
