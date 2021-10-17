const User = require('../models/User');
const commonService = require('./../services/common-service');
const jwt = require("jsonwebtoken");

const config = require("../../config/config.json").development;
const moment = require('moment');
const SALT = 20;
const _ = {
    cloneDeep: require('lodash/cloneDeep')
}

const getUsers = (req, res, next) => {
    User.findAll()
        .then((users) => {
            commonService.sendResponse(res, users);
        }).catch((error) => {
        commonService.sendError('No users found in data base.', next, error);
    });
}

const getUsersByIds = (req, res, next) => {
    if (req.query.ids) {
        let userIds = req.query.ids;
        if (userIds && userIds.length > 0) {
            User.findAll({
                where: {
                    id: userIds
                }
            }).then((users) => {
                commonService.sendResponse(res, users);
            }).catch((error) => {
                commonService.sendError('No users found in data base.', next, error);
            });
        } else {
            commonService.sendError('Please provide at least one user id.', next);
        }
    } else {
        getUsers(req, res, next);
    }
}

const createUser = (req, res, next) => {
    const createdBy = commonService.getCurrentUserId(req);
    const request = commonService.checkRequest(req, ['firstName', 'lastName', 'phone', 'password']);
    if (typeof request == 'object') {
        if (request.isProper) {
            let userObject = req.body;
            userObject.createdBy = createdBy;
            const remark = userObject.remark;
            delete userObject.remark;
            new Promise((resolve, reject) => {
                try {
                    const round1 = commonService.getEncryptedMessage(userObject.password);
                    const round2 = commonService.getEncryptedMessageByCrypto(round1);
                    const round3 = commonService.getEncryptedMessage(round2);
                    resolve(round3);
                } catch (error) {
                    reject(error || 'Hashing is not working.');
                }
            })
                .then((password) => {
                    userObject.password = password;
                    return User.create(userObject);
                }).then((user) => {
                    const data = {createdBy: userObject.createdBy, userId: user.dataValues.id, remark: remark};
                })
                .then((user) => {
                    commonService.sendResponse(res, user);
                }).catch((error) => {
                commonService.sendError('Issue creating user please try again later.', next, error);
            });
        } else {
            commonService.sendError('Please provide ' + request.attr + ' field.', next);
        }
    } else {
        commonService.sendError('Please provide body to register user.', next);
    }
}
const updateUser = (req, res, next) => {
    const request = commonService.checkNotNull(req, ['firstName', 'lastName', 'email']);
    if (typeof request == 'object') {
        if (request.isNotNull) {
            const accessToken = req.headers.accesstoken;
            const userId = req.params.userId;
            const modifiedBy = commonService.getCurrentUserId(req);
            const userObject = req.body;
            userObject.modifiedBy = modifiedBy;
            const remark = userObject.remark;
            delete userObject.remark;

            User.findOne({
                where: {id: userId}
            })
                .then((user) => {
                    if (user) {
                        return user.update(userObject);
                    } else {
                        commonService.sendError('There is no user with id = ' + userId, next);
                    }
                })
                .then((updateResponse) => {
                    commonService.sendResponse(res, 'User updated successfully.');
                }).catch((error) => {
                commonService.sendError(error, next, error);
            });
        } else {
            commonService.sendError('you have provided this ' + request.attr + ' field as null.', next);
        }
    } else {
        commonService.sendError('Please provide body to update user.', next);
    }
}

const updateUserPassword = (req, res, next) => {
    if (!req.headers.accesstoken) {
        commonService.sendError('Please provide access token.', next);
        return;
    }
    const accessToken = req.headers.accesstoken;
    const parentUserId = commonService.getCurrentUserId(req);
    const userId = req.params.userId;
    const request = commonService.checkRequest(req, ['password']);

    if (typeof request == 'object') {
        if (request.isProper) {
            const userPassword = req.body.password;
            User.findOne({
                where: {id: userId}
            })
                .then(async (user) => {
                    if (user) {
                        let password = userPassword;
                        try {
                            const round1 = commonService.getEncryptedMessage(userPassword);
                            const round2 = commonService.getEncryptedMessageByCrypto(round1);
                            password = commonService.getEncryptedMessage(round2);
                        } catch (error) {
                            commonService.sendError('There is error to update password because of encyption.', next, error);
                            return;
                        }
                        return user.update({password: password, modifiedBy: parentUserId});
                    } else {
                        commonService.sendError('There is no user with id = ' + userId, next);
                    }
                })
                .then((updateResponse) => {
                    commonService.sendResponse(res, 'Password changed successfully.');
                }).catch((error) => {
                commonService.sendError(error, next, error);
            });
        } else {
            commonService.sendError('Please provide ' + request.attr + ' field.', next);
        }
    } else {
        commonService.sendError('Please provide password to update user password.', next);
    }
}

const loginUser = (req, res, next) => {
    const request = commonService.checkRequest(req, ['email', 'password']);
    if (typeof request == 'object') {
            User.findOne({
                where: {
                    email: req.body.email
                }
            }).then(user => {
                user = user.dataValues;
                    if (!user) {
                        return res.status(404).send({ message: "User Not found." });
                    }
                    let passwordIsValid = false;
                try {
                    const round1 = commonService.getDecryptedMessage(user.password);
                    const round2 = commonService.getDecryptedMessageByCrypto(round1);
                    const round3 = commonService.getDecryptedMessage(round2);
                    passwordIsValid = round3 === req.body.password;
                } catch (error) {
                    return res.status(401).send({ message: "Authentication failed." });
                }

                    if (!passwordIsValid) {
                        return res.status(401).send({
                            accessToken: null,
                            message: "Invalid Password!"
                        });
                    }

                    const token = jwt.sign({ id: user.id }, config.secret, {
                        expiresIn: 86400 // 24 hours
                    });
                    res.status(200).send({
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        phone: user.phone,
                        profile: user.userProfile,
                        accessToken: token
                    });
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                });

    } else {
        commonService.sendError('email or password is not valid.', next);
    }
}

const logOutUser = (req, res, next) => {
    const accessToken = req.headers.accesstoken;
    User.findOne({
        where: {accessToken: accessToken}
    })
        .then((user) => {
            return user.update({accessToken: null});
        }).then((user) => {
            commonService.sendResponse(res, {message: 'User Logged out successfully.'});
        })
        .catch((error) => {
            commonService.sendError('There is some error please try again.', next, error);
        })
};

const deleteUser = (req, res, next) => {
    const userId = req.params.userId;
    User.destroy({
        where: {id: userId}
    }).then((user) => {
            commonService.sendResponse(res, 'User deleted successfully.');
        })
        .catch((error) => {
            commonService.sendError('User can\'t deleted.', next, error);
        })
};

const search = (req, res, next) => {
    let currentObj = {};
    const object = {term: {value: req.query.term || '', fieldNames: ['firstName', 'lastName']}};
    const fields = [];
    if(req.query.hasOwnProperty('isActive')){
        object['isActive'] = JSON.parse(req.query.isActive);
        fields.push('isActive');
    }
    console.log(object);
    const filterObject = commonService.getSearchableQuery(object, null, fields);
    console.log(filterObject);
    User.findAll({...filterObject}).then((users) => {
        commonService.sendResponse(res, users, currentObj);
    })
        .catch((error) => {
            commonService.sendError('Can\'t fetched users.', next, error);
        })
}

module.exports = {
    getUsers: getUsers,
    getUsersByIds: getUsersByIds,
    createUser: createUser,
    updateUser: updateUser,
    updateUserPassword: updateUserPassword,
    loginUser: loginUser,
    deleteUser: deleteUser,
    logOutUser: logOutUser,
    search: search
};