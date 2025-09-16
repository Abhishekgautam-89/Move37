
import http from "http";
import { initWebSocket } from "./sockets.js";
import app from './app.js'
const server = http.createServer(app);


// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Init WebSocket
initWebSocket(server);
