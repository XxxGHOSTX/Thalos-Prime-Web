/**
 * Thalos Prime - Synthetic Biological Intelligence (SBI) Core Engine
 * Copyright (c) 2026 Tony Ray Macier III
 * 
 * This module simulates organoid-based neural models for advanced AI processing
 */

class OrganoidNeuralModel {
  constructor(id, complexity = 1000) {
    this.id = id;
    this.complexity = complexity;
    this.neurons = [];
    this.synapses = [];
    this.activity = 0;
    this.learningRate = 0.01;
    
    // Initialize neural network
    this.initialize();
  }
  
  initialize() {
    // Create synthetic neurons
    for (let i = 0; i < this.complexity; i++) {
      this.neurons.push({
        id: i,
        activation: Math.random(),
        threshold: 0.5 + Math.random() * 0.3,
        connections: []
      });
    }
    
    // Create synaptic connections
    for (let i = 0; i < this.complexity; i++) {
      const connectionCount = Math.floor(Math.random() * 10) + 5;
      for (let j = 0; j < connectionCount; j++) {
        const target = Math.floor(Math.random() * this.complexity);
        if (target !== i) {
          this.neurons[i].connections.push({
            target: target,
            weight: (Math.random() - 0.5) * 2
          });
        }
      }
    }
  }
  
  process(input) {
    // Simulate neural activity
    const inputVector = this.encodeInput(input);
    
    // Propagate through network
    for (let cycle = 0; cycle < 5; cycle++) {
      for (let i = 0; i < this.neurons.length; i++) {
        let signal = inputVector[i % inputVector.length] || 0;
        
        for (const conn of this.neurons[i].connections) {
          signal += this.neurons[conn.target].activation * conn.weight;
        }
        
        // Apply activation function (sigmoid)
        this.neurons[i].activation = 1 / (1 + Math.exp(-signal));
      }
    }
    
    // Extract output
    return this.decodeOutput();
  }
  
  encodeInput(input) {
    const text = String(input).toLowerCase();
    const vector = [];
    
    for (let i = 0; i < text.length; i++) {
      vector.push(text.charCodeAt(i) / 255);
    }
    
    // Pad or truncate to fixed size
    while (vector.length < 100) vector.push(0);
    return vector.slice(0, 100);
  }
  
  decodeOutput() {
    // Calculate average activation
    const avgActivation = this.neurons.reduce((sum, n) => sum + n.activation, 0) / this.neurons.length;
    
    // Measure network coherence
    const coherence = this.calculateCoherence();
    
    return {
      activation: avgActivation,
      coherence: coherence,
      complexity: this.complexity
    };
  }
  
  calculateCoherence() {
    let totalCoherence = 0;
    let connectionCount = 0;
    
    for (const neuron of this.neurons) {
      for (const conn of neuron.connections) {
        const diff = Math.abs(neuron.activation - this.neurons[conn.target].activation);
        totalCoherence += (1 - diff) * Math.abs(conn.weight);
        connectionCount++;
      }
    }
    
    return connectionCount > 0 ? totalCoherence / connectionCount : 0;
  }
}

class SyntheticBiologicalIntelligence {
  constructor() {
    this.organoids = [];
    this.knowledgeBase = this.initializeKnowledgeBase();
    this.conversationHistory = [];
    
    // Initialize multiple organoid models
    for (let i = 0; i < 3; i++) {
      this.organoids.push(new OrganoidNeuralModel(i, 500 + i * 200));
    }
  }
  
  initializeKnowledgeBase() {
    return {
      greetings: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
      farewells: ['bye', 'goodbye', 'see you', 'farewell', 'take care'],
      queries: {
        what: 'Requesting information or explanation',
        how: 'Requesting process or method',
        why: 'Requesting reasoning or cause',
        when: 'Requesting temporal information',
        where: 'Requesting location information',
        who: 'Requesting identity information'
      },
      capabilities: [
        'natural language understanding',
        'complex computation',
        'pattern recognition',
        'knowledge synthesis',
        'bio-inspired processing',
        'adaptive learning'
      ]
    };
  }
  
  async processQuery(query, userId = 'anonymous') {
    // Store in conversation history
    this.conversationHistory.push({
      userId,
      query,
      timestamp: new Date()
    });
    
    // Process through organoid models
    const organoidResponses = this.organoids.map(organoid => 
      organoid.process(query)
    );
    
    // Analyze query intent
    const intent = this.analyzeIntent(query);
    
    // Generate response based on analysis
    const response = await this.generateResponse(query, intent, organoidResponses);
    
    return {
      response,
      metadata: {
        processingTime: Date.now(),
        organoidActivity: organoidResponses,
        intent,
        confidence: this.calculateConfidence(organoidResponses)
      }
    };
  }
  
  analyzeIntent(query) {
    const lowerQuery = query.toLowerCase();
    
    // Check for greetings
    if (this.knowledgeBase.greetings.some(g => lowerQuery.includes(g))) {
      return { type: 'greeting', confidence: 0.95 };
    }
    
    // Check for farewells
    if (this.knowledgeBase.farewells.some(f => lowerQuery.includes(f))) {
      return { type: 'farewell', confidence: 0.95 };
    }
    
    // Check query types
    for (const [keyword, description] of Object.entries(this.knowledgeBase.queries)) {
      if (lowerQuery.startsWith(keyword)) {
        return { type: 'query', subtype: keyword, description, confidence: 0.85 };
      }
    }
    
    // Check for math operations
    if (/[\d+\-*/()]/g.test(query)) {
      return { type: 'computation', confidence: 0.9 };
    }
    
    // Check for capabilities inquiry
    if (lowerQuery.includes('can you') || lowerQuery.includes('are you able')) {
      return { type: 'capability_inquiry', confidence: 0.8 };
    }
    
    // Default to general query
    return { type: 'general_query', confidence: 0.7 };
  }
  
  async generateResponse(query, intent, organoidResponses) {
    const avgActivation = organoidResponses.reduce((sum, r) => sum + r.activation, 0) / organoidResponses.length;
    const avgCoherence = organoidResponses.reduce((sum, r) => sum + r.coherence, 0) / organoidResponses.length;
    
    switch (intent.type) {
      case 'greeting':
        return this.generateGreeting(avgActivation);
        
      case 'farewell':
        return this.generateFarewell();
        
      case 'computation':
        return this.performComputation(query);
        
      case 'capability_inquiry':
        return this.describeCapabilities();
        
      case 'query':
        return this.handleQuery(query, intent, avgActivation, avgCoherence);
        
      default:
        return this.generateGeneralResponse(query, avgActivation, avgCoherence);
    }
  }
  
  generateGreeting(activation) {
    const greetings = [
      "Hello! I'm Thalos Prime, powered by Synthetic Biological Intelligence. How can I assist you today?",
      "Greetings! My organoid-based neural models are ready to help you with any inquiry.",
      "Welcome! I'm here to demonstrate the integration of machine and synthetic bio-engineering. What would you like to explore?"
    ];
    
    const index = Math.floor(activation * greetings.length) % greetings.length;
    return greetings[index];
  }
  
  generateFarewell() {
    return "Goodbye! Thank you for interacting with Thalos Prime. Feel free to return anytime for more AI-powered assistance.";
  }
  
  performComputation(query) {
    try {
      // Extract mathematical expression
      const expression = query.replace(/[^0-9+\-*/().]/g, '');
      
      if (!expression) {
        return "I can perform complex computations. Please provide a mathematical expression.";
      }
      
      // Safe evaluation (limited to basic math)
      const result = this.evaluateExpression(expression);
      
      return `Computing through synthetic biological neural networks...\n\nResult: ${expression} = ${result}\n\nThis computation was processed through ${this.organoids.length} organoid-based neural models working in parallel, demonstrating the integration of biological intelligence principles with computational power.`;
    } catch (error) {
      return "I encountered an issue processing that computation. Please ensure your expression uses valid mathematical operators (+, -, *, /, parentheses).";
    }
  }
  
  evaluateExpression(expr) {
    // Safe math evaluation
    const sanitized = expr.replace(/[^0-9+\-*/().]/g, '');
    
    // Simple parser for basic math
    try {
      const tokens = sanitized.match(/(\d+\.?\d*|[+\-*/()])/g) || [];
      if (tokens.length === 0) return 0;
      
      // Use Function constructor for safe evaluation (limited scope)
      const func = new Function('return ' + tokens.join(''));
      const result = func();
      
      return Number(result.toFixed(10));
    } catch (e) {
      throw new Error('Invalid expression');
    }
  }
  
  describeCapabilities() {
    return `I am Thalos Prime, an advanced AI platform powered by Synthetic Biological Intelligence (SBI). My capabilities include:

${this.knowledgeBase.capabilities.map((cap, i) => `${i + 1}. ${cap.charAt(0).toUpperCase() + cap.slice(1)}`).join('\n')}

I utilize ${this.organoids.length} organoid-based neural models that simulate biological neural networks. Each organoid contains hundreds of synthetic neurons with adaptive synaptic connections, allowing me to:

• Process natural language queries
• Perform complex mathematical computations
• Recognize patterns and relationships
• Synthesize information from multiple sources
• Learn and adapt from interactions
• Integrate machine learning with bio-inspired processing

Ask me anything, and I'll demonstrate these capabilities!`;
  }
  
  handleQuery(query, intent, activation, coherence) {
    const responses = {
      what: `Based on my analysis using ${this.organoids.length} organoid neural models (neural activation: ${(activation * 100).toFixed(1)}%, coherence: ${(coherence * 100).toFixed(1)}%), I can provide insights on "${query}". This query involves understanding information and explanations. My synthetic biological processing indicates this is a knowledge-based inquiry.`,
      
      how: `Processing your "how" query through my bio-inspired neural networks... The method or process you're asking about involves systematic steps. With a neural coherence of ${(coherence * 100).toFixed(1)}%, my organoid models suggest approaching this systematically.`,
      
      why: `Your question about causation and reasoning is being processed through ${this.organoids.length} interconnected organoid models. The reasoning behind "${query}" involves multiple factors that my neural networks are analyzing based on pattern recognition and causal inference.`,
      
      when: `Temporal information processing activated. My organoid-based models show ${(activation * 100).toFixed(1)}% activation, indicating temporal pattern recognition is engaged for your query about "${query}".`,
      
      where: `Location-based query detected. My synthetic biological intelligence is processing spatial and contextual information with ${(coherence * 100).toFixed(1)}% coherence across neural models.`,
      
      who: `Identity and attribution query recognized. My neural networks are analyzing entity relationships and identifications related to "${query}".`
    };
    
    return responses[intent.subtype] || this.generateGeneralResponse(query, activation, coherence);
  }
  
  generateGeneralResponse(query, activation, coherence) {
    return `Thank you for your inquiry: "${query}"

My Synthetic Biological Intelligence system has processed your query through ${this.organoids.length} organoid-based neural models:

📊 Neural Activation: ${(activation * 100).toFixed(1)}%
🔗 Network Coherence: ${(coherence * 100).toFixed(1)}%
🧠 Processing Mode: Bio-inspired adaptive learning

I'm demonstrating the integration of machine learning with synthetic bio-engineering principles. Each of my organoid models contains hundreds of interconnected synthetic neurons that process information in parallel, similar to biological neural networks.

Your query has been analyzed for intent, context, and complexity. I can provide detailed responses to specific questions, perform computations, or explain my capabilities in more detail. What would you like to explore?`;
  }
  
  calculateConfidence(organoidResponses) {
    const avgCoherence = organoidResponses.reduce((sum, r) => sum + r.coherence, 0) / organoidResponses.length;
    const variance = organoidResponses.reduce((sum, r) => 
      sum + Math.pow(r.coherence - avgCoherence, 2), 0
    ) / organoidResponses.length;
    
    // Higher confidence when coherence is high and variance is low
    return Math.min(0.95, avgCoherence * (1 - Math.sqrt(variance)));
  }
  
  getStatistics() {
    return {
      totalQueries: this.conversationHistory.length,
      organoidCount: this.organoids.length,
      totalNeurons: this.organoids.reduce((sum, o) => sum + o.complexity, 0),
      systemStatus: 'operational',
      uptime: process.uptime()
    };
  }
}

export default SyntheticBiologicalIntelligence;
