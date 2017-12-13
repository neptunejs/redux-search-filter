import {Map} from 'immutable';
import getFilteredData from '../getFilteredData';

const data = [
    {A: ['Y'], B: 'Y', C: 1, D: {X: 'X'}},
    {A: ['Z'], B: 'Z', C: 3},
    {A: ['Z', 'Y'], B: 'X', C: 2, D: {Y: 'Y'}},
    {A: ['X'], B: 'Y', C: -1, D: {X: 'OTHER'}},
    {B: true},
];
data.forEach((d, idx) => (d.idx = idx));

const getData = () => data;

const searchFilter = new Map({
    emptyList: new Map(),
    withList: new Map({
        name1: {prop: 'A', value: ['Y'], negated: true, expected: [1, 3, 4]},
        name2: {prop: 'B', value: ['Y'], negated: true, expected: [1, 2, 4]}
    })
});

describe('getFilteredData', () => {
    it('empty list', () => {
        const selector = getFilteredData('emptyList', getData);
        const result = selector({searchFilter});
        expect(result).toHaveLength(5);
    });
    it('two filters', () => {
        const selector = getFilteredData('withList', getData);
        const result = selector({
            searchFilter
        });
        expect(result.length).toBe(2);
        expect(result.includes(data[1])).toBe(true);
        expect(result.includes(data[4])).toBe(true);
    });
});
