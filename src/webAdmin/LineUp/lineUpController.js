const lineUpProvider = require("../../webAdmin/LineUp/lineUpProvider");
const lineUpService = require("../../webAdmin/LineUp/lineUpService");
const baseResponse = require("../../../config/adminBaseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

//라인업 조회
//[GET] /admin/line-up
exports.getLineUp = async function(req, res){
  const {language} = req.query;
  if (language){
    if (language!=='ko' && language!=='en'){
      return res.send(errResponse(baseResponse.INVALID_LANGUAGE));
    }
  }

  const lineUpResultList = await lineUpProvider.retrieveLineUpList();
  
  if (!lineUpResultList){
    return res.send(errResponse(baseResponse.DB_ERROR));
  }

  if (lineUpResultList.length === 0){
    return res.send(errResponse(baseResponse.LINEUP_EMPTY));
  }

  let result = {};
  result.lineUp = [];
  lineUpResultList.forEach(lineup => {
    result.lineUp.push({
      'id': lineup.lineUpIdx,
      'name': (language === 'en') ? lineup.nameEng : lineup.name,
      'imgUrl':lineup.imgUrl,
      'siteUrl': lineup.siteUrl
    })
  })

  return res.send(response(baseResponse.SUCCESS, result));
}

//라인업 생성
//[POST] /admin/line-up
exports.uploadLineUp = async function(req, res){
  const {name, nameEng, imgUrl, siteUrl} = req.body;

  if (!name) return res.send(errResponse(baseResponse.EMPTY_LINEUP_NAME));
  else if (!nameEng) return res.send(errResponse(baseResponse.EMPTY_LINEUP_NAMEENG));
  else if (!imgUrl) return res.send(errResponse(baseResponse.EMPTY_LINEUP_IMG));
  else if (!siteUrl) return res.send(errResponse(baseResponse.EMPTY_LINEUP_SITE));

  if(name.length > 200) return res.send(errResponse(baseResponse.EXCEED_LINEUP_NAME));
  else if (nameEng.length > 200) return res.send(errResponse(baseResponse.EXCEED_LINEUP_NAMEENG));

  let params = [name, nameEng, imgUrl, siteUrl];

  const newLineUp = await lineUpService.uploadNewLineUp(params);
  
  if (newLineUp){
    return res.send(response(baseResponse.SUCCESS));
  }
  else{
    return res.send(errResponse(baseResponse.DB_ERROR));
  }
}

//라인업 삭제
//[DELETE] /admin/line-up/:id
exports.deleteLineUp = async function(req, res){
  const {id} = req.params;
  let params = [id];
  if (!id){
    return res.send(errResponse(baseResponse.EMPTY_LINEUP_ID));
  }

  const validId = await lineUpProvider.retrieveValidLineUpId(params);
  if (validId === false){
    return res.send(errResponse(baseResponse.DB_ERROR));
  }
  if (validId === 0){
    return res.send(errResponse(baseResponse.INVALD_LINEUP_ID));
  }

  const deleteLineUp = await lineUpService.deleteLineUp(params);
  
  if (deleteLineUp){
    return res.send(response(baseResponse.SUCCESS));
  }
  else{
    return res.send(errResponse(baseResponse.DB_ERROR));
  }
}