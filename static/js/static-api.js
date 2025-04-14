
// Static API handler for GitHub Pages deployment
// This replaces the backend API calls with static responses

document.addEventListener('DOMContentLoaded', function() {
    // Override fetch for API endpoints
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (url.includes('/api/')) {
            console.log('Static mode: Intercepting API call to ' + url);
            
            // Redirect to API notice page for actual API endpoints
            if (url === '/api/deepseek' || url === '/api/reset_conversation') {
                return new Promise((resolve) => {
                    if (options && options.method === 'POST') {
                        const body = JSON.parse(options.body);
                        
                        if (url === '/api/deepseek') {
                            // Simulate chatbot response
                            setTimeout(() => {
                                resolve({
                                    ok: true,
                                    json: () => Promise.resolve({
                                        message: getStaticResponse(body.message),
                                        session_id: body.session_id || 'static-session'
                                    })
                                });
                            }, 1000);
                        } else if (url === '/api/reset_conversation') {
                            // Simulate conversation reset
                            setTimeout(() => {
                                resolve({
                                    ok: true,
                                    json: () => Promise.resolve({
                                        status: 'success',
                                        message: 'Conversation reset successfully'
                                    })
                                });
                            }, 500);
                        }
                    }
                });
            }
            
            // For health check endpoint
            if (url === '/api/health') {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            ok: true,
                            json: () => Promise.resolve({
                                status: 'healthy',
                                message: 'Static API is running (demo mode)'
                            })
                        });
                    }, 300);
                });
            }
        }
        
        // Pass through all other requests
        return originalFetch(url, options);
    };
    
    // Static responses for demo mode
    function getStaticResponse(message) {
        message = message.toLowerCase();
        
        if (message.includes('experience') || message.includes('work')) {
            return "Pranav has experience as a Machine Learning Researcher at NJIT, Programmer Analyst at Vandoo LLC, Data Scientist at JerseySTEM, Data Engineer at Bayer, and R&D Software Engineer at Dassault Systems. His most recent role involves fine-tuning language models for neuroimaging classification tasks.";
        }
        
        if (message.includes('education') || message.includes('study') || message.includes('degree')) {
            return "Pranav holds a Master of Science in Data Science from New Jersey Institute of Technology (2022-2023) and a Bachelor of Engineering in Mechanical Engineering from Visvesvaraya Technological University (2014-2018).";
        }
        
        if (message.includes('skill') || message.includes('technology') || message.includes('tech')) {
            return "Pranav's skills include Python, R, TensorFlow, PyTorch, Machine Learning, Deep Learning, NLP, Data Engineering, AWS, Spark, Airflow, SQL, and Data Visualization. He's particularly strong in developing scalable machine learning solutions.";
        }
        
        if (message.includes('project')) {
            return "Pranav has worked on several projects including a Scalable Real-time Content Recommendation Engine, Intelligent Financial Document Analysis System, Gravitational Wave Detection, and an Interactive Anime Insights Platform. His recommendation engine processes over 100GB of data daily with sub-second response times.";
        }
        
        if (message.includes('contact') || message.includes('email') || message.includes('phone')) {
            return "You can contact Pranav via email at pk.kowadkar@gmail.com, phone at +1 973-704-7623, or connect on LinkedIn at linkedin.com/in/pkowadkar. You can also check out his GitHub at github.com/p-kowadkar.";
        }
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello! I'm Pranav's AI assistant. I can tell you about his experience, education, skills, projects, or contact information. What would you like to know?";
        }
        
        // Default response
        return "I'm currently in demo mode since this is a static website. For specific questions about Pranav's experience, education, skills, projects, or contact information, please try asking directly about those topics. For full chatbot functionality, the Flask backend needs to be deployed on a server that supports Python applications.";
    }
});
