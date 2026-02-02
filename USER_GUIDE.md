# Thalos Prime - User Guide

**Copyright © 2026 Tony Ray Macier III**

## Introduction

Welcome to **Thalos Prime**, a revolutionary AI platform powered by Synthetic Biological Intelligence (SBI). This guide will help you understand and effectively use the platform.

## What is Thalos Prime?

Thalos Prime simulates biological neural networks using organoid-based models. Unlike traditional AI that relies solely on mathematical algorithms, Thalos Prime integrates bio-inspired processing principles:

- **Organoid Models**: Simulated brain organoids with neural structures
- **Synthetic Neurons**: Mathematical representations of biological neurons
- **Adaptive Connections**: Synaptic weights that change based on activity
- **Parallel Processing**: Multiple organoids working simultaneously

## Getting Started

### Installation

1. **Prerequisites**: Node.js 14.0 or higher
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start the Server**:
   ```bash
   npm start
   ```
4. **Access the Platform**: Open `http://localhost:3000` in your browser

### Using Docker

```bash
docker build -t thalos-prime .
docker run -p 3000:3000 thalos-prime
```

## How to Use

### Web Interface

1. **Open the Application**: Navigate to `http://localhost:3000`
2. **Type Your Query**: Use the input field at the bottom
3. **Send**: Click "Send" or press Enter
4. **View Response**: Watch the AI process and respond in real-time

### Understanding the Interface

#### Status Panel
- **System Status**: Connection state (🟢 Connected, 🔴 Disconnected)
- **Organoid Models**: Number of neural models (default: 3)
- **Total Neurons**: Combined neurons across all models (default: 2,100)
- **Queries Processed**: Total number of queries handled

#### Neural Visualization
- **Animated Network**: Real-time visualization of neural activity
- **Neural Activation**: Percentage of active neurons (0-100%)
- **Network Coherence**: Synchronization level between neurons (0-100%)

Higher values indicate more intense processing and better network coordination.

#### Chat Interface
- **Welcome Message**: Introduction and example queries
- **Conversation History**: Your queries and AI responses
- **Input Field**: Where you type your questions

## What You Can Ask

### Natural Language Queries

Ask anything in natural language:
- "What are your capabilities?"
- "How do organoid models work?"
- "Tell me about synthetic biological intelligence"
- "What can you do?"

### Mathematical Computations

Perform calculations:
- "Calculate 123 * 456"
- "What is 25 * 4 + 100?"
- "Solve (100 + 50) * 2 - 25"

Supported operators: `+`, `-`, `*`, `/`, `(`, `)`

### Greetings and Conversation

Have natural conversations:
- "Hello"
- "Hi, how are you?"
- "Good morning"
- "Thank you"
- "Goodbye"

## Understanding the Response

Each response includes:

### Main Response Text
The AI's answer to your query, processed through the SBI engine.

### Neural Metrics
- **Neural Activation**: Shows how active the network is during processing
- **Network Coherence**: Indicates how well the neurons are synchronized
- **Confidence**: Overall system confidence in the response (displayed in metadata)

### Processing Details
Some responses include:
- **Organoid Activity**: Individual metrics for each organoid model
- **Intent Analysis**: What the system understood about your query
- **Processing Time**: Time taken to generate the response

## Advanced Usage

### API Access

#### REST API

**Status Check**:
```bash
curl http://localhost:3000/api/status
```

**Submit Query**:
```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query":"Your question here"}'
```

**Get Capabilities**:
```bash
curl http://localhost:3000/api/capabilities
```

#### WebSocket API

For real-time interactions, connect to `ws://localhost:3000`:

```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'query',
    query: 'Hello, Thalos Prime!'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
};
```

## Tips for Best Results

1. **Be Specific**: The more specific your query, the better the response
2. **Use Natural Language**: Don't worry about formatting - just ask naturally
3. **Try Different Queries**: Explore various types of questions
4. **Watch the Metrics**: Higher activation often means more complex processing
5. **Observe the Visualization**: The neural network animation reflects real processing

## Understanding Neural Metrics

### Neural Activation (0-100%)
- **0-30%**: Low activity - simple query or idle state
- **30-60%**: Moderate activity - standard processing
- **60-100%**: High activity - complex computation or analysis

### Network Coherence (0-100%)
- **0-30%**: Low coherence - diverse neural responses
- **30-60%**: Moderate coherence - balanced processing
- **60-100%**: High coherence - synchronized neural activity

## Troubleshooting

### Connection Issues
- **Status shows 🔴**: Refresh the page or restart the server
- **Queries not sending**: Check browser console for errors
- **WebSocket disconnected**: Server may have restarted

### Performance Issues
- **Slow responses**: Normal for complex queries; wait a few seconds
- **Neural visualization laggy**: Reduce browser zoom or close other tabs
- **High memory usage**: Expected with 2,100 synthetic neurons running

### Query Not Working
- **No response**: Check if server is running (`npm start`)
- **Error message**: Query may contain unsupported characters
- **Unexpected response**: Rephrase your query for clarity

## Technical Details

### System Architecture
- **Backend**: Node.js + Express + WebSocket
- **Frontend**: Vanilla JavaScript + Canvas API
- **Neural Models**: 3 organoid models with 500-900 neurons each
- **Processing**: 5-cycle iterative propagation per query

### Performance Specifications
- **Query Processing**: < 100ms average
- **WebSocket Latency**: < 50ms
- **Memory Usage**: ~50MB base + ~10MB per organoid
- **Concurrent Users**: Supports multiple simultaneous connections

### Security Features
- Input sanitization
- Safe expression evaluation
- No arbitrary code execution
- CORS configuration

## Frequently Asked Questions

**Q: Is this connected to real biological tissue?**
A: No, Thalos Prime simulates organoid neural models mathematically. It's inspired by biological systems but runs entirely on digital hardware.

**Q: How accurate are the computations?**
A: Mathematical computations are precise. The "biological processing" is a simulation that adds context to the results.

**Q: Can I add more organoid models?**
A: Yes! Edit `server/sbi-core.js` and modify the initialization code to add more organoid models.

**Q: Does it learn from my queries?**
A: Currently, learning is session-based. Queries are stored in memory during the session but don't persist after restart.

**Q: Can I use this for production applications?**
A: Yes, but review the license terms. This is a demonstration platform that can be extended for production use.

## License

Copyright © 2026 Tony Ray Macier III

See the [LICENSE](LICENSE) file for full terms.

## Support

For issues, questions, or feedback:
- **Repository**: https://github.com/XxxGHOSTX/Thalos-Prime-Web
- **Documentation**: See [README.md](README.md) and [API.md](API.md)

## Conclusion

Thalos Prime demonstrates the future of AI by integrating biological intelligence principles with computational power. Explore its capabilities, experiment with different queries, and observe how synthetic neural networks process information in real-time.

**Welcome to the future of artificial intelligence!**

---

*"The future of AI is not just digital - it's biological."*

**Thalos Prime v1.0.0** | Powered by Synthetic Biological Intelligence
