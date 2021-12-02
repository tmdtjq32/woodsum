const {pool} = require("../../../config/database");
const {logger} = require("../../../config/winston");
const contentDao = require("./contentDao");

exports.retrieveCategoryVrOrVideoList = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const result = await contentDao.selectCategoryVrOrVideo(connection, params);
      connection.release();
      return result;
    }catch(err){
      logger.error(`retrieveCategoryVrList transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`retrieveCategoryVrList transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.retrieveCategoryImageList = async function(){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const result = await contentDao.selectCategoryImage(connection);
      connection.release();
      return result;
    }catch(err){
      logger.error(`retrieveCategoryImageList transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`retrieveCategoryImageList transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.isValidCategoryMediaId = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const result = await contentDao.isValidCategoryMediaId(connection, params);
      connection.release();
      return result;
    }catch(err){
      logger.error(`isValidCategoryMediaId transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`isValidCategoryMediaId transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.isValidCategoryImageId = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const result = await contentDao.isValidCategoryImageId(connection, params);
      connection.release();
      return result;
    }catch(err){
      logger.error(`isValidCategoryImageId transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`isValidCategoryImageId transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.getCategoryMediaDetail = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const result = await contentDao.selectCategoryMediaDetail(connection, params);
      connection.release();
      return result;
    }catch(err){
      logger.error(`getCategoryMediaDetail transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`getCategoryMediaDetail transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.getCategoryImageDetail = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const result = await contentDao.selectCategoryImageDetail(connection, params);
      connection.release();
      return result;
    }catch(err){
      logger.error(`getCategoryImageDetails transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`getCategoryImageDetails transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}