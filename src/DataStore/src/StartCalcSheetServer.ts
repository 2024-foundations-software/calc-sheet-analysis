
import startCalcSheetServerApp from "./CalcSheetServerApp";
import process from "process";


// read the port from the command line

let port = 3000;
if (process.argv.length > 2) {
    port = parseInt(process.argv[2]);
}

startCalcSheetServerApp(port);
console.log(`Server is running on port ${port}`);

export { };

