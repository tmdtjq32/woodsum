const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

exports.test = async function (req, res) {
    return res.send('test Server!');
};

exports.home = async function (req, res) {
    const lang = req.query.language;
    if (!lang) {
        return res.send(errResponse(baseResponse.LANG_TYPE_NONE));
    }
    const result = await userProvider.getLineUp(lang);

    if (lang === 'ko') {
        for (let i = 0; i < result.length; i++) {
            delete result[i].nameEng;
        }
    }
    else if (lang === 'en') {
        for (let i = 0; i < result.length; i++) {
            result[i].name = result[i].nameEng;
            delete result[i].nameEng;
        }
    }
    else {
        return res.send(errResponse(baseResponse.LANG_TYPE_FAIL));
    }

    return res.send(response(baseResponse.SUCCESS, { 'lineUp': result }));
};

/** JWT 토큰 검증 API
 * [GET] app/users/check
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userInfo;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
