# Thalos Prime API Documentation

## Overview

Thalos Prime provides both REST API and WebSocket API for interacting with the Synthetic Biological Intelligence engine.

## Base URL

```
http://localhost:3000
```

## REST API Endpoints

### 1. Get System Status

**Endpoint**: `GET /api/status`

**Description**: Retrieves the current system status and statistics.

**Response**:
```json
{
  "status": "operational",
  "system": "Thalos Prime",
  "version": "1.0.0",
  "sbi": {
    "totalQueries": 42,
    "organoidCount": 3,
    "totalNeurons": 1300,
    "systemStatus": "operational",
    "uptime": 3600.5
  }
}
```

**Status Codes**:
- `200 OK`: Success

---

### 2. Process Query

**Endpoint**: `POST /api/query`

**Description**: Submit a query to the SBI engine for processing.

**Request Body**:
```json
{
  "query": "What are your capabilities?",
  "userId": "user-123"
}
```

**Parameters**:
- `query` (string, required): The query text
- `userId` (string, optional): User identifier

**Response**:
```json
{
  "response": "Thank you for your inquiry...",
  "metadata": {
    "processingTime": 1675342800000,
    "organoidActivity": [
      {
        "activation": 0.73,
        "coherence": 0.68,
        "complexity": 500
      },
      {
        "activation": 0.71,
        "coherence": 0.65,
        "complexity": 700
      },
      {
        "activation": 0.75,
        "coherence": 0.70,
        "complexity": 900
      }
    ],
    "intent": {
      "type": "capability_inquiry",
      "confidence": 0.8
    },
    "confidence": 0.89
  }
}
```

**Status Codes**:
- `200 OK`: Query processed successfully
- `400 Bad Request`: Invalid request (missing query)
- `500 Internal Server Error`: Processing error

---

### 3. Get Capabilities

**Endpoint**: `GET /api/capabilities`

**Description**: Retrieves information about the platform's capabilities.

**Response**:
```json
{
  "capabilities": [
    "Natural Language Understanding",
    "Complex Computation",
    "Pattern Recognition",
    "Knowledge Synthesis",
    "Bio-Inspired Processing",
    "Adaptive Learning"
  ],
  "organoids": 3,
  "neurons": 1300
}
```

**Status Codes**:
- `200 OK`: Success

---

## WebSocket API

### Connection

**URL**: `ws://localhost:3000`

**Protocol**: WebSocket

### Message Types

#### 1. Connection Confirmation

Sent automatically upon connection.

```json
{
  "type": "connection",
  "message": "Connected to Thalos Prime SBI Engine",
  "timestamp": "2026-02-02T12:00:00.000Z"
}
```

#### 2. Query Request (Client → Server)

Send a query to the SBI engine.

```json
{
  "type": "query",
  "query": "Hello, Thalos Prime",
  "userId": "user-123"
}
```

#### 3. Query Response (Server → Client)

Receive the processed response.

```json
{
  "type": "response",
  "data": {
    "response": "Hello! I'm Thalos Prime, powered by Synthetic Biological Intelligence...",
    "metadata": {
      "processingTime": 1675342800000,
      "organoidActivity": [...],
      "intent": {
        "type": "greeting",
        "confidence": 0.95
      },
      "confidence": 0.89
    }
  },
  "timestamp": "2026-02-02T12:00:00.123Z"
}
```

#### 4. Statistics Request (Client → Server)

Request current system statistics.

```json
{
  "type": "stats"
}
```

#### 5. Statistics Response (Server → Client)

Receive system statistics.

```json
{
  "type": "stats",
  "data": {
    "totalQueries": 42,
    "organoidCount": 3,
    "totalNeurons": 1300,
    "systemStatus": "operational",
    "uptime": 3600.5
  },
  "timestamp": "2026-02-02T12:00:00.456Z"
}
```

#### 6. Error Message (Server → Client)

Error notification.

```json
{
  "type": "error",
  "message": "Error processing message",
  "timestamp": "2026-02-02T12:00:00.789Z"
}
```

---

## Response Metadata

### Organoid Activity

Each organoid model returns activity metrics:

```json
{
  "activation": 0.73,      // Neural activation level (0-1)
  "coherence": 0.68,       // Network coherence (0-1)
  "complexity": 500        // Number of neurons in model
}
```

### Intent Analysis

The system identifies query intent:

```json
{
  "type": "greeting|farewell|computation|capability_inquiry|query|general_query",
  "subtype": "what|how|why|when|where|who",  // For query type
  "description": "Requesting information or explanation",
  "confidence": 0.85        // Intent confidence (0-1)
}
```

### Intent Types

- `greeting`: User greeting
- `farewell`: User goodbye
- `computation`: Mathematical calculation request
- `capability_inquiry`: Question about system capabilities
- `query`: Specific question (what, how, why, when, where, who)
- `general_query`: General inquiry

---

## Query Examples

### Natural Language Queries

```bash
# Greeting
POST /api/query
{
  "query": "Hello, how are you?"
}

# Capabilities
POST /api/query
{
  "query": "What can you do?"
}

# Question
POST /api/query
{
  "query": "How do organoid models work?"
}
```

### Computation Queries

```bash
# Basic math
POST /api/query
{
  "query": "Calculate 123 * 456"
}

# Complex expression
POST /api/query
{
  "query": "What is (100 + 50) * 2 - 25?"
}
```

---

## Error Handling

### REST API Errors

```json
{
  "error": "Query is required"
}
```

### WebSocket Errors

```json
{
  "type": "error",
  "message": "Error processing message",
  "timestamp": "2026-02-02T12:00:00.000Z"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Future versions may include:
- Maximum queries per minute
- Concurrent connection limits
- Query complexity limits

---

## Client Libraries

### JavaScript (Browser)

```javascript
// REST API
const response = await fetch('http://localhost:3000/api/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'Hello!' })
});
const data = await response.json();

// WebSocket
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

### Node.js

```javascript
import fetch from 'node-fetch';
import WebSocket from 'ws';

// REST API
const response = await fetch('http://localhost:3000/api/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'Hello!' })
});
const data = await response.json();

// WebSocket
const ws = new WebSocket('ws://localhost:3000');
ws.on('open', () => {
  ws.send(JSON.stringify({
    type: 'query',
    query: 'Hello, Thalos Prime!'
  }));
});
ws.on('message', (data) => {
  console.log(JSON.parse(data));
});
```

---

## Versioning

Current API version: **v1.0.0**

The API follows semantic versioning. Breaking changes will increment the major version.

---

## Support

For API support, please refer to the main [README](README.md) or contact the development team.

**Copyright © 2026 Tony Ray Macier III**
