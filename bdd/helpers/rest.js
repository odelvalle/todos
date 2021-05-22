const axios = require('axios');

const getData = async (url) => {
    try {
        return await axios.default.get(url);
    } catch (e) {
        console.error('exception occurred while GET', e);
        throw e;
    }
}

const postData = async (url, data) => {
    try {
        return await axios.default.post(url, data);
    } catch (e) {
        console.error('exception occurred while POST', e);
        throw e;
    }
}

const patchData = async (url, data) => {
    try {
        return await axios.default.patch(url, data);
    } catch (e) {
        console.error('exception occurred while PATCH', e);
        throw e;
    }
}

const deleteData = async (url, data) => {
    try {
        return await axios.default.delete(url);
    } catch (e) {
        console.error('exception occurred while DELETE', e);
        throw e;
    }
}

module.exports = {
    getData,
    postData,
    patchData,
    deleteData
}