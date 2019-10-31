import users from './utils/users.json';
import * as services from './utils/services.js';
import {
  example,
  fetchUserByIdTheirFavAnimalAndStatus,
  config,
  normaliseTypes,
  omitProperties,
  flattenObject,
  getValue,
} from './app';

describe('Technical Assessment', () => {
  test('Example', () => {
    expect(example()).toBe(true);
  });

  test('Omit properties', () => {
    expect(
      omitProperties(users, ['favouriteAnimalId', 'id', 'token'])
    ).toMatchSnapshot();
  });

  test('Get config', () => {
    const getUserConfig = config({ active: true, country: 'au' });
    expect(getUserConfig({ country: 'us', color: 'blue' })).toEqual({
      active: true,
      color: 'blue',
      country: 'us',
    });
  });

  test('Fetch data', () => {
    return fetchUserByIdTheirFavAnimalAndStatus(2, services).then(
      ([animal, status, user]) => {
        expect(user.name).toEqual('Mary');
        expect(animal.name).toEqual('Cat');
        expect(status.up).toBeTruthy;
      }
    );
  });

  test('Normalise types', () => {
    const config = {
      ACTIVE: ['ACTIVE'],
      INACTIVE: ['DISABLED', 'INACTIVE', 'PENDING'],
    };

    expect(normaliseTypes(users, 'status', config)).toMatchSnapshot();
  });

  test('Flatten object', () => {
    const data = {
      user: {
        name: 'sam',
        age: 33,
        animals: {
          cats: null,
          dogs: ['spot', 'george'],
        },
      },
      account: 'web',
      loggedIn: false,
      status: {
        status: 'ok',
      },
    };

    expect(flattenObject(data)).toMatchSnapshot();
  });

  test('Get value', () => {
    const haystack = {
      id: '23fgll',
      logs: {
        rgiij: {
          logged: true,
          time: 1548385781499,
          marks: ['http', 'browser'],
        },
        rgqyy: null,
      },
      type: 'visual',
      check: ['id', 22, 23],
    };

    expect(getValue('id', haystack)).toBe('23fgll');
    expect(getValue(['logs', 'rgiij', 'marks'], haystack)).toEqual([
      'http',
      'browser',
    ]);
    expect(getValue(['logs', 'rrkoq'], haystack)).toBeNull();
  });
});
