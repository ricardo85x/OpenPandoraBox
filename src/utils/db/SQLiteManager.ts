import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

import * as schema from './schemas';
import {IRom, IRomRaw} from './types';

const database_name = 'OpenPandoraBox.db';
const database_version = '1.0';
const database_displayname = 'OpenPandoraBoxDB';
const database_size = 200000;

/// TODO refactor

class SQLiteManager {
  type = '';
  db: SQLiteDatabase = null as any;

  constructor() {
    this.type = 'SingletonDefaultExportInstance';
    this.db = null as any;
  }

  errorCB(error: any) {
    console.log('Error CB', error);
  }

  initDB() {
    let db: SQLite.SQLiteDatabase;

    return new Promise((resolve) => {
      (SQLite as any)
        .echoTest()
        .then(() => {
          (SQLite as any)
            .openDatabase(
              database_name,
              database_version,
              database_displayname,
              database_size,
            )
            .then((DB: any) => {
              this.db = DB;
              db = DB;
              db.executeSql(
                'SELECT rom.favorite FROM Rom cross join History cross join Favorites LIMIT 1',
              )
                .then(() => {
                  //
                })
                .catch((error) => {

                  console.log("INIT DB ERROR", error)

                  db.transaction((tx) => {
                    for (const name in schema.Tables) {

                      this.dropTable(
                        tx,
                        name,
                      );

                      this.createTable(
                        tx,
                        schema.Tables[
                          name as keyof typeof schema.Tables
                        ] as any,
                        name,
                      );
                      console.log('Creating Table', name);
                    }
                  })
                    .then(() => {
                      //
                    })
                    .catch((e) => {
                      
                    });
                });
              resolve(db);
            })
            .catch((error: any) => {
              console.log('Error initializing db 1', error);
            });
        })
        .catch((error: any) => {
          console.log('Error initializing db 2', error);
        });
    });
  }

  closeDatabase(db: SQLiteDatabase) {
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

  async cleanPlatform(platform: string) {
    try {
      await this.db.executeSql('DELETE from Rom where platform = ? ', [
        platform,
      ]);
    } catch (error) {
      console.log('Error cleaning platform', platform, error);
    }
  }

  loadRomsFromPlatform(platform: string) {
    return new Promise((resolve) => {
      this.db
        .transaction((tx) => {
          tx.executeSql('select * from Rom where platform = ? ', [
            platform,
          ]).then(([tx, results]) => {
            resolve(results);
          });
        })
        .catch(() => {
          console.log('Error loading rom from db', platform);
          resolve([]);
        });
    });
  }

  sizeRomPlatform(platform: string) {
    let sql = 'select COUNT(id) as size from Rom where platform = ?  ';
    let params = [platform];

    if (platform === 'All') {
      sql = 'select COUNT(id) as size from Rom';
      params = [];
    }

    return new Promise<number>((resolve) => {
      this.db
        .transaction((tx) => {
          tx.executeSql(sql, params).then(([, results]) => {
            const _size = results.rows.length;
            let size = 0;
            if (_size > 0) {
              if (results?.rows?.item(0)?.size) {
                size = results.rows.item(0).size;
              }
            }
            resolve(size);
          });
        })
        .catch((error: any) => {
          console.log('Error get size of DB', platform, error);
          resolve(0);
        });
    });
  }

  loadRomsFromPlatformOffsetLimit(
    platform: string,
    offset: number,
    limit: number,
  ) {
    return new Promise((resolve) => {
      let sql =
        "select * from (select platform,id,name,path,thumbnail,image,video,romName,normalizedName,favorite from Rom where platform = ? order by normalizedName ASC) LIMIT ? OFFSET ? ";
      let params = [platform, limit, offset];

      if (platform === 'All') {
        sql =
          "select * from (select platform,id,name,path,thumbnail,image,video,romName,normalizedName,favorite from Rom order by normalizedName ASC, platform) LIMIT ? OFFSET ? ";
        params = [limit, offset];
      }

      this.db
        .transaction((tx) => {
 
          tx.executeSql(sql, params).then(([, results]) => {
            const _size = results.rows.length;

            let roms = [];

            if (_size > 0) {
              for (let i = 0; i < _size; i++) {
                roms.push({
                  ...results.rows.item(i),
                  sortId: i + offset,
                });
              }
            }

            resolve(roms);
          });
        })
        .catch((err: any) => {
          console.log('Err on loadRomsFromPlatformOffsetLimit');
          // console.log('Err on loadRomsFromPlatformOffsetLimit', err);
          resolve([]);
        });
    });
  }

  async removeFromHistory(rom: IRom) {
    try {
      const current_history = await this.getHistory();
      if (current_history.length) {
        const duplicated = current_history.findIndex(
          (i) => i.id === rom.id && i.platform === rom.platform,
        );

        if (duplicated !== -1) {
          await this.db.executeSql(
            'delete from  history where romId = ? and platform = ?',
            [rom.id, rom.platform],
          );
        }
      }
    } catch (err) {
      console.log('Error adding rom to history', err);
    }
  }

  async addHistory(id: number, platform: string) {
    try {
      const current_history = await this.getHistory();
      if (current_history.length === 0) {
        await this.db.executeSql(
          "insert into history(romId, platform, updated_at) values (?,?, datetime(CURRENT_TIMESTAMP, 'localtime'))",
          [id, platform],
        );
      } else {
        const duplicated = current_history.findIndex(
          (i) => i.id === id && i.platform === platform,
        );
        if (duplicated === -1) {
          await this.db.executeSql(
            "insert into history(romId, platform, updated_at) values (?,?, datetime(CURRENT_TIMESTAMP, 'localtime'))",
            [id, platform],
          );
        } else {
          await this.db.executeSql(
            'update history set updated_at = datetime(CURRENT_TIMESTAMP, "localtime") where romId = ? and platform = ?',
            [id, platform],
          );
        }
      }
    } catch (err) {
      console.log('Error adding rom to history', err);
    }
  }

  async removeFromFavorites(rom: IRom) {
    try {
      const current_favorites = await this.getFavorites();
      if (current_favorites.length) {
        const duplicated = current_favorites.findIndex(
          (i) => i.id === rom.id && i.platform === rom.platform,
        );

        if (duplicated !== -1) {
          await this.db.executeSql(
            'delete from  favorites where romId = ? and platform = ?',
            [rom.id, rom.platform],
          );
        }
      }
    } catch (err) {
      console.log('Error adding rom to favorites', err);
    }
  }

  async setFavorite(id: number, platform: string) {

    let isFavorite = true;



    try {

      const roms = await this.db.executeSql(
        'select favorite from Rom where id = ? and platform = ?',
        [id, platform],
      );

      if (roms.length) {
        const current_row = roms[0].rows.item(0);
        if(current_row?.favorite){
          isFavorite = false;
        } 
        await this.db.executeSql(
          'update rom set favorite = ? where id = ? and platform = ?',
          [isFavorite, id, platform],
        );
      }
    } catch (err) {
      console.log('Error adding rom to favorites', err);
    }

    return isFavorite
  }


  async getDescription(id: number) {
    let result = ""

    const results = await this.db.executeSql(
      'select desc from Rom where id = ?  limit 1',
      [id],
    );

    if (results.length) {
      for (let i = 0; i < results.length; i++) {
        const current_row = results[i].rows.item(0);
        result = current_row.desc;
      }
    }

    return result;

  } 

  async getFavorites() {
    let resultData = [];

    const results = await this.db.executeSql(
      'select * from Rom where favorite = ? order by normalizedName ASC',
      [true],
    );

    if (results.length) {
      for (let i = 0; i < results.length; i++) {
        const current_result = results[i];

        for (let j = 0; j < current_result.rows.length; j++) {
          const current_row = results[i].rows.item(j);

          if (resultData.findIndex((d) => d.id === current_row.id) === -1) {
            resultData.push(current_row);
          }
        }
      }
    }

    return resultData;
  }

  async getHistory() {
    let resultData = [];

    const results = await this.db.executeSql(
      'select * from History order by updated_at DESC',
      [],
    );

    if (results.length) {
      for (let i = 0; i < results.length; i++) {
        const current_result = results[i];

        for (let j = 0; j < current_result.rows.length; j++) {
          const current_row = results[i].rows.item(j);

          const results_rom = await this.db.executeSql(
            'select * from rom where id = ? and platform = ?',
            [current_row.romId, current_row.platform],
          );

          if (results_rom.length && results_rom[0].rows.length) {
            const current = results_rom[0].rows.item(0);

            if (resultData.findIndex((d) => d.id === current.id) === -1) {
              resultData.push(current);
            }
          }
        }
      }
    }

    return resultData;
  }

  async searchRom(text: string) {
    let resultData = [];

    const text_parts = text
      .trim()
      .split(' ')
      .map((t) => `%${t.toLocaleUpperCase()}%`);

    if ((!!text.trim() && text.trim().length > 1) == false) {
      return [];
    }

    const questions = text_parts.reduce((acc) => {
      if (acc.length == 0) {
        acc = 'normalizedName like ? ';
      } else {
        acc = acc + 'and normalizedName like ? ';
      }
      return acc;
    }, '');

    const results = await this.db.executeSql(
      `select * from Rom where ${questions} order by normalizedName COLLATE NOCASE ASC LIMIT 100`,
      text_parts,
    );

    if (results.length) {
      for (let i = 0; i < results.length; i++) {
        const current_result = results[i];

        for (let j = 0; j < current_result.rows.length; j++) {
          const current_row = results[i].rows.item(j);
          resultData.push(current_row);
        }
      }
    }
    return resultData;
  }



  async addRoms(roms: IRomRaw[]) {

    await Promise.all(
      [this.db.transaction((tx) => {


        roms.forEach((rom) => {
          try {
    
            const actual_params = [
              rom.platform,
              rom.id,
              rom.name,
              rom.path,
              rom.thumbnail,
              rom.image,
              rom.video,
              rom.desc,
              rom.romName,
              String(rom.name)
                .normalize('NFD')
                ?.replace(/\p{Diacritic}/gu, '')
            ];

            tx.executeSql(
              `INSERT INTO ROM(platform,id,name,path,thumbnail,image,video,desc,romName,normalizedName) VALUES(?,?,?,?,?,?,?,?,?,?);`,
              actual_params,
            )

          } catch (e) {
            console.log("error adding ROM ", e)

          }
        })


      }).catch(e => console.log("error adding ROMS", e)) ]
    )

    console.log("finished add roms")

  }

  createTablesFromSchema() {
    if (this.db) {
      this.db.transaction((tx) => {
        for (const name in schema.Tables) {
          this.createTable(
            tx,
            schema.Tables[name as keyof typeof schema.Tables] as any,
            name,
          );
        }
      });
    }
  }

  dropDatabase() {
    return new Promise((resolve, reject) => {
      SQLite.deleteDatabase(database_name as any)
        .then(() => {
          (SQLite as any).openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
          );
        })
        .then(() => {
          resolve(1);
        })
        .catch((err) => {
          reject(err);
        });
    }).catch((error) => {
      console.log('error dropping database', error);
    });
  }

  dropTable(tx: SQLite.Transaction, tableName: string) {
    let sql = `DROP TABLE IF EXISTS ${tableName} `;

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

  
  createTable(tx: SQLite.Transaction, table: any[], tableName: string) {
    
    let sql = `CREATE TABLE IF NOT EXISTS ${tableName} `;
    const createColumns = [];

    for (const key in table) {
      createColumns.push(
        `${key} ${table[key].type.type} ${
          table[key].primary_key ? 'PRIMARY KEY NOT NULL' : ''
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
