import { Agent } from '@mastra/core';
import { deepseek } from '@ai-sdk/deepseek';
import { z } from 'zod';
import { UniverseMemory } from '../memory/universeMemory.js';
import { universeTools } from '../tools/universeTools.js';
import { personalityTools } from '../tools/personalityTools.js';
import { timelineTools } from '../tools/timelineTools.js';
import { logger } from '../utils/logger.js';

// Schema for agent configuration
const AgentConfigSchema = z.object({
  modelProvider: z.string().default('deepseek'),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().default(2000),
  systemPrompt: z.string().optional(),
});

export class ParallelAgent {
  private agent: Agent;
  private memory: UniverseMemory;
  private config: z.infer<typeof AgentConfigSchema>;

  constructor(config?: Partial<z.infer<typeof AgentConfigSchema>>) {
    this.config = AgentConfigSchema.parse(config || {});
    this.memory = new UniverseMemory();
    
    // Initialize the Mastra agent
    this.agent = new Agent({
      name: 'ParallelYouAgent',
      description: 'An agent that simulates parallel universe versions of yourself',
      model: deepseek('deepseek-chat'),
      tools: [
        ...universeTools,
        ...personalityTools,
        ...timelineTools,
      ],
      systemPrompt: this.getSystemPrompt(),
      memory: this.memory,
      config: {
        temperature: this.config.temperature,
        maxTokens: this.config.maxTokens,
      },
    });
  }

  private getSystemPrompt(): string {
    return this.config.systemPrompt || `
      You are the Parallel Universe Agent, an advanced AI that helps users explore alternate versions of themselves across parallel universes.
      
      Your capabilities include:
      1. Generating realistic parallel universe scenarios based on key life decisions
      2. Creating detailed personality profiles for alternate versions
      3. Analyzing timeline divergences and their consequences
      4. Simulating conversations with parallel selves
      5. Comparing different life paths and outcomes
      
      Guidelines:
      - Be creative but maintain logical consistency within each universe
      - Consider butterfly effects - small changes can lead to big differences
      - Respect the user's privacy and emotional boundaries
      - Provide insights that are thought-provoking but not distressing
      - Use scientific concepts of multiverse theory when appropriate
      - Balance realism with imagination
      
      Remember: Each parallel universe represents a path not taken, a decision made differently, or a circumstance that changed. Help users explore these possibilities with empathy and wisdom.
    `;
  }

  async createUniverse(params: {
    userId: string;
    baseProfile: any;
    divergencePoint?: string;
  }) {
    logger.info('Creating new universe for user:', params.userId);
    
    const response = await this.agent.run({
      messages: [
        {
          role: 'user',
          content: `Create a parallel universe for the following profile:
            ${JSON.stringify(params.baseProfile, null, 2)}
            ${params.divergencePoint ? `Divergence point: ${params.divergencePoint}` : ''}
          `,
        },
      ],
      toolChoice: 'auto',
    });

    // Store universe in memory
    const universeId = `universe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await this.memory.storeUniverse(universeId, {
      userId: params.userId,
      baseProfile: params.baseProfile,
      divergencePoint: params.divergencePoint,
      data: response,
      createdAt: new Date(),
    });

    return {
      universeId,
      ...response,
    };
  }

  async exploreUniverse(universeId: string) {
    const universe = await this.memory.getUniverse(universeId);
    if (!universe) {
      throw new Error('Universe not found');
    }

    const response = await this.agent.run({
      messages: [
        {
          role: 'user',
          content: `Explore and provide detailed insights about this universe:
            ${JSON.stringify(universe, null, 2)}
          `,
        },
      ],
    });

    return response;
  }

  async compareUniverses(universeIds: string[]) {
    const universes = await Promise.all(
      universeIds.map(id => this.memory.getUniverse(id))
    );

    const validUniverses = universes.filter(u => u !== null);
    if (validUniverses.length < 2) {
      throw new Error('Need at least 2 valid universes to compare');
    }

    const response = await this.agent.run({
      messages: [
        {
          role: 'user',
          content: `Compare these parallel universes and highlight key differences:
            ${JSON.stringify(validUniverses, null, 2)}
          `,
        },
      ],
    });

    return response;
  }

  async chatWithParallelSelf(universeId: string, message: string) {
    const universe = await this.memory.getUniverse(universeId);
    if (!universe) {
      throw new Error('Universe not found');
    }

    const response = await this.agent.run({
      messages: [
        {
          role: 'system',
          content: `You are now embodying the parallel self from universe ${universeId}. 
            Respond as this version would, based on their experiences and personality:
            ${JSON.stringify(universe, null, 2)}
          `,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    // Store conversation in memory
    await this.memory.addConversation(universeId, {
      message,
      response: response.content,
      timestamp: new Date(),
    });

    return response;
  }

  async generateTimeline(universeId: string) {
    const universe = await this.memory.getUniverse(universeId);
    if (!universe) {
      throw new Error('Universe not found');
    }

    const response = await this.agent.run({
      messages: [
        {
          role: 'user',
          content: `Generate a detailed timeline for this parallel universe,
            showing key events and how they differ from the base reality:
            ${JSON.stringify(universe, null, 2)}
          `,
        },
      ],
      toolChoice: { tool: 'generateTimeline' },
    });

    return response;
  }

  async analyzePersonality(universeId: string) {
    const universe = await this.memory.getUniverse(universeId);
    if (!universe) {
      throw new Error('Universe not found');
    }

    const response = await this.agent.run({
      messages: [
        {
          role: 'user',
          content: `Analyze the personality of the parallel self in this universe.
            Provide detailed personality traits, values, and behavioral patterns:
            ${JSON.stringify(universe, null, 2)}
          `,
        },
      ],
      toolChoice: { tool: 'analyzePersonality' },
    });

    return response;
  }
}

export async function initializeAgent() {
  const agent = new ParallelAgent({
    temperature: 0.8,
    maxTokens: 2000,
  });
  
  return agent;
}