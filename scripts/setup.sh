#!/bin/bash
echo "AssignFlow Setup Script"
echo "========================"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi
echo "✅ Docker found"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    exit 1
fi
echo "✅ Docker Compose found"

# Create .env if not exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please edit .env with your settings"
fi

# Start services
echo "Starting services..."
docker-compose up -d

echo ""
echo "✅ Setup complete!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000"
echo "Admin: http://localhost:8000/admin"
