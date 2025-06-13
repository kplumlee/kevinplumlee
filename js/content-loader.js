// Content Loader Module
const ContentLoader = {
    cache: new Map(),
    
    // Embedded content to avoid CORS issues with local files
    embeddedContent: {
        about: `<div class="about-content">
    <!-- Header section with profile picture on left and name/title on right -->
    <div class="about-header">
        <div class="header-profile-image">
            <img src="../images/profilepicture/Kevin_Plumlee.webp" alt="Kevin Plumlee - VP Performance Marketing at Unlock Health" />
        </div>
        <div class="header-info">
            <h2>Kevin Plumlee</h2>
            <p class="title">VP Performance Marketing at Unlock Health</p>
            <p class="subtitle">Digital Marketing Strategist | Healthcare Innovation Leader</p>
        </div>
    </div>

    <!-- Main bio and value proposition -->
    <div class="profile-bio-section">
        <p class="bio">Transform your healthcare organization with over 15 years of cutting-edge digital marketing, SEO mastery, and full-stack web development expertise. As VP of Performance Marketing at Unlock Health and co-founder of Dreamscape Marketing, I lead our team in architecting data-driven digital ecosystems that revolutionize patient acquisition, enhance online visibility, and deliver exceptional ROI.</p>
        
        <div class="career-highlight">
            <p><strong>From scaling startups to 80+ person agencies to becoming the largest behavioral health marketing firm in the U.S.</strong>, I now bring this expertise to Unlock Health, where I blend technical prowess with strategic vision to create digital solutions that connect people to life-changing care.</p>
        </div>
        
        <div class="value-proposition">
            <div class="value-item">
                <i class="fas fa-rocket"></i>
                <div class="value-content">
                    <span class="value-title">Growth Catalyst</span>
                    <span class="value-desc">Scaled companies from 2 to 80+ employees through strategic digital transformation</span>
                </div>
            </div>
            <div class="value-item">
                <i class="fas fa-chart-line"></i>
                <div class="value-content">
                    <span class="value-title">ROI Focused</span>
                    <span class="value-desc">Consistently deliver measurable results exceeding industry benchmarks</span>
                </div>
            </div>
            <div class="value-item">
                <i class="fas fa-shield-alt"></i>
                <div class="value-content">
                    <span class="value-title">Healthcare Compliant</span>
                    <span class="value-desc">HIPAA-compliant solutions with deep regulatory understanding</span>
                </div>
            </div>
        </div>
        
        <div class="unlock-health-role">
            <h3><i class="fas fa-building"></i> My Role at Unlock Health</h3>
            <p>As VP of Performance Marketing, I lead our healthcare marketing initiatives, overseeing strategic vision and management of SEO, content creation, and web development for healthcare clients nationwide. I work directly with our team to design and implement comprehensive strategies that enhance organic search rankings, drive patient acquisition, and deliver measurable ROI through integrated solutions spanning managed care, marketing, and technology.</p>
        </div>
    </div>

    <div class="expertise-overview">
        <h3>Digital Marketing Excellence at Unlock Health</h3>
        <p class="section-intro">Leading comprehensive digital marketing strategies that drive patient acquisition and organizational growth through integrated, multi-channel approaches.</p>
        
        <div class="marketing-methodology">
            <div class="methodology-card">
                <i class="fas fa-bullhorn"></i>
                <h4>Strategic Digital Marketing</h4>
                <div class="methodology-details">
                    <div class="detail-section">
                        <h5>Campaign Orchestration & Strategy</h5>
                        <ul>
                            <li>Multi-channel campaign orchestration</li>
                            <li>Patient journey mapping & optimization</li>
                            <li>Conversion funnel development</li>
                            <li>Marketing automation & CRM integration</li>
                            <li>Attribution modeling & performance tracking</li>
                            <li>Budget optimization & spend efficiency</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="methodology-card">
                <i class="fas fa-users"></i>
                <h4>Audience Development</h4>
                <div class="methodology-details">
                    <div class="detail-section">
                        <h5>Healthcare Persona & Segmentation</h5>
                        <ul>
                            <li>Healthcare persona development</li>
                            <li>Behavioral segmentation strategies</li>
                            <li>Demographic & psychographic analysis</li>
                            <li>Patient lifecycle optimization</li>
                            <li>Referral source optimization</li>
                            <li>Community engagement strategies</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="methodology-card">
                <i class="fas fa-ads"></i>
                <h4>Paid Media Mastery</h4>
                <div class="methodology-details">
                    <div class="detail-section">
                        <h5>Healthcare-Compliant Advertising</h5>
                        <ul>
                            <li>Google Ads campaign management</li>
                            <li>Facebook & social media advertising</li>
                            <li>Healthcare-compliant ad creation</li>
                            <li>Landing page optimization</li>
                            <li>A/B testing & creative optimization</li>
                            <li>Cross-platform campaign coordination</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="seo-expertise">
        <h3>Advanced SEO & Technical Optimization</h3>
        <p class="section-intro">Leading comprehensive search engine optimization strategies that dominate healthcare search results and drive organic patient acquisition.</p>
        
        <div class="seo-methodology">
            <div class="methodology-card">
                <i class="fas fa-search"></i>
                <h4>Technical SEO Mastery</h4>
                <div class="methodology-details">
                    <div class="detail-section">
                        <h5>Site Architecture & Performance</h5>
                        <ul>
                            <li>Core Web Vitals optimization (LCP, CLS, FID)</li>
                            <li>Mobile-first indexing strategies</li>
                            <li>Page speed optimization & caching</li>
                            <li>Structured data implementation (Schema.org)</li>
                            <li>XML sitemap optimization</li>
                            <li>Robot.txt configuration</li>
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h5>Healthcare SEO Specialization</h5>
                        <ul>
                            <li>Medical entity optimization</li>
                            <li>Local SEO for healthcare practices</li>
                            <li>YMYL (Your Money Your Life) content strategy</li>
                            <li>E-A-T (Expertise, Authority, Trust) building</li>
                            <li>Medical review content processes</li>
                            <li>Healthcare compliance in content</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="methodology-card">
                <i class="fas fa-keywords"></i>
                <h4>Keyword Research & Strategy</h4>
                <div class="methodology-details">
                    <div class="detail-section">
                        <h5>Advanced Research Techniques</h5>
                        <ul>
                            <li>Healthcare-specific keyword analysis</li>
                            <li>Competitor gap analysis</li>
                            <li>Semantic keyword clustering</li>
                            <li>Intent-based keyword mapping</li>
                            <li>Long-tail opportunity identification</li>
                            <li>Local search optimization</li>
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h5>Content Strategy Integration</h5>
                        <ul>
                            <li>Topic cluster development</li>
                            <li>Pillar page architecture</li>
                            <li>Content calendar optimization</li>
                            <li>Featured snippet targeting</li>
                            <li>FAQ optimization strategies</li>
                            <li>Voice search optimization</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="seo-technology-stack">
        <div class="section-header">
            <div class="section-icon">
                <i class="fas fa-chart-line"></i>
            </div>
            <div class="section-content">
                <h3>Advanced SEO & Analytics Platform</h3>
                <p class="section-intro">Deploying enterprise-grade SEO platforms and sophisticated analytics solutions to achieve superior search performance, dominate healthcare search rankings, and deliver measurable ROI for patient acquisition.</p>
            </div>
        </div>
        
        <div class="seo-areas">
            <div class="seo-area">
                <i class="fas fa-search"></i>
                <h4>Comprehensive SEO Platforms</h4>
                <div class="tech-stack">
                    <div class="tech-category">
                        <h5>Platform Tools</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">SEMrush</span>
                            <span class="tech-tag">Ahrefs</span>
                            <span class="tech-tag">Moz Pro</span>
                            <span class="tech-tag">Majestic</span>
                        </div>
                    </div>
                    
                    <div class="tech-category">
                        <h5>Core Features</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">Keyword Research</span>
                            <span class="tech-tag">Competitor Analysis</span>
                            <span class="tech-tag">Site Audits</span>
                            <span class="tech-tag">Rank Tracking</span>
                        </div>
                    </div>
                    
                    <div class="tech-category">
                        <h5>Advanced Analysis</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">Backlink Analysis</span>
                            <span class="tech-tag">Content Explorer</span>
                            <span class="tech-tag">Local SEO</span>
                            <span class="tech-tag">Link Explorer</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="seo-area">
                <i class="fas fa-cogs"></i>
                <h4>Technical SEO & Analytics</h4>
                <div class="tech-stack">
                    <div class="tech-category">
                        <h5>Audit Tools</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">Screaming Frog</span>
                            <span class="tech-tag">GTmetrix</span>
                            <span class="tech-tag">PageSpeed Insights</span>
                            <span class="tech-tag">Schema Markup</span>
                        </div>
                    </div>
                    
                    <div class="tech-category">
                        <h5>Performance Monitoring</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">Site Audits</span>
                            <span class="tech-tag">Speed Testing</span>
                            <span class="tech-tag">Core Web Vitals</span>
                            <span class="tech-tag">Broken Links</span>
                        </div>
                    </div>
                    
                    <div class="tech-category">
                        <h5>Data Insights</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">Rich Snippets</span>
                            <span class="tech-tag">Medical Entity</span>
                            <span class="tech-tag">Performance Monitoring</span>
                            <span class="tech-tag">Technical Analysis</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="seo-area">
                <i class="fab fa-google"></i>
                <h4>Google Marketing Platform</h4>
                <div class="tech-stack">
                    <div class="tech-category">
                        <h5>Analytics & Search</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">Google Analytics 4</span>
                            <span class="tech-tag">Google Search Console</span>
                            <span class="tech-tag">Google Ads</span>
                            <span class="tech-tag">Google Tag Manager</span>
                        </div>
                    </div>
                    
                    <div class="tech-category">
                        <h5>Tracking & Events</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">GA4 Migration</span>
                            <span class="tech-tag">Custom Events</span>
                            <span class="tech-tag">Event Tracking</span>
                            <span class="tech-tag">Conversion Setup</span>
                        </div>
                    </div>
                    
                    <div class="tech-category">
                        <h5>Healthcare Campaigns</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">Healthcare Ads</span>
                            <span class="tech-tag">Local Campaigns</span>
                            <span class="tech-tag">Search Performance</span>
                            <span class="tech-tag">Attribution</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="seo-area">
                <i class="fas fa-stethoscope"></i>
                <h4>Healthcare-Specific Tools</h4>
                <div class="tech-stack">
                    <div class="tech-category">
                        <h5>Reputation Management</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">BirdEye</span>
                            <span class="tech-tag">Review Management</span>
                            <span class="tech-tag">Local Listings</span>
                            <span class="tech-tag">Reputation Monitoring</span>
                        </div>
                    </div>
                    
                    <div class="tech-category">
                        <h5>Compliance & Security</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">HIPAA Compliance</span>
                            <span class="tech-tag">Data Privacy</span>
                            <span class="tech-tag">Security Audits</span>
                            <span class="tech-tag">Privacy Protection</span>
                        </div>
                    </div>
                    
                    <div class="tech-category">
                        <h5>Patient Experience</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">Healthcare UX</span>
                            <span class="tech-tag">Accessibility</span>
                            <span class="tech-tag">Patient Journey</span>
                            <span class="tech-tag">User Testing</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="web-development">
        <h3>Full-Stack Web Development</h3>
        <p class="section-intro">Modern, scalable, and HIPAA-compliant web solutions that enhance user experience and drive conversions.</p>
        
        <div class="development-areas">
            <div class="dev-area">
                <i class="fab fa-html5"></i>
                <h4>Frontend Development</h4>
                <div class="tech-stack">
                    <div class="tech-category">
                        <h5>Core Technologies</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">HTML5</span>
                            <span class="tech-tag">CSS3</span>
                            <span class="tech-tag">JavaScript ES6+</span>
                            <span class="tech-tag">TypeScript</span>
                        </div>
                    </div>
                    
                    <div class="tech-category">
                        <h5>Frameworks & Libraries</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">React</span>
                            <span class="tech-tag">Vue.js</span>
                            <span class="tech-tag">Bootstrap</span>
                            <span class="tech-tag">Tailwind CSS</span>
                        </div>
                    </div>
                    
                    <div class="tech-category">
                        <h5>Specializations</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">Responsive Design</span>
                            <span class="tech-tag">Progressive Web Apps</span>
                            <span class="tech-tag">Accessibility (WCAG)</span>
                            <span class="tech-tag">Performance Optimization</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="dev-area">
                <i class="fas fa-server"></i>
                <h4>Backend Development</h4>
                <div class="tech-stack">
                    <div class="tech-category">
                        <h5>Server Technologies</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">Node.js</span>
                            <span class="tech-tag">PHP</span>
                            <span class="tech-tag">Python</span>
                            <span class="tech-tag">Express.js</span>
                        </div>
                    </div>
                    
                    <div class="tech-category">
                        <h5>Database Management</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">MySQL</span>
                            <span class="tech-tag">PostgreSQL</span>
                            <span class="tech-tag">MongoDB</span>
                            <span class="tech-tag">Redis</span>
                        </div>
                    </div>
                    
                    <div class="tech-category">
                        <h5>Integration & APIs</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">RESTful APIs</span>
                            <span class="tech-tag">GraphQL</span>
                            <span class="tech-tag">CRM Integration</span>
                            <span class="tech-tag">Payment Processing</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="dev-area">
                <i class="fas fa-cloud"></i>
                <h4>DevOps & Deployment</h4>
                <div class="tech-stack">
                    <div class="tech-category">
                        <h5>Cloud Platforms</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">AWS</span>
                            <span class="tech-tag">Google Cloud</span>
                            <span class="tech-tag">Microsoft Azure</span>
                            <span class="tech-tag">Netlify</span>
                        </div>
                    </div>
                    
                    <div class="tech-category">
                        <h5>Development Tools</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">Git/GitHub</span>
                            <span class="tech-tag">Docker</span>
                            <span class="tech-tag">CI/CD Pipelines</span>
                            <span class="tech-tag">Webpack</span>
                        </div>
                    </div>
                    
                    <div class="tech-category">
                        <h5>Security & Compliance</h5>
                        <div class="tech-tags">
                            <span class="tech-tag">HIPAA Compliance</span>
                            <span class="tech-tag">SSL/TLS Security</span>
                            <span class="tech-tag">Data Encryption</span>
                            <span class="tech-tag">Security Auditing</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="ai-innovation">
        <h3>AI & Innovation Leadership</h3>
        <p class="section-intro">Pioneering AI-driven solutions that enhance healthcare marketing effectiveness and patient engagement.</p>
        
        <div class="innovation-grid">
            <div class="innovation-item">
                <i class="fas fa-robot"></i>
                <h4>AI-Powered Analytics</h4>
                <ul>
                    <li>ChatGPT API integration for content generation</li>
                    <li>Predictive analytics for patient behavior</li>
                    <li>Automated reporting and insights</li>
                    <li>Natural language processing for patient feedback</li>
                </ul>
            </div>
            
            <div class="innovation-item">
                <i class="fas fa-brain"></i>
                <h4>Machine Learning Applications</h4>
                <ul>
                    <li>Patient journey optimization algorithms</li>
                    <li>Conversion prediction models</li>
                    <li>Dynamic content personalization</li>
                    <li>Automated A/B testing optimization</li>
                </ul>
            </div>
            
            <div class="innovation-item">
                <i class="fas fa-cogs"></i>
                <h4>Marketing Automation</h4>
                <ul>
                    <li>Intelligent lead scoring systems</li>
                    <li>Automated email marketing campaigns</li>
                    <li>Dynamic landing page optimization</li>
                    <li>Cross-platform campaign synchronization</li>
                </ul>
            </div>
        </div>
    </div>

    <div class="industry-achievements">
        <h3>Industry Leadership & Achievements</h3>
        
        <div class="achievements-grid">
            <div class="achievement">
                <i class="fas fa-trophy"></i>
                <h4>Company Scale Success</h4>
                <p>Co-founded and scaled Dreamscape Marketing from 2 employees to 80+, establishing the largest behavioral health marketing firm in the United States.</p>
            </div>
            
            <div class="achievement">
                <i class="fas fa-handshake"></i>
                <h4>Strategic Acquisitions</h4>
                <p>Successfully navigated two major strategic acquisitions by SPM Group and Unlock Health, contributing to the creation of the largest healthcare marketing company nationally.</p>
            </div>
            
            <div class="achievement">
                <i class="fas fa-chart-line"></i>
                <h4>Performance Excellence</h4>
                <p>Consistently delivered ROI exceeding industry benchmarks across multi-million dollar marketing budgets with industry-leading client retention rates.</p>
            </div>
            
            <div class="achievement">
                <i class="fas fa-users"></i>
                <h4>Team Leadership</h4>
                <p>Built and managed high-performing teams of 80+ professionals across marketing, development, and client services with exceptional growth outcomes.</p>
            </div>
        </div>
    </div>

    <div class="healthcare-specializations">
        <h3>Healthcare Sector Expertise</h3>
        <div class="specializations-grid">
            <div class="specialization-item">
                <i class="fas fa-brain"></i>
                <div class="spec-info">
                    <span class="spec-title">Behavioral Health</span>
                    <span class="spec-desc">Mental health, addiction treatment, therapy practices</span>
                </div>
            </div>
            <div class="specialization-item">
                <i class="fas fa-user-friends"></i>
                <div class="spec-info">
                    <span class="spec-title">Senior Living</span>
                    <span class="spec-desc">Assisted living, memory care, independent living</span>
                </div>
            </div>
            <div class="specialization-item">
                <i class="fas fa-tooth"></i>
                <div class="spec-info">
                    <span class="spec-title">Dental Care</span>
                    <span class="spec-desc">General dentistry, orthodontics, oral surgery</span>
                </div>
            </div>
            <div class="specialization-item">
                <i class="fas fa-hospital"></i>
                <div class="spec-info">
                    <span class="spec-title">Hospital Systems</span>
                    <span class="spec-desc">Multi-location healthcare networks, specialty care</span>
                </div>
            </div>
        </div>
    </div>

    <div class="certifications-education">
        <h3>Professional Development</h3>
        <div class="cert-grid">
            <div class="cert-item">
                <i class="fas fa-certificate"></i>
                <div class="cert-info">
                    <h4>Digital Marketing Certification</h4>
                    <p>Advanced certification in digital marketing strategies and analytics</p>
                </div>
            </div>
            <div class="cert-item">
                <i class="fas fa-graduation-cap"></i>
                <div class="cert-info">
                    <h4>Bachelor of Science</h4>
                    <p>Computer Science & Business, Towson University</p>
                </div>
            </div>
        </div>
    </div>

    <div class="contact-cta">
        <h3>Ready to Work with Kevin & Unlock Health?</h3>
        <p>Partner with me and the Unlock Health team to transform your healthcare organization through strategic digital marketing, advanced SEO, and innovative web development solutions that drive exceptional growth.</p>
        
        <div class="cta-highlight">
            <i class="fas fa-handshake"></i>
            <div class="cta-text">
                <h4>Work with Unlock Health</h4>
                <p>Reach out to discuss how Kevin and our expert team can drive your organization's digital marketing success through our comprehensive healthcare marketing platform.</p>
            </div>
        </div>
        
        <div class="cta-buttons">
            <a href="https://unlockhealth.com" class="cta-primary" target="_blank" rel="noopener">
                <i class="fas fa-building"></i>
                Explore Unlock Health
            </a>
            <a href="https://linkedin.com/in/kevinplumlee" class="cta-secondary" target="_blank" rel="noopener">
                <i class="fab fa-linkedin"></i>
                Connect on LinkedIn
            </a>
        </div>
    </div>

    <div class="social-links">
        <a href="https://linkedin.com/in/kevinplumlee" class="social-link" target="_blank" rel="noopener">
            <i class="fab fa-linkedin"></i>
        </a>
        <a href="https://badgr.com/public/assertions/thX0QvfBRc-IOJV7qjZs7g" class="social-link" target="_blank" rel="noopener">
            <i class="fas fa-certificate"></i>
        </a>
        <a href="https://unlockhealth.com" class="social-link" target="_blank" rel="noopener">
            <i class="fas fa-building"></i>
        </a>
    </div>
</div>`,
        
        projects: `<div class="projects-hero">
    <h2>Healthcare Marketing Excellence with Unlock Health</h2>
    <p class="hero-subtitle">Led by Kevin Plumlee, our team delivers comprehensive digital marketing solutions that transform healthcare organizations and drive exceptional patient acquisition results.</p>
    <div class="hero-stats">
        <div class="stat">
            <span class="stat-number">300+</span>
            <span class="stat-label">Healthcare Clients</span>
        </div>
        <div class="stat">
            <span class="stat-number">200%</span>
            <span class="stat-label">Average ROI Increase</span>
        </div>
        <div class="stat">
            <span class="stat-number">$50M+</span>
            <span class="stat-label">Ad Spend Managed</span>
        </div>
    </div>
</div>

<div class="project-filters">
    <div class="filter-btn active" data-filter="all">All Projects</div>
    <div class="filter-btn" data-filter="behavioral-health">Behavioral Health</div>
    <div class="filter-btn" data-filter="senior-living">Senior Living</div>
    <div class="filter-btn" data-filter="healthcare-systems">Healthcare Systems</div>
    <div class="filter-btn" data-filter="addiction-treatment">Addiction Treatment</div>
</div>

<div class="projects-grid">
    <!-- National Addiction Treatment Network -->
    <div class="project-item featured" data-category="addiction-treatment behavioral-health" data-status="completed">
        <div class="project-status completed">Completed</div>
        <div class="project-image">
            <i class="fas fa-hospital-alt"></i>
        </div>
        <div class="project-info">
            <h3>National Addiction Treatment Network</h3>
            <p class="project-subtitle">Multi-Location Treatment Centers</p>
            <p>Led comprehensive digital transformation for one of the nation's largest addiction treatment networks. Delivered a complete website rebuild, enterprise SEO strategy, and multi-location Google Ads campaigns driving over 40% increase in qualified admissions.</p>
            
            <div class="project-details">
                <div class="detail-section">
                    <h4><i class="fas fa-globe"></i> Website Development</h4>
                    <ul>
                        <li>Complete website architecture redesign with patient journey optimization</li>
                        <li>HIPAA-compliant patient intake and assessment forms</li>
                        <li>Multi-location service area mapping and local content</li>
                        <li>Insurance verification tools and treatment program configurators</li>
                        <li>Mobile-first responsive design with Core Web Vitals optimization</li>
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-search"></i> SEO Strategy</h4>
                    <ul>
                        <li>National and local SEO for 25+ treatment locations</li>
                        <li>Medical entity optimization and E-A-T content strategy</li>
                        <li>Treatment-specific landing pages with conversion optimization</li>
                        <li>Schema markup for medical facilities and treatment programs</li>
                        <li>Achieved 150% increase in organic patient inquiries</li>
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-ad"></i> Digital Marketing</h4>
                    <ul>
                        <li>Multi-location Google Ads campaigns with geo-targeting</li>
                        <li>Social media marketing for addiction awareness and education</li>
                        <li>Retargeting campaigns for website visitors and previous patients</li>
                        <li>Call tracking and conversion optimization across all channels</li>
                        <li>Crisis intervention advertising and emergency response campaigns</li>
                    </ul>
                </div>
            </div>
            
            <div class="project-results">
                <div class="result-item">
                    <span class="result-number">40%</span>
                    <span class="result-label">Admission Increase</span>
                </div>
                <div class="result-item">
                    <span class="result-number">150%</span>
                    <span class="result-label">Organic Inquiries</span>
                </div>
                <div class="result-item">
                    <span class="result-number">25+</span>
                    <span class="result-label">Locations Optimized</span>
                </div>
            </div>
            
            <div class="project-tech">
                <span class="tech-tag">Multi-Location SEO</span>
                <span class="tech-tag">HIPAA Compliance</span>
                <span class="tech-tag">Google Ads</span>
                <span class="tech-tag">Call Tracking</span>
                <span class="tech-tag">Crisis Marketing</span>
                <span class="tech-tag">Conversion Optimization</span>
            </div>
        </div>
    </div>

    <!-- Luxury Treatment Centers -->
    <div class="project-item featured" data-category="addiction-treatment behavioral-health" data-status="completed">
        <div class="project-status completed">Completed</div>
        <div class="project-image">
            <i class="fas fa-heart"></i>
        </div>
        <div class="project-info">
            <h3>Luxury Treatment Centers</h3>
            <p class="project-subtitle">Premium Addiction Recovery Network</p>
            <p>Developed sophisticated digital marketing strategies for an upscale addiction treatment network, focusing on premium care messaging, family support resources, and high-end treatment program promotion across multiple luxury facilities.</p>
            
            <div class="project-details">
                <div class="detail-section">
                    <h4><i class="fas fa-globe"></i> Website Development</h4>
                    <ul>
                        <li>Luxury-focused website design with premium aesthetic and messaging</li>
                        <li>Comprehensive treatment program showcases and facility virtual tours</li>
                        <li>Advanced patient portal with concierge-level support features</li>
                        <li>Insurance verification for premium plans and private pay options</li>
                        <li>Mobile-optimized design with accessibility and performance focus</li>
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-search"></i> SEO Strategy</h4>
                    <ul>
                        <li>Luxury treatment and premium care keyword optimization</li>
                        <li>High-value patient targeting and conversion strategy</li>
                        <li>Treatment modality-specific content and authority building</li>
                        <li>Local SEO for exclusive treatment locations</li>
                        <li>Achieved 180% increase in qualified luxury care inquiries</li>
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-ad"></i> Digital Marketing</h4>
                    <ul>
                        <li>Premium treatment-focused Google Ads and social campaigns</li>
                        <li>Luxury lifestyle targeting and high-value patient acquisition</li>
                        <li>Family education and executive treatment program promotion</li>
                        <li>Concierge service marketing and VIP care coordination</li>
                        <li>Delivered 90% increase in premium program admissions</li>
                    </ul>
                </div>
            </div>
            
            <div class="project-results">
                <div class="result-item">
                    <span class="result-number">90%</span>
                    <span class="result-label">Premium Admissions</span>
                </div>
                <div class="result-item">
                    <span class="result-number">180%</span>
                    <span class="result-label">Luxury Inquiries</span>
                </div>
                <div class="result-item">
                    <span class="result-number">95%</span>
                    <span class="result-label">Patient Satisfaction</span>
                </div>
            </div>
            
            <div class="project-tech">
                <span class="tech-tag">Luxury Marketing</span>
                <span class="tech-tag">Premium SEO</span>
                <span class="tech-tag">Concierge Services</span>
                <span class="tech-tag">Executive Programs</span>
                <span class="tech-tag">VIP Care</span>
                <span class="tech-tag">High-Value Targeting</span>
            </div>
        </div>
    </div>

    <!-- Major Healthcare System -->
    <div class="project-item featured" data-category="healthcare-systems" data-status="completed">
        <div class="project-status completed">Completed</div>
        <div class="project-image">
            <i class="fas fa-clinic-medical"></i>
        </div>
        <div class="project-info">
            <h3>Major Healthcare System</h3>
            <p class="project-subtitle">Integrated Healthcare Network Digital Strategy</p>
            <p>Partnered with a leading healthcare system to enhance their digital ecosystem, focusing on patient engagement, provider connectivity, and integrated care coordination through comprehensive website optimization and strategic digital marketing initiatives.</p>
            
            <div class="project-details">
                <div class="detail-section">
                    <h4><i class="fas fa-hospital"></i> Healthcare System Integration</h4>
                    <ul>
                        <li>Multi-specialty clinic website development and optimization</li>
                        <li>EHR integration and patient portal connectivity</li>
                        <li>Provider directory and appointment scheduling systems</li>
                        <li>Telehealth platform integration and optimization</li>
                        <li>Mobile app development for patient engagement</li>
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-users"></i> Patient Acquisition Strategy</h4>
                    <ul>
                        <li>Specialty care SEO optimization and content strategy</li>
                        <li>Local SEO for multiple clinic locations and services</li>
                        <li>Healthcare service-specific landing page development</li>
                        <li>Medical professional and service authority building</li>
                        <li>180% increase in online appointment bookings</li>
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-digital-tachograph"></i> Digital Marketing Excellence</h4>
                    <ul>
                        <li>Healthcare service-focused Google Ads campaigns</li>
                        <li>Physician and specialty care promotional strategies</li>
                        <li>Community health education content marketing</li>
                        <li>Health screening and prevention campaign development</li>
                        <li>Achieved 120% growth in patient referrals</li>
                    </ul>
                </div>
            </div>
            
            <div class="project-results">
                <div class="result-item">
                    <span class="result-number">180%</span>
                    <span class="result-label">Appointment Bookings</span>
                </div>
                <div class="result-item">
                    <span class="result-number">120%</span>
                    <span class="result-label">Patient Referrals</span>
                </div>
                <div class="result-item">
                    <span class="result-number">50+</span>
                    <span class="result-label">Specialty Services</span>
                </div>
            </div>
            
            <div class="project-tech">
                <span class="tech-tag">Healthcare Systems</span>
                <span class="tech-tag">EHR Integration</span>
                <span class="tech-tag">Multi-Location SEO</span>
                <span class="tech-tag">Telehealth</span>
                <span class="tech-tag">Patient Portals</span>
                <span class="tech-tag">Specialty Care</span>
            </div>
        </div>
    </div>

    <!-- National Hospice Network -->
    <div class="project-item" data-category="healthcare-systems" data-status="completed">
        <div class="project-status completed">Completed</div>
        <div class="project-image">
            <i class="fas fa-home"></i>
        </div>
        <div class="project-info">
            <h3>National Hospice Network</h3>
            <p class="project-subtitle">Compassionate End-of-Life Care Marketing</p>
            <p>Developed a comprehensive digital strategy for a leading hospice care provider, focusing on compassionate messaging, family support resources, and healthcare professional outreach across their national network of care locations.</p>
            
            <div class="project-details">
                <div class="detail-section">
                    <h4><i class="fas fa-globe"></i> Website Development</h4>
                    <ul>
                        <li>Compassionate website design with family-focused navigation</li>
                        <li>Grief support resources and educational content libraries</li>
                        <li>Multi-location service area optimization</li>
                        <li>Provider referral portals and professional resources</li>
                        <li>HIPAA-compliant family communication systems</li>
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-search"></i> SEO Strategy</h4>
                    <ul>
                        <li>Local SEO optimization for 190+ hospice locations</li>
                        <li>Hospice and palliative care keyword targeting</li>
                        <li>Family education content strategy and authority building</li>
                        <li>Healthcare provider outreach and referral optimization</li>
                        <li>Achieved 125% increase in family inquiries</li>
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-ad"></i> Digital Marketing</h4>
                    <ul>
                        <li>Compassionate messaging campaigns for families and providers</li>
                        <li>Healthcare professional education and outreach programs</li>
                        <li>Community awareness and bereavement support campaigns</li>
                        <li>Referral source development and partnership marketing</li>
                        <li>Delivered 95% increase in provider referrals</li>
                    </ul>
                </div>
            </div>
            
            <div class="project-results">
                <div class="result-item">
                    <span class="result-number">125%</span>
                    <span class="result-label">Family Inquiries</span>
                </div>
                <div class="result-item">
                    <span class="result-number">95%</span>
                    <span class="result-label">Provider Referrals</span>
                </div>
                <div class="result-item">
                    <span class="result-number">190+</span>
                    <span class="result-label">Locations Optimized</span>
                </div>
            </div>
            
            <div class="project-tech">
                <span class="tech-tag">Hospice Marketing</span>
                <span class="tech-tag">Family Resources</span>
                <span class="tech-tag">Multi-Location SEO</span>
                <span class="tech-tag">Provider Outreach</span>
                <span class="tech-tag">Compassionate Messaging</span>
                <span class="tech-tag">Grief Support</span>
            </div>
        </div>
    </div>

    <!-- Premium Senior Living Network -->
    <div class="project-item" data-category="senior-living" data-status="completed">
        <div class="project-status completed">Completed</div>
        <div class="project-image">
            <i class="fas fa-building"></i>
        </div>
        <div class="project-info">
            <h3>Premium Senior Living Network</h3>
            <p class="project-subtitle">Luxury Senior Care Communities</p>
            <p>Created a sophisticated digital marketing ecosystem for a premium senior living network, incorporating virtual community tours, family communication tools, and comprehensive care level marketing to drive occupancy and family engagement.</p>
            
            <div class="project-details">
                <div class="detail-section">
                    <h4><i class="fas fa-globe"></i> Website Development</h4>
                    <ul>
                        <li>Premium community websites with immersive virtual tours</li>
                        <li>Interactive floor plans and amenity showcases</li>
                        <li>Family communication portals and resident updates</li>
                        <li>Care level assessment tools and pricing calculators</li>
                        <li>Mobile-optimized design for family accessibility</li>
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-search"></i> SEO Strategy</h4>
                    <ul>
                        <li>Senior living keyword optimization and content strategy</li>
                        <li>Local SEO for each community location and care level</li>
                        <li>Family education content and decision-making resources</li>
                        <li>Care level-specific landing pages and conversion optimization</li>
                        <li>Achieved 160% increase in tour bookings</li>
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-ad"></i> Digital Marketing</h4>
                    <ul>
                        <li>Family-focused Google Ads campaigns and remarketing</li>
                        <li>Social media marketing for community engagement</li>
                        <li>Virtual event marketing and family education seminars</li>
                        <li>Occupancy marketing and waitlist management campaigns</li>
                        <li>Delivered 45% increase in qualified inquiries</li>
                    </ul>
                </div>
            </div>
            
            <div class="project-results">
                <div class="result-item">
                    <span class="result-number">160%</span>
                    <span class="result-label">Tour Bookings</span>
                </div>
                <div class="result-item">
                    <span class="result-number">45%</span>
                    <span class="result-label">Qualified Inquiries</span>
                </div>
                <div class="result-item">
                    <span class="result-number">92%</span>
                    <span class="result-label">Occupancy Rate</span>
                </div>
            </div>
            
            <div class="project-tech">
                <span class="tech-tag">Senior Living</span>
                <span class="tech-tag">Virtual Tours</span>
                <span class="tech-tag">Family Portals</span>
                <span class="tech-tag">Care Assessment</span>
                <span class="tech-tag">Occupancy Marketing</span>
                <span class="tech-tag">Community Engagement</span>
            </div>
        </div>
    </div>

    <!-- Teen & Young Adult Treatment Programs -->
    <div class="project-item" data-category="addiction-treatment behavioral-health" data-status="completed">
        <div class="project-status completed">Completed</div>
        <div class="project-image">
            <i class="fas fa-spa"></i>
        </div>
        <div class="project-info">
            <h3>Teen & Young Adult Treatment Programs</h3>
            <p class="project-subtitle">Adolescent Mental Health & Addiction Services</p>
            <p>Developed specialized marketing strategies for a leading adolescent and young adult treatment provider, focusing on family-centered messaging, educational resources, and age-appropriate treatment program promotion.</p>
            
            <div class="project-details">
                <div class="detail-section">
                    <h4><i class="fas fa-globe"></i> Website Development</h4>
                    <ul>
                        <li>Youth-focused website design with engaging visual elements</li>
                        <li>Parent and teen resource centers with educational content</li>
                        <li>Academic integration tools and school partnership portals</li>
                        <li>Family therapy scheduling and communication systems</li>
                        <li>Mobile-first design optimized for teen and parent usage</li>
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-search"></i> SEO Strategy</h4>
                    <ul>
                        <li>Teen and young adult treatment keyword optimization</li>
                        <li>Family education content strategy and parent resources</li>
                        <li>Academic support and school integration content</li>
                        <li>Age-specific treatment program landing pages</li>
                        <li>Achieved 140% increase in family consultations</li>
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-ad"></i> Digital Marketing</h4>
                    <ul>
                        <li>Parent-focused Google Ads campaigns and social media</li>
                        <li>Educational content marketing for families and schools</li>
                        <li>Academic partnership marketing and referral programs</li>
                        <li>Crisis intervention and family support campaigns</li>
                        <li>Delivered 75% increase in program admissions</li>
                    </ul>
                </div>
            </div>
            
            <div class="project-results">
                <div class="result-item">
                    <span class="result-number">75%</span>
                    <span class="result-label">Program Admissions</span>
                </div>
                <div class="result-item">
                    <span class="result-number">140%</span>
                    <span class="result-label">Family Consultations</span>
                </div>
                <div class="result-item">
                    <span class="result-number">90%</span>
                    <span class="result-label">Program Completion</span>
                </div>
            </div>
            
            <div class="project-tech">
                <span class="tech-tag">Teen Treatment</span>
                <span class="tech-tag">Family Therapy</span>
                <span class="tech-tag">Academic Support</span>
                <span class="tech-tag">Mobile-First</span>
                <span class="tech-tag">Social Media</span>
                <span class="tech-tag">Crisis Support</span>
            </div>
        </div>
    </div>

    <!-- Outpatient Treatment Centers -->
    <div class="project-item" data-category="addiction-treatment behavioral-health" data-status="completed">
        <div class="project-status completed">Completed</div>
        <div class="project-image">
            <i class="fas fa-seedling"></i>
        </div>
        <div class="project-info">
            <h3>Outpatient Treatment Centers</h3>
            <p class="project-subtitle">Community-Based Recovery Programs</p>
            <p>Created a comprehensive digital marketing strategy for a growing outpatient treatment network, emphasizing accessibility, insurance acceptance, and community-based care while maintaining strong conversion optimization and local market penetration.</p>
            
            <div class="project-details">
                <div class="detail-section">
                    <h4><i class="fas fa-globe"></i> Website Development</h4>
                    <ul>
                        <li>Accessible outpatient-focused website with scheduling integration</li>
                        <li>Insurance verification and pre-authorization tools</li>
                        <li>Community resource directories and support group listings</li>
                        <li>Flexible program scheduling and appointment booking systems</li>
                        <li>Local community integration and partnership portals</li>
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-search"></i> SEO Strategy</h4>
                    <ul>
                        <li>Outpatient treatment and local community keyword targeting</li>
                        <li>Insurance acceptance and accessibility content optimization</li>
                        <li>Community-based recovery resource content strategy</li>
                        <li>Local treatment program and support group optimization</li>
                        <li>Achieved 110% increase in program enrollments</li>
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-ad"></i> Digital Marketing</h4>
                    <ul>
                        <li>Local community-focused Google Ads and social campaigns</li>
                        <li>Insurance-based targeting and affordability messaging</li>
                        <li>Community outreach and partnership development</li>
                        <li>Flexible scheduling and accessibility-focused marketing</li>
                        <li>Delivered 65% increase in community referrals</li>
                    </ul>
                </div>
            </div>
            
            <div class="project-results">
                <div class="result-item">
                    <span class="result-number">110%</span>
                    <span class="result-label">Program Enrollments</span>
                </div>
                <div class="result-item">
                    <span class="result-number">65%</span>
                    <span class="result-label">Community Referrals</span>
                </div>
                <div class="result-item">
                    <span class="result-number">88%</span>
                    <span class="result-label">Patient Retention</span>
                </div>
            </div>
            
            <div class="project-tech">
                <span class="tech-tag">Outpatient Programs</span>
                <span class="tech-tag">Insurance Verification</span>
                <span class="tech-tag">Community Outreach</span>
                <span class="tech-tag">Accessibility Focus</span>
                <span class="tech-tag">Local SEO</span>
                <span class="tech-tag">Support Groups</span>
            </div>
        </div>
    </div>

    <!-- Healthcare Marketing Platform -->
    <div class="project-item featured" data-category="healthcare-systems" data-status="ongoing">
        <div class="project-status ongoing">Ongoing</div>
        <div class="project-image">
            <i class="fas fa-unlock-alt"></i>
        </div>
        <div class="project-info">
            <h3>Unlock Health Marketing Platform</h3>
            <p class="project-subtitle">Integrated Healthcare Marketing Solutions</p>
            <p>Under Kevin's leadership, Unlock Health continues to innovate and deliver comprehensive marketing solutions that integrate managed care, marketing technology, and healthcare expertise to drive measurable growth for organizations nationwide.</p>
            
            <div class="platform-features">
                <div class="feature-grid">
                    <div class="feature-item">
                        <i class="fas fa-chart-network"></i>
                        <h4>Integrated Analytics</h4>
                        <p>Comprehensive reporting across all marketing channels</p>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-robot"></i>
                        <h4>AI-Powered Optimization</h4>
                        <p>Machine learning for campaign and content optimization</p>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-shield-check"></i>
                        <h4>Healthcare Compliance</h4>
                        <p>HIPAA-compliant tools and regulatory expertise</p>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-users-cog"></i>
                        <h4>Managed Services</h4>
                        <p>Full-service marketing team and account management</p>
                    </div>
                </div>
            </div>
            
            <div class="project-tech">
                <span class="tech-tag">Marketing Platform</span>
                <span class="tech-tag">AI Analytics</span>
                <span class="tech-tag">Managed Services</span>
                <span class="tech-tag">Healthcare Focus</span>
                <span class="tech-tag">Compliance Tools</span>
            </div>
        </div>
    </div>
</div>

<div class="projects-cta">
    <h3>Transform Your Healthcare Marketing with Unlock Health</h3>
    <p>Partner with Kevin Plumlee and the Unlock Health team to drive exceptional growth for your healthcare organization through strategic digital marketing, comprehensive SEO, and innovative technology solutions.</p>
    <div class="cta-buttons">
        <a href="https://unlockhealth.com" class="cta-primary" target="_blank">
            <i class="fas fa-rocket"></i>
            Explore Our Services
        </a>
        <a href="mailto:kevin@kevinplumlee.com" class="cta-secondary">
            <i class="fas fa-calendar-alt"></i>
            Schedule Strategy Session
        </a>
    </div>
</div>`,
        
        resume: `<div class="resume-content">
    <div class="resume-header">
        <div class="resume-profile-section">
            <div class="resume-profile-image">
                <img src="images/profilepicture/Kevin_Plumlee.webp" alt="Kevin Plumlee - Healthcare Marketing Executive" />
            </div>
            <div class="resume-profile-info">
                <h2>Kevin Plumlee</h2>
                <div class="contact-info">
                    <span><i class="fas fa-envelope"></i> kevin@kevinplumlee.com</span>
                    <span><i class="fab fa-linkedin"></i> linkedin.com/in/kevinplumlee</span>
                    <span><i class="fas fa-building"></i> unlockhealth.com</span>
                    <span><i class="fas fa-map-marker-alt"></i> Columbia, Maryland</span>
                </div>
            </div>
        </div>
    </div>
    
    <div class="resume-section">
        <h3>Professional Summary</h3>
        <p>Healthcare marketing executive with 15+ years of experience driving transformative growth for organizations in behavioral health, senior living, dental care, and hospital systems. Proven track record in scaling companies, leading digital transformation, and delivering measurable ROI through data-driven strategies. Co-founded Dreamscape Marketing and successfully navigated two strategic acquisitions, establishing industry leadership in healthcare marketing innovation.</p>
    </div>
    
    <div class="resume-section">
        <h3>Experience</h3>
        
        <div class="experience-item">
            <div class="job-header">
                <h4>VP Performance Marketing</h4>
                <span class="duration">Apr 2024 - Present</span>
            </div>
            <p class="company">Unlock Health</p>
            <ul>
                <li>Oversee strategic vision and management of SEO, content creation, and web development for healthcare clients</li>
                <li>Design and implement comprehensive strategies enhancing organic search rankings for hospital systems</li>
                <li>Lead team in creating engaging content tailored to specific healthcare audiences and patient demographics</li>
                <li>Develop user-friendly websites and digital assets aligned with business objectives for sustained organic growth</li>
                <li>Drive measurable ROI through integrated solutions spanning managed care, marketing, and technology</li>
            </ul>
        </div>
        
        <div class="experience-item">
            <div class="job-header">
                <h4>Co-Founder</h4>
                <span class="duration">Jul 2014 - Apr 2024</span>
            </div>
            <p class="company">Dreamscape Marketing, LLC</p>
            <ul>
                <li>Co-founded and scaled company from 2 employees to 80, becoming largest behavioral health marketing firm in the U.S.</li>
                <li>Led strategic acquisitions by SPM Group and Unlock Health, establishing largest healthcare marketing company nationally</li>
                <li>Built comprehensive digital marketing strategies for behavioral health, senior living, and dental care organizations</li>
                <li>Implemented data-driven analytics and process optimization leading to industry-leading client retention rates</li>
                <li>Pioneered innovative approaches in healthcare marketing compliance and patient privacy protection</li>
                <li>Managed multi-million dollar marketing budgets and delivered consistent ROI exceeding industry benchmarks</li>
            </ul>
        </div>
        
        <div class="experience-item">
            <div class="job-header">
                <h4>Digital Marketing Consultant</h4>
                <span class="duration">2010 - 2014</span>
            </div>
            <p class="company">Healthcare Organizations (Various)</p>
            <ul>
                <li>Provided specialized digital marketing consulting for healthcare practices and systems</li>
                <li>Developed SEO strategies and web development solutions for medical practices</li>
                <li>Implemented Google Analytics and tracking systems for patient acquisition measurement</li>
                <li>Created HIPAA-compliant websites and digital marketing campaigns</li>
                <li>Established foundation expertise in healthcare marketing regulations and best practices</li>
            </ul>
        </div>
    </div>
    
    <div class="resume-section">
        <h3>Education</h3>
        
        <div class="education-item">
            <h4>Bachelor of Science in Computer Science, Business</h4>
            <p class="school">Towson University</p>
            <p class="details">2004-2008 • Activities: Intramural Softball</p>
        </div>
        
        <div class="education-item">
            <h4>Associate of Arts in Information Technology, Business</h4>
            <p class="school">Howard Community College</p>
            <p class="details">2002-2004</p>
        </div>
    </div>
    
    <div class="resume-section">
        <h3>Technical Skills & Expertise</h3>
        
        <div class="skills-resume">
            <div class="skill-category">
                <h4><i class="fas fa-search"></i> SEO & Analytics</h4>
                <div class="skill-list">
                    <span class="skill-tag">Google Analytics</span>
                    <span class="skill-tag">Google Search Console</span>
                    <span class="skill-tag">Bing Search Console</span>
                    <span class="skill-tag">Ahrefs</span>
                    <span class="skill-tag">Screaming Frog</span>
                    <span class="skill-tag">Local SEO</span>
                    <span class="skill-tag">Technical SEO</span>
                </div>
            </div>
            
            <div class="skill-category">
                <h4><i class="fas fa-code"></i> Web Development</h4>
                <div class="skill-list">
                    <span class="skill-tag">HTML5</span>
                    <span class="skill-tag">CSS3</span>
                    <span class="skill-tag">JavaScript</span>
                    <span class="skill-tag">Responsive Design</span>
                    <span class="skill-tag">HIPAA Compliance</span>
                    <span class="skill-tag">Web Performance</span>
                </div>
            </div>
            
            <div class="skill-category">
                <h4><i class="fas fa-robot"></i> AI & Automation</h4>
                <div class="skill-list">
                    <span class="skill-tag">ChatGPT APIs</span>
                    <span class="skill-tag">AI Implementation</span>
                    <span class="skill-tag">Process Automation</span>
                    <span class="skill-tag">Predictive Analytics</span>
                </div>
            </div>
            
            <div class="skill-category">
                <h4><i class="fas fa-tools"></i> CRM & Tools</h4>
                <div class="skill-list">
                    <span class="skill-tag">Salesforce</span>
                    <span class="skill-tag">Zoho CRM</span>
                    <span class="skill-tag">Call Tracking Metrics</span>
                    <span class="skill-tag">CallRail</span>
                    <span class="skill-tag">Intranet Management</span>
                </div>
            </div>
            
            <div class="skill-category">
                <h4><i class="fas fa-heartbeat"></i> Healthcare Specialties</h4>
                <div class="skill-list">
                    <span class="skill-tag">Behavioral Health</span>
                    <span class="skill-tag">Senior Living</span>
                    <span class="skill-tag">Dental Marketing</span>
                    <span class="skill-tag">Hospital Systems</span>
                    <span class="skill-tag">Healthcare Compliance</span>
                </div>
            </div>
        </div>
    </div>
    
    <div class="resume-section">
        <h3>Key Achievements</h3>
        
        <div class="achievement-item">
            <i class="fas fa-trophy"></i>
            <div class="achievement-info">
                <h4>Company Growth & Acquisitions</h4>
                <p>Successfully scaled Dreamscape Marketing from startup to industry leader through strategic growth and two major acquisitions</p>
            </div>
        </div>
        
        <div class="achievement-item">
            <i class="fas fa-users"></i>
            <div class="achievement-info">
                <h4>Team Leadership</h4>
                <p>Built and managed teams of 80+ professionals across marketing, development, and client services</p>
            </div>
        </div>
        
        <div class="achievement-item">
            <i class="fas fa-chart-line"></i>
            <div class="achievement-info">
                <h4>Industry Recognition</h4>
                <p>Established largest behavioral health marketing firm in the U.S. and contributed to creating largest healthcare marketing company nationally</p>
            </div>
        </div>
    </div>
    
    <div class="resume-section">
        <h3>Professional Certification</h3>
        
        <div class="cert-item">
            <i class="fas fa-certificate"></i>
            <div class="cert-info">
                <h4>Digital Marketing Certification</h4>
                <p>Verified Achievement • 2024</p>
            </div>
        </div>
    </div>
    
    <div class="download-resume">
        <a href="https://linkedin.com/in/kevinplumlee" target="_blank" rel="noopener" class="download-btn">
            <i class="fab fa-linkedin"></i>
            Connect on LinkedIn
        </a>
    </div>
</div>`,
        
        settings: `<div class="settings-section">
    <h3>Desktop Background</h3>
    <p>Choose a wallpaper from the available options:</p>
    <div class="wallpaper-grid" id="wallpaper-grid">
        <!-- Wallpapers will be loaded dynamically -->
    </div>
</div>`,
        
        contact: `<div class="contact-section">
    <h2>Let's Connect</h2>
    <p class="contact-intro">The best way to reach me is through LinkedIn where I'm most active. For direct communication, feel free to use the contact options below.</p>
    
    <!-- LinkedIn Profile Section -->
    <div class="linkedin-section">
        <h3><i class="fab fa-linkedin"></i> Connect on LinkedIn</h3>
        <div class="linkedin-card">
            <div class="linkedin-info">
                <div class="linkedin-profile">
                    <img src="../images/profilepicture/Kevin_Plumlee.webp" alt="Kevin Plumlee" class="linkedin-avatar">
                    <div class="linkedin-details">
                        <h4>Kevin Plumlee</h4>
                        <p class="linkedin-title">VP Performance Marketing at Unlock Health</p>
                        <p class="linkedin-location">Columbia, Maryland, United States</p>
                        <div class="linkedin-stats">
                            <span><i class="fas fa-users"></i> 500+ connections</span>
                            <span><i class="fas fa-building"></i> Healthcare Marketing Expert</span>
                        </div>
                    </div>
                </div>
                <div class="linkedin-actions">
                    <a href="https://linkedin.com/in/kevinplumlee" class="linkedin-connect-btn" target="_blank" rel="noopener">
                        <i class="fab fa-linkedin"></i>
                        Connect on LinkedIn
                    </a>
                    <p class="linkedin-note">Send me a message on LinkedIn for the fastest response</p>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Contact Methods -->
    <div class="contact-methods-section">
        <h3>Other Ways to Reach Me</h3>
        
        <div class="contact-methods">
            <a href="https://unlockhealth.com/contact" target="_blank" rel="noopener" class="contact-method">
                <i class="fas fa-handshake contact-icon"></i>
                <div class="contact-method-info">
                    <h4>Professional Consultation</h4>
                    <p>Schedule a strategic consultation</p>
                </div>
            </a>
            
            <a href="https://unlockhealth.com" target="_blank" rel="noopener" class="contact-method">
                <i class="fas fa-building contact-icon"></i>
                <div class="contact-method-info">
                    <h4>Unlock Health</h4>
                    <p>Professional inquiries</p>
                </div>
            </a>
            
            <a href="https://badgr.com/public/assertions/thX0QvfBRc-IOJV7qjZs7g" target="_blank" rel="noopener" class="contact-method">
                <i class="fas fa-certificate contact-icon"></i>
                <div class="contact-method-info">
                    <h4>Professional Credentials</h4>
                    <p>View certifications</p>
                </div>
            </a>
        </div>
    </div>
    
    <!-- Professional Info -->
    <div class="professional-info">
        <div class="info-card">
            <i class="fas fa-map-marker-alt"></i>
            <div class="info-content">
                <h4>Location</h4>
                <p>Columbia, Maryland</p>
            </div>
        </div>
        
        <div class="info-card">
            <i class="fas fa-clock"></i>
            <div class="info-content">
                <h4>Time Zone</h4>
                <p>Eastern Time (UTC-5)</p>
            </div>
        </div>
        
        <div class="info-card">
            <i class="fas fa-reply"></i>
            <div class="info-content">
                <h4>Response Time</h4>
                <p>LinkedIn: Same day<br>Consultation: 1-2 business days</p>
            </div>
        </div>
    </div>
    
    <!-- Specialization Areas -->
    <div class="expertise-areas">
        <h3>Areas of Expertise</h3>
        <div class="expertise-grid">
            <div class="expertise-item">
                <i class="fas fa-heartbeat"></i>
                <span>Healthcare Marketing</span>
            </div>
            <div class="expertise-item">
                <i class="fas fa-search"></i>
                <span>SEO Strategy</span>
            </div>
            <div class="expertise-item">
                <i class="fas fa-code"></i>
                <span>Web Development</span>
            </div>
            <div class="expertise-item">
                <i class="fas fa-chart-line"></i>
                <span>Digital Analytics</span>
            </div>
            <div class="expertise-item">
                <i class="fas fa-bullhorn"></i>
                <span>Performance Marketing</span>
            </div>
            <div class="expertise-item">
                <i class="fas fa-cogs"></i>
                <span>Digital Transformation</span>
            </div>
        </div>
    </div>

    <!-- Contact CTA -->
    <div class="contact-cta">
        <h3>Ready to Connect?</h3>
        <p>Whether you're looking for healthcare marketing expertise, SEO consultation, or web development services, I'm here to help transform your digital presence.</p>
        <div class="cta-buttons">
            <a href="https://linkedin.com/in/kevinplumlee" class="cta-primary" target="_blank" rel="noopener">
                <i class="fab fa-linkedin"></i>
                Connect on LinkedIn
            </a>
            <a href="https://unlockhealth.com/contact" class="cta-secondary" target="_blank" rel="noopener">
                <i class="fas fa-building"></i>
                Schedule Consultation
            </a>
        </div>
    </div>
</div>`,


    },
    
    // Load content for a specific app
    async loadContent(appName) {
        Utils.logger.debug(`Loading content for ${appName}`);
        
        // Check cache first
        if (this.cache.has(appName)) {
            Utils.logger.debug(`Content for ${appName} found in cache`);
            return this.cache.get(appName);
        }
        
        try {
            // Show loading state
            this.showLoadingState(appName);
            
            // Add artificial delay for better UX
            await Utils.time.wait(Config.content.loadingDelay);
            
            // Get content from embedded data
            let content = this.embeddedContent[appName];
            
            // Handle function-based content sources
            if (typeof content === 'function') {
                content = content();
            }
            
            if (!content) {
                // Fallback to fetch if embedded content not found
                const response = await fetch(`content/${appName}.html`);
                
                if (!response.ok) {
                    throw new Error(`Failed to load content: ${response.status}`);
                }
                
                content = await response.text();
            }
            
            // Cache the content
            this.cache.set(appName, content);
            
            // Load content into window
            this.injectContent(appName, content);
            
            // Initialize any dynamic functionality
            this.initializeContentFeatures(appName);
            
            Utils.logger.debug(`Content for ${appName} loaded successfully`);
            return content;
            
        } catch (error) {
            Utils.logger.error(`Error loading content for ${appName}:`, error);
            this.showErrorState(appName, error.message);
            throw error;
        }
    },
    
    // Show loading state in window
    showLoadingState(appName) {
        const contentElement = Utils.dom.get(`${appName}-content`);
        if (contentElement) {
            contentElement.innerHTML = `
                <div class="loading">
                    <div class="loading-text">Loading ${Utils.string.capitalize(appName)}...</div>
                </div>
            `;
        }
    },
    
    // Show error state in window
    showErrorState(appName, errorMessage) {
        const contentElement = Utils.dom.get(`${appName}-content`);
        if (contentElement) {
            contentElement.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Failed to Load Content</h3>
                    <p>${errorMessage}</p>
                    <button onclick="ContentLoader.retryLoad('${appName}')" class="retry-btn">
                        <i class="fas fa-redo"></i>
                        Try Again
                    </button>
                </div>
            `;
        }
    },
    
    // Inject content into window
    injectContent(appName, content) {
        const contentElement = Utils.dom.get(`${appName}-content`);
        if (contentElement) {
            contentElement.innerHTML = content;
            
            // Animate content entrance
            const children = contentElement.children;
            Array.from(children).forEach((child, index) => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    Utils.animation.slideInUp(child, 400);
                }, index * 100);
            });
            
            // Recalculate window layout after content is loaded
            setTimeout(() => {
                const window = contentElement.closest('.window');
                if (window && window.classList.contains('active')) {
                    // Use WindowManager's recalculate function if available
                    if (window.WindowManager && typeof WindowManager.recalculateWindowLayout === 'function') {
                        WindowManager.recalculateWindowLayout(window);
                    } else if (window.PortfolioApp && typeof PortfolioApp.recalculateWindowLayout === 'function') {
                        PortfolioApp.recalculateWindowLayout(window);
                    } else {
                        // Fallback recalculation
                        this.forceLayoutRecalculation(window);
                    }
                }
            }, 500);
        }
    },
    
    // Fallback layout recalculation
    forceLayoutRecalculation(window) {
        const content = window.querySelector('.window-content');
        if (!content) return;
        
        // Force reflow
        const windowRect = window.getBoundingClientRect();
        const header = window.querySelector('.window-header');
        const headerHeight = header ? header.offsetHeight : 36;
        const availableHeight = windowRect.height - headerHeight;
        
        content.style.height = availableHeight + 'px';
        
        // Check if scrolling is needed
        if (content.scrollHeight > content.clientHeight) {
            content.style.overflowY = 'auto';
        } else {
            content.style.overflowY = 'hidden';
        }
        
        Utils.logger.debug('Layout recalculated for', window.dataset.app);
    },
    
    // Initialize dynamic features for specific content
    initializeContentFeatures(appName) {
        switch (appName) {
            case 'projects':
                this.initializeProjectsFeatures();
                break;
            case 'contact':
                this.initializeContactFeatures();
                break;
            case 'resume':
                this.initializeResumeFeatures();
                break;
            case 'about':
                this.initializeAboutFeatures();
                break;

            case 'settings':
                this.initializeSettingsFeatures();
                break;
        }
    },

    // Initialize settings-specific features
    initializeSettingsFeatures() {
        // Let the SettingsManager handle the wallpaper loading
        if (window.settingsManager) {
            setTimeout(() => {
                window.settingsManager.loadWallpapers();
            }, 100);
        }
    },
    
    // Initialize projects-specific features
    initializeProjectsFeatures() {
        // Project filtering
        const filterBtns = Utils.dom.queryAll('.filter-btn');
        const projectItems = Utils.dom.queryAll('.project-item');
        
        filterBtns.forEach(btn => {
            Utils.dom.on(btn, 'click', (e) => {
                const filter = btn.dataset.filter;
                
                // Update active filter
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter projects
                projectItems.forEach(item => {
                    const category = item.dataset.category;
                    const shouldShow = filter === 'all' || category.includes(filter);
                    
                    if (shouldShow) {
                        item.style.display = 'block';
                        Utils.animation.fadeIn(item, 300);
                    } else {
                        const fadePromise = Utils.animation.fadeOut(item, 300);
                        if (fadePromise && typeof fadePromise.then === 'function') {
                            fadePromise.then(() => {
                                item.style.display = 'none';
                            });
                        } else {
                            // Fallback if fadeOut doesn't return a promise
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    }
                });
                
                // Don't prevent event bubbling - let window focus work
            });
        });
        
        // Project item animations
        projectItems.forEach((item, index) => {
            // Stagger animation
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('animate-slide-in-up');
            
            // Hover effects
            Utils.dom.on(item, 'mouseenter', () => {
                Utils.animation.animate(item, [
                    { transform: 'translateY(0) scale(1)' },
                    { transform: 'translateY(-8px) scale(1.02)' }
                ], { duration: 300, fill: 'forwards' });
            });
            
            Utils.dom.on(item, 'mouseleave', () => {
                Utils.animation.animate(item, [
                    { transform: 'translateY(-8px) scale(1.02)' },
                    { transform: 'translateY(0) scale(1)' }
                ], { duration: 300, fill: 'forwards' });
            });
        });
        
        // Ensure window focus works when clicking on projects content
        const projectsContent = Utils.dom.get('projects-content');
        if (projectsContent) {
            Utils.dom.on(projectsContent, 'click', (e) => {
                // Get the projects window and bring it to front
                const projectsWindow = Utils.dom.get('projects-window');
                if (projectsWindow && window.PortfolioApp) {
                    window.PortfolioApp.bringWindowToFront('projects');
                }
            });
        }
    },
    
    // Initialize contact-specific features
    initializeContactFeatures() {
        // Initialize email protection
        const emailLinks = document.querySelectorAll('.email-link');
        emailLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const user = this.getAttribute('data-user');
                const domain = this.getAttribute('data-domain');
                const email = user + '@' + domain;
                
                if (this.textContent === 'Click to reveal email') {
                    this.textContent = email;
                    this.href = 'mailto:' + email;
                } else {
                    window.location.href = 'mailto:' + email;
                }
            });
        });
        
        // Animate LinkedIn card on hover
        const linkedinCard = document.querySelector('.linkedin-card');
        if (linkedinCard) {
            linkedinCard.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 8px 25px rgba(0, 119, 181, 0.15)';
            });
            
            linkedinCard.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        }
        
        // Animate expertise items
        const expertiseItems = document.querySelectorAll('.expertise-item');
        expertiseItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('animate-fade-in');
        });
    },
    
    // Initialize resume-specific features
    initializeResumeFeatures() {
        // Animate sections on scroll (if needed)
        const sections = Utils.dom.queryAll('.resume-section');
        
        sections.forEach((section, index) => {
            section.style.animationDelay = `${index * 0.2}s`;
            section.classList.add('animate-slide-in-left');
        });
        
        // Skill tag interactions
        const skillTags = Utils.dom.queryAll('.skill-tag');
        skillTags.forEach(tag => {
            Utils.dom.on(tag, 'click', () => {
                // Bounce animation on click
                Utils.animation.bounce(tag, 600);
            });
        });
    },
    
    // Initialize about-specific features
    initializeAboutFeatures() {
        const skillItems = Utils.dom.queryAll('.skill-item');
        
        // Stagger animation for skill items
        skillItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('animate-fade-in');
        });
        
        // Interactive skill items
        skillItems.forEach(item => {
            Utils.dom.on(item, 'click', () => {
                item.classList.add('animate-pulse');
                setTimeout(() => {
                    item.classList.remove('animate-pulse');
                }, 1000);
            });
        });
        
        // Social links
        const socialLinks = Utils.dom.queryAll('.social-link');
        socialLinks.forEach(link => {
            Utils.dom.on(link, 'mouseenter', () => {
                Utils.animation.animate(link, [
                    { transform: 'scale(1) rotate(0deg)' },
                    { transform: 'scale(1.1) rotate(5deg)' }
                ], { duration: 200, fill: 'forwards' });
            });
            
            Utils.dom.on(link, 'mouseleave', () => {
                Utils.animation.animate(link, [
                    { transform: 'scale(1.1) rotate(5deg)' },
                    { transform: 'scale(1) rotate(0deg)' }
                ], { duration: 200, fill: 'forwards' });
            });
        });
    },
    

    
    // Retry loading content
    async retryLoad(appName) {
        // Clear cache for this app
        this.cache.delete(appName);
        
        try {
            await this.loadContent(appName);
        } catch (error) {
            Utils.logger.error(`Retry failed for ${appName}:`, error);
        }
    },
    
    // Preload all content
    async preloadAll() {
        const apps = ['about', 'projects', 'resume', 'contact'];
        const promises = apps.map(app => this.loadContent(app).catch(error => {
            Utils.logger.warn(`Failed to preload ${app}:`, error);
        }));
        
        await Promise.all(promises);
        Utils.logger.info('Content preloading completed');
    },
    
    // Clear cache
    clearCache() {
        this.cache.clear();
        Utils.logger.info('Content cache cleared');
    },
    
    // Get cache info
    getCacheInfo() {
        return {
            size: this.cache.size,
            items: Array.from(this.cache.keys())
        };
    }
};

// Global access
window.ContentLoader = ContentLoader; 