import os
from datetime import datetime

import psycopg
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="CloudPulse AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Model for incoming metrics
class Metric(BaseModel):
    service_name: str
    metric_name: str
    metric_value: float


# PostgreSQL connection configuration
DATABASE_CONFIG = {
    "host": os.getenv("DB_HOST", "cloudpulse-db"),
    "dbname": os.getenv("POSTGRES_DB", "cloudpulse"),
    "user": os.getenv("POSTGRES_USER", "cloudpulse_user"),
    "password": os.getenv("POSTGRES_PASSWORD", "cloudpulse_password"),
    "port": int(os.getenv("DB_PORT", "5432")),
}


def get_connection():
    return psycopg.connect(**DATABASE_CONFIG)


# Create the metrics table when the application starts
@app.on_event("startup")
def create_metrics_table():
    try:
        connection = get_connection()

        with connection.cursor() as cursor:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS metrics (
                    id SERIAL PRIMARY KEY,
                    service_name VARCHAR(100) NOT NULL,
                    metric_name VARCHAR(100) NOT NULL,
                    metric_value DOUBLE PRECISION NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            connection.commit()

        connection.close()
        print("CloudPulse AI: Database connected successfully")

    except Exception as error:
        print(f"Database startup error: {error}")


# Home endpoint
@app.get("/")
def root():
    return {
        "message": "CloudPulse AI is running",
        "status": "healthy",
        "version": "1.0.0",
    }


# Application health endpoint
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


# Store a new metric
@app.post("/metrics")
def create_metric(metric: Metric):
    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO metrics (service_name, metric_name, metric_value)
                    VALUES (%s, %s, %s)
                    RETURNING id, service_name, metric_name, metric_value, created_at;
                    """,
                    (
                        metric.service_name,
                        metric.metric_name,
                        metric.metric_value,
                    ),
                )

                new_metric = cursor.fetchone()
                connection.commit()

        return {
            "status": "success",
            "message": "Metric stored successfully",
            "metric": {
                "id": new_metric[0],
                "service_name": new_metric[1],
                "metric_name": new_metric[2],
                "metric_value": new_metric[3],
                "created_at": new_metric[4],
            },
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


# Get all stored metrics
@app.get("/metrics")
def get_metrics():
    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id, service_name, metric_name, metric_value, created_at
                    FROM metrics
                    ORDER BY created_at DESC;
                """)
                metrics = cursor.fetchall()

        return {
            "status": "success",
            "count": len(metrics),
            "metrics": [
                {
                    "id": metric[0],
                    "service_name": metric[1],
                    "metric_name": metric[2],
                    "metric_value": metric[3],
                    "created_at": metric[4],
                }
                for metric in metrics
            ],
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


# Analyze metrics and detect potential problems
@app.get("/analyze")
def analyze_metrics():
    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT service_name, metric_name, metric_value, created_at
                    FROM metrics
                    ORDER BY created_at DESC;
                """)
                metrics = cursor.fetchall()

        alerts = []

        for metric in metrics:
            service_name, metric_name, metric_value, created_at = metric

            if metric_name == "cpu_usage" and metric_value >= 90:
                alerts.append({
                    "severity": "critical",
                    "service": service_name,
                    "metric": metric_name,
                    "value": metric_value,
                    "recommendation": "High CPU usage detected. Consider scaling the service."
                })

            elif metric_name == "memory_usage" and metric_value >= 80:
                alerts.append({
                    "severity": "warning",
                    "service": service_name,
                    "metric": metric_name,
                    "value": metric_value,
                    "recommendation": "High memory usage detected. Check for memory leaks."
                })

            elif metric_name == "response_time_ms" and metric_value >= 200:
                alerts.append({
                    "severity": "warning",
                    "service": service_name,
                    "metric": metric_name,
                    "value": metric_value,
                    "recommendation": "Slow response time detected. Investigate application performance."
                })

        return {
            "status": "success",
            "metrics_analyzed": len(metrics),
            "alerts_found": len(alerts),
            "alerts": alerts,
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


# CPU-intensive endpoint for Kubernetes HPA testing
@app.get("/load-test")
def load_test():
    result = sum(i * i for i in range(10_000_000))

    return {
        "status": "success",
        "message": "CPU load test completed",
        "result": result,
    }