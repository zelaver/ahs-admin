import * as SQLite from "expo-sqlite";

export type HistoryDTO = {
  saldo: number;
  stock_aqua: number;
  stock_galon_kosong: number;
  stock_gas_12kg: number;
  stock_gas_kosong: number;
  stock_isi_ulang: number;
  transactionId?: number | null;
  note?: string | null;
  date?: string | Date | null;
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
  transactionId = null,
  note = null,
  date = null,
}: HistoryDTO) => {
  const db = await SQLite.openDatabaseAsync("ahs-admin.db", {
    useNewConnection: true,
  });
  try {
    const dateValue = date instanceof Date ? date.toISOString() : date;
    const query = `
      insert into history (saldo, stock_aqua, stock_galon_kosong, stock_gas_12kg, stock_gas_kosong, stock_isi_ulang, transactionId, note, date)
      values(?,?,?,?,?,?,?,?,?)
      `;
    console.log(query);
    const result = await db.runAsync(
      query,
      [
        saldo,
        stock_aqua,
        stock_galon_kosong,
        stock_gas_12kg,
        stock_gas_kosong,
        stock_isi_ulang,
        transactionId,
        note,
        dateValue,
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

