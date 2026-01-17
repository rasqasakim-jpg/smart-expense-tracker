import app from "./app.js";
import os from "os";
import config from "./utils/env.js";
// Bind to configured HOST (default 0.0.0.0) so server is reachable from other devices when needed
app.listen(config.PORT, config.HOST, () => {
    console.log(`Server running at http://${config.HOST}:${config.PORT}`);
    // If server is bound to 0.0.0.0, list accessible local IP addresses for convenience
    if (config.HOST === "0.0.0.0") {
        const nets = os.networkInterfaces();
        console.log("Accessible network addresses:");
        for (const name of Object.keys(nets)) {
            const netInfo = nets[name] || [];
            for (const net of netInfo) {
                // Only show IPv4, non-internal addresses
                if (net.family === "IPv4" && !net.internal) {
                    console.log(`  - http://${net.address}:${config.PORT}/ (interface: ${name})`);
                }
            }
        }
        console.log("Use one of the above IPs from your device browser or set HOST to one of them in .env");
    }
});
//# sourceMappingURL=index.js.map
