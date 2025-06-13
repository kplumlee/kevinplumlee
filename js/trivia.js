class HealthcareMarketingTrivia {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.answered = 0;
        this.questions = [
            {
                question: "What does E-A-T stand for in Google's quality guidelines for healthcare content?",
                options: [
                    "Expertise, Authority, Trustworthiness",
                    "Engagement, Analytics, Traffic", 
                    "Ethics, Accuracy, Transparency",
                    "Education, Accessibility, Technology"
                ],
                correct: 0,
                explanation: "E-A-T stands for Expertise, Authority, and Trustworthiness. Google uses these criteria to evaluate content quality, especially for YMYL (Your Money or Your Life) topics like healthcare."
            },
            {
                question: "What is the average patient acquisition cost (PAC) for dental practices in 2024?",
                options: [
                    "$150-200",
                    "$250-300", 
                    "$350-400",
                    "$500-600"
                ],
                correct: 1,
                explanation: "The average patient acquisition cost for dental practices ranges from $250-300. This varies by location, specialty, and marketing channels used."
            },
            {
                question: "Which HIPAA rule specifically governs healthcare marketing communications?",
                options: [
                    "Privacy Rule",
                    "Security Rule",
                    "Breach Notification Rule", 
                    "Omnibus Rule"
                ],
                correct: 0,
                explanation: "The HIPAA Privacy Rule governs healthcare marketing communications, requiring patient authorization for most marketing uses of protected health information."
            },
            {
                question: "What is considered the most effective ROI metric for healthcare marketing campaigns?",
                options: [
                    "Cost per click (CPC)",
                    "Patient lifetime value (LTV)",
                    "Conversion rate",
                    "Brand awareness"
                ],
                correct: 1,
                explanation: "Patient lifetime value (LTV) is the most effective ROI metric as it measures the total value a patient brings over their entire relationship with the practice."
            },
            {
                question: "For local healthcare SEO, what is the optimal keyword density for location-based terms?",
                options: [
                    "1-2%",
                    "3-5%",
                    "6-8%", 
                    "10%+"
                ],
                correct: 0,
                explanation: "For local healthcare SEO, 1-2% keyword density for location terms is optimal. Higher densities can be seen as keyword stuffing by search engines."
            },
            {
                question: "What percentage of patients read online reviews before choosing a healthcare provider?",
                options: [
                    "45%",
                    "67%",
                    "84%",
                    "91%"
                ],
                correct: 3,
                explanation: "Studies show that 91% of patients read online reviews before choosing a healthcare provider, making reputation management crucial."
            },
            {
                question: "Which social media platform has the highest engagement rate for healthcare content?",
                options: [
                    "Facebook",
                    "Instagram", 
                    "LinkedIn",
                    "TikTok"
                ],
                correct: 1,
                explanation: "Instagram has the highest engagement rate for healthcare content, particularly for visual health education and behind-the-scenes practice content."
            },
            {
                question: "What is the average conversion rate for healthcare landing pages?",
                options: [
                    "2-4%",
                    "5-7%",
                    "8-12%",
                    "15-20%"
                ],
                correct: 2,
                explanation: "Healthcare landing pages typically see conversion rates of 8-12%, higher than many other industries due to the urgent nature of health needs."
            },
            {
                question: "What percentage of healthcare searches are performed on mobile devices?",
                options: [
                    "45%",
                    "60%", 
                    "75%",
                    "87%"
                ],
                correct: 3,
                explanation: "87% of healthcare searches are performed on mobile devices, making mobile optimization critical for healthcare websites."
            },
            {
                question: "Which Google Analytics 4 metric is most important for measuring patient engagement?",
                options: [
                    "Page views",
                    "Session duration",
                    "Engagement rate", 
                    "Bounce rate"
                ],
                correct: 2,
                explanation: "Engagement rate in GA4 is the most comprehensive metric, measuring the percentage of engaged sessions and providing better insights than traditional bounce rate."
            }
        ];
        this.init();
    }

    init() {
        this.setupElements();
        this.displayQuestion();
        console.log('Healthcare Marketing Trivia initialized');
    }

    setupElements() {
        // Wait for content to be loaded
        const checkContent = () => {
            const container = document.querySelector('#trivia-content');
            if (container && container.innerHTML.trim()) {
                this.setupEventListeners();
            } else {
                setTimeout(checkContent, 100);
            }
        };
        checkContent();
    }

    setupEventListeners() {
        const nextBtn = document.getElementById('next-btn');
        const restartBtn = document.getElementById('restart-btn');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restartTrivia());
        }

        // Add click handlers for answer buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('answer-btn')) {
                this.selectAnswer(parseInt(e.target.dataset.answer));
            }
        });
    }

    displayQuestion() {
        const questionContainer = document.getElementById('question-container');
        const resultsContainer = document.getElementById('results-container');
        
        if (!questionContainer || !resultsContainer) return;

        if (this.currentQuestion < this.questions.length) {
            questionContainer.style.display = 'block';
            resultsContainer.style.display = 'none';

            const q = this.questions[this.currentQuestion];
            
            document.getElementById('question-number').textContent = this.currentQuestion + 1;
            document.getElementById('total-questions').textContent = this.questions.length;
            document.getElementById('question-text').textContent = q.question;
            
            const answersContainer = document.getElementById('answers-container');
            answersContainer.innerHTML = '';
            
            q.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'answer-btn';
                button.dataset.answer = index;
                button.textContent = option;
                answersContainer.appendChild(button);
            });

            document.getElementById('feedback').style.display = 'none';
            document.getElementById('next-btn').style.display = 'none';
        } else {
            this.showResults();
        }

        this.updateProgress();
    }

    selectAnswer(answerIndex) {
        if (document.querySelector('.answer-btn.selected')) return; // Already answered

        const buttons = document.querySelectorAll('.answer-btn');
        const q = this.questions[this.currentQuestion];
        
        buttons.forEach((btn, index) => {
            btn.disabled = true;
            if (index === q.correct) {
                btn.classList.add('correct');
            } else if (index === answerIndex && index !== q.correct) {
                btn.classList.add('incorrect');
            }
            if (index === answerIndex) {
                btn.classList.add('selected');
            }
        });

        this.answered++;
        if (answerIndex === q.correct) {
            this.score++;
        }

        document.getElementById('feedback-text').textContent = q.explanation;
        document.getElementById('feedback').style.display = 'block';
        document.getElementById('next-btn').style.display = 'inline-block';
        
        this.updateStats();
    }

    nextQuestion() {
        this.currentQuestion++;
        this.displayQuestion();
    }

    updateProgress() {
        const progress = ((this.currentQuestion) / this.questions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
    }

    updateStats() {
        document.getElementById('current-score').textContent = this.score;
        document.getElementById('questions-answered').textContent = this.answered;
        
        const accuracy = this.answered > 0 ? Math.round((this.score / this.answered) * 100) : 0;
        document.getElementById('accuracy').textContent = `${accuracy}%`;
    }

    showResults() {
        document.getElementById('question-container').style.display = 'none';
        document.getElementById('results-container').style.display = 'block';

        const accuracy = Math.round((this.score / this.questions.length) * 100);
        document.getElementById('final-score').textContent = `${this.score}/${this.questions.length}`;
        document.getElementById('final-accuracy').textContent = `${accuracy}%`;

        let grade, message;
        if (accuracy >= 90) {
            grade = 'A+';
            message = 'Outstanding! You have expert-level healthcare marketing knowledge.';
        } else if (accuracy >= 80) {
            grade = 'A';
            message = 'Excellent! Your healthcare marketing expertise is impressive.';
        } else if (accuracy >= 70) {
            grade = 'B';
            message = 'Good job! You have solid healthcare marketing fundamentals.';
        } else if (accuracy >= 60) {
            grade = 'C';
            message = 'Not bad! Consider studying more healthcare marketing best practices.';
        } else {
            grade = 'D';
            message = 'Keep learning! Healthcare marketing has many nuances to master.';
        }

        document.getElementById('grade').textContent = grade;
        document.getElementById('result-message').textContent = message;

        // Celebration animation for high scores
        if (accuracy >= 80) {
            this.showCelebration();
        }
    }

    showCelebration() {
        const celebration = document.createElement('div');
        celebration.className = 'celebration';
        celebration.innerHTML = '🎉';
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            celebration.remove();
        }, 3000);
    }

    restartTrivia() {
        this.currentQuestion = 0;
        this.score = 0;
        this.answered = 0;
        this.updateStats();
        this.displayQuestion();
    }
}

// Initialize trivia when content is ready
let triviaApp;

// Multiple initialization strategies
document.addEventListener('DOMContentLoaded', initTrivia);
window.addEventListener('load', initTrivia);

// Custom event for dynamic content loading
document.addEventListener('triviaContentLoaded', initTrivia);

// Mutation observer for dynamic content
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            const triviaContent = document.getElementById('trivia-content');
            if (triviaContent && triviaContent.innerHTML.trim() && !triviaApp) {
                initTrivia();
            }
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Fallback timer
let initAttempts = 0;
const maxAttempts = 10;

function attemptInit() {
    const triviaContent = document.getElementById('trivia-content');
    console.log(`Trivia init attempt ${initAttempts + 1}:`, {
        triviaContent: !!triviaContent,
        hasContent: triviaContent ? triviaContent.innerHTML.trim().length > 0 : false,
        triviaApp: !!triviaApp
    });
    
    if (triviaContent && triviaContent.innerHTML.trim() && !triviaApp) {
        initTrivia();
    } else if (initAttempts < maxAttempts) {
        initAttempts++;
        setTimeout(attemptInit, 500);
    }
}

setTimeout(attemptInit, 500);

function initTrivia() {
    const triviaContent = document.getElementById('trivia-content');
    console.log('Attempting to initialize trivia:', {
        triviaContent: !!triviaContent,
        hasContent: triviaContent ? triviaContent.innerHTML.trim().length > 0 : false,
        alreadyInitialized: !!triviaApp
    });
    
    if (triviaContent && triviaContent.innerHTML.trim() && !triviaApp) {
        console.log('Initializing Healthcare Marketing Trivia');
        triviaApp = new HealthcareMarketingTrivia();
    }
}

// Export for external use
if (typeof window !== 'undefined') {
    window.HealthcareMarketingTrivia = HealthcareMarketingTrivia;
} 