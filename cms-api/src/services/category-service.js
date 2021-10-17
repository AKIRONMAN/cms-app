const Category = require('../models/Category');
const commonService = require('./../services/common-service');
const moment = require('moment');
const _ = {
    cloneDeep: require('lodash/cloneDeep'),
    merge: require('lodash/merge'),
    map: require('lodash/map'),
    startCase: require('lodash/startCase'),
    find: require('lodash/find')
};

const getList = (req, res, next) => {
    Category.findAll()
        .then((categories) => {
            commonService.sendResponse(res, categories);
        }).catch((error) => {
        commonService.sendError('No categories found in data base.', next, error);
    });
}

const create = (req, res, next) => {
    const createdBy = commonService.getCurrentUserId(req);
    const bodyData = {body: _.cloneDeep(req.body)};
    const request = commonService.checkNotNull(bodyData, ['label']);

    if (typeof request == 'object') {
        if (request.isNotNull) {
            const tempObject = _.cloneDeep(req.body);
            tempObject.createdBy = createdBy;
            tempObject.createdAt = moment().format();
            Category.create(tempObject)
              .then((object) => {
                commonService.sendResponse(res, object);
            }).catch((error) => {
                commonService.sendError('Could\'t create category.', next, error);
            });
        } else {
            commonService.sendError('Please provide ' + request.attr + ' field.', next);
        }
    } else {
        let message = 'Please provide body to create category.';
        commonService.sendError(message, next);
    }
}


const update = (req, res, next) => {
    if (!req.params.id) {
        commonService.sendError('Please provide id of fieldMeta in url.', next);
        return;
    }
    const modifiedBy = commonService.getCurrentUserId(req);
    const data = Object.keys(req.body);
    const request = commonService.checkNotNull(req, data);
    if (typeof request == 'object') {
        if (request.isNotNull) {
            const tempObject = _.cloneDeep(req.body);
            tempObject.modifiedBy = modifiedBy;
            tempObject.modifiedAt = moment().format();
            Category.findOne({
                where: {id: req.params.id}
            }).then((category) => {
                    if (category) {
                        return category.update(tempObject);
                    } else {
                        commonService.sendError('There is no category with id = ' + req.params.id, next);
                    }
                })
                .then((updateResponse) => {
                    commonService.sendResponse(res, updateResponse);
                }).catch((error) => {
                commonService.sendError('Could not updated', next, error);
            });
        } else {
            commonService.sendError('You have provided this ' + request.attr + ' field as null.', next);
        }
    } else {
         let message = 'Please provide body to update category.';
        commonService.sendError(message, next);
    }
}

const deleteCategory = (req, res, next) => {
    const id = req.params.id;
   Category.destroy({where: {id: id}})
   .then((category) => {
            commonService.sendResponse(res, 'category deleted successfully.');
        })
        .catch((error) => {
            commonService.sendError('category can\'t deleted.', next, error);
        })
};

const search = (req, res, next) => {
    let currentObj = {};
            const object = {term: {value: req.query.term || '', fieldName: 'label'}};
            const filterObject = commonService.getSearchableQuery(object);
    Category.findAll(filterObject).then((category) => {
            commonService.sendResponse(res, category, currentObj);
        })
        .catch((error) => {     
            commonService.sendError('Can\'t fetched category.', next, error);
        })
}

module.exports = {
    getList: getList,
    create: create,
    update: update,
    deleteCategory: deleteCategory,
    search: search,
};
