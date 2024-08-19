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
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      orderList TEXT NOT NULL, 
      customerId INTEGER, 
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
    // const result: any = await db.getAllAsync("SELECT * FROM transactions;");
    const result: any = await db.getAllAsync("SELECT * FROM history;");
    console.log(JSON.stringify(result, null, 2));
    // console.log(result[result.length - 1])
    // console.log(typeof JSON.parse(result[0].orderList)[0].productId);
    // return result
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
    const orderListJson = JSON.stringify([
      { productid: 1, sum: 3 },
      { productid: 2, sum: 5 },
    ]);

    const customerId = 123; // contoh nilai customerId
    const status = "lunas"; // contoh nilai status
    const total_price = 100; // contoh nilai total_price
    const result = await db.getAllAsync(
      `
      insert into transactions (orderList, customerId, status, total_price)
      values(?, ?, ?, ?)
      `,
      [orderListJson, customerId, status, total_price]
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
  id?: number;
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

const updateContact = async ({ name, address, phone, isSubscriber }: contact, id: number) => {
  const db = await SQLite.openDatabaseAsync("ahs-admin", {
    useNewConnection: true,
  });
  try {
    const result = await db.runAsync(
      `
      UPDATE customers 
      SET name = ?, address = ?, phone = ?, isSubscriber = ? 
      WHERE id = ?;
      `,
      [name, address, phone, isSubscriber, id]
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
    return result;
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }
};

const deleteContact = async (id: number) => {
  const db = await SQLite.openDatabaseAsync("ahs-admin", {
    useNewConnection: true,
  });
  try {
    const result = await db.runAsync("DELETE FROM customers WHERE id = $id", { $id: id });
    // console.log(result[0])
    return result;
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }
};

const getHistory = async () => {
  const db = await SQLite.openDatabaseAsync("ahs-admin", {
    useNewConnection: true,
  });
  try {
    const result = await db.getAllAsync(`select * from history`);
    // console.log(result[0])
    return result;
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }
};

const addHistory = async ({
  saldo,
  stock_aqua,
  stock_galon_kosong,
  stock_gas_12kg,
  stock_gas_kosong,
  stock_isi_ulang,
  transactionId,
}: any) => {
  const db = await SQLite.openDatabaseAsync("ahs-admin", {
    useNewConnection: true,
  });
  try {
    const result = await db.runAsync(
      `
      insert into history (saldo, stock_aqua, stock_galon_kosong, stock_gas_12kg, stock_gas_kosong, stock_isi_ulang, transactionId)
      values(?,?,?,?,?,?,?)
      `,
      [
        saldo,
        stock_aqua,
        stock_galon_kosong,
        stock_gas_12kg,
        stock_gas_kosong,
        stock_isi_ulang,
        transactionId,
      ]
      // delete from transactions where id = 'trans001'
    );
    return result;
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }
};

type products = {
  id: number;
  name: string;
  price: number;
  subs_price: number;
};

const getProducts = async (): Promise<products[] | undefined> => {
  const db = await SQLite.openDatabaseAsync("ahs-admin", {
    useNewConnection: true,
  });
  try {
    const result: products[] = await db.getAllAsync(`select * from products`);
    // console.log(result[0])
    return result;
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }
};

type orderList = {
  productid: number;
  sum: number;
};

type Transaction = {
  orderList: orderList[];
  customerId: number;
  status: string;
  total_price: number;
};

const addTransaction = async ({ orderList, customerId, status, total_price }: Transaction) => {
  const db = await SQLite.openDatabaseAsync("ahs-admin", {
    useNewConnection: true,
  });
  try {
    const result = await db.runAsync(
      `
      insert into transactions (orderList, customerId, status, total_price)
      values(?,?,?,?)
      `,
      [JSON.stringify(orderList), customerId, status, total_price]
      // delete from transactions where id = 'trans001'
    );
    return result;
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }
};

const getTransactions = async () => {
  const db = await SQLite.openDatabaseAsync("ahs-admin", {
    useNewConnection: true,
  });
  try {
    const result: any[] = await db.getAllAsync(`select * from transactions`);
    // console.log(result[0])
    return result;
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }
};

export {
  initDB,
  getQuery,
  getAllTables,
  execQuery,
  addContact,
  getAllContacts,
  updateContact,
  deleteContact,
  getHistory,
  addHistory,
  getProducts,
  addTransaction,
  getTransactions,
};
