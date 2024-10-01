import * as SQLite from "expo-sqlite";

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

const addTransaction = async ({ orderList, customerId, status, ongkir, total_price, date }: Transaction) => {
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

export {
  addTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
};
