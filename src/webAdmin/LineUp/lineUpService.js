const {pool} = require("../../../config/database");
const lineUpDao = require("./lineUpDao");
const {logger} = require("../../../config/winston");

//라인업 생성
exports.uploadNewLineUp = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      await connection.beginTransaction();
      const result = await lineUpDao.createNewLineUp(connection, params);
      await connection.commit();
      connection.release();
      return result;
    }catch(err){
      await connection.rollback();
      connection.release();
      logger.error(`uploadNewLineUp transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }
  catch(err){
    logger.error(`uploadNewLineUp transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

//라인업 삭제
exports.deleteLineUp = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      await connection.beginTransaction();
      const result = await lineUpDao.deleteLineUp(connection, params);
      await connection.commit();
      connection.release();
      return result;
    }catch(err){
      await connection.rollback();
      connection.release();
      logger.error(`deleteLineUp transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }
  catch(err){
    logger.error(`deleteLineUp transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}