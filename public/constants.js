export const BOOTLOG_RENDER_DELAY = 10;
export const SHUTDOWN_RENDER_DELAY = 10;
export const INITIAL_BUFFER_DELAY = 200;
export const COMMAND_BUFFER_DELAY = 50;
export const SHUTDOWN_BUFFER_DELAY = 1000;
export const BOOTLOG_DELAY_FLAGS = {
    slow: ["Loading drivers", "Mounting virtual", "Starting system"],
    fast: ["Starting udev", "devpts", "Cleaning up"],
};
export const SHUTDOWN_DELAY_FLAGS = {
    slow: ["Stopping system", "Unmounting virtual", "Shutting down"],
    fast: ["Killing remaining", "Deactivating swap", "Flushing file"],
};
