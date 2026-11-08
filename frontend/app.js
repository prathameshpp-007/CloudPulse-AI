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

    document.getElementById(`${page}-page`).classList.add("active-page");

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

    document.getElementById("page-title").textContent = pageInfo[page][0];
    document.getElementById("page-subtitle").textContent = pageInfo[page][1];
}

async function loadDashboard() {
    try {
        const healthResponse = await fetch(`${API_URL}/health`);
        const health = await healthResponse.json();

        document.getElementById("system-status").textContent =
            health.status === "healthy" ? "Healthy" : "Issue";

        document.getElementById("api-status").textContent = "Online";
        document.getElementById("service-api").textContent = "Online";

        const metricsResponse = await fetch(`${API_URL}/metrics`);
        const metricsData = await metricsResponse.json();

        currentMetrics = metricsData.metrics || [];

        document.getElementById("metric-count").textContent =
            metricsData.count || 0;

        displayMetrics(currentMetrics, "metrics-list", 8);
        displayMetrics(currentMetrics, "all-metrics-list");

        const analysisResponse = await fetch(`${API_URL}/analyze`);
        const analysisData = await analysisResponse.json();

        currentAlerts = analysisData.alerts || [];

        document.getElementById("alert-count").textContent =
            analysisData.alerts_found || 0;

        displayAlerts(currentAlerts, "alerts-list");
        displayAlerts(currentAlerts, "all-alerts-list");

    } catch (error) {
        console.error("CloudPulse API Error:", error);

        document.getElementById("system-status").textContent = "Offline";
        document.getElementById("api-status").textContent = "Disconnected";
        document.getElementById("service-api").textContent = "Offline";
    }
}

function displayMetrics(metrics, containerId, limit = null) {
    const container = document.getElementById(containerId);

    if (!container) return;

    const visibleMetrics = limit ? metrics.slice(0, limit) : metrics;

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
            <div class="metric-value">${metric.metric_value}</div>
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

loadDashboard();const API_URL = "http://localhost:8081";

async function loadDashboard() {
    try {
        const healthResponse = await fetch(`${API_URL}/health`);
        const health = await healthResponse.json();

        document.getElementById("system-status").textContent =
            health.status === "healthy" ? "Healthy" : "Issue";

        document.getElementById("api-status").textContent = "Online";

        const metricsResponse = await fetch(`${API_URL}/metrics`);
        const metricsData = await metricsResponse.json();

        document.getElementById("metric-count").textContent =
            metricsData.count || 0;

        displayMetrics(metricsData.metrics || []);

        const analysisResponse = await fetch(`${API_URL}/analyze`);
        const analysisData = await analysisResponse.json();

        document.getElementById("alert-count").textContent =
            analysisData.alerts_found || 0;

        displayAlerts(analysisData.alerts || []);

    } catch (error) {
        console.error(error);

        document.getElementById("system-status").textContent = "Offline";
        document.getElementById("api-status").textContent = "Disconnected";
    }
}

function displayMetrics(metrics) {
    const container = document.getElementById("metrics-list");

    if (metrics.length === 0) {
        container.innerHTML = "<p>No metrics collected yet.</p>";
        return;
    }

    container.innerHTML = metrics.slice(0, 8).map(metric => `
        <div class="metric-item">
            <div class="metric-name">
                ${metric.service_name} · ${metric.metric_name}
            </div>
            <div class="metric-value">
                ${metric.metric_value}
            </div>
        </div>
    `).join("");
}

function displayAlerts(alerts) {
    const container = document.getElementById("alerts-list");

    if (alerts.length === 0) {
        container.innerHTML = `
            <div class="alert-item">
                <strong>✓ No active issues</strong>
                <p>Cloud infrastructure is operating normally.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = alerts.map(alert => `
        <div class="alert-item">
            <strong class="alert-${alert.severity}">
                ${alert.severity.toUpperCase()}
            </strong>
            <p>${alert.recommendation}</p>
        </div>
    `).join("");
}

loadDashboard();
