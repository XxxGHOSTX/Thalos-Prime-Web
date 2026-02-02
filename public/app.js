/**
 * Thalos Prime - Frontend Application
 * Copyright (c) 2026 Tony Ray Macier III
 */

class ThalosPrimeClient {
  constructor() {
    this.ws = null;
    this.connected = false;
    this.apiUrl = window.location.origin;
    this.wsUrl = `ws://${window.location.host}`;
    
    this.init();
  }
  
  init() {
    this.setupWebSocket();
    this.setupEventListeners();
    this.setupNeuralVisualization();
    this.fetchSystemStatus();
  }
  
  setupWebSocket() {
    try {
      this.ws = new WebSocket(this.wsUrl);
      
      this.ws.onopen = () => {
        this.connected = true;
        this.updateSystemStatus('🟢 Connected');
        console.log('Connected to Thalos Prime');
      };
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleWebSocketMessage(data);
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.updateSystemStatus('🔴 Connection Error');
      };
      
      this.ws.onclose = () => {
        this.connected = false;
        this.updateSystemStatus('🟡 Disconnected');
        
        // Attempt to reconnect after 3 seconds
        setTimeout(() => this.setupWebSocket(), 3000);
      };
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      this.updateSystemStatus('🔴 Offline');
    }
  }
  
  setupEventListeners() {
    const queryInput = document.getElementById('queryInput');
    const sendButton = document.getElementById('sendButton');
    
    sendButton.addEventListener('click', () => this.sendQuery());
    
    queryInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendQuery();
      }
    });
    
    // Request stats every 5 seconds
    setInterval(() => {
      if (this.connected && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'stats' }));
      }
    }, 5000);
  }
  
  setupNeuralVisualization() {
    const canvas = document.getElementById('neuralCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Neural network visualization
    this.neurons = [];
    for (let i = 0; i < 50; i++) {
      this.neurons.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        activation: Math.random()
      });
    }
    
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 15, 30, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw neurons
      this.neurons.forEach((neuron, i) => {
        neuron.x += neuron.vx;
        neuron.y += neuron.vy;
        
        // Bounce off edges
        if (neuron.x < 0 || neuron.x > canvas.width) neuron.vx *= -1;
        if (neuron.y < 0 || neuron.y > canvas.height) neuron.vy *= -1;
        
        // Update activation
        neuron.activation += (Math.random() - 0.5) * 0.1;
        neuron.activation = Math.max(0, Math.min(1, neuron.activation));
        
        // Draw connections
        this.neurons.forEach((other, j) => {
          if (i < j) {
            const dx = other.x - neuron.x;
            const dy = other.y - neuron.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
              const alpha = (1 - dist / 150) * 0.3;
              ctx.strokeStyle = `rgba(0, 200, 255, ${alpha * neuron.activation})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(neuron.x, neuron.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        });
        
        // Draw neuron
        ctx.fillStyle = `rgba(0, 200, 255, ${neuron.activation})`;
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  async fetchSystemStatus() {
    try {
      const response = await fetch(`${this.apiUrl}/api/status`);
      const data = await response.json();
      
      if (data.sbi) {
        this.updateStats(data.sbi);
      }
    } catch (error) {
      console.error('Failed to fetch system status:', error);
    }
  }
  
  async sendQuery() {
    const input = document.getElementById('queryInput');
    const query = input.value.trim();
    
    if (!query) return;
    
    // Add user message to chat
    this.addMessage(query, 'user');
    
    // Clear input
    input.value = '';
    
    // Show thinking indicator
    const thinkingId = this.addMessage('Processing through organoid neural models...', 'system', true);
    
    try {
      if (this.connected && this.ws.readyState === WebSocket.OPEN) {
        // Send via WebSocket for real-time response
        this.ws.send(JSON.stringify({
          type: 'query',
          query: query,
          userId: this.getUserId()
        }));
        
        // Remove thinking indicator (will be replaced by response)
        setTimeout(() => {
          const thinkingMsg = document.getElementById(thinkingId);
          if (thinkingMsg) thinkingMsg.remove();
        }, 500);
      } else {
        // Fallback to REST API
        const response = await fetch(`${this.apiUrl}/api/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, userId: this.getUserId() })
        });
        
        const data = await response.json();
        
        // Remove thinking indicator
        const thinkingMsg = document.getElementById(thinkingId);
        if (thinkingMsg) thinkingMsg.remove();
        
        this.handleQueryResponse(data);
      }
    } catch (error) {
      console.error('Query error:', error);
      
      // Remove thinking indicator
      const thinkingMsg = document.getElementById(thinkingId);
      if (thinkingMsg) thinkingMsg.remove();
      
      this.addMessage('Error processing query. Please try again.', 'error');
    }
  }
  
  handleWebSocketMessage(data) {
    switch (data.type) {
      case 'connection':
        console.log(data.message);
        break;
        
      case 'response':
        this.handleQueryResponse(data.data);
        break;
        
      case 'stats':
        this.updateStats(data.data);
        break;
        
      case 'error':
        this.addMessage(data.message, 'error');
        break;
    }
  }
  
  handleQueryResponse(data) {
    if (data.response) {
      this.addMessage(data.response, 'assistant');
    }
    
    if (data.metadata) {
      this.updateNeuralMetrics(data.metadata);
      
      if (data.metadata.organoidActivity) {
        this.animateNeuralActivity(data.metadata.organoidActivity);
      }
    }
  }
  
  addMessage(text, type, isThinking = false) {
    const chatHistory = document.getElementById('chatHistory');
    const messageDiv = document.createElement('div');
    const messageId = `msg-${Date.now()}-${Math.random()}`;
    
    messageDiv.id = messageId;
    messageDiv.className = `message ${type}${isThinking ? ' thinking' : ''}`;
    
    if (type === 'user') {
      messageDiv.innerHTML = `<strong>You:</strong> ${this.escapeHtml(text)}`;
    } else if (type === 'assistant') {
      messageDiv.innerHTML = `<strong>Thalos Prime:</strong> ${this.formatResponse(text)}`;
    } else if (type === 'system') {
      messageDiv.innerHTML = `<em>${this.escapeHtml(text)}</em>`;
    } else if (type === 'error') {
      messageDiv.innerHTML = `<span class="error-text">⚠️ ${this.escapeHtml(text)}</span>`;
    }
    
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    return messageId;
  }
  
  formatResponse(text) {
    // Convert newlines to <br> and preserve formatting
    return this.escapeHtml(text)
      .replace(/\n/g, '<br>')
      .replace(/📊|🔗|🧠|🧬|🔬|⚡|🎯/g, match => match);
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  updateSystemStatus(status) {
    const statusElement = document.getElementById('systemStatus');
    if (statusElement) {
      statusElement.textContent = status;
    }
  }
  
  updateStats(stats) {
    const elements = {
      organoidCount: stats.organoidCount,
      neuronCount: stats.totalNeurons,
      queryCount: stats.totalQueries
    };
    
    for (const [id, value] of Object.entries(elements)) {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value.toLocaleString();
      }
    }
  }
  
  updateNeuralMetrics(metadata) {
    if (metadata.organoidActivity && metadata.organoidActivity.length > 0) {
      const avgActivation = metadata.organoidActivity.reduce((sum, o) => sum + o.activation, 0) / metadata.organoidActivity.length;
      const avgCoherence = metadata.organoidActivity.reduce((sum, o) => sum + o.coherence, 0) / metadata.organoidActivity.length;
      
      this.setMetric('activation', avgActivation);
      this.setMetric('coherence', avgCoherence);
    }
  }
  
  setMetric(type, value) {
    const percentage = Math.round(value * 100);
    const bar = document.getElementById(`${type}Bar`);
    const valueSpan = document.getElementById(`${type}Value`);
    
    if (bar) {
      bar.style.width = `${percentage}%`;
    }
    
    if (valueSpan) {
      valueSpan.textContent = `${percentage}%`;
    }
  }
  
  animateNeuralActivity(activity) {
    // Increase neural animation intensity based on activity
    const avgActivation = activity.reduce((sum, o) => sum + o.activation, 0) / activity.length;
    
    this.neurons.forEach(neuron => {
      neuron.activation = Math.min(1, neuron.activation + avgActivation * 0.3);
    });
  }
  
  getUserId() {
    let userId = localStorage.getItem('thalos-user-id');
    if (!userId) {
      userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('thalos-user-id', userId);
    }
    return userId;
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.thalosPrime = new ThalosPrimeClient();
});
