export type PlatformName = 'browser' | 'telegram' | 'eitaa' | 'bale';

export interface PlatformAdapter {
  readonly name: PlatformName;

  /**
   * Initialize the platform integration.
   * Platform-specific behavior must be implemented only
   * after the corresponding official documentation is verified.
   */
  initialize(): Promise<void>;

  /**
   * Close or clean up platform-specific resources.
   */
  destroy(): void;

  /**
   * Whether the current runtime provides this platform.
   */
  isAvailable(): boolean;
}
