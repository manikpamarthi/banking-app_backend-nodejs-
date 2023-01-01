const { runQuery } = require("../db/index");

const deactiveUser = async (body) => {
  const rows = await runQuery(
    `select * from users where (password = '${body.password}' and id = ${body.id})`
  );

  if (!rows.length) {
    return { success: false, error: "Incorrect Password" };
  }

  await runQuery(
    `update users set status = false where (password = '${body.password}' and id = ${body.id})`
  );

  return true;
};

module.exports = { deactiveUser };
