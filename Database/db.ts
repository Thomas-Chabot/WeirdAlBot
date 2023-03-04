import * as sqlite3 from "sqlite3";
import { open } from "sqlite";
import { CreateDirectory } from "../Files/Files";
import { Database as Log } from "../Logs/Logger";

let db = null;

export const GetDb = async () => {
    if (db !== null){
        return db;
    }
    
    const directory = `${process.cwd()}\\Database\\db`;
    const path = `${directory}\\database.db`;
    
    // Create the directory if it doesn't exist
    CreateDirectory(directory);
    
    Log("Opening database at ", path);
    db = await open({
        filename: path,
        driver: sqlite3.Database
    });
    Log("Opened");

    return db;
}