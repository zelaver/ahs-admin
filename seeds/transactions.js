const fs = require("fs");

const prices = {
  1: 20000,
  2: 18000,
  3: 25000,
  4: 15000,
  5: 30000,
};

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[random(0, arr.length - 1)];
}

function formatDate(date) {
  const pad = (n) => n.toString().padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
}

const rows = [];

rows.push(
  "id,date,orderList,customerId,ongkir,status,total_price"
);

const start = new Date("2026-01-01T08:00:00");

for (let id = 1; id <= 500; id++) {
  const date = new Date(
    start.getTime() + random(0, 180 * 24 * 60 * 60 * 1000)
  );

  const order = [];
  let total = 0;
  let hasItem = false;

  for (let productid = 1; productid <= 5; productid++) {
    let sum;

    switch (productid) {
      case 1:
        sum = random(0, 5);
        break;
      case 2:
        sum = random(0, 4);
        break;
      case 3:
        sum = random(0, 3);
        break;
      case 4:
        sum = random(0, 2);
        break;
      default:
        sum = random(0, 2);
    }

    if (sum > 0) {
      hasItem = true;
      total += sum * prices[productid];
    }

    order.push({
      productid,
      sum,
    });
  }

  if (!hasItem) {
    order[0].sum = 1;
    total += prices[1];
  }

  const customerId = random(1, 50);
  const ongkir = pick([1000, 2000, 3000, 5000]);
  const status = Math.random() < 0.85 ? "lunas" : "hutang";

  const orderJson = JSON.stringify(order).replace(/"/g, '""');

  rows.push(
    [
      id,
      formatDate(date),
      `"${orderJson}"`,
      customerId,
      ongkir,
      status,
      total,
    ].join(",")
  );
}

fs.writeFileSync("seeds/transactions_seed_500.csv", rows.join("\n"));

console.log("✅ Berhasil membuat transactions_seed_500.csv");