const { runQuery } = require("../db/index");

const loginUser = async (body) => {
  const inactiveUser = await runQuery(
    `select id from users where (username = '${body.username}' and password = '${body.password}' and status = false)`
  );

  if (inactiveUser.length) {
    return {
      success: false,
      error: "Your account is locked. Contact higher-ups",
    };
  }

  const rows = await runQuery(
    `select id from users where (username = '${body.username}' and password = '${body.password}' and status = true)`
  );

  if (!rows.length) {
    return { success: false, error: "Invalid Credentials" };
  }

  return { success: true, data: { id: rows[0].id } };
};

const getUserData = async (id) => {
  const rows = await runQuery(`select * from user_accounts where (id = ${id})`);
  console.log("rows", rows);

  return { success: true, data: rows[0] };
};

module.exports = { loginUser, getUserData };
