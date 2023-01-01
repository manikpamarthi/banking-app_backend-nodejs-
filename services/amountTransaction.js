require("dotenv").config();
const { pool, runQuery } = require("../db/index");
const { getOffset } = require("../db/helper");
const config = require("../db/config");

const doTransaction = async (body) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const { rows: amountInSendersAccount } = await client.query(
      `select amount from user_accounts where id = ${body.sender_id}`
    );

    const { rows: amountInReceiversAccount } = await client.query(
      `select amount from user_accounts where id = ${body.receiver_id}`
    );

    const { rows: sendersName } = await client.query(
      `select name from user_accounts where id = ${body.sender_id}`
    );

    const { rows: receiverName } = await client.query(
      `select name from user_accounts where id = ${body.receiver_id}`
    );

    if (body.amount > amountInSendersAccount[0].amount) {
      await client.query("ROLLBACK");
      return {
        success: false,
        error: "Amount sholud be less than your current balance",
      };
    }

    if (!amountInReceiversAccount.length) {
      await client.query("ROLLBACK");
      return { success: false, error: "Inavlid Receiver" };
    }

    await client.query(
      `update user_accounts set amount = ${
        parseInt(amountInSendersAccount[0].amount) - parseInt(body.amount)
      } where id = ${body.sender_id}`
    );

    await client.query(
      `update user_accounts set amount = ${
        parseInt(amountInReceiversAccount[0].amount) + parseInt(body.amount)
      } where id = ${body.receiver_id}`
    );

    const { rows: transaction_id } = await client.query(
      `insert into transactions (id, receiver_id, receiver_name, sender_id, sender_name, amount, time) values (default, ${
        body.receiver_id
      }, '${receiverName[0].name}', ${body.sender_id}, '${
        sendersName[0].name
      }', ${body.amount}, '${new Date().toISOString()}') returning id`
    );

    await client.query("COMMIT");

    return { id: transaction_id[0].id };
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Error while creating transcations", e);
    throw e;
  } finally {
    client.release();
  }
};

const getTransactions = async (query) => {
  const offset = getOffset(query.page, config.listPerPage);

  if (!query.id) {
    return { success: false, error: "ID not found" };
  }

  try {
    const dbQuery = `select * from transactions where (sender_id = ${query.id} or receiver_id = ${query.id}) order by time desc OFFSET ${offset} LIMIT ${config.listPerPage}`;

    const rows = await runQuery(dbQuery);

    return { success: true, data: rows || [] };
  } catch (e) {
    console.error("Error while grtting transcations", e);
    throw e;
  }
};

module.exports = { doTransaction, getTransactions };
