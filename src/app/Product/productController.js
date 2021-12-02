const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/Product/productProvider");
const userService = require("../../app/Product/productService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

exports.product = async function (req, res) {
    const idx = req.params.idx;
    const lang = req.query.language;

    if (!lang) {
        return res.send(errResponse(baseResponse.LANG_TYPE_NONE));
    }

    if (lang !== 'ko' && lang !== 'en') {
        return res.send(errResponse(baseResponse.LANG_TYPE_FAIL));
    }

    if (!idx) {
        return res.send(errResponse(baseResponse.IDX_NONE));
    }

    const result = await userProvider.checkProduct(idx);

    if (!result) {
        return res.send(errResponse(baseResponse.PRODUCT_NONE));
    }

    if (result.status === 'D') {
        return res.send(errResponse(baseResponse.PRODUCT_DEL));
    }

    if (lang === 'ko') {
        delete result.nameEng;
        delete result.snsTagEng;
    }
    else if (lang === 'en') {
        result.name = result.nameEng;
        result.snsTag = result.snsTagEng;
        delete result.nameEng;
        delete result.snsTagEng;
    }

    const body = await userProvider.productInfo(idx, lang);

    result.assemblingMedia = body.assemblingMedia;
    result.VRMedia = body.VRMedia;
    result.relatedMediaLists = body.relatedMediaLists;
    result.relatedPictureLists = body.relatedPictureLists;

    return res.send(response(baseResponse.SUCCESS, result));
};

exports.category = async function (req, res) {
    const lang = req.query.language;
    const type = req.query.type;
    const page = req.query.page;

    if (!lang) {
        return res.send(errResponse(baseResponse.LANG_TYPE_NONE));
    }

    if (lang !== 'ko' && lang !== 'en') {
        return res.send(errResponse(baseResponse.LANG_TYPE_FAIL));
    }

    if (!type) {
        return res.send(errResponse(baseResponse.CATEGORY_TYPE_NONE));
    }

    if (!(type === 'VR' || type === 'media' || type === 'picture')) {
        return res.send(errResponse(baseResponse.CATEGORY_TYPE_FAIL));
    }

    if (!page) {
        return res.send(errResponse(baseResponse.CATEGORY_PAGE_NONE));
    }

    const result = await userProvider.categoryLists(type, page * 20);

    if (result.length == 0) {
        return res.send(errResponse(baseResponse.CATEGORY_PAGE_FAIL));
    }

    if (lang === 'ko') {
        for (let i = 0; i < result.length; i++) {
            delete result[i].nameEng;
            delete result[i].contentEng;
        }
    }
    else if (lang === 'en') {
        for (let i = 0; i < result.length; i++) {
            result[i].name = result[i].nameEng;
            result[i].content = result[i].contentEng;
            delete result[i].nameEng;
            delete result[i].contentEng;
        }
    }

    return res.send(response(baseResponse.SUCCESS, { 'lists': result }));
};



/** JWT 토큰 검증 API
 * [GET] app/users/check
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userInfo;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
