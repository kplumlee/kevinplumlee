// Performance Monitor for Real-time CLS and LCP Tracking
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            cls: 0,
            lcp: 0,
            fid: 0,
            fcp: 0,
            layoutShifts: [],
            networkPayload: 0,
            imageLoads: [],
            startTime: performance.now()
        };
        
        this.init();
    }

    init() {
        this.observeLayoutShifts();
        this.observeLCP();
        this.observeFCP();
        this.observeFID();
        this.trackNetworkPayload();
        this.trackImageLoading();
        
        // Log performance after page load
        if (document.readyState === 'complete') {
            setTimeout(() => this.generateReport(), 1000);
        } else {
            window.addEventListener('load', () => {
                setTimeout(() => this.generateReport(), 1000);
            });
        }
    }

    observeLayoutShifts() {
        if ('LayoutShift' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        this.metrics.cls += entry.value;
                        this.metrics.layoutShifts.push({
                            value: entry.value,
                            elements: entry.sources?.map(source => ({
                                element: source.node,
                                elementName: source.node?.tagName || 'unknown'
                            })) || [],
                            timestamp: entry.startTime
                        });
                    }
                }
            });
            observer.observe({entryTypes: ['layout-shift']});
        }
    }

    observeLCP() {
        if ('LargestContentfulPaint' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
            });
            observer.observe({entryTypes: ['largest-contentful-paint']});
        }
    }

    observeFCP() {
        if ('PerformancePaintTiming' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.fcp = entry.startTime;
                    }
                }
            });
            observer.observe({entryTypes: ['paint']});
        }
    }

    observeFID() {
        if ('FirstInputDelay' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                }
            });
            observer.observe({entryTypes: ['first-input']});
        }
    }

    trackNetworkPayload() {
        if ('PerformanceResourceTiming' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.metrics.networkPayload += entry.transferSize || 0;
                }
            });
            observer.observe({entryTypes: ['resource']});
        }
    }

    trackImageLoading() {
        // Track lazy-loaded images
        const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        images.forEach(img => {
            const startTime = performance.now();
            
            const onLoad = () => {
                const loadTime = performance.now() - startTime;
                this.metrics.imageLoads.push({
                    src: img.src || img.dataset.src,
                    loadTime: loadTime,
                    isLazy: img.hasAttribute('data-src') || img.loading === 'lazy'
                });
                img.removeEventListener('load', onLoad);
            };
            
            img.addEventListener('load', onLoad);
        });
    }

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            metrics: {
                cls: this.metrics.cls.toFixed(4),
                lcp: Math.round(this.metrics.lcp),
                fcp: Math.round(this.metrics.fcp),
                fid: Math.round(this.metrics.fid),
                totalNetworkPayload: Math.round(this.metrics.networkPayload / 1024), // KB
                imageCount: this.metrics.imageLoads.length,
                layoutShiftCount: this.metrics.layoutShifts.length
            },
            analysis: this.analyzePerformance(),
            recommendations: this.getRecommendations()
        };

        console.group('🚀 Performance Report');
        console.log('Core Web Vitals:', {
            'CLS (Cumulative Layout Shift)': report.metrics.cls + (parseFloat(report.metrics.cls) <= 0.1 ? ' ✅ Good' : parseFloat(report.metrics.cls) <= 0.25 ? ' ⚠️ Needs Improvement' : ' ❌ Poor'),
            'LCP (Largest Contentful Paint)': report.metrics.lcp + 'ms' + (report.metrics.lcp <= 2500 ? ' ✅ Good' : report.metrics.lcp <= 4000 ? ' ⚠️ Needs Improvement' : ' ❌ Poor'),
            'FCP (First Contentful Paint)': report.metrics.fcp + 'ms' + (report.metrics.fcp <= 1800 ? ' ✅ Good' : report.metrics.fcp <= 3000 ? ' ⚠️ Needs Improvement' : ' ❌ Poor'),
            'FID (First Input Delay)': report.metrics.fid + 'ms' + (report.metrics.fid <= 100 ? ' ✅ Good' : report.metrics.fid <= 300 ? ' ⚠️ Needs Improvement' : ' ❌ Poor')
        });
        
        console.log('Network Performance:', {
            'Total Payload': report.metrics.totalNetworkPayload + ' KB',
            'Images Loaded': report.metrics.imageCount,
            'Layout Shifts': report.metrics.layoutShiftCount
        });

        if (this.metrics.layoutShifts.length > 0) {
            console.log('Layout Shift Details:', this.metrics.layoutShifts);
        }

        console.log('Analysis:', report.analysis);
        
        if (report.recommendations.length > 0) {
            console.log('Recommendations:', report.recommendations);
        }
        
        console.groupEnd();

        // Store report for debugging
        localStorage.setItem('performanceReport', JSON.stringify(report));

        return report;
    }

    analyzePerformance() {
        const analysis = [];
        
        if (this.metrics.cls > 0.25) {
            analysis.push('High layout shift detected - check image dimensions and loading patterns');
        } else if (this.metrics.cls > 0.1) {
            analysis.push('Moderate layout shift - consider optimizing image loading');
        } else {
            analysis.push('Layout shifts are well controlled');
        }

        if (this.metrics.lcp > 4000) {
            analysis.push('LCP is slow - optimize largest contentful element');
        } else if (this.metrics.lcp > 2500) {
            analysis.push('LCP needs improvement - consider preloading critical resources');
        } else {
            analysis.push('LCP performance is good');
        }

        if (this.metrics.networkPayload > 3000000) { // 3MB
            analysis.push('Large network payload - implement lazy loading and image optimization');
        } else if (this.metrics.networkPayload > 1500000) { // 1.5MB
            analysis.push('Moderate network payload - consider further optimization');
        } else {
            analysis.push('Network payload is optimized');
        }

        return analysis;
    }

    getRecommendations() {
        const recommendations = [];

        if (this.metrics.cls > 0.1) {
            recommendations.push('Add explicit width/height to images to prevent layout shifts');
            recommendations.push('Use CSS aspect-ratio or min-height for dynamic content areas');
        }

        if (this.metrics.lcp > 2500) {
            recommendations.push('Preload LCP image with high fetchpriority');
            recommendations.push('Optimize server response time');
            recommendations.push('Consider using a CDN for static assets');
        }

        if (this.metrics.networkPayload > 1500000) {
            recommendations.push('Implement progressive image loading');
            recommendations.push('Use WebP format for better compression');
            recommendations.push('Lazy load non-critical images');
        }

        return recommendations;
    }

    // Real-time monitoring
    startRealTimeMonitoring() {
        setInterval(() => {
            console.log(`CLS: ${this.metrics.cls.toFixed(4)}, LCP: ${Math.round(this.metrics.lcp)}ms, Payload: ${Math.round(this.metrics.networkPayload/1024)}KB`);
        }, 5000);
    }
}

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', () => {
    window.performanceMonitor = new PerformanceMonitor();
    
    // Expose useful methods globally
    window.getPerformanceReport = () => window.performanceMonitor.generateReport();
    window.startRealTimeMonitoring = () => window.performanceMonitor.startRealTimeMonitoring();
}); 