import * as SQLite from "expo-sqlite";

const getQuery = async () => {
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
    useNewConnection: true,
  });

  try {
    const result: any = await db.getAllAsync("SELECT * FROM history;");
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }
};

const execQuery = async () => {
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
    useNewConnection: true,
  });
  try {
    const result = await db.execAsync(
      `
      ALTER TABLE history
      ADD COLUMN note TEXT;
      `
    );
    console.log(result);
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }
};

const getAllTables = async () => {
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
    useNewConnection: true,
  });

  try {
    const result: any = await db.getAllAsync("SELECT name FROM sqlite_master WHERE type='table'; ");
    console.log(result);
    // console.log(JSON.stringify(result, 0, 2));
    // return result
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }
};

export { getAllTables, execQuery, getQuery };
