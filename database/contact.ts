import * as SQLite from "expo-sqlite";

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

export { addContact, deleteContact, getAllContacts, getContact, updateContact };
