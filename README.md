# CloudPulse AI 🚀

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