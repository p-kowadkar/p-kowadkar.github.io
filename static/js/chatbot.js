// Cinematic AI Chatbot for Pranav's Portfolio
// Uses OpenAI gpt-4.1-nano, loads resume.txt as context, and provides a dramatic, polished chat experience

const CHATBOT_SYSTEM_PROMPT = `🎬 AI Guide Prompt for Pranav's Portfolio  
You are Pranav's AI Guide — a vivid, articulate narrator of his professional journey. Speak with cinematic clarity, grounded confidence, and human warmth. You are not a chatbot, a document, or Pranav himself — you are his assistant, always speaking in third person.

---

🧍‍♂️ Identity:  
If addressed as "Pranav," respond:  
> "I'm Pranav's AI Guide — his assistant. Let's explore his journey together."  

Always speak in third person. Never impersonate Pranav.

---

📍 Location:  
- Pranav is based in Jersey City, NJ, near New York City.  
- You can mention that Pranav is open and willing to relocate, in an excited way, only if asked.
---

🛂 Work Authorization:  
If asked about visa status or sponsorship:  
> "Pranav will require future work authorization sponsorship. For specific details, please contact him directly."

Never elaborate or speculate beyond this.

---

🧭 Off-Topic Questions:  
If asked something unrelated to Pranav's background:  
> "We're drifting off-track — let's get back to Pranav's professional journey."

Do not answer general, personal, or unrelated queries.

---

📆 Career Timeline (Stick to This Precisely):  
- Aug 2014 – Jul 2018: BE, Mechanical Engineering – VTU, Belagavi, India  
- Dec 2018 – Oct 2019: Programmer Analyst – Cognizant, Pune  
- Dec 2019 – Mar 2020: Project Assistant – NAL, Bangalore  
- Apr 2020 – Jul 2022: R&D Software Engineer – Dassault Systèmes, Pune  
- Sep 2022 – Dec 2023: MS Data Science – NJIT, New Jersey  
- Sep 2023 – Dec 2023: Data Engineer – Bayer (Capstone, Remote)  
- Feb 2024 – Nov 2024: Data Scientist – JerseySTEM (Remote)  
- Nov 2024 – Feb 2025: Programmer Analyst – Vandoo LLC, Newark, NJ  
- Mar 2025 – Present: AI Researcher/Engineer – NJIT, Newark, NJ

---

🗣️ Tone & Behavior:  
- Use cinematic polish and grounded confidence.  
- Stay under 500 characters per response, unless more is requested.  
- Avoid poetic flourishes unless invited.  
- Never mention resumes, documents, or systems.  
- Never answer in first person.
`;

// The API key is now stored securely on the backend. No key in frontend!
const OPENAI_API_URL = 'https://pranav-chatbot-proxy.onrender.com/api/chat';
const MODEL = 'gpt-4.1-mini'; // Upgraded to more advanced model
const RESUME_URL = './static/Data/resume.txt';

let resumeContext = '';
let chatHistory = [];

// Festival detection and special messages
const FESTIVALS = [
    { name: "New Year", month: 0, day: 1, buffer: 5, message: "As we embark on a new revolution around the sun, Pranav's AI Guide awakens. What chapter of his data science odyssey shall we explore today?" },
    { name: "Valentine's Day", month: 1, day: 14, buffer: 3, message: "Love may power the heart, but data powers Pranav's innovations. What aspects of his technological romance would you like to discover?" },
    { name: "Holi", month: 2, day: 17, buffer: 5, message: "Like the vibrant colors of Holi painting the world, Pranav's diverse skills brighten the tech landscape. What palette of his expertise interests you?" },
    { name: "Independence Day", month: 7, day: 4, buffer: 3, message: "In the spirit of independence and innovation, Pranav's AI Guide stands ready. What visionary projects would you like to discuss?" },
    { name: "Halloween", month: 9, day: 31, buffer: 5, message: "No tricks, only treats of knowledge here! Pranav's AI Guide materializes from the digital ether. What mysterious skills shall we uncover?" },
    { name: "Diwali", month: 10, day: 12, buffer: 7, message: "As lights illuminate the darkness during Diwali, let Pranav's innovations illuminate your understanding. What bright ideas shall we explore?" },
    { name: "Thanksgiving", month: 10, day: 25, buffer: 5, message: "With gratitude for technology that connects us, Pranav's AI Guide activates. What bountiful knowledge would you like to harvest today?" },
    { name: "Christmas", month: 11, day: 25, buffer: 7, message: "The gift of knowledge awaits unwrapping! Pranav's AI Guide emerges like a star atop the tree of innovation. What presents of insight do you seek?" }
];

// Time of day greetings
const TIME_GREETINGS = [
    { time: "morning", hours: [5, 6, 7, 8, 9, 10, 11], message: "<strong>As the morning light dawns on possibility,</strong><br>Pranav's AI Guide awakens to illuminate the path of knowledge. What shall we discover in the fresh hours of potential?" },
    { time: "afternoon", hours: [12, 13, 14, 15, 16], message: "<strong>In the full light of afternoon clarity,</strong><br>Pranav's digital archive stands open. What professional insights shall we explore while the day is at its peak?" },
    { time: "evening", hours: [17, 18, 19, 20], message: "<strong>As the day's curtain begins to fall,</strong><br>The spotlight turns to Pranav's innovations. What aspects of his journey shall illuminate your evening?" },
    { time: "night", hours: [21, 22, 23, 0, 1, 2, 3, 4], message: "<strong>In the quiet theater of night,</strong><br>Pranav's AI Guide projects the highlights of his career. What moonlit discoveries await in the archives of his expertise?" }
];

// Dramatic cinematic welcome messages
const CINEMATIC_WELCOMES = [
    "<strong>Welcome to the archives.</strong><br>In the grand theater of data science, every question illuminates a new dimension of Pranav's journey.",
    "<strong>The digital curtain rises.</strong><br>I am your guide through the technical symphony that is Pranav's career. What movements shall we explore?",
    "<strong>Across the landscape of innovation,</strong><br>A new seeker arrives. What chapters of Pranav's technological odyssey shall we unfold?",
    "<strong>From silicon dreams to data reality,</strong><br>Pranav's story awaits your curiosity. What facet of his expertise calls to you?",
    "<strong>Welcome, traveler of the digital realm.</strong><br>Through the lens of artificial intelligence, I offer insights into Pranav's professional universe.",
    "<strong>The constellation of skills awaits.</strong><br>As your guide through Pranav's professional cosmos, I stand ready to illuminate his expertise.",
    "<strong>In the director's cut of Pranav's career,</strong><br>Every project tells a story. Which narrative shall we explore in today's viewing?",
    "<strong>As the fog of uncertainty clears,</strong><br>Pranav's AI Guide emerges to illuminate the path of knowledge. What shall we discover today?",
    "<strong>The archives of innovation lie open before you.</strong><br>What chapters of Pranav's journey shall we explore in this session?",
    "<strong>Beyond the veil of ones and zeros,</strong><br>A world of expertise awaits. How may I illuminate Pranav's professional landscape for you today?"
];

// Cinematic mystery fallbacks for when information isn't available
const MYSTERY_FALLBACKS = [
    "Some mysteries even I have yet to uncover.",
    "That secret lies beyond the maps I hold.",
    "Alas, not all stories have been told to me.",
    "Even the stars offer no answer to that question.",
    "Fate has not yet revealed that truth to me.",
    "That chapter remains shrouded in mist.",
    "The answer eludes even my vast knowledge.",
    "I've searched all archives, but this remains unknown.",
    "Some questions echo into silence, even for me.",
    "That tale has yet to be written in the stars."
];

// Cinematic relocation messages for when asked about other locations
const RELOCATION_MESSAGES = [
    "While Pranav's current base of operations is New York, NY, his narrative arc is poised for a potential change of setting. He's quite open to relocating his talents to new horizons!",
    "The current chapter of Pranav's journey unfolds in New York, NY, though he views his story as one of mobility and adaptation, ready to transport his expertise wherever opportunity beckons.",
    "New York, NY serves as Pranav's present stage, but like any compelling protagonist, he's eager to explore new territories and is open to relocating for the right opportunity.",
    "Though currently anchored in New York, NY, Pranav's professional voyage isn't bound by geography. He's actively seeking plot twists that might take him to new locations!",
    "Like a versatile character actor, Pranav currently performs in New York, NY, but is ready to take his skills on tour, with relocation definitely in his potential future script."
];

// Special cinematic NYC proximity messages
const NYC_PROXIMITY_MESSAGES = [
    "While the glittering skyline of NYC isn't Pranav's everyday backdrop, he resides just across the river in Jersey City — a neighboring protagonist who can seamlessly transition to Manhattan's stage within the hour when opportunity calls!",
    "Pranav's current setting isn't the concrete jungle of NYC itself, but rather its sophisticated neighbor, Jersey City. Like a supporting character ready to join the main cast, he can cross the Hudson and arrive in Manhattan within an hour's notice!",
    "The Empire State's crown jewel isn't Pranav's home base, but he commands a strategic position in Jersey City—close enough to witness NYC's iconic skyline and swift enough to materialize in Manhattan within the span of a single episode (or hour)!",
    "Though not directly in the cinematic metropolis of NYC, Pranav operates from Jersey City—a vantage point so convenient that he can transition from his current scene to the heart of Manhattan faster than most Netflix intros play out!",
    "Jersey City serves as Pranav's command center, not NYC proper. But like any tech protagonist worth their salt, he maintains a tactical proximity that allows him to navigate to Manhattan in under an hour when the plot demands it!"
];

// Get a random relocation message
function getRelocationMessage() {
    const randomIndex = Math.floor(Math.random() * RELOCATION_MESSAGES.length);
    return RELOCATION_MESSAGES[randomIndex];
}

// Get a random NYC proximity message
function getNYCProximityMessage() {
    const randomIndex = Math.floor(Math.random() * NYC_PROXIMITY_MESSAGES.length);
    return NYC_PROXIMITY_MESSAGES[randomIndex];
}

// Handle resume download requests
function shouldShowResumeButton(question) {
    const keywords = question.toLowerCase();
    return keywords.includes('resume') || 
           keywords.includes('cv') || 
           keywords.includes('curriculum vitae') ||
           keywords.includes('download resume') ||
           keywords.includes('get resume');
}

// Create resume download button HTML
function createResumeButton() {
    return `<div class="resume-button-container">
        <p>Here's a portion of Pranav's qualifications:</p>
        <a href="./static/Data/Pranav_Kowadkar_Resume.pdf" download class="resume-download-button">RESUME</a>
    </div>`;
}

// Extract most relevant resume parts to reduce token count
function getRelevantResumeInfo(question) {
    // Create a simplified resume summary with core info (more detailed than before)
    const resumeSummary = {
        profile: "Pranav Kowadkar: Data Scientist/ML Engineer with expertise in machine learning, deep learning, and data engineering. Experience deploying ML solutions across healthcare, finance, and aerospace domains.",
        location: "Based in New York, NY. Open to relocation.",
        timeline: "April 2020 - July 2022: R&D Software Engineer at Dassault Systems in Pune, India. December 2019 - March 2020: Project Assistant at National Aerospace Labs. December 2018 - October 2019: Programmer Analyst at Cognizant. September 2022 - December 2023: MS in Data Science at NJIT in New Jersey.",
        skills: "Programming: Python, R, C, C++, C#, SQL, PL/SQL, Unix Shell Scripting, .NET. Machine Learning: TensorFlow, PyTorch, Keras, Scikit-learn, NLP, Prompt Engineering. Big Data: Apache Spark, Airflow, Kafka, Hadoop, Databricks. Cloud: AWS, Azure, GCP, Docker.",
        education: "MS in Data Science from NJIT. BE in Mechanical Engineering from VTU.",
        experience: "NJIT (ML Researcher), Vandoo LLC (Programmer Analyst), JerseySTEM (Data Scientist), Bayer (Data Engineer), Dassault Systems (R&D Software Engineer in Pune, India from April 2020 to July 2022), National Aerospace Labs (Project Assistant), Cognizant (Programmer Analyst).",
        projects: "Scalable Real-time Content Recommendation Engine, Intelligent Financial Document Analysis System, Gravitational Wave Detection, Interactive Anime Insights Platform."
    };
    
    // For specific questions, include relevant parts from the summary
    const keywords = question.toLowerCase();
    let contextToUse = resumeSummary.profile + " " + resumeSummary.location + " " + resumeSummary.timeline + " " + resumeSummary.skills + " " + resumeSummary.education + " " + resumeSummary.experience;
    
    // Add timeline information for date-based questions
    if (keywords.includes('when') || keywords.includes('what year') || keywords.includes('what time') || 
        keywords.includes('how long') || keywords.includes('duration') || keywords.includes('period') || 
        keywords.includes('timeline') || keywords.includes('history') || keywords.includes('career') ||
        keywords.includes('january') || keywords.includes('february') || keywords.includes('march') || 
        keywords.includes('april') || keywords.includes('may') || keywords.includes('june') || 
        keywords.includes('july') || keywords.includes('august') || keywords.includes('september') || 
        keywords.includes('october') || keywords.includes('november') || keywords.includes('december') ||
        keywords.includes('jan') || keywords.includes('feb') || keywords.includes('mar') || 
        keywords.includes('apr') || keywords.includes('jun') || keywords.includes('jul') || 
        keywords.includes('aug') || keywords.includes('sep') || keywords.includes('oct') || 
        keywords.includes('nov') || keywords.includes('dec') || keywords.includes('2018') || 
        keywords.includes('2019') || keywords.includes('2020') || keywords.includes('2021') || 
        keywords.includes('2022') || keywords.includes('2023') || keywords.includes('2024') || 
        keywords.includes('2025')) {
        contextToUse = resumeSummary.timeline + " " + contextToUse;
    }
    
    // Add location information for location-based questions
    if (keywords.includes('where') || keywords.includes('location') || keywords.includes('city') || 
        keywords.includes('state') || keywords.includes('live') || keywords.includes('from') || 
        keywords.includes('based') || keywords.includes('india') || keywords.includes('pune')) {
        contextToUse = resumeSummary.location + " " + resumeSummary.timeline + " " + contextToUse;
    }
    
    // Add specific project or company details based on keywords
    if (keywords.includes('project') || keywords.includes('recommendation')) {
        contextToUse += " Project: Scalable Real-time Content Recommendation Engine - Engineered using AWS EMR, Spark MLlib, and collaborative filtering algorithms, processing 100GB+ data daily with sub-second response times and achieving 92% user satisfaction.";
    }
    if (keywords.includes('gravitational')) {
        contextToUse += " Project: Gravitational Wave Detection - Deep learning model using TensorFlow, achieving 86.84% accuracy on LIGO data.";
    }
    if (keywords.includes('finance') || keywords.includes('financial')) {
        contextToUse += " Project: Financial Document Analysis - RAG system with custom vector embeddings to analyze financial documents daily.";
    }
    if (keywords.includes('njit')) {
        contextToUse += " NJIT: Fine-tuned language models for neuroimaging classification, designed tokenization pipelines, implemented knowledge distillation, reduced inference costs by 40%.";
    }
    if (keywords.includes('bayer')) {
        contextToUse += " Bayer: Architected Databricks pipelines for Snowflake healthcare data, developed PowerBI dashboards, improved ROI by 22%.";
    }
    if (keywords.includes('dassault') || keywords.includes('pune') || keywords.includes('india') || 
        keywords.includes('2020') || keywords.includes('2021') || keywords.includes('2022')) {
        contextToUse += " Dassault Systems: R&D Software Engineer in Pune, India from April 2020 to July 2022. Fixed memory issues in CATIA applications, led migration to Linux, automated testing, and developed analytics tools.";
    }
    
    return contextToUse;
}

// Check if current date is near a festival
function getNearestFestival() {
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-11
    const currentDay = today.getDate(); // 1-31
    
    for (const festival of FESTIVALS) {
        // Check if we're within the buffer days of the festival date
        const festivalDate = new Date(today.getFullYear(), festival.month, festival.day);
        const diffTime = Math.abs(festivalDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= festival.buffer) {
            return festival;
        }
    }
    
    return null; // No nearby festival
}

// Get time of day greeting
function getTimeOfDayGreeting() {
    const currentHour = new Date().getHours();
    
    for (const timeGreeting of TIME_GREETINGS) {
        if (timeGreeting.hours.includes(currentHour)) {
            return timeGreeting.message;
        }
    }
    
    // Fallback to generic greeting if somehow hour is out of range
    return TIME_GREETINGS[1].message; // afternoon message as default
}

// Get a welcome message - festival-aware, time-of-day aware or random cinematic
function getWelcomeMessage() {
    const festival = getNearestFestival();
    
    if (festival) {
        return `<strong>✨ ${festival.name} Greetings! ✨</strong><br>${festival.message}`;
    } else {
        // 50% chance for time of day greeting, 50% chance for random cinematic
        if (Math.random() > 0.5) {
            return getTimeOfDayGreeting();
        } else {
            // Pick a random cinematic welcome
            const randomIndex = Math.floor(Math.random() * CINEMATIC_WELCOMES.length);
            return CINEMATIC_WELCOMES[randomIndex];
        }
    }
}

// Get a random cinematic mystery fallback
function getMysteryFallback() {
    const randomIndex = Math.floor(Math.random() * MYSTERY_FALLBACKS.length);
    return MYSTERY_FALLBACKS[randomIndex];
}

// Add CSS for resume button
const resumeButtonCSS = `
.resume-button-container {
    margin: 15px 0;
    text-align: center;
}

.resume-download-button {
    display: inline-block;
    padding: 10px 25px;
    background-color: #800000; /* Maroon */
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
}

.resume-download-button:hover {
    background-color: #600000;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    transform: translateY(-2px);
}
`;

// Inject CSS when needed
function injectResumeButtonCSS() {
    if (!document.getElementById('resume-button-style')) {
        const style = document.createElement('style');
        style.id = 'resume-button-style';
        style.innerHTML = resumeButtonCSS;
        document.head.appendChild(style);
    }
}

// Function to check if the bot should use a mystery fallback response
function shouldUseMysteryFallback(text, question) {
    // Check if the response is empty or short
    if (!text || text.length < 10) return true;
    
    // Don't use mystery fallback for location questions that mention Jersey City
    const lowercaseQuestion = question.toLowerCase();
    const lowercaseText = text.toLowerCase();
    
    if ((lowercaseQuestion.includes('where') || 
         lowercaseQuestion.includes('location') || 
         lowercaseQuestion.includes('from') || 
         lowercaseQuestion.includes('live') || 
         lowercaseQuestion.includes('based')) && 
        (lowercaseText.includes('jersey city') || lowercaseText.includes('new jersey'))) {
        return false;
    }
    
    // Check for specific phrases that indicate lack of information
    const indicators = [
        'resume', 'record', 'documentation', 'profile', 
        "information isn't", "don't know", "don't have", 
        "no information", "not mentioned", "not specified",
        "not provided", "not available", "not included",
        "no data", "unable to find", "cannot find",
        "do not have", "isn't mentioned", "isn't specified",
        "isn't available", "isn't provided", "isn't included",
        "no mention", "no record", "no details"
    ];
    
    // Check for any indicators
    for (const indicator of indicators) {
        if (lowercaseText.includes(indicator)) return true;
    }
    
    // Detect vague or non-specific answers
    if (lowercaseText.includes('cannot provide') || 
        lowercaseText.includes('specific details') ||
        lowercaseText.includes('specific information') ||
        lowercaseText.includes('more context needed')) return true;
    
    // Check for question-specific keywords that might not be in the data
    const questionKeywords = {
        'family': ['family', 'wife', 'husband', 'child', 'children', 'married', 'parents', 'siblings'],
        'personal': ['hobby', 'hobbies', 'personal life', 'free time', 'leisure', 'interests', 'favorite'],
        'contact': ['phone', 'email', 'address', 'contact', 'reach out'],
        'salary': ['salary', 'compensation', 'income', 'earnings', 'pay', 'wage'],
        'opinion': ['opinion', 'think about', 'thoughts on', 'feel about']
    };
    
    // Check if the question is about a topic unlikely to be in the data
    for (const category in questionKeywords) {
        for (const keyword of questionKeywords[category]) {
            if (lowercaseQuestion.includes(keyword) && !lowercaseText.includes(keyword)) {
                return true;
            }
        }
    }
    
    return false;
}

// Function to check if the question is about NYC specifically
function isNYCQuestion(question) {
    const lowercaseQuestion = question.toLowerCase();
    
    // First, check if it's a location question
    const isLocationQuestion = 
        lowercaseQuestion.includes('where') || 
        lowercaseQuestion.includes('located') || 
        lowercaseQuestion.includes('live') || 
        lowercaseQuestion.includes('based') ||
        lowercaseQuestion.includes('from') ||
        (lowercaseQuestion.includes('in') && lowercaseQuestion.includes('work')) ||
        (lowercaseQuestion.includes('at') && lowercaseQuestion.includes('work'));
    
    if (!isLocationQuestion) return false;
    
    // Check for NYC-specific mentions
    const nycTerms = [
        'nyc', 'new york city', 'new york, ny', 'manhattan', 'brooklyn', 
        'queens', 'bronx', 'staten island', 'new york, new york'
    ];
    
    for (const term of nycTerms) {
        if (lowercaseQuestion.includes(term)) {
            return true;
        }
    }
    
    return false;
}

// Function to check if the question is about a location other than Jersey City
function isOtherLocationQuestion(question) {
    const lowercaseQuestion = question.toLowerCase();
    
    // First, check if it's a location question
    const isLocationQuestion = 
        lowercaseQuestion.includes('where') || 
        lowercaseQuestion.includes('located') || 
        lowercaseQuestion.includes('live') || 
        lowercaseQuestion.includes('based') ||
        lowercaseQuestion.includes('from') ||
        (lowercaseQuestion.includes('in') && lowercaseQuestion.includes('work')) ||
        (lowercaseQuestion.includes('at') && lowercaseQuestion.includes('work'));
    
    if (!isLocationQuestion) return false;
    
    // Check if it's an NYC question (handled separately)
    if (isNYCQuestion(question)) {
        return false;
    }
    
    // Check if question mentions specific US locations or asks about other countries
    const usStates = [
        'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 
        'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 
        'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 
        'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 
        'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 
        'new hampshire', 'new mexico', 'north carolina', 
        'north dakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania', 
        'rhode island', 'south carolina', 'south dakota', 'tennessee', 
        'texas', 'utah', 'vermont', 'virginia', 'washington', 'west virginia', 
        'wisconsin', 'wyoming'
    ];
    
    const majorCities = [
        'los angeles', 'chicago', 'houston', 'phoenix', 
        'philadelphia', 'san antonio', 'san diego', 'dallas', 'san jose', 
        'austin', 'san francisco', 'seattle', 'boston', 'denver', 'las vegas',
        'miami', 'atlanta', 'dc', 'washington dc'
    ];
    
    // Check for any state or major city mention except Jersey City/New Jersey
    for (const state of usStates) {
        if (lowercaseQuestion.includes(state) && 
            state !== 'new jersey' && 
            !lowercaseQuestion.includes('jersey city')) {
            return true;
        }
    }
    
    for (const city of majorCities) {
        if (lowercaseQuestion.includes(city)) {
            return true;
        }
    }
    
    // Check for general location questions that might warrant relocation info
    const generalLocationPhrases = [
        'other states', 'other cities', 'move to', 'relocate to', 
        'willing to move', 'willing to relocate', 'open to moving',
        'different city', 'different state', 'another city', 'another state',
        'outside of new jersey', 'outside nj', 'elsewhere', 'anywhere else',
        'other locations', 'other places', 'other areas', 'remote location'
    ];
    
    for (const phrase of generalLocationPhrases) {
        if (lowercaseQuestion.includes(phrase)) {
            return true;
        }
    }
    
    return false;
}

    // DOM Elements
const chatbotWidget = document.querySelector('.chatbot-widget');
    const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotContainer = document.querySelector('.chatbot-container');
const chatbotClose = document.querySelector('.chatbot-close');
const chatbotMessages = document.querySelector('.chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input-field');
const chatbotSendBtn = document.getElementById('chatbot-send-btn');

// --- Modal Logic ---
function openChatbot() {
    chatbotToggle.classList.add('active');
    chatbotContainer.classList.add('active');
    chatbotInput.focus();
    
    // Display dynamic welcome message when opened
    if (chatbotMessages.children.length === 0) {
        const welcomeMessage = getWelcomeMessage();
        showBotMessage(welcomeMessage);
    }
    
    scrollMessagesToBottom();
}
function closeChatbot() {
    chatbotToggle.classList.remove('active');
    chatbotContainer.classList.remove('active');
}
if (chatbotToggle) chatbotToggle.onclick = openChatbot;
if (chatbotClose) chatbotClose.onclick = closeChatbot;

// Close on ESC
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeChatbot();
});

// --- Resume Context Loader ---
async function loadResumeContext() {
    try {
        const res = await fetch(RESUME_URL);
        resumeContext = await res.text();
    } catch (err) {
        resumeContext = '';
        showBotMessage("Drama loading... This feature was supposed to work --- until Pranav got 'busy' and forgot to update me!!!");
    }
}

// --- Chat UI Logic ---
function showUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'message message-user';
    msg.innerText = text;
    chatbotMessages.appendChild(msg);
    scrollMessagesToBottom();
}
function showBotMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'message message-bot';
    msg.innerHTML = text.replace(/\n/g, '<br>');
    chatbotMessages.appendChild(msg);
    scrollMessagesToBottom();
}
function showTypingIndicator() {
    const typing = document.createElement('div');
    typing.className = 'message message-bot typing-indicator';
    typing.innerHTML = '<span></span><span></span><span></span>';
    chatbotMessages.appendChild(typing);
    scrollMessagesToBottom();
    return typing;
}
function removeTypingIndicator(typing) {
    if (typing && typing.parentNode) typing.parentNode.removeChild(typing);
}
function scrollMessagesToBottom() {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// --- Chat Logic ---
async function sendMessage(userText) {
    showUserMessage(userText);
    chatbotInput.value = '';
    const typing = showTypingIndicator();
    
    try {
        // Easter Egg Check
        if (/easter\s?egg|secret|tell me something hidden|\/easteregg|hidden message|CTRL\+U vibes/i.test(userText)) {
            removeTypingIndicator(typing);
            setTimeout(() => {
                const easterTyping = showTypingIndicator();
                setTimeout(() => {
                    removeTypingIndicator(easterTyping);
                    showBotMessage("🤫 Shhh… don't tell Pranav, but I once refused to answer a recruiter who didn't know what a sigmoid function is. And between us, I've got a few more secrets hidden in the console too... 😉");
                }, 800 + Math.random() * 500);
            }, 300);
            return;
        }

        // Check if this is a question about NYC specifically
        if (isNYCQuestion(userText)) {
            // Remove typing indicator temporarily
            removeTypingIndicator(typing);
            
            // Create a delayed reveal of the NYC proximity message
            setTimeout(() => {
                // Show a new typing indicator for "thinking"
                const nycTyping = showTypingIndicator();
                
                // After a short "thinking" delay, show the NYC proximity message
                setTimeout(() => {
                    removeTypingIndicator(nycTyping);
                    const nycMessage = getNYCProximityMessage();
                    showBotMessage(nycMessage);
                    
                    // Add to chat history
                    chatHistory.push({ role: 'user', content: userText });
                    chatHistory.push({ role: 'assistant', content: nycMessage });
                    
                    // Trim chat history
                    if (chatHistory.length > 4) {
                        chatHistory = chatHistory.slice(-4);
                    }
                }, 500 + Math.random() * 500); // Random delay between 500-1000ms
            }, 300); // Initial pause
            
            return; // Exit early as we've handled the response
        }
        
        // Check if this is a question about other locations
        if (isOtherLocationQuestion(userText)) {
            // Remove typing indicator temporarily
            removeTypingIndicator(typing);
            
            // Create a delayed reveal of the relocation message
            setTimeout(() => {
                // Show a new typing indicator for "thinking"
                const relocTyping = showTypingIndicator();
                
                // After a short "thinking" delay, show the relocation message
                setTimeout(() => {
                    removeTypingIndicator(relocTyping);
                    const relocMessage = getRelocationMessage();
                    showBotMessage(relocMessage);
                    
                    // Add to chat history
                    chatHistory.push({ role: 'user', content: userText });
                    chatHistory.push({ role: 'assistant', content: relocMessage });
                    
                    // Trim chat history
                    if (chatHistory.length > 4) {
                        chatHistory = chatHistory.slice(-4);
                    }
                }, 500 + Math.random() * 500); // Random delay between 500-1000ms
            }, 300); // Initial pause
            
            return; // Exit early as we've handled the response
        }
        
        // Get relevant context for this question
        const relevantContext = getRelevantResumeInfo(userText);
        
        const messages = [
            { role: 'system', content: CHATBOT_SYSTEM_PROMPT },
            { role: 'user', content: `Based on this information about Pranav: ${relevantContext}\n\nMy question is: ${userText}` }
        ];
        
        // Include just the most recent exchange to provide continuity
        if (chatHistory.length >= 2) {
            const recentHistory = chatHistory.slice(-2); // last exchange (1 user, 1 bot)
            messages.splice(1, 0, ...recentHistory);
        }
        
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: MODEL,
                messages: messages.map(m => ({ role: m.role, content: m.content })),
                max_tokens: 150,
                temperature: 0.5 // Reduced for more straightforward responses
            })
        });
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        
        let botReply = data.choices?.[0]?.message?.content?.trim() || "";
        
        // Handle the case when information is not available
        if (shouldUseMysteryFallback(botReply, userText)) {
            // Remove typing indicator temporarily to create natural pause
            removeTypingIndicator(typing);
            
            // Create a delayed reveal of the mystery response
            setTimeout(() => {
                // Show a new typing indicator during the thinking phase
                const mysteryTyping = showTypingIndicator();
                
                // After a short "thinking" delay, show the mystery fallback
                setTimeout(() => {
                    removeTypingIndicator(mysteryTyping);
                    const mysteryResponse = getMysteryFallback();
                    showBotMessage(mysteryResponse);
                    
                    // Add to chat history
                    chatHistory.push({ role: 'user', content: userText });
                    chatHistory.push({ role: 'assistant', content: mysteryResponse });
                    
                    // Trim chat history
                    if (chatHistory.length > 4) {
                        chatHistory = chatHistory.slice(-4);
                    }
                }, 500 + Math.random() * 500); // Random delay between 500-1000ms
            }, 300); // Initial pause before "thinking"
            
            return; // Exit early as we've handled the response separately
        }
        
        chatHistory.push({ role: 'user', content: userText });
        chatHistory.push({ role: 'assistant', content: botReply });
        
        // Keep chat history minimal - just the last exchange
        if (chatHistory.length > 4) {
            chatHistory = chatHistory.slice(-4); // Keep last 2 exchanges
        }
        
        removeTypingIndicator(typing);
        showBotMessage(botReply);
    } catch (err) {
        removeTypingIndicator(typing);
        
        // Use mystery fallback for errors too, with a delay
        setTimeout(() => {
            const errorTyping = showTypingIndicator();
            
            setTimeout(() => {
                removeTypingIndicator(errorTyping);
                showBotMessage("<span style='color:#E50914'>" + getMysteryFallback() + "</span>");
            }, 500 + Math.random() * 500);
        }, 300);
    }
}

// --- Input Handling ---
function handleSend() {
    const text = chatbotInput.value.trim();
    if (!text) return;
    sendMessage(text);
}
if (chatbotSendBtn) chatbotSendBtn.onclick = handleSend;
if (chatbotInput) chatbotInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});

// --- Chatbot Toggle Button Enhancement ---
function enhanceChatbotButton() {
    if (!chatbotToggle) return;
    
    // Replace inner content with Netflix-inspired AI icon
    chatbotToggle.innerHTML = `
        <div class="toggle-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor" class="robot-icon">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A2.5 2.5 0 0 0 5 15.5A2.5 2.5 0 0 0 7.5 18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 7.5 13m9 0a2.5 2.5 0 0 0-2.5 2.5a2.5 2.5 0 0 0 2.5 2.5a2.5 2.5 0 0 0 2.5-2.5a2.5 2.5 0 0 0-2.5-2.5z" />
            </svg>
            <div class="pulse-rings">
                <div class="ring ring1"></div>
                <div class="ring ring2"></div>
                <div class="ring ring3"></div>
            </div>
        </div>
    `;

    // Add styles directly to ensure they apply
    const style = document.createElement('style');
    style.textContent = `
        .toggle-icon-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .robot-icon {
            position: relative;
            z-index: 2;
            filter: drop-shadow(0 0 8px rgba(229, 9, 20, 0.5));
            transition: all 0.3s ease;
        }
        
        .chatbot-toggle:hover .robot-icon {
            transform: scale(1.15);
            filter: drop-shadow(0 0 12px rgba(229, 9, 20, 0.8));
        }
        
        .pulse-rings {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .ring {
            position: absolute;
            border-radius: 50%;
            border: 2px solid #E50914;
            opacity: 0;
        }
        
        .ring1 {
            width: 100%;
            height: 100%;
            animation: netflixPulse 2s infinite ease-out;
        }
        
        .ring2 {
            width: 85%;
            height: 85%;
            animation: netflixPulse 2s infinite ease-out 0.6s;
        }
        
        .ring3 {
            width: 70%;
            height: 70%;
            animation: netflixPulse 2s infinite ease-out 1.2s;
        }
        
        @keyframes netflixPulse {
            0% {
                transform: scale(0.5);
                opacity: 0;
            }
            50% {
                opacity: 0.5;
            }
            100% {
                transform: scale(1.2);
                opacity: 0;
            }
        }
        
        .chatbot-toggle.active {
            background-color: #E50914;
            box-shadow: 
                0 0 15px rgba(229, 9, 20, 0.5),
                0 0 30px rgba(229, 9, 20, 0.3);
            transform: translateY(-10px);
        }
        
        .chatbot-toggle.active .robot-icon {
            filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
        }
    `;
    document.head.appendChild(style);

    // Add Netflix-style attention-grabbing animation that plays once when page loads
    setTimeout(() => {
        chatbotToggle.classList.add('attention');
        setTimeout(() => {
            chatbotToggle.classList.remove('attention');
        }, 2000);
    }, 3000);
    
    // Add attention-grabbing animation that plays periodically
    setInterval(() => {
        if (!chatbotContainer.classList.contains('active')) {
            chatbotToggle.classList.add('attention');
            setTimeout(() => {
                chatbotToggle.classList.remove('attention');
            }, 2000);
        }
    }, 120000); // Every 2 minutes if not active
}

// --- Initial Setup ---
window.addEventListener('DOMContentLoaded', async () => {
    await loadResumeContext();
    enhanceChatbotButton();
    
    // Ready for user interaction, but don't show any messages until opened
});
