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
      note TEXT
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
      values(0,0,0,0,0,0,null, "first  init");
      `
    );
    return result;
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
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
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
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
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
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
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

const getContact = async (id: number) => {
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
    useNewConnection: true,
  });
  try {
    const result = await db.getFirstAsync(`select * from customers where id = ?`, id);
    // console.log(result[0])
    return result;
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }
};

const deleteContact = async (id: number) => {
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
    useNewConnection: true,
  });
  try {
    const result = await db.execAsync(
      `
      DELETE FROM customers WHERE id = ${id};
      DELETE FROM transactions WHERE customerId = ${id};
      `
    );
    // console.log(result[0])
    // console.log("masuk");
    return result;
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }
};

const getHistory = async () => {
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
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
  note,
}: any) => {
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
    useNewConnection: true,
  });
  try {
    const result = await db.runAsync(
      `
      insert into history (saldo, stock_aqua, stock_galon_kosong, stock_gas_12kg, stock_gas_kosong, stock_isi_ulang, transactionId, note)
      values(?,?,?,?,?,?,?,?)
      `,
      [
        saldo,
        stock_aqua,
        stock_galon_kosong,
        stock_gas_12kg,
        stock_gas_kosong,
        stock_isi_ulang,
        transactionId,
        note,
      ]
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
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
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
  ongkir: number;
  date: string;
};

const addTransaction = async ({
  orderList,
  customerId,
  status,
  ongkir,
  total_price,
  date,
}: Transaction) => {
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
    useNewConnection: true,
  });
  try {
    const result = await db.runAsync(
      `
      insert into transactions (date, orderList, customerId, status,ongkir, total_price)
      values(?,?,?,?,?,?)
      `,
      [date, JSON.stringify(orderList), customerId, status, ongkir, total_price]
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
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
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

const updateTransaction = async (
  { orderList, customerId, status, total_price, date, ongkir }: Transaction,
  id: number
) => {
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
    useNewConnection: true,
  });
  try {
    // orderList
    // customerId
    // status
    // total_price
    const result = await db.runAsync(
      `
      UPDATE transactions 
      SET orderList = ?, customerId = ?, status = ?, total_price = ?, date = ?, ongkir = ?
      WHERE id = ?;
      `,
      [JSON.stringify(orderList), customerId, status, total_price, date, ongkir, id]
      // delete from transactions where id = 'trans001'
    );
    return result;
  } catch (e) {
    if (e instanceof Error) {
      console.log("error di backend", e);
    }
  }
};

const deleteTransaction = async (id: number) => {
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
    useNewConnection: true,
  });
  try {
    // orderList
    // customerId
    // status
    // total_price
    const result = await db.runAsync(
      `
      delete from transactions where id = ?
      `,
      [id]
      // delete from transactions where id = 'trans001'
    );
    return result;
  } catch (e) {
    if (e instanceof Error) {
      console.log("error di backend", e);
    }
  }
};

const updateProductPrice = async (id: number, price: number, subs_price: number) => {
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
    useNewConnection: true,
  });
  try {
    const result = await db.runAsync(
      `
      UPDATE products 
      SET price = ?, subs_price = ?
      WHERE id = ?;
      `,
      [price, subs_price, id]
    );

    return true;
  } catch (e) {
    if (e instanceof Error) {
      return e;
    }
  }
};

export {
  initDB,
  initHistory,
  addContact,
  getAllContacts,
  updateContact,
  deleteContact,
  getContact,
  getHistory,
  addHistory,
  getProducts,
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  updateProductPrice,
};
