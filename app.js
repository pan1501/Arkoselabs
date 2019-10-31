import { resolve } from "url";
import { rejects } from "assert";

/**
 * Example - 0 points
 * @description This is an example to demonstrate how returning a value will
 * satisfy the first test case
 */
export const example = () => true;

/**
 * Omit properties - 5 points
 * @description Remove the given properties from each object in the given array
 * of objects
 */
export const omitProperties = (dataSet, propertiesToRemove) => {
    let result = JSON.parse(JSON.stringify(dataSet));
    // if passed in data set is an array and it is not empty
    if (Array.isArray(result) && result.length > 0) {
        // Loop though all the record of the data set
        result.forEach((dataRecord) => {
            // Loop though all the properties that needed to be remove
            propertiesToRemove.forEach((property) => {
                // if the property does exsit in the current recrod then remove the property
                if (dataRecord[property] !== undefined) delete dataRecord[property]
            })
        });
    }

    return result;
};

/**
 * Get config - 2 points
 * @description Return a function that returns a given object ensuring it has
 * the properties of the object `config` received.
 */
export const config  = (dataset) => {
    let result = {}
    if (!Object.keys(dataset).every(elem => Object.keys(result).indexOf(elem) > -1)) {
        result = config(Object.assign(result, dataset));
        return result
    }

    return result;
};

/**
 * Fetch data - 10 points
 * @description Given a user id and some services, fetch the data and return
 * all of it at the same time.
 */
export const fetchUserByIdTheirFavAnimalAndStatus = (userId, services) => {
    // Get the status from services
    let status = new Promise((resolve, reject) => {
        resolve(services.fetchStatus());
      });
    // Get user from services
    let user =  new Promise((resolve, reject) => {
            resolve(services.fetchUsers());
        }).then((userData) => {
            return new Promise((resolve, reject) => {
                // only resolve when the record's id is targeted id
                userData.forEach(record => {
                    if (record.id === userId) {
                        resolve(record);
                    }
                });
            });
        });

    let animal = user.then((userRecord) => {
            // Use user data to find user's favourite animal
            return new Promise((resolve, reject) => {
                resolve(services.fetchAnimalById(userRecord.favouriteAnimalId))
            });
        });
   
    return Promise.all([animal, status, user]).then(([animal, status, user]) => {
        return [animal, status, user];
    });
};

/**
 * Normalise types - 8 points
 * @description Normalise a property for each object in the given array. Avoid
 * using `if` and `switch` statements.
 */
export const normaliseTypes = (dataSet, property, config) => {
    let result = JSON.parse(JSON.stringify(dataSet));
    // Data set that need to me normalise
    let dataSetValue = result.map((record) => record[property]);
    let configKey = Object.keys(config);
    
    // Loop though the key of the config
    configKey.forEach(normaliseTo => {
        // Loop though the arry of object to normalise base on the key
        config[normaliseTo].forEach((normaliseFrom) => {
            // Locate the object that need to be nomalise by indexOf and update it to what it should be normaliseTo
            result[dataSetValue.indexOf(normaliseFrom)][property] = normaliseTo
        })
    })

    return result;
};

/**
 * Flatten object - 10 points
 * @description Flatten a given object, so any nested values are moved to the
 * root level of the object
 */
export const flattenObject = (data) => {
    let result = {};
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        Object.keys(data).forEach(key => {
            // Check if the data value is an object or not
            if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
                // if it is concat the flattened object
                Object.assign(result, flattenObject(data[key]))
            } else {
                // else set the key to the result and assign value(data[key]) to it
                result[key] = data[key]
            }
        })
    }

    return result;
};

/**
 * Get value - 12 points
 * @description Given a key, which may be an array, and a set of data, find the
 * associated value
 */
export const getValue = (keysToFind, dataSet, currentIndex) => {
    let result = null;
    let dataSetKeys = Object.keys(dataSet);
    // Perprocess to truns non array to array
    if (!Array.isArray(keysToFind)) {
        keysToFind = [keysToFind];
    }
    // Loop though each key to find
    keysToFind.forEach((keyToFind, index) => {
        if (dataSetKeys.includes(keyToFind)) {
            // if the the key to find exist in the data set and the value of it is an object
            if (typeof dataSet[keyToFind] === 'object' &&
                dataSet[keyToFind] !== null &&
                !Array.isArray(dataSet[keyToFind])) {
                    // Remove key to find from keysToFind obj
                    keysToFind.splice(index, 1);
                    // Reuse the getValue function with reduced key and deeper data set
                    result = getValue(keysToFind, dataSet[keyToFind]);

            } else {
                result = dataSet[keyToFind];
            }
        }
    })

    return result;
};
