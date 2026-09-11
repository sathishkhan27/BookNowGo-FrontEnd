type LoadingListener = (isLoading: boolean, activeCount: number) => void;

class LoadingManager {
  private activeRequests = 0;
  private listeners: Set<LoadingListener> = new Set();
  private debounceTimer: any = null;

  public start() {
    this.activeRequests++;
    this.notify();
  }

  public stop() {
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }
    this.notify();
  }

  public get isLoading(): boolean {
    return this.activeRequests > 0;
  }

  public get count(): number {
    return this.activeRequests;
  }

  public subscribe(listener: LoadingListener): () => void {
    this.listeners.add(listener);
    // Initial call
    listener(this.isLoading, this.activeRequests);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const loading = this.isLoading;
    const count = this.activeRequests;
    this.listeners.forEach((listener) => {
      try {
        listener(loading, count);
      } catch (err) {
        console.error('Error in loading listener:', err);
      }
    });
  }
}

export const loadingManager = new LoadingManager();
