import { Executor } from "./executor";
import { Terminal } from "./terminal";

async function main() {
  const terminal = new Terminal("terminalWindow");
  const executor = new Executor(terminal.container);

  await executor.boot();
}

main();
