import { Setup, Loop } from "./Control/Loop";

require('dotenv').config();
(async () => {
    await Setup();
    await Loop();
})();