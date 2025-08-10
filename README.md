# Parallel You Agent 2

🌌 An AI-powered agent that simulates parallel universe versions of yourself using the Mastra framework.

## 🚀 Features

- **Multiple Universe Simulation**: Generate different versions of yourself across various parallel universes
- **Timeline Analysis**: Explore how different choices lead to different life paths
- **Personality Variations**: See how your personality might have evolved differently
- **Memory System**: Persistent storage of universe data and interactions
- **Interactive API**: RESTful endpoints for universe exploration
- **DeepSeek Integration**: Advanced AI reasoning for realistic simulations

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- DeepSeek API key

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Rexingleung/parallel-you-agent2.git
cd parallel-you-agent2
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env and add your DeepSeek API key
```

4. Run the development server:
```bash
npm run dev
```

## 🎮 Usage

### Starting the Agent

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### API Endpoints

#### Create a Universe
```bash
curl -X POST http://localhost:3000/api/universe/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "baseProfile": {
      "name": "John Doe",
      "age": 30,
      "interests": ["technology", "music"],
      "keyDecisions": ["college major", "first job"]
    }
  }'
```

#### Explore a Universe
```bash
curl http://localhost:3000/api/universe/{universeId}/explore
```

#### Compare Universes
```bash
curl -X POST http://localhost:3000/api/universe/compare \
  -H "Content-Type: application/json" \
  -d '{
    "universeIds": ["universe1", "universe2"]
  }'
```

#### Chat with Parallel Self
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "universeId": "universe123",
    "message": "What did you do differently?"
  }'
```

## 🏗️ Architecture

### Core Components

- **Universe Engine**: Generates and manages parallel universes
- **Timeline Processor**: Calculates divergence points and outcomes
- **Personality Modeler**: Creates personality variations based on different life paths
- **Memory Manager**: Handles persistent storage using LibSQL
- **Agent Orchestrator**: Coordinates between different agent instances

### Technology Stack

- **Mastra**: AI agent framework
- **DeepSeek**: LLM provider for intelligent responses
- **LibSQL**: Database for persistent storage
- **Zod**: Schema validation
- **Express**: Web server framework

## 📁 Project Structure

```
parallel-you-agent2/
├── src/
│   ├── agents/           # Agent definitions
│   ├── config/          # Configuration files
│   ├── controllers/     # API controllers
│   ├── models/          # Data models
│   ├── services/        # Business logic
│   ├── tools/           # Mastra tools
│   ├── types/           # TypeScript types
│   └── index.ts         # Entry point
├── data/                # Database files
├── logs/                # Application logs
└── tests/               # Test files
```

## 🔧 Configuration

Edit `src/config/universe.config.ts` to customize:

- Number of parallel universes to generate
- Divergence factors and weights
- Personality trait variations
- Timeline branching parameters

## 🧪 Testing

```bash
npm test
```

## 📊 Example Output

```json
{
  "universeId": "universe_xyz",
  "divergencePoint": "Chose computer science instead of music",
  "currentState": {
    "profession": "Software Engineer",
    "location": "San Francisco",
    "personality": {
      "openness": 0.8,
      "conscientiousness": 0.75,
      "extraversion": 0.6
    }
  },
  "timeline": [
    {
      "age": 18,
      "event": "Started CS degree",
      "impact": "high"
    },
    {
      "age": 22,
      "event": "First tech internship",
      "impact": "medium"
    }
  ]
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Mastra](https://mastra.ai) for the excellent AI agent framework
- [DeepSeek](https://deepseek.com) for the powerful LLM capabilities
- The parallel universe theory for the inspiration

## 📞 Contact

For questions and support, please open an issue in the GitHub repository.

---

⭐ Star this repo if you find it interesting!