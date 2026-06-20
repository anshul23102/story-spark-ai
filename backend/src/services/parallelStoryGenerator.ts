import pLimit from 'p-limit';

interface GenerationTask {
  id: string;
  prompt: string;
  config: Record<string, any>;
  priority?: number;
}

interface GenerationResult {
  taskId: string;
  content: string;
  processingTime: number;
  success: boolean;
  error?: string;
}

interface GeneratorConfig {
  concurrency: number;
  timeout: number;
  retries: number;
}

type GeneratorFunction = (prompt: string, config: Record<string, any>) => Promise<string>;

export class ParallelStoryGenerator {
  private limit: any;
  private readonly config: GeneratorConfig;
  private generator: GeneratorFunction;
  private tasksInProgress: Map<string, Promise<GenerationResult>> = new Map();

  constructor(generator: GeneratorFunction, config: Partial<GeneratorConfig> = {}) {
    this.generator = generator;
    this.config = {
      concurrency: config.concurrency || 4,
      timeout: config.timeout || 30000,
      retries: config.retries || 2,
    };

    this.limit = pLimit(this.config.concurrency);
  }

  private async generateWithTimeout(prompt: string, config: Record<string, any>): Promise<string> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Story generation timeout after ${this.config.timeout}ms`));
      }, this.config.timeout);

      this.generator(prompt, config)
        .then((result) => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  private async generateWithRetries(prompt: string, config: Record<string, any>): Promise<string> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        return await this.generateWithTimeout(prompt, config);
      } catch (error) {
        lastError = error as Error;
        if (attempt < this.config.retries) {
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError || new Error('Story generation failed after retries');
  }

  async generateSingle(taskId: string, prompt: string, config: Record<string, any>): Promise<GenerationResult> {
    const startTime = Date.now();

    try {
      const content = await this.generateWithRetries(prompt, config);
      const processingTime = Date.now() - startTime;

      return {
        taskId,
        content,
        processingTime,
        success: true,
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;

      return {
        taskId,
        content: '',
        processingTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async generateParallel(tasks: GenerationTask[]): Promise<GenerationResult[]> {
    const sortedTasks = tasks.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    const promises = sortedTasks.map((task) =>
      this.limit(() => this.generateSingle(task.id, task.prompt, task.config))
    );

    return Promise.all(promises);
  }

  async generateWithTracking(taskId: string, prompt: string, config: Record<string, any>): Promise<GenerationResult> {
    if (this.tasksInProgress.has(taskId)) {
      return this.tasksInProgress.get(taskId) as Promise<GenerationResult>;
    }

    const resultPromise = this.generateSingle(taskId, prompt, config);
    this.tasksInProgress.set(taskId, resultPromise);

    const result = await resultPromise;
    this.tasksInProgress.delete(taskId);

    return result;
  }

  getActiveTaskCount(): number {
    return this.tasksInProgress.size;
  }

  getConfig(): GeneratorConfig {
    return { ...this.config };
  }

  setConcurrency(concurrency: number): void {
    if (concurrency < 1) throw new Error('Concurrency must be at least 1');
    this.limit = pLimit(concurrency);
  }
}

export function createParallelGenerator(
  generator: GeneratorFunction,
  config?: Partial<GeneratorConfig>
): ParallelStoryGenerator {
  return new ParallelStoryGenerator(generator, config);
}
