const Customer = require('../models/Customer');
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
    Customer.findAll()
        .then((customers) => {
            commonService.sendResponse(res, customers);
        }).catch((error) => {
        commonService.sendError('No customers found in data base.', next, error);
    });
}

const create = (req, res, next) => {
    const createdBy = commonService.getCurrentUserId(req);
    const bodyData = {body: _.cloneDeep(req.body)};
    const request = commonService.checkNotNull(bodyData, ['name', 'email', 'phone']);

    if (typeof request == 'object') {
        if (request.isNotNull) {
            const tempObject = _.cloneDeep(req.body);
            tempObject.createdBy = createdBy;
            tempObject.createdAt = moment().format();
            Customer.create(tempObject)
                .then((object) => {
                    commonService.sendResponse(res, object);
                }).catch((error) => {
                commonService.sendError('Could\'t create customers.', next, error);
            });
        } else {
            commonService.sendError('Please provide ' + request.attr + ' field.', next);
        }
    } else {
        let message = 'Please provide body to create customers.';
        commonService.sendError(message, next);
    }
}


const update = (req, res, next) => {
    if (!req.params.id) {
        commonService.sendError('Please provide id of customer in url.', next);
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
            Customer.findOne({
                where: {id: req.params.id}
            }).then((customer) => {
                if (customer) {
                    return customer.update(tempObject);
                } else {
                    commonService.sendError('There is no customer with id = ' + req.params.id, next);
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
        let message = 'Please provide body to update customer.';
        commonService.sendError(message, next);
    }
}

const deleteCustomer = (req, res, next) => {
    const id = req.params.id;
    Customer.destroy({where: {id: id}})
        .then((customer) => {
            commonService.sendResponse(res, 'customer deleted successfully.');
        })
        .catch((error) => {
            commonService.sendError('customer can\'t deleted.', next, error);
        })
};

const search = (req, res, next) => {
    let currentObj = {};
    const object = {term: {value: req.query.term || '', fieldName: 'label'}};
    const filterObject = commonService.getSearchableQuery(object);
    Customer.findAll(filterObject).then((customer) => {
        commonService.sendResponse(res, customer, currentObj);
    })
        .catch((error) => {
            commonService.sendError('Can\'t fetched customer.', next, error);
        })
}

module.exports = {
    getList: getList,
    create: create,
    update: update,
    deleteCustomer: deleteCustomer,
    search: search,
};
