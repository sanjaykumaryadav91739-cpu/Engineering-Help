
let io = null;

export const setIO = (socketInstance) => {
    if (!socketInstance) {
        throw new Error("A valid Socket.IO instance is required.");
    }

    if (io) {
        throw new Error("Socket.IO has already been initialized.");
    }

    io = socketInstance;
};

export const getIO = () => {
    if (!io) {
        throw new Error(
            "Socket.IO is not initialized. Check server configuration."
        );
    }

    return io;
};
