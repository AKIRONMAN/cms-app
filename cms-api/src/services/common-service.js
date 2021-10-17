const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _ = {
    forEach: require('lodash/forEach'),
    cloneDeep: require('lodash/cloneDeep'),
    compact: require('lodash/compact'),
    map: require('lodash/map'),
    merge: require('lodash/merge'),
    assign: require('lodash/assign'),
    find: require('lodash/find')
};
const crypto = require("crypto-js");
const SECRET_KEY = 'qBZ0rexLKPg321fvAqYRqD7LhRpLOIO'; // After dot
const BOT_USER = 9999999999;
const ID_SEPARATOR = 'log-ged-in-user';


const sendError = (customMessage, next, server = null) => {
    let serverMessage = null;
    if (server && (server.message || server.msg)) {
        serverMessage = server.message || server.msg;
    }
    const error = new Error(JSON.stringify(
        {
            server: serverMessage,
            custom: customMessage
        }));
    next(error);
}

const sendResponse = (res, object, extraObj) => {
    let sendObj = {
        status: 200,
        data: object
    };
    if(extraObj && Object.keys(extraObj).length > 0){
        sendObj = _.merge(sendObj, extraObj);
    }
    res.status(200).send(sendObj);
}

const checkRequest = (req, arrayOfAttr) => {
    if (req && req.body && arrayOfAttr) {
        let value = {isProper: true};
        _.forEach(_.cloneDeep(arrayOfAttr), (attr) => {
            if (!req.body[attr] || req.body[attr] == '') {
                value = {isProper: false, attr: attr};
            }
        });
        return value;
    }
    return false;
}

const checkNotNull = (req, arrayOfAttr) => {
    if (req && req.body && arrayOfAttr) {
        let value = {isNotNull: true};
        _.find(_.cloneDeep(arrayOfAttr), (attr) => {
            if (!req.body[attr] || req.body[attr] == '' || req.body[attr] == null) {
                value = {isNotNull: false, attr: attr};
                return true;
            }
        });
        return value;
    }
    return false;
}


const getEncryptedMessage = (text) => {
    return Buffer.from(text).toString('base64')
}

const getDecryptedMessage = (encodedText) => {
    return Buffer.from(encodedText, 'base64').toString()
}

const getEncryptedMessageByCrypto = (text) => {
    return crypto.AES.encrypt(text, SECRET_KEY).toString();
}

const getDecryptedMessageByCrypto = (encodedText) => {
    const bytes = crypto.AES.decrypt(encodedText, SECRET_KEY);
    return bytes.toString(crypto.enc.Utf8);
}

const getCurrentUserId = (req) => {
    return req && req.loggedInUserId;
}

const getSearchableQuery = (object, include, directFilterFields = []) => {
    const directAppliedFilters = directFilterFields || [];
    let termObject = {};
    if(object.term){
        _.forEach(object.term.fieldNames, (fieldName) => {
            termObject[fieldName] = {
                [Op.like]: `%${object.term.value}%`
            }
        });
        termObject = {[Op.or]: {...termObject}};
    }
    const filterObject = {
        where: {
            ...termObject
        }
    };
    if(object.pagination){
        filterObject.limit = object.pagination.limit || 100;
        filterObject.offset = object.pagination.offset || 0
    }
    if(!!include){
        filterObject.include = include;
    }

    _.forEach(directAppliedFilters, (filter) => {
            filterObject.where[filter] = object[filter];
    });
    return filterObject;


}


module.exports = {
    sendError: sendError,
    sendResponse: sendResponse,
    checkRequest: checkRequest,
    checkNotNull: checkNotNull,
    getEncryptedMessage: getEncryptedMessage,
    getDecryptedMessage: getDecryptedMessage,
    getEncryptedMessageByCrypto: getEncryptedMessageByCrypto,
    getDecryptedMessageByCrypto: getDecryptedMessageByCrypto,
    getCurrentUserId: getCurrentUserId,
    getSearchableQuery: getSearchableQuery
};
