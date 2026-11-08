# ☁️ CloudPulse AI

A cloud-native monitoring and alerting application built to demonstrate modern **Cloud, DevOps, CI/CD, GitOps, and Kubernetes** practices.

CloudPulse AI collects application metrics, stores them in PostgreSQL, analyzes potential performance issues, and provides automated recommendations. The application is containerized with Docker and deployed to Kubernetes using Helm and Argo CD.

## 🚀 Project Highlights

- Built a RESTful monitoring API using **FastAPI**
- Integrated **PostgreSQL** for persistent metric storage
- Containerized the application with **Docker**
- Deployed to a local **Kubernetes cluster using Kind**
- Packaged Kubernetes resources using **Helm**
- Implemented automated **CI/CD with GitHub Actions**
- Published container images to **GitHub Container Registry (GHCR)**
- Implemented **GitOps deployment using Argo CD**
- Configured Kubernetes **readiness and liveness probes**
- Implemented **Horizontal Pod Autoscaling (HPA)**
- Successfully demonstrated autoscaling from **2 to 5 pods** during CPU load testing

---

## 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │      GitHub         │
                         │   Source Code Repo  │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   GitHub Actions    │
                         │       CI/CD         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │        GHCR         │
                         │   Docker Images     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       Argo CD       │
                         │       GitOps        │
                         └──────────┬──────────┘
                                    │
                                    ▼
        ┌────────────────────────────────────────────────┐
        │              Kubernetes (Kind)                 │
        │                                                │
        │   ┌────────────────────────────────────────┐   │
        │   │          CloudPulse AI Pods            │   │
        │   │                                        │   │
        │   │      FastAPI Application (2–5 Pods)    │   │
        │   └───────────────────┬────────────────────┘   │
        │                       │                        │
        │                       ▼                        │
        │              ┌────────────────┐                │
        │              │   PostgreSQL   │                │
        │              │    Database    │                │
        │              └────────────────┘                │
        │                                                │
        │       HPA monitors CPU and scales pods         │
        └────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Python | Application development |
| FastAPI | REST API framework |
| PostgreSQL | Persistent metric storage |
| Docker | Application containerization |
| Kubernetes | Container orchestration |
| Kind | Local Kubernetes cluster |
| Helm | Kubernetes package management |
| Argo CD | GitOps continuous deployment |
| GitHub Actions | CI/CD automation |
| GHCR | Container image registry |

---

## ✨ Application Features

### 📊 Metric Collection

CloudPulse AI stores application metrics including:

- CPU usage
- Memory usage
- Response time

### 🤖 Metric Analysis

The `/analyze` endpoint detects potential problems and generates recommendations.

Examples include:

| Metric | Threshold | Severity |
|---|---:|---|
| CPU Usage | ≥ 90% | Critical |
| Memory Usage | ≥ 80% | Warning |
| Response Time | ≥ 200 ms | Warning |

### ❤️ Health Monitoring

The application exposes a health endpoint:

```text
GET /health
```

Kubernetes uses health checks to determine whether the application is running and ready to receive traffic.

### 📈 Horizontal Pod Autoscaling

CloudPulse AI is configured with:

```text
Minimum replicas: 2
Maximum replicas: 5
Target CPU utilization: 50%
```

During load testing, the application successfully scaled from **2 pods to 5 pods**.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Application information |
| GET | `/health` | Application health check |
| POST | `/metrics` | Store a new metric |
| GET | `/metrics` | Retrieve stored metrics |
| GET | `/analyze` | Analyze metrics and generate alerts |
| GET | `/load-test` | Generate CPU load for HPA testing |

### Example: Store a Metric

```bash
curl -X POST http://localhost:8000/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "service_name": "cloudpulse-api",
    "metric_name": "cpu_usage",
    "metric_value": 95
  }'
```

### Example: Analyze Metrics

```bash
curl http://localhost:8000/analyze
```

---

## 🐳 Run Locally with Docker

### Clone the Repository

```bash
git clone https://github.com/prathameshpp-007/CloudPulse-AI.git
cd CloudPulse-AI
```

### Build and Start the Application

```bash
docker-compose up --build
```

### Verify the Application

```bash
curl http://localhost:8000/health
```

---

## ☸️ Kubernetes Deployment

Apply the Kubernetes resources:

```bash
kubectl apply -f kubernetes/
```

Check the deployment:

```bash
kubectl get pods
kubectl get services
```

Check resource usage:

```bash
kubectl top pods
```

---

## 📦 Helm

CloudPulse AI is packaged as a Helm chart.

The Helm configuration includes:

- Deployment
- Service
- Resource requests and limits
- Horizontal Pod Autoscaler
- Database configuration

Check the deployment:

```bash
kubectl get deployment cloudpulse-ai
```

---

## 🔄 CI/CD Pipeline

GitHub Actions automatically runs when code is pushed to the `main` branch.

### Pipeline Workflow

```text
Code Push
    │
    ▼
GitHub Actions
    │
    ▼
Build Multi-Platform Docker Image
    │
    ▼
Push Image to GHCR
    │
    ▼
Update Helm Image Tag
    │
    ▼
Commit Updated Helm Configuration
    │
    ▼
Argo CD Detects Git Change
    │
    ▼
Kubernetes Deployment Updated
```

The Docker image is built for:

- `linux/amd64`
- `linux/arm64`

The GitHub Actions workflow automatically updates the Helm image tag after a successful image build.

---

## 🔁 GitOps with Argo CD

Argo CD monitors the Helm configuration stored in the GitHub repository.

When GitHub Actions updates the image tag:

1. A new container image is built and pushed to GHCR.
2. The Helm image tag is updated automatically.
3. The change is committed to the repository.
4. Argo CD detects the Git change.
5. Argo CD synchronizes the Kubernetes cluster.

Check the application status:

```bash
argocd app get cloudpulse-ai
```

A healthy deployment should show:

```text
Sync Status: Synced
Health Status: Healthy
```

---

## 📈 HPA Load Testing

Monitor autoscaling:

```bash
kubectl get hpa cloudpulse-ai -w
```

Generate CPU load:

```bash
for round in {1..10}; do
  for i in {1..20}; do
    curl -s http://localhost:9090/load-test > /dev/null &
  done
  sleep 1
done

wait
```

Check the pods:

```bash
kubectl get pods
```

During testing, CloudPulse AI successfully scaled from **2 replicas to 5 replicas**.

---

## 📸 Screenshots

Add screenshots demonstrating the project in action.

Recommended screenshots:

1. **Argo CD Application Dashboard** — Synced and Healthy status
2. **Kubernetes Pods** — Running application replicas
3. **HPA Autoscaling** — CPU utilization and replica scaling
4. **API Health Check** — Successful `/health` response
5. **Metric Analysis** — Alerts returned from `/analyze`

Create a folder for screenshots:

```bash
mkdir -p docs/screenshots
```

Example Markdown:

```markdown
![Argo CD Status](docs/screenshots/argocd-status.png)

![Kubernetes Pods](docs/screenshots/kubernetes-pods.png)

![HPA Autoscaling](docs/screenshots/hpa-scaling.png)
```

---

## 🔐 Security

Sensitive configuration should never be committed directly to GitHub.

CloudPulse AI uses environment variables and Kubernetes Secrets for database configuration.

Example variables:

```text
DB_HOST
POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
DB_PORT
```

See `.env.example` for the expected configuration format.

---

## 📁 Project Structure

```text
CloudPulse-AI/
├── app/                    # FastAPI application
├── frontend/               # Web interface
├── kubernetes/             # Kubernetes manifests
├── helm/cloudpulse-ai/     # Helm chart
├── argocd/                 # Argo CD application configuration
├── .github/workflows/      # GitHub Actions pipeline
├── scripts/                # Deployment scripts
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🔮 Future Improvements

- Prometheus monitoring
- Grafana dashboards
- AI-powered anomaly detection
- AWS EKS deployment
- Automated application testing
- Alert notifications

---

## 👨‍💻 Author

**Prathamesh Patil**

Aspiring Cloud & DevOps Engineer | BCA Student

GitHub: https://github.com/prathameshpp-007# CloudPulse AI 🚀

CloudPulse AI is a cloud-native real-time monitoring and incident response platform.

## Tech Stack

- Google Cloud Platform (GCP)
- Docker
- Kubernetes (GKE)
- Terraform
- GitHub Actions
- PostgreSQL
- Cloud Monitoring & Logging

## Project Status

🚧 Currently under development.

# 🚀 CloudPulse AI

CloudPulse AI is a cloud-native monitoring and alerting application designed to collect, analyze, and monitor application metrics.

The project demonstrates modern **Cloud, DevOps, and Kubernetes** practices, including containerization, health monitoring, resource management, autoscaling, and CI automation.

## 🏗️ Architecture

```text
                ┌──────────────────┐
                │     GitHub       │
                │   Source Code    │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │ GitHub Actions   │
                │   CI Pipeline    │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │  Docker Image    │
                └────────┬─────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │     Kubernetes       │
              │                      │
              │  ┌────────────────┐  │
              │  │ CloudPulse API │  │
              │  │   FastAPI      │  │
              │  └───────┬────────┘  │
              │          │           │
              │          ▼           │
              │  ┌────────────────┐  │
              │  │   PostgreSQL   │  │
              │  └────────────────┘  │
              └──────────────────────┘
```

## ✨ Features

- REST API built with FastAPI
- PostgreSQL database integration
- Docker containerization
- Kubernetes deployment
- Readiness and liveness health probes
- CPU and memory resource requests and limits
- Kubernetes Metrics Server monitoring
- Horizontal Pod Autoscaling from 2 to 5 replicas
- GitHub Actions Continuous Integration pipeline

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Python | Application development |
| FastAPI | REST API |
| PostgreSQL | Database |
| Docker | Containerization |
| Kubernetes | Container orchestration |
| Kind | Local Kubernetes cluster |
| GitHub Actions | Continuous Integration |

## 📊 Kubernetes Features

CloudPulse AI uses Kubernetes production-style features:

### Health Probes

The application exposes a health endpoint:

```text
/health
```

Kubernetes uses:

- **Readiness Probe** – Determines when the application can receive traffic.
- **Liveness Probe** – Detects unhealthy containers and restarts them.

### Resource Management

The API deployment includes resource requests and limits:

| Resource | Request | Limit |
|---|---:|---:|
| CPU | 100m | 500m |
| Memory | 128Mi | 256Mi |

### Horizontal Pod Autoscaler

The application automatically scales based on CPU utilization.

```text
Minimum Pods: 2
Maximum Pods: 5
Target CPU: 50%
```

During load testing, CloudPulse AI successfully scaled from **2 pods to 5 pods**.

## 🔄 CI Pipeline

GitHub Actions automatically runs when code is pushed to the `main` branch.

The pipeline:

1. Checks out the source code
2. Sets up Python
3. Installs application dependencies
4. Tests the application
5. Builds the Docker image

## 🚀 Running the Project Locally

### Clone the repository

```bash
git clone https://github.com/prathameshpp-007/CloudPulse-AI.git
cd CloudPulse-AI
```

### Build the Docker image

```bash
docker build -t cloudpulse-ai .
```

### Run with Docker Compose

```bash
docker-compose up --build
```

### Check application health

```bash
curl http://localhost:8000/health
```

## ☸️ Deploying to Kubernetes

Apply the Kubernetes configuration:

```bash
kubectl apply -f kubernetes/
```

Check the running pods:

```bash
kubectl get pods
```

Check resource usage:

```bash
kubectl top pods
```

Check autoscaling:

```bash
kubectl get hpa
```

## 📈 Future Improvements

- Automated Docker image publishing
- Continuous Deployment pipeline
- Amazon EKS deployment
- AWS ECR container registry
- Monitoring with Prometheus and Grafana
- AI-powered anomaly detection

## 👨‍💻 Author

**Prathamesh Patil**

Aspiring Cloud and DevOps Engineer | BCA Student

GitHub: https://github.com/prathameshpp-007
