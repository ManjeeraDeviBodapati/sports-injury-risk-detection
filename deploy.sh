#!/bin/bash
echo "==================================================="
echo "  SPORTS INJURY RISK DETECTION PLATFORM - DEPLOYMENT"
echo "==================================================="
echo "Building and orchestrating Docker containers..."
docker-compose up --build -d

echo ""
echo "Database Seeding..."
docker exec -it sports_injury_backend python seed_data.py

echo ""
echo "Production deployment complete!"
echo " -> Frontend Application: http://localhost:5173"
echo " -> Backend API Engine: http://localhost:8000/docs"
echo "==================================================="
