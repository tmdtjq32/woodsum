const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./productDao");

//Provider : Read의 비즈니스 로직 처리

exports.checkProduct = async function (idx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const [result] = await userDao.getProductById(connection, idx);
    connection.release();

    return result;
};

exports.productInfo = async function (idx, lang) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await userDao.getProductInfo(connection, idx, lang);
    connection.release();

    return result;
};

exports.categoryLists = async function (type, page) {
    const connection = await pool.getConnection(async (conn) => conn);
    if (type === 'VR') {
        const result = await userDao.getVRlists(connection, page);
        connection.release();
        return result;
    }
    else if (type === 'media') {
        const result = await userDao.getMedialists(connection, page);
        connection.release();
        return result;
    }
    else if (type === 'picture') {
        const result = await userDao.getPicturelists(connection, page);
        connection.release();
        return result;
    }
};
