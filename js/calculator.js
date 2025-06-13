class HealthcareMarketingCalculator {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        console.log('Healthcare Marketing Calculator initialized');
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.calc-nav-btn');
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const calcType = e.target.dataset.calc;
                this.switchCalculator(calcType);
            });
        });
    }

    setupEventListeners() {
        // Add enter key support for all inputs
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const section = input.closest('.calculator-section');
                    const calcButton = section.querySelector('.calc-btn');
                    if (calcButton) calcButton.click();
                }
            });
        });
    }

    switchCalculator(calcType) {
        // Update navigation
        document.querySelectorAll('.calc-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-calc="${calcType}"]`).classList.add('active');

        // Update sections
        document.querySelectorAll('.calculator-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${calcType}-calculator`).classList.add('active');
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatPercentage(decimal) {
        return (decimal * 100).toFixed(1) + '%';
    }

    // Industry benchmarks data
    getBenchmarks() {
        return {
            pac: {
                'general': 180,
                'dental': 250,
                'cardiology': 400,
                'orthopedic': 350,
                'dermatology': 300,
                'behavioral': 220,
                'urgent-care': 120,
                'cosmetic': 500
            },
            conversionRates: {
                'visitor-to-lead': 0.03,
                'lead-to-appointment': 0.25,
                'appointment-to-patient': 0.80
            }
        };
    }

    getOptimizationTips(type, performance) {
        const tips = {
            pac: {
                excellent: [
                    "Your PAC is excellent! Focus on scaling successful campaigns.",
                    "Consider expanding to similar target demographics.",
                    "Invest in retention strategies to maximize LTV."
                ],
                good: [
                    "Good performance. Test higher-value keywords for better ROI.",
                    "Optimize landing pages to improve conversion rates.",
                    "Consider adding video testimonials to build trust."
                ],
                poor: [
                    "High PAC suggests optimization needed. Review keyword targeting.",
                    "Test different ad copy and landing page combinations.",
                    "Focus on local SEO to reduce paid acquisition costs.",
                    "Consider remarketing campaigns for better conversion rates."
                ]
            },
            conversion: {
                'visitor-to-lead': [
                    "Improve website user experience and page load speed",
                    "Add clear calls-to-action above the fold",
                    "Implement live chat or scheduling widgets",
                    "Create targeted landing pages for campaigns"
                ],
                'lead-to-appointment': [
                    "Reduce response time to leads (under 5 minutes ideal)",
                    "Implement automated nurture sequences",
                    "Train staff on effective lead qualification",
                    "Offer online scheduling options"
                ],
                'appointment-to-patient': [
                    "Improve appointment confirmation processes",
                    "Send reminder communications",
                    "Reduce wait times and improve office experience",
                    "Follow up on no-shows with rescheduling offers"
                ]
            }
        };
        return tips[type] || [];
    }
}

// ROI Calculator
function calculateROI() {
    const revenue = parseFloat(document.getElementById('roi-revenue').value) || 0;
    const investment = parseFloat(document.getElementById('roi-investment').value) || 0;

    if (revenue <= 0 || investment <= 0) {
        alert('Please enter valid revenue and investment amounts');
        return;
    }

    const netProfit = revenue - investment;
    const roiPercentage = (netProfit / investment) * 100;
    const returnMultiple = revenue / investment;

    // Update results
    document.getElementById('roi-percentage').textContent = roiPercentage.toFixed(1) + '%';
    document.getElementById('roi-profit').textContent = calculator.formatCurrency(netProfit);
    document.getElementById('roi-multiple').textContent = returnMultiple.toFixed(1) + 'x';

    // Benchmark comparison
    let benchmarkText = '';
    if (roiPercentage >= 500) {
        benchmarkText = 'Excellent - Above industry average';
    } else if (roiPercentage >= 300) {
        benchmarkText = 'Good - Within industry range';
    } else if (roiPercentage >= 0) {
        benchmarkText = 'Below average - Optimization needed';
    } else {
        benchmarkText = 'Negative ROI - Immediate attention required';
    }
    document.getElementById('roi-benchmark').textContent = benchmarkText;

    document.getElementById('roi-results').style.display = 'block';
}

// Patient Acquisition Cost Calculator
function calculatePAC() {
    const spend = parseFloat(document.getElementById('pac-spend').value) || 0;
    const patients = parseFloat(document.getElementById('pac-patients').value) || 0;
    const specialty = document.getElementById('pac-specialty').value;

    if (spend <= 0 || patients <= 0) {
        alert('Please enter valid spend and patient numbers');
        return;
    }

    const pacCost = spend / patients;
    const benchmarks = calculator.getBenchmarks();
    const industryAverage = benchmarks.pac[specialty];

    // Update results
    document.getElementById('pac-cost').textContent = calculator.formatCurrency(pacCost);
    document.getElementById('pac-benchmark').textContent = calculator.formatCurrency(industryAverage);

    // Performance assessment
    let performance = '';
    let performanceType = '';
    if (pacCost <= industryAverage * 0.8) {
        performance = 'Excellent - 20% below industry average';
        performanceType = 'excellent';
    } else if (pacCost <= industryAverage) {
        performance = 'Good - At or below industry average';
        performanceType = 'good';
    } else {
        performance = 'Needs Improvement - Above industry average';
        performanceType = 'poor';
    }
    document.getElementById('pac-performance').textContent = performance;

    // Optimization tips
    const tips = calculator.getOptimizationTips('pac', performanceType);
    const tipsHtml = tips.map(tip => `<p>• ${tip}</p>`).join('');
    document.getElementById('pac-tips').innerHTML = tipsHtml;

    document.getElementById('pac-results').style.display = 'block';
}

// Lifetime Value Calculator
function calculateLTV() {
    const visitValue = parseFloat(document.getElementById('ltv-visit-value').value) || 0;
    const visitsPerYear = parseFloat(document.getElementById('ltv-visits-year').value) || 0;
    const retention = parseFloat(document.getElementById('ltv-retention').value) || 0;
    const referrals = parseFloat(document.getElementById('ltv-referrals').value) || 0;

    if (visitValue <= 0 || visitsPerYear <= 0 || retention <= 0) {
        alert('Please enter valid values for all required fields');
        return;
    }

    const annualValue = visitValue * visitsPerYear;
    const patientLTV = annualValue * retention;
    const referralValue = referrals * patientLTV * 0.5; // Assume referrals have 50% of original LTV
    const totalLTV = patientLTV + referralValue;

    // Update results
    document.getElementById('ltv-total').textContent = calculator.formatCurrency(patientLTV);
    document.getElementById('ltv-annual').textContent = calculator.formatCurrency(annualValue);
    document.getElementById('ltv-referral-value').textContent = calculator.formatCurrency(referralValue);
    document.getElementById('ltv-with-referrals').textContent = calculator.formatCurrency(totalLTV);

    // Insights
    let insights = [];
    if (annualValue > 2000) {
        insights.push("High-value patients - Focus on retention strategies");
    }
    if (retention > 5) {
        insights.push("Excellent patient retention - Great foundation for growth");
    }
    if (referrals > 2) {
        insights.push("Strong referral generation - Consider referral incentive programs");
    }
    if (totalLTV > 10000) {
        insights.push("High LTV justifies premium acquisition strategies");
    }
    
    const insightsHtml = insights.map(insight => `<p>• ${insight}</p>`).join('');
    document.getElementById('ltv-insights').innerHTML = insightsHtml || '<p>• Continue tracking these metrics to optimize patient value</p>';

    document.getElementById('ltv-results').style.display = 'block';
}

// Conversion Rate Calculator
function calculateConversion() {
    const visitors = parseFloat(document.getElementById('conv-visitors').value) || 0;
    const leads = parseFloat(document.getElementById('conv-leads').value) || 0;
    const appointments = parseFloat(document.getElementById('conv-appointments').value) || 0;
    const patients = parseFloat(document.getElementById('conv-patients').value) || 0;

    if (visitors <= 0) {
        alert('Please enter valid visitor numbers');
        return;
    }

    // Calculate conversion rates
    const leadRate = leads / visitors;
    const appointmentRate = appointments / leads || 0;
    const patientRate = patients / appointments || 0;

    // Update funnel display
    document.getElementById('funnel-visitors').textContent = visitors.toLocaleString();
    document.getElementById('funnel-leads').textContent = leads.toLocaleString();
    document.getElementById('funnel-lead-rate').textContent = calculator.formatPercentage(leadRate);
    document.getElementById('funnel-appointments').textContent = appointments.toLocaleString();
    document.getElementById('funnel-appointment-rate').textContent = calculator.formatPercentage(appointmentRate);
    document.getElementById('funnel-patients').textContent = patients.toLocaleString();
    document.getElementById('funnel-patient-rate').textContent = calculator.formatPercentage(patientRate);

    // Generate optimization tips
    const benchmarks = calculator.getBenchmarks().conversionRates;
    let tips = [];

    if (leadRate < benchmarks['visitor-to-lead']) {
        tips.push(...calculator.getOptimizationTips('conversion', 'visitor-to-lead'));
    }
    if (appointmentRate < benchmarks['lead-to-appointment']) {
        tips.push(...calculator.getOptimizationTips('conversion', 'lead-to-appointment'));
    }
    if (patientRate < benchmarks['appointment-to-patient']) {
        tips.push(...calculator.getOptimizationTips('conversion', 'appointment-to-patient'));
    }

    if (tips.length === 0) {
        tips.push("Excellent conversion rates across the funnel! Focus on scaling traffic.");
    }

    const tipsHtml = tips.map(tip => `<p>• ${tip}</p>`).join('');
    document.getElementById('conversion-tips').innerHTML = tipsHtml;

    document.getElementById('conversion-results').style.display = 'block';
}

// Budget Planner Calculator
function calculateBudget() {
    const totalBudget = parseFloat(document.getElementById('budget-total').value) || 0;
    const practiceType = document.getElementById('budget-practice-type').value;
    const goals = document.getElementById('budget-goals').value;

    if (totalBudget <= 0) {
        alert('Please enter a valid budget amount');
        return;
    }

    // Budget allocation percentages based on practice type and goals
    const allocations = {
        small: {
            awareness: { digital: 35, seo: 25, tech: 15, traditional: 15, analytics: 10 },
            acquisition: { digital: 45, seo: 20, tech: 15, traditional: 10, analytics: 10 },
            retention: { digital: 25, seo: 30, tech: 20, traditional: 15, analytics: 10 },
            reputation: { digital: 30, seo: 35, tech: 15, traditional: 10, analytics: 10 },
            mixed: { digital: 35, seo: 25, tech: 15, traditional: 15, analytics: 10 }
        },
        medium: {
            awareness: { digital: 40, seo: 25, tech: 15, traditional: 10, analytics: 10 },
            acquisition: { digital: 50, seo: 20, tech: 15, traditional: 5, analytics: 10 },
            retention: { digital: 30, seo: 30, tech: 20, traditional: 10, analytics: 10 },
            reputation: { digital: 35, seo: 35, tech: 15, traditional: 5, analytics: 10 },
            mixed: { digital: 40, seo: 25, tech: 15, traditional: 10, analytics: 10 }
        },
        large: {
            awareness: { digital: 45, seo: 25, tech: 15, traditional: 5, analytics: 10 },
            acquisition: { digital: 55, seo: 20, tech: 15, traditional: 0, analytics: 10 },
            retention: { digital: 35, seo: 30, tech: 20, traditional: 5, analytics: 10 },
            reputation: { digital: 40, seo: 35, tech: 15, traditional: 0, analytics: 10 },
            mixed: { digital: 45, seo: 25, tech: 15, traditional: 5, analytics: 10 }
        },
        hospital: {
            awareness: { digital: 40, seo: 30, tech: 15, traditional: 5, analytics: 10 },
            acquisition: { digital: 50, seo: 25, tech: 15, traditional: 0, analytics: 10 },
            retention: { digital: 30, seo: 35, tech: 20, traditional: 5, analytics: 10 },
            reputation: { digital: 35, seo: 40, tech: 15, traditional: 0, analytics: 10 },
            mixed: { digital: 40, seo: 30, tech: 15, traditional: 5, analytics: 10 }
        }
    };

    const allocation = allocations[practiceType][goals];

    // Calculate amounts
    const digitalAmount = totalBudget * (allocation.digital / 100);
    const seoAmount = totalBudget * (allocation.seo / 100);
    const techAmount = totalBudget * (allocation.tech / 100);
    const traditionalAmount = totalBudget * (allocation.traditional / 100);
    const analyticsAmount = totalBudget * (allocation.analytics / 100);

    // Update display
    document.getElementById('budget-digital-pct').textContent = allocation.digital + '%';
    document.getElementById('budget-digital-amt').textContent = calculator.formatCurrency(digitalAmount);
    document.getElementById('budget-seo-pct').textContent = allocation.seo + '%';
    document.getElementById('budget-seo-amt').textContent = calculator.formatCurrency(seoAmount);
    document.getElementById('budget-tech-pct').textContent = allocation.tech + '%';
    document.getElementById('budget-tech-amt').textContent = calculator.formatCurrency(techAmount);
    document.getElementById('budget-traditional-pct').textContent = allocation.traditional + '%';
    document.getElementById('budget-traditional-amt').textContent = calculator.formatCurrency(traditionalAmount);
    document.getElementById('budget-analytics-pct').textContent = allocation.analytics + '%';
    document.getElementById('budget-analytics-amt').textContent = calculator.formatCurrency(analyticsAmount);

    // Generate recommendations
    const recommendations = getBudgetRecommendations(practiceType, goals, totalBudget);
    const recommendationsHtml = recommendations.map(rec => `<p>• ${rec}</p>`).join('');
    document.getElementById('budget-tips').innerHTML = recommendationsHtml;

    document.getElementById('budget-results').style.display = 'block';
}

function getBudgetRecommendations(practiceType, goals, budget) {
    const recommendations = [];

    // Budget size recommendations
    if (budget < 5000) {
        recommendations.push("Focus on organic strategies like SEO and content marketing for maximum impact");
        recommendations.push("Consider local SEO and Google My Business optimization as priority");
    } else if (budget < 15000) {
        recommendations.push("Balanced approach - mix paid advertising with organic growth strategies");
        recommendations.push("Invest in conversion tracking and analytics tools");
    } else {
        recommendations.push("Scale successful campaigns and test new channels");
        recommendations.push("Consider advanced attribution modeling and marketing automation");
    }

    // Practice type specific
    if (practiceType === 'small') {
        recommendations.push("Focus on local market dominance and word-of-mouth referrals");
    } else if (practiceType === 'hospital') {
        recommendations.push("Emphasize thought leadership content and reputation management");
    }

    // Goal specific
    if (goals === 'acquisition') {
        recommendations.push("Prioritize high-intent keywords and conversion optimization");
    } else if (goals === 'retention') {
        recommendations.push("Invest in patient communication tools and loyalty programs");
    }

    return recommendations;
}

// Initialize calculator when content is ready
let calculator;

// Multiple initialization strategies for dynamic content loading
document.addEventListener('DOMContentLoaded', initCalculator);
window.addEventListener('load', initCalculator);

// Custom event for dynamic content loading
document.addEventListener('calculatorContentLoaded', initCalculator);

// Mutation observer for dynamic content
const calcObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            const calculatorContent = document.getElementById('calculator-content');
            if (calculatorContent && calculatorContent.innerHTML.trim() && !calculator) {
                initCalculator();
            }
        }
    });
});

calcObserver.observe(document.body, {
    childList: true,
    subtree: true
});

// Fallback timer
let calcInitAttempts = 0;
const maxCalcAttempts = 10;

function attemptCalcInit() {
    const calculatorContent = document.getElementById('calculator-content');
    console.log(`Calculator init attempt ${calcInitAttempts + 1}:`, {
        calculatorContent: !!calculatorContent,
        hasContent: calculatorContent ? calculatorContent.innerHTML.trim().length > 0 : false,
        calculator: !!calculator
    });
    
    if (calculatorContent && calculatorContent.innerHTML.trim() && !calculator) {
        initCalculator();
    } else if (calcInitAttempts < maxCalcAttempts) {
        calcInitAttempts++;
        setTimeout(attemptCalcInit, 500);
    }
}

setTimeout(attemptCalcInit, 500);

function initCalculator() {
    const calculatorContent = document.getElementById('calculator-content');
    console.log('Attempting to initialize calculator:', {
        calculatorContent: !!calculatorContent,
        hasContent: calculatorContent ? calculatorContent.innerHTML.trim().length > 0 : false,
        alreadyInitialized: !!calculator
    });
    
    if (calculatorContent && calculatorContent.innerHTML.trim() && !calculator) {
        console.log('Initializing Healthcare Marketing Calculator');
        calculator = new HealthcareMarketingCalculator();
    }
}

// Export for external use
if (typeof window !== 'undefined') {
    window.HealthcareMarketingCalculator = HealthcareMarketingCalculator;
} 