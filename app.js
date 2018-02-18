process.chdir(__dirname);
process.on('SIGINT', () => {process.exit(0);}); // not gracefully, just for test task
const core = new (require("./modules/Core.js"));


                                           