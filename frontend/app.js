const API_URL = "http://localhost:8081";

let currentMetrics = [];
let currentAlerts = [];

// Navigation
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();

        const page = link.dataset.page;
        showPage(page);

        document.querySelectorAll(".nav-link").forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});

function showPage(page) {
    document.querySelectorAll(".page").forEach(item => {
        item.classList.remove("active-page");
    });

    const selectedPage = document.getElementById(`${page}-page`);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }

    const pageInfo = {
        dashboard: [
            "System Overview",
            "Real-time infrastructure health and performance."
        ],
        metrics: [
            "Infrastructure Metrics",
            "Monitor performance data collected across your services."
        ],
        alerts: [
            "Alerts & AI Insights",
            "Detected issues and intelligent infrastructure recommendations."
        ],
        services: [
            "Service Status",
            "Health and availability of your CloudPulse infrastructure."
        ]
    };

    if (pageInfo[page]) {
        document.getElementById("page-title").textContent = pageInfo[page][0];
        document.getElementById("page-subtitle").textContent = pageInfo[page][1];
    }
}

async function loadDashboard() {
    try {
        // Check API health
        const healthResponse = await fetch(`${API_URL}/health`);

        if (!healthResponse.ok) {
            throw new Error("API health check failed");
        }

        const health = await healthResponse.json();

        document.getElementById("system-status").textContent =
            health.status === "healthy" ? "Healthy" : "Issue";

        document.getElementById("api-status").textContent = "Online";

        const serviceApi = document.getElementById("service-api");
        if (serviceApi) {
            serviceApi.textContent = "Online";
        }

        // Load metrics
        const metricsResponse = await fetch(`${API_URL}/metrics`);

        if (!metricsResponse.ok) {
            throw new Error("Could not load metrics");
        }

        const metricsData = await metricsResponse.json();

        currentMetrics = metricsData.metrics || [];

        document.getElementById("metric-count").textContent =
            metricsData.count || 0;

        displayMetrics(currentMetrics, "metrics-list", 8);
        displayMetrics(currentMetrics, "all-metrics-list");

        // Load AI analysis and alerts
        const analysisResponse = await fetch(`${API_URL}/analyze`);

        if (!analysisResponse.ok) {
            throw new Error("Could not load AI analysis");
        }

        const analysisData = await analysisResponse.json();

        currentAlerts = analysisData.alerts || [];

        document.getElementById("alert-count").textContent =
            analysisData.alerts_found || 0;

        displayAlerts(currentAlerts, "alerts-list");
        displayAlerts(currentAlerts, "all-alerts-list");

        console.log("CloudPulse dashboard loaded successfully");

    } catch (error) {
        console.error("CloudPulse API Error:", error);

        document.getElementById("system-status").textContent = "Offline";
        document.getElementById("api-status").textContent = "Disconnected";

        const serviceApi = document.getElementById("service-api");
        if (serviceApi) {
            serviceApi.textContent = "Offline";
        }
    }
}

function displayMetrics(metrics, containerId, limit = null) {
    const container = document.getElementById(containerId);

    if (!container) return;

    const visibleMetrics = limit
        ? metrics.slice(0, limit)
        : metrics;

    if (visibleMetrics.length === 0) {
        container.innerHTML = "<p>No metrics collected yet.</p>";
        return;
    }

    container.innerHTML = visibleMetrics.map(metric => `
        <div class="metric-item">
            <div class="metric-name">
                <strong>${metric.service_name}</strong>
                <span>${metric.metric_name}</span>
            </div>
            <div class="metric-value">
                ${metric.metric_value}
            </div>
        </div>
    `).join("");
}

function displayAlerts(alerts, containerId) {
    const container = document.getElementById(containerId);

    if (!container) return;

    if (alerts.length === 0) {
        container.innerHTML = `
            <div class="alert-item">
                <strong>✓ No active issues</strong>
                <p>Your cloud infrastructure is operating normally.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = alerts.map(alert => `
        <div class="alert-item">
            <strong class="alert-${alert.severity}">
                ${alert.severity.toUpperCase()} · ${alert.service}
            </strong>
            <p>${alert.recommendation}</p>
        </div>
    `).join("");
}

// Load CloudPulse data when the page opens
loadDashboard();