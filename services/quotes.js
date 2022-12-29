const db = require("../db/index");
const config = require("../db/config");
const { getOffset, emptyRows } = require("../db/helper");

const validateCreate = (body) => {
  let messages = [];

  if (!body) {
    messages.push("No Object is provided");
  }

  if (!body.id) {
    messages.push("id not provided");
  }

  if (!body.name) {
    messages.push("name not provided");
  }

  if (!body.username) {
    messages.push("username not provided");
  }

  if (messages.length) {
    const error = new Error(messages.join());
    error.statusCode = 400;

    throw error;
  }
};

const getData = async (page = 1) => {
  const offset = getOffset(page, config.listPerPage);

  const rows = await db.runQuery(
    "SELECT id, name, username, created_at FROM users OFFSET $1 LIMIT $2",
    [offset, config.listPerPage]
  );

  const data = emptyRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
};

const createData = async (body) => {
  validateCreate(body);

  const query = `INSERT into users (id, name, username, password, created_at) values (${
    body.id
  }, '${body.name}', '${body.username}', '${
    body.password
  }', '${new Date().toISOString()}') returning *`;

  const result = await db.runQuery(query);

  let message = "Error while creating user";

  if (result.length) {
    message = "User Created succesfully";
  }

  return { message };
};

module.exports = { getData, createData };
