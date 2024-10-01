import * as SQLite from "expo-sqlite";

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

export { getProducts, updateProductPrice };
