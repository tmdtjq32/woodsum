const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

//Provider : Read의 비즈니스 로직 처리

exports.getLineUp = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await userDao.getLineUpLists(connection);
    connection.release();

    return result;
};
