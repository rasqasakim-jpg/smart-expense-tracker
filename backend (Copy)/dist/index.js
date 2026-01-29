import app from "./app.js";
import config from "./utils/env.js";
app.listen(config.PORT, () => {
    console.log(`Server running at http://${config.HOST}:${config.PORT}`);
});
//# sourceMappingURL=index.js.map
