import * as SQLite from "expo-sqlite";

const initDB = async () => {
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
    useNewConnection: true,
  });

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name TEXT NOT NULL, 
      price DECIMAL(10, 2) NOT NULL, 
      subs_price DECIMAL(10, 2) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name TEXT NOT NULL, 
      address TEXT, 
      phone TEXT, 
      isSubscriber BOOLEAN NOT NULL
    );
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      orderList TEXT NOT NULL, 
      customerId INTEGER, 
      ongkir INTEGER, 
      status TEXT CHECK(status IN ('hutang', 'pinjam', 'lunas')) NOT NULL, 
      total_price DECIMAL(10, 2) NOT NULL, 
      FOREIGN KEY (customerId) REFERENCES customers(id)
    );
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transactionId INTEGER,
      stock_aqua INTEGER,
      stock_isi_ulang INTEGER,
      stock_galon_kosong INTEGER,
      stock_gas_12kg INTEGER,
      stock_gas_kosong INTEGER,
      saldo INTEGER,
      note TEXT,
      date TIMESTAMP DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (transactionId) REFERENCES transactions(id)
    );
    INSERT OR IGNORE INTO products (id, name, price, subs_price) VALUES 
      (1, 'Aqua', 20000, 18000),
      (3, 'Isi Ulang', 5000, 4500),
      (4, 'Gas 12 kg', 220000, 220000
    );
  `);
};

const initHistory = async () => {
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
    useNewConnection: true,
  });
  try {
    const result = await db.execAsync(
      `
      insert into history (saldo, stock_aqua, stock_galon_kosong, stock_gas_12kg, stock_gas_kosong, stock_isi_ulang, transactionId, note)
      values(0,0,0,0,0,0,null, "History pertama");
      `
    );
    return result;
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }
};

export { initDB, initHistory };
