# CollabGen AI Agent

A sophisticated multi-agent AI system designed for collaborative intelligence and automated business analysis. This platform leverages specialized AI agents that work together to perform comprehensive research, product analysis, marketing strategies, and critical evaluation.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Configuration](#environment-configuration)
7. [Running the Application](#running-the-application)
   - [Development Mode](#development-mode)
   - [Production Mode](#production-mode)
   - [Docker Deployment](#docker-deployment)
8. [API Documentation](#api-documentation)
9. [Agent System](#agent-system)
10. [Contributing](#contributing)
11. [License](#license)

---

## Overview

CollabGen AI Agent is an enterprise-grade multi-agent collaboration platform that automates complex business workflows through the coordination of specialized AI agents. Each agent is designed with domain-specific expertise, enabling the system to tackle multifaceted problems by decomposing them into specialized tasks and synthesizing the results into comprehensive outputs.

The platform provides a modern web interface for interacting with the agent system, viewing real-time agent collaboration, and accessing generated reports and analyses.

---

## Features

### Multi-Agent Collaboration
- **Orchestrated AI Agents**: Multiple specialized agents working in concert to solve complex problems
- **Agent Communication Protocol**: Structured inter-agent messaging and task delegation
- **Real-time Collaboration Visibility**: Monitor agent interactions and decision-making processes

### Specialized Agent Capabilities
- **Research Agent**: Conducts in-depth research and data gathering on specified topics
- **Product Agent**: Analyzes products, features, and market positioning
- **Marketing Agent**: Develops marketing strategies and content recommendations
- **Critic Agent**: Provides critical evaluation and quality assurance of agent outputs

### Interactive Dashboard
- **Chat Interface**: Natural language interaction with the agent system
- **Report Generation**: Automated generation of comprehensive business reports
- **Company Selector**: Multi-company analysis and comparison capabilities
- **Real-time Status Updates**: Live feedback on agent processing states

### Enterprise Features
- **Scalable Architecture**: Designed for horizontal scaling and high availability
- **Docker Support**: Containerized deployment for consistent environments
- **CI/CD Integration**: Automated deployment pipelines via GitHub Actions
- **API-First Design**: RESTful API for integration with external systems

---

## Architecture

The CollabGen AI Agent follows a modular microservices architecture with clear separation between the frontend presentation layer and backend processing layer.

```
                    +-------------------+
                    |   Frontend (UI)   |
                    |    Next.js App    |
                    +--------+----------+
                             |
                             | HTTP/REST
                             |
                    +--------v----------+
                    |   Backend API     |
                    |    FastAPI/Flask  |
                    +--------+----------+
                             |
          +------------------+------------------+
          |                  |                  |
+---------v------+  +--------v-------+  +-------v--------+
|   Orchestrator |  |  LLM Service   |  | Storage Service|
+--------+-------+  +----------------+  +----------------+
         |
   +-----+-----+-----+-----+
   |     |     |     |     |
+--v-+ +-v--+ +v--+ +v---+ |
|Res.| |Prod| |Mkt| |Crit| |
|Agt | |Agt | |Agt| |Agt | |
+----+ +----+ +---+ +----+ |
```

### Key Architectural Components

**Frontend Layer**
- Single Page Application built with Next.js
- Component-based architecture for reusability
- State management for complex UI interactions
- Responsive design for multi-device support

**Backend Layer**
- RESTful API server handling all client requests
- Agent orchestration and lifecycle management
- Service layer for external integrations (LLM, Storage)
- Request/Response models for type-safe communication

**Agent Layer**
- Base agent class providing common functionality
- Specialized agent implementations with domain expertise
- Orchestrator coordinating multi-agent workflows
- Asynchronous processing for long-running tasks

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js | React framework for production-grade applications |
| TypeScript | Type-safe JavaScript for robust code |
| Tailwind CSS | Utility-first CSS framework for styling |
| React Hooks | State and lifecycle management |
| Zustand/Redux | Global state management |

### Backend
| Technology | Purpose |
|------------|---------|
| Python | Primary backend programming language |
| FastAPI/Flask | Web framework for building APIs |
| Pydantic | Data validation and settings management |
| LangChain/Custom | Agent framework and LLM integration |
| Async/Await | Asynchronous request handling |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Docker | Containerization platform |
| Docker Compose | Multi-container orchestration |
| GitHub Actions | CI/CD automation |
| Cloud Providers | AWS/GCP/Azure deployment options |

---

## Project Structure

```
collabgen-ai-agent/
|
|-- .github/
|   |-- workflows/
|       |-- backend-deploy.yml      # Backend CI/CD pipeline
|       |-- frontend-deploy.yml     # Frontend CI/CD pipeline
|
|-- backend/
|   |-- app/
|   |   |-- agents/
|   |   |   |-- __init__.py
|   |   |   |-- base_agent.py       # Base agent class with common functionality
|   |   |   |-- orchestrator.py     # Agent coordination and workflow management
|   |   |   |-- research_agent.py   # Research and data gathering agent
|   |   |   |-- product_agent.py    # Product analysis agent
|   |   |   |-- marketing_agent.py  # Marketing strategy agent
|   |   |   |-- critic_agent.py     # Quality assurance and evaluation agent
|   |   |
|   |   |-- api/
|   |   |   |-- __init__.py
|   |   |   |-- routes.py           # Main API router configuration
|   |   |   |-- pipeline.py         # Pipeline execution endpoints
|   |   |   |-- research.py         # Research-related endpoints
|   |   |   |-- product.py          # Product-related endpoints
|   |   |   |-- marketing.py        # Marketing-related endpoints
|   |   |   |-- reports.py          # Report generation endpoints
|   |   |
|   |   |-- models/
|   |   |   |-- __init__.py
|   |   |   |-- request_models.py   # API request data models
|   |   |   |-- response_models.py  # API response data models
|   |   |
|   |   |-- services/
|   |   |   |-- __init__.py
|   |   |   |-- llm_service.py      # LLM provider integration
|   |   |   |-- report_service.py   # Report generation service
|   |   |   |-- storage_service.py  # Data persistence service
|   |   |
|   |   |-- utils/
|   |   |   |-- __init__.py
|   |   |   |-- (utility modules)   # Helper functions and utilities
|   |   |
|   |   |-- config.py               # Application configuration
|   |   |-- main.py                 # Application entry point
|   |
|   |-- Dockerfile                  # Backend container configuration
|   |-- requirements.txt            # Python dependencies
|   |-- .env.example                # Environment variables template
|
|-- frontend/
|   |-- app/
|   |   |-- (dashboard)/
|   |   |   |-- chat/               # Chat interface pages
|   |   |   |-- reports/            # Report viewing pages
|   |   |   |-- layout.tsx          # Dashboard layout component
|   |   |   |-- page.tsx            # Dashboard home page
|   |   |
|   |   |-- globals.css             # Global styles
|   |   |-- layout.tsx              # Root layout component
|   |   |-- page.tsx                # Application entry page
|   |
|   |-- components/
|   |   |-- agents/                 # Agent visualization components
|   |   |-- chat/                   # Chat interface components
|   |   |-- layout/                 # Layout and navigation components
|   |   |-- reports/                # Report display components
|   |   |-- ui/                     # Reusable UI components
|   |   |-- CompanySelector.tsx     # Company selection component
|   |
|   |-- hooks/                      # Custom React hooks
|   |-- lib/                        # Utility libraries
|   |-- store/                      # State management
|   |-- types/
|   |   |-- agent.ts                # Agent type definitions
|   |   |-- api.ts                  # API type definitions
|   |   |-- report.ts               # Report type definitions
|   |
|   |-- Dockerfile                  # Frontend container configuration
|   |-- package.json                # Node.js dependencies
|   |-- next.config.ts              # Next.js configuration
|   |-- tailwind.config.ts          # Tailwind CSS configuration
|
|-- docs/
|   |-- API.md                      # API documentation
|   |-- ARCHITECTURE.md             # Architecture documentation
|   |-- DEPLOYMENT.md               # Deployment guide
|
|-- docker-compose.yml              # Multi-container orchestration
|-- .env.example                    # Root environment template
|-- .gitignore                      # Git ignore rules
|-- README.md                       # Project documentation
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

**Required:**
- Node.js (version 18.x or higher)
- Python (version 3.10 or higher)
- pip (Python package manager)
- npm or yarn (Node.js package managers)

**Optional (for containerized deployment):**
- Docker (version 20.x or higher)
- Docker Compose (version 2.x or higher)

**API Keys:**
- OpenAI API key or compatible LLM provider credentials
- Any additional service API keys as required

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Aditya7808/collabgen-Ai-agent-.git
cd collabgen-ai-agent
```

#### 2. Backend Setup

Navigate to the backend directory and create a virtual environment:

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend

# Install dependencies
npm install
# or using yarn
yarn install
```

### Environment Configuration

#### Backend Environment Variables

Create a `.env` file in the `backend/` directory based on `.env.example`:

```env
# Application Settings
APP_ENV=development
APP_DEBUG=true
APP_HOST=0.0.0.0
APP_PORT=8000

# LLM Configuration
OPENAI_API_KEY=your_openai_api_key_here
LLM_MODEL=gpt-4
LLM_TEMPERATURE=0.7
LLM_MAX_TOKENS=4096

# Database Configuration (if applicable)
DATABASE_URL=your_database_connection_string

# Storage Configuration
STORAGE_TYPE=local
STORAGE_PATH=./data

# CORS Settings
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Logging
LOG_LEVEL=INFO
```

#### Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true
```

---

## Running the Application

### Development Mode

#### Start the Backend Server

From the `backend/` directory with the virtual environment activated:

```bash
# Using Python directly
python -m app.main

# Or using uvicorn (for FastAPI)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or using Flask
flask run --debug --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`.

#### Start the Frontend Development Server

From the `frontend/` directory:

```bash
npm run dev
# or
yarn dev
```

The frontend application will be available at `http://localhost:3000`.

### Production Mode

#### Build and Run Backend

```bash
cd backend

# Install production dependencies
pip install -r requirements.txt

# Run with a production WSGI server
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000
```

#### Build and Run Frontend

```bash
cd frontend

# Create production build
npm run build

# Start production server
npm run start
```

### Docker Deployment

#### Using Docker Compose (Recommended)

From the root project directory:

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

#### Building Individual Containers

**Backend:**
```bash
cd backend
docker build -t collabgen-backend .
docker run -p 8000:8000 --env-file .env collabgen-backend
```

**Frontend:**
```bash
cd frontend
docker build -t collabgen-frontend .
docker run -p 3000:3000 collabgen-frontend
```

---

## API Documentation

The backend API follows RESTful conventions and provides endpoints for all agent operations.

### Base URL

```
http://localhost:8000/api/v1
```

### Authentication

Include your API key in the request headers:

```
Authorization: Bearer <your-api-key>
```

### Core Endpoints

#### Pipeline Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/pipeline/execute` | Execute a full agent pipeline |
| GET | `/pipeline/status/{id}` | Get pipeline execution status |
| DELETE | `/pipeline/{id}` | Cancel a running pipeline |

#### Research Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/research/analyze` | Initiate research analysis |
| GET | `/research/results/{id}` | Retrieve research results |

#### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/product/analyze` | Analyze product information |
| GET | `/product/results/{id}` | Retrieve product analysis |

#### Marketing Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/marketing/strategy` | Generate marketing strategy |
| GET | `/marketing/results/{id}` | Retrieve marketing strategy |

#### Report Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports` | List all generated reports |
| GET | `/reports/{id}` | Get specific report details |
| POST | `/reports/generate` | Generate a new report |
| DELETE | `/reports/{id}` | Delete a report |

### Example Request

```bash
curl -X POST http://localhost:8000/api/v1/pipeline/execute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "company": "Example Corp",
    "query": "Analyze market position and suggest growth strategies",
    "agents": ["research", "product", "marketing", "critic"]
  }'
```

### Example Response

```json
{
  "pipeline_id": "pl_abc123xyz",
  "status": "processing",
  "created_at": "2024-01-15T10:30:00Z",
  "estimated_completion": "2024-01-15T10:35:00Z",
  "agents_status": {
    "research": "running",
    "product": "pending",
    "marketing": "pending",
    "critic": "pending"
  }
}
```

For complete API documentation, refer to `/docs/API.md` or access the interactive Swagger documentation at `http://localhost:8000/docs` when running the backend server.

---

## Agent System

### Agent Types

#### Research Agent
The Research Agent is responsible for gathering and synthesizing information from various sources. It excels at:
- Market research and competitive analysis
- Industry trend identification
- Data collection and summarization
- Source verification and citation

#### Product Agent
The Product Agent focuses on product-related analysis and recommendations:
- Feature analysis and comparison
- Product positioning strategies
- User experience evaluation
- Technical specification review

#### Marketing Agent
The Marketing Agent develops comprehensive marketing strategies:
- Target audience identification
- Campaign strategy development
- Content recommendations
- Channel optimization suggestions

#### Critic Agent
The Critic Agent ensures quality and provides constructive evaluation:
- Output validation and fact-checking
- Logical consistency verification
- Improvement suggestions
- Risk and limitation identification

### Orchestrator

The Orchestrator manages the coordination between all agents:
- Task decomposition and assignment
- Agent communication facilitation
- Result aggregation and synthesis
- Workflow state management

### Agent Workflow

1. **Input Processing**: User query is received and parsed
2. **Task Planning**: Orchestrator decomposes the query into sub-tasks
3. **Parallel Execution**: Relevant agents process their assigned tasks
4. **Critic Review**: Critic Agent evaluates all outputs
5. **Synthesis**: Results are combined into a coherent response
6. **Output Generation**: Final report or response is generated

---

## Contributing

We welcome contributions to the CollabGen AI Agent project. Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Write or update tests as needed
5. Ensure all tests pass
6. Commit your changes (`git commit -m 'Add: description of your changes'`)
7. Push to your branch (`git push origin feature/your-feature-name`)
8. Open a Pull Request

### Code Style Guidelines

**Python (Backend):**
- Follow PEP 8 style guidelines
- Use type hints for function parameters and return values
- Write docstrings for all public functions and classes
- Maximum line length: 88 characters (Black formatter)

**TypeScript (Frontend):**
- Follow the existing ESLint configuration
- Use TypeScript strict mode
- Write JSDoc comments for complex functions
- Use functional components with hooks

### Commit Message Format

Use clear, descriptive commit messages:
- `Add:` for new features
- `Fix:` for bug fixes
- `Update:` for updates to existing functionality
- `Remove:` for removed features or code
- `Docs:` for documentation changes
- `Refactor:` for code refactoring

### Pull Request Process

1. Ensure your PR description clearly describes the changes
2. Link any related issues
3. Request review from maintainers
4. Address any feedback promptly
5. Ensure CI/CD checks pass before merge

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Support

For questions, issues, or feature requests:

- Create an issue on GitHub
- Contact the maintainers directly
- Check the documentation in the `/docs` directory

---

## Acknowledgments

- Thanks to all contributors who have helped shape this project
- Built with modern open-source technologies
- Inspired by advancements in multi-agent AI systems

---

**CollabGen AI Agent** - Collaborative Intelligence for Modern Enterprises
