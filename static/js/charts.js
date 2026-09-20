/**
 * SecurePass — Chart.js Analytics & Visualizations Engine
 * Renders interactive Doughnut and Bar charts for security metrics.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js library not detected on current view.');
        return;
    }

    // Chart.js Theme Defaults for Cyber Theme
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";

    // Read metrics from window object if set, or fallback to DOM data attributes
    const metricsContainer = document.getElementById('analytics-data');
    
    let strongCount = 0;
    let mediumCount = 0;
    let weakCount = 0;
    let scoreDist = [0, 0, 0, 0, 0, 0];

    if (window.analyticsData) {
        strongCount = window.analyticsData.strong || 0;
        mediumCount = window.analyticsData.medium || 0;
        weakCount = window.analyticsData.weak || 0;
        scoreDist = window.analyticsData.scoreDist || [0, 0, 0, 0, 0, 0];
    } else if (metricsContainer) {
        strongCount = parseInt(metricsContainer.dataset.strong || '0', 10);
        mediumCount = parseInt(metricsContainer.dataset.medium || '0', 10);
        weakCount = parseInt(metricsContainer.dataset.weak || '0', 10);
        try {
            scoreDist = JSON.parse(metricsContainer.dataset.scoreDist || '[0,0,0,0,0,0]');
        } catch (e) {
            scoreDist = [0, 0, 0, 0, 0, 0];
        }
    }

    // 1. Doughnut Chart: Overall Strength Distribution
    const ctxDoughnut = document.getElementById('strengthDoughnutChart');
    if (ctxDoughnut) {
        const total = strongCount + mediumCount + weakCount;
        // If all 0, provide placeholder preview data so chart renders aesthetically
        const displayData = total > 0 ? [strongCount, mediumCount, weakCount] : [1, 1, 1];
        const displayColors = total > 0 
            ? ['#10b981', '#f59e0b', '#f43f5e'] 
            : ['rgba(16, 185, 129, 0.3)', 'rgba(245, 158, 11, 0.3)', 'rgba(244, 63, 94, 0.3)'];

        new Chart(ctxDoughnut, {
            type: 'doughnut',
            data: {
                labels: ['Strong (Score 5)', 'Medium (Score 3-4)', 'Weak (Score 0-2)'],
                datasets: [{
                    data: displayData,
                    backgroundColor: displayColors,
                    borderColor: '#0f172a',
                    borderWidth: 3,
                    hoverOffset: 8,
                    hoverBorderColor: '#38bdf8'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#38bdf8',
                        bodyColor: '#f1f5f9',
                        borderColor: 'rgba(56, 189, 248, 0.3)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                if (total === 0) return ' No audits yet (Sample display)';
                                const val = context.parsed;
                                const pct = ((val / total) * 100).toFixed(1);
                                return ` ${context.label}: ${val} passwords (${pct}%)`;
                            }
                        }
                    }
                },
                cutout: '72%',
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000
                }
            }
        });
    }

    // 2. Bar Chart: Score Distribution (0 to 5)
    const ctxBar = document.getElementById('scoreBarChart');
    if (ctxBar) {
        new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['Score 0', 'Score 1', 'Score 2', 'Score 3', 'Score 4', 'Score 5'],
                datasets: [{
                    label: 'Audit Count',
                    data: scoreDist,
                    backgroundColor: [
                        '#f43f5e',
                        '#f43f5e',
                        '#fb7185',
                        '#fbbf24',
                        '#f59e0b',
                        '#10b981'
                    ],
                    borderColor: [
                        'rgba(244, 63, 94, 0.8)',
                        'rgba(244, 63, 94, 0.8)',
                        'rgba(251, 113, 133, 0.8)',
                        'rgba(251, 191, 36, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(16, 185, 129, 0.8)'
                    ],
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            tickColor: 'transparent'
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { family: "'JetBrains Mono', monospace", size: 12 }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            color: '#94a3b8',
                            font: { family: "'JetBrains Mono', monospace", size: 11 }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            tickColor: 'transparent'
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#c084fc',
                        bodyColor: '#f1f5f9',
                        borderColor: 'rgba(192, 132, 252, 0.3)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return ` Passwords logged: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000
                }
            }
        });
    }
});
