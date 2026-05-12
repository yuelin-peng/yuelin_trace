export const GRPC_CLIENT_CONFIG = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  timeout: 10000,
};

export class GrpcClient {
  private apiUrl: string;
  private timeout: number;

  constructor(config = GRPC_CLIENT_CONFIG) {
    this.apiUrl = config.apiUrl;
    this.timeout = config.timeout;
  }

  async call<TResponse>(
    service: string,
    method: string,
    request: unknown
  ): Promise<TResponse> {
    const url = `${this.apiUrl}/${service}/${method}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/grpc-web+json',
          'X-Grpc-Accept-Encoding': 'gzip',
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        throw new Error(`gRPC call failed: ${response.status} ${response.statusText}`);
      }

      return await response.json() as TResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to call ${service}/${method}: ${error.message}`);
      }
      throw error;
    }
  }

  getApiUrl(): string {
    return this.apiUrl;
  }
}

export const grpcClient = new GrpcClient();