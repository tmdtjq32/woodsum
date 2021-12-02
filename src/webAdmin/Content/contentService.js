const {pool} = require("../../../config/database");
const {logger} = require("../../../config/winston");
const contentDao = require("./contentDao");

exports.uploadCategoryVrOrVideo = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      await connection.beginTransaction();
      const result = await contentDao.createCategoryVrOrVideo(connection, params);
      await connection.commit();
      connection.release();
      return result;
    }catch(err){
      await connection.rollback();
      connection.release();
      logger.error(`uploadCategoryVrOrVideo transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`uploadCategoryVrOrVideo transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.uploadCategoryImage = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      await connection.beginTransaction();
      const result = await contentDao.createCategoryImage(connection, params);
      await connection.commit();
      connection.release();
      return result;
    }catch(err){
      await connection.rollback();
      connection.release();
      logger.error(`uploadCategoryImage transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`uploadCategoryImage transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.updateCategoryMedia = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      await connection.beginTransaction();
      const result = await contentDao.updateCategoryMedia(connection, params);
      await connection.commit();
      connection.release();
      return result;
    }catch(err){
      await connection.rollback();
      connection.release();
      logger.error(`updateCategoryMedia transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`updateCategoryMedia transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.updateCategoryImage = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      await connection.beginTransaction();
      const result = await contentDao.updateCategoryImage(connection, params);
      await connection.commit();
      connection.release();
      return result;
    }catch(err){
      await connection.rollback();
      connection.release();
      logger.error(`updateCategoryImage transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`updateCategoryImage transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.deleteCategoryMedia = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      await connection.beginTransaction();
      const result = await contentDao.deleteCategoryMedia(connection, params);
      await connection.commit();
      connection.release();
      return result;
    }catch(err){
      await connection.rollback();
      connection.release();
      logger.error(`deleteCategoryMedia transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`deleteCategoryMedia transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.deleteCategoryImage = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      await connection.beginTransaction();
      const result = await contentDao.deleteCategoryImage(connection, params);
      await connection.commit();
      connection.release();
      return result;
    }catch(err){
      await connection.rollback();
      connection.release();
      logger.error(`deleteCategoryImage transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`deleteCategoryImage transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}