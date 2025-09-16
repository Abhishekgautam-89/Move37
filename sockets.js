import { Server } from "socket.io";

let io;

export const initWebSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("joinPoll", (pollId) => {
      socket.join(`poll-${pollId}`);
      console.log(`Client ${socket.id} joined poll-${pollId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

export { io };
