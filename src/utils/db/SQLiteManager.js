import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

import * as schema from './schemas';

const database_name = 'OpenPandoraBox.db';
const database_version = '1.0';
const database_displayname = 'OpenPandoraBoxDB';
const database_size = 200000;

class SQLiteManager {
    constructor() {
        this.type = 'SingletonDefaultExportInstance';
        this.db = null;
    }

    initDB() {
        let db;
        return new Promise((resolve) => {
            SQLite.echoTest()
                .then(() => {
                    SQLite.openDatabase(
                        database_name,
                        database_version,
                        database_displayname,
                        database_size,
                    )
                        .then((DB) => {
                            this.db = DB;
                            db = DB;
                            db.executeSql('SELECT 1 FROM Rom LIMIT 1')
                                .then(() => {
                                    //
                                })
                                .catch((error) => {
                                    db.transaction((tx) => {
                                        for (const name in schema.Tables) {
                                            this.createTable(tx, schema.Tables[name], name);
                                        }
                                    })
                                        .then(() => {
                                            //
                                        })
                                        .catch(() => {
                                            //
                                        });
                                });
                            resolve(db);
                        })
                        .catch((error) => {
                            //
                        });
                })
                .catch((error) => {
                    //
                });
        });
    }

    closeDatabase(db) {
        if (db) {
            db.close()
                .then((status) => {
                    //
                })
                .catch((error) => {
                    this.errorCB(error);
                });
        } else {
            //
        }
    }

    cleanPlatform(platform) {
        return new Promise((resolve) => {
            this.db
                .transaction((tx) => {
                    
                    tx.executeSql('DELETE from Rom where platform = ? ', [
                        platform
                    ]).then(([tx, results]) => {
                        resolve(results);
                    });
                    
                })
                .then((result) => {
                    //
                })
                .catch(() => {
                    //
                });
        });
    }

    hasRomInPlatform(platform) {
        return new Promise((resolve) => {
            this.db
                .transaction((tx) => {
                    
                    tx.executeSql('select id from Rom where platform = ? LIMIT 1 ', [
                        platform
                    ]).then(([tx, results]) => {
                        resolve(results);
                    });
                    
                })
                .then((result) => {
                    //
                })
                .catch(() => {
                    //
                });
        });
    }

    loadRomsFromPlatform(platform) {
        return new Promise((resolve) => {
            this.db
                .transaction((tx) => {
                    
                    tx.executeSql('select * from Rom where platform = ? ', [
                        platform
                    ]).then(([tx, results]) => {
                        resolve(results);
                    });
                    
                })
                .then((result) => {
                    //
                })
                .catch(() => {
                    //
                });
        });
    }

    sizeRomPlatform(platform) {
        return new Promise((resolve) => {
            this.db
                .transaction((tx) => {
                    tx.executeSql('select COUNT(id) as size from Rom where platform = ?  ', [
                        platform
                    ]).then(([tx, results]) => {

                        const _size = results.rows.length;
                        let size = 0;
                        if (_size > 0) {
                            if(results?.rows?.item(0)?.size){
                                size = results.rows.item(0).size
                            }                        
                        }
                        resolve(size);
                    });
                    
                })
                .then((result) => {
                    //
                })
                .catch(() => {
                    //
                });
        });
    }

    loadRomsFromPlatformIdInList(platform, list) {
        return new Promise((resolve) => {
            this.db
                .transaction((tx) => {
                    
                    tx.executeSql('select * from Rom where platform = ? and id in (?) ', [
                        platform, list.toString()
                    ]).then(([tx, results]) => {

                        const _size = results.rows.length;

                        let roms = []

                        if (_size > 0) {
                            for (let i = 0; i < _size; i++) {
                                roms.push(results.rows.item(i))
                            }
                        }

                        resolve(roms);
                    });
                    
                })
                .then((result) => {
                    //
                })
                .catch(() => {
                    //
                });
        });
    }

    loadRomsFromPlatformOffsetLimit(platform, offset, limit) {
        return new Promise((resolve) => {
            this.db
                .transaction((tx) => {
                    
                    tx.executeSql('select * from Rom where platform = ? LIMIT ? OFFSET ? ', [
                        platform, limit, offset
                    ]).then(([tx, results]) => {

                        const _size = results.rows.length;

                        let roms = []

                        if (_size > 0) {
                            for (let i = 0; i < _size; i++) {
                                roms.push(results.rows.item(i))
                            }
                        }

                        resolve(roms);
                    });
                    
                })
                .then((result) => {
                    //
                })
                .catch(() => {
                    //
                });
        });
    }

    addRoms(roms) {
        return new Promise((resolve) => {
            this.db
                .transaction((tx) => {
                    for (let i = 0; i < roms.length; i++) {
                        tx.executeSql('INSERT OR REPLACE INTO Rom VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                            roms[i].platform,
                            roms[i].id,
                            roms[i].name,
                            roms[i].path,
                            roms[i].thumbnail,
                            roms[i].image,
                            roms[i].video,
                            roms[i].desc,
                            roms[i].romName,
                        ]).then(([tx, results]) => {
                            resolve(results);
                        });
                    }
                })
                .then((result) => {
                    //
                })
                .catch(() => {
                    //
                });
        });
    }

    createTablesFromSchema() {
        if (this.db) {
            this.db.transaction((tx) => {
                for (const name in schema.Tables) {
                    this.createTable(tx, schema.Tables[name], name);
                }
            });
        }
    }

    dropDatabase() {
        return new Promise((resolve, reject) => {
            SQLite.deleteDatabase(database_name)
                .then(() => {
                    SQLite.openDatabase(
                        database_name,
                        database_version,
                        database_displayname,
                        database_size,
                    );
                })
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        }).catch((error) => {
            //
        });
    }

    createTable(tx, table, tableName) {
        let sql = `CREATE TABLE IF NOT EXISTS ${tableName} `;
        const createColumns = [];
        for (const key in table) {
            createColumns.push(
                `${key} ${table[key].type.type} ${table[key].primary_key ? 'PRIMARY KEY NOT NULL' : ''
                } default ${table[key].default_value}`,
            );
        }
        sql += `(${createColumns.join(', ')});`;
        tx.executeSql(
            sql,
            [],
            () => {
                //
            },
            () => {
                //
            },
        );
    }
}

export default new SQLiteManager();