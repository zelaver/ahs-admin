import * as SQLite from "expo-sqlite";

const initDB = async () => {
  const db = await SQLite.openDatabaseAsync("ahs-admin", {
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
      id TEXT PRIMARY KEY, 
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      orderList TEXT NOT NULL, 
      customerId TEXT, 
      status TEXT CHECK(status IN ('hutang', 'pinjam', 'lunas')) NOT NULL, 
      total_price DECIMAL(10, 2) NOT NULL, 
      FOREIGN KEY (customerId) REFERENCES customers(id)
    );
    CREATE TABLE IF NOT EXISTS history (
      id TEXT PRIMARY KEY,
      transactionId TEXT,
      stock_aqua INTEGER,
      stock_isi_ulang INTEGER,
      stock_galon_kosong INTEGER,
      stock_gas_12kg INTEGER,
      stock_gas_kosong INTEGER,
      saldo INTEGER,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (transactionId) REFERENCES transactions(id)
    );
  `);
};

const getQuery = async () => {
  const db = await SQLite.openDatabaseAsync("ahs-admin", {
    useNewConnection: true,
  });

  try {
    const result: any = await db.getAllAsync("SELECT * FROM customers;");
    console.log(JSON.stringify(result, 0, 2));
    // console.log(typeof JSON.parse(result[0].orderList)[0].productId);
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }
};

const getAllTables = async () => {
  const db = await SQLite.openDatabaseAsync("ahs-admin", {
    useNewConnection: true,
  });

  try {
    const result: any = await db.getAllAsync("SELECT name FROM sqlite_master WHERE type='table'; ");
    console.log(result);
    // console.log(JSON.stringify(result, 0, 2));
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }
};

const execQuery = async () => {
  const db = await SQLite.openDatabaseAsync("ahs-admin", {
    useNewConnection: true,
  });
  // console.log(query)

  try {
    const result = await db.getAllAsync(
      //   INSERT INTO transactions (id, orderList, customerId, status, total_price)
      //   VALUES (
      // 'trans001',
      // '[{"productId": 1, "quantity": 3}, {"productId": 2, "quantity": 1}]',
      // 'cust001',
      // 'lunas',
      // 50000.00);
      `
      drop table if exists customers
      `
      // delete from customers where name = 'sigma skibid'
    );
    console.log(result);
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }
};

type contact = {
  name: string;
  address: string;
  phone: string;
  isSubscriber: number;
};

const addContact = async ({ name, address, phone, isSubscriber }: contact) => {
  const db = await SQLite.openDatabaseAsync("ahs-admin", {
    useNewConnection: true,
  });
  try {
    const result = await db.runAsync(
      `
      insert into customers (name, address, phone, isSubscriber) 
      values(?, ?, ?, ?);
      `,
      [name, address, phone, isSubscriber]
      // delete from transactions where id = 'trans001'
    );
    return result;
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }
};

const getAllContacts = async () => {
  const db = await SQLite.openDatabaseAsync("ahs-admin", {
    useNewConnection: true,
  });
  try {
    const result = await db.getAllAsync(`select * from customers`);
    // console.log(result[0])
    return result
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }

};

export { initDB, getQuery, getAllTables, execQuery, addContact , getAllContacts};
