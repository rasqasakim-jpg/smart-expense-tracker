import app from "./app";
import config from './utils/env';

app.listen(config.PORT, () => {
    console.log(`Server running at http://${config.HOST}:${config.PORT}`);
});