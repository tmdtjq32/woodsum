const {pool} = require("../../../config/database");
const lineUpDao = require("./lineUpDao");
const {logger} = require("../../../config/winston");

//라인업 조회
exports.retrieveLineUpList = async function(){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const result = await lineUpDao.selectLineUpList(connection);
      connection.release();

      return result;
    }catch(err){
      logger.error(`retrieveLineUpList transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }
  catch(err){
    logger.error(`retrieveLineUpList transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

//유효한 라인업 id인지
exports.retrieveValidLineUpId = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const result = await lineUpDao.selectValidLineUpId(connection, params);
      connection.release();

      return result;
    }catch(err){
      logger.error(`retrieveValidLineUpId transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`retrieveValidLineUpId transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}