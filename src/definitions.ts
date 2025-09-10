type CommandHandler = () => void | Promise<void>;

export type Handlers = Record<string, CommandHandler>;

export type DelayFlags = {
  fast: string[],
  slow: string[],
}
