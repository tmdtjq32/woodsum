const {pool} = require('../../../config/database');
const {logger} = require("../../../config/winston");
const productDao = require('./productDao');

//제품 조회
exports.retrieveProductList = async function(){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const result = await productDao.selectProduct(connection);
      connection.release();
    
      return result;
    }catch(err){
      logger.error(`retrieveProductList transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`retrieveProductList transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

//제품 상세 조회
exports.retrieveProductRelatedVideoList = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const result = await productDao.selectProductRelatedVideo(connection, params);
      connection.release();

      return result;
    }catch(err){
      logger.error(`retrieveProductRelatedVideoList transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`retrieveProductRelatedVideoList transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.retrieveProductRelatedImgList = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const result = await productDao.selectProductRelatedImg(connection, params);
      connection.release();

      return result;
    }catch(err){
      logger.error(`retrieveProductRelatedImgList transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`retrieveProductRelatedImgList transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.retrieveValidProductId = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const result = await productDao.selectValidProductId(connection, params);
      connection.release();

      return result;
    }catch(err){
      logger.error(`retrieveValidProductId transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`retrieveValidProductId transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.retrieveProductMenualVrList = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const result = await productDao.selectProductMenualVr(connection, params);
      connection.release();

      return result;
    }catch(err){
      logger.error(`retrieveProductMenualVrList transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`retrieveProductMenualVrList transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.isValidProductId = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const result = await productDao.selectValidProductId(connection, params);
      connection.release();

      return result;
    }catch(err){
      logger.error(`isValidProductId transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`isValidProductId transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}


//----------------------상품 수정 관련----------------------
exports.getOriginalRelatedVideoLength =async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const result = await productDao.selectOriginalRelatedVideoLength(connection, params);
      connection.release();
      return result;
    }catch(err){
      connection.release();
      logger.error(`getOriginalRelatedVideoLength transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`getOriginalRelatedVideoLength transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.getOriginalRelatedImageLength = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const result = await productDao.selectOriginalRelatedImageLength(connection, params);
      connection.release();
      return result;
    }catch(err){
      connection.release();
      logger.error(`getOriginalRelatedImageLength transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`getOriginalRelatedImageLength transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.deleteExistRelatedVideo = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const result = await productDao.deleteExistRelatedVideo(connection, params);
      connection.release();
      return result;
    }catch(err){
      connection.release();
      logger.error(`deleteExistRelatedVideo transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`deleteExistRelatedVideo transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.getExistRelatedVideoId = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const result = await productDao.getExistRelatedVideoId(connection, params);
      connection.release();
      return result;
    }catch(err){
      connection.release();
      logger.error(`getExistRelatedVideoId transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`getExistRelatedVideoId transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}

exports.getExistRelatedImageId = async function(params){
  try{
    const connection = await pool.getConnection(async conn => conn);
    try{
      const result = await productDao.getExistRelatedImageId(connection, params);
      connection.release();
      return result;
    }catch(err){
      connection.release();
      logger.error(`getExistRelatedImageId transaction Query error\n: ${JSON.stringify(err)}`);
      return false;
    }
  }catch(err){
    logger.error(`getExistRelatedImageId transaction DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
}