import * as SQLite from "expo-sqlite";

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
  date,
}: any) => {
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
    useNewConnection: true,
  });
  try {
    const result = await db.runAsync(
      `
      insert into history (saldo, stock_aqua, stock_galon_kosong, stock_gas_12kg, stock_gas_kosong, stock_isi_ulang, transactionId, note, date)
      values(?,?,?,?,?,?,?,?,?)
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
        date,
      ]
    );
    return result;
  } catch (e) {
    if (e instanceof Error) {
      console.log(e);
    }
  }
};

export { addHistory, getHistory };
