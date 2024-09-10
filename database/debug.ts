import * as SQLite from "expo-sqlite";

const getQuery = async () => {
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
    useNewConnection: true,
  });

  try {
    const result: any = await db.getAllAsync("SELECT * FROM transactions;");
    console.log(JSON.stringify(result, null, 2));
    // console.log(result.length)
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
      delete from transactions
      `,
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
