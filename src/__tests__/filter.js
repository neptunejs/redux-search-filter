import {Map} from 'immutable';
import filterData from '../filterData';

const data = [
    {A: ['Y'], B: 'Y', C: 1},
    {A: ['Z'], B: 'Z', C: 3},
    {A: ['Z', 'Y'], B: 'X', C: 2},
    {A: ['X'], B: 'Y', C: -1},
];
data.forEach((d, idx) => d.idx = idx);


describe('Test filter', () => {
    it('multiple', () => {
        const filters = [
            {value: [], expected: [0, 1, 2, 3]},
            {value: ['Y'], expected: [0, 2]},
            {value: ['Y'], negated: true, expected: [1, 3]},
            {value: ['Y', 'Z'], expected: [2]},
            {value: ['Y', 'Z'], operator: 'OR', expected: [0, 1, 2]},
            {value: ['Y', 'Z'], operator: 'AND', negated: true, expected: [3]},
            {value: ['Z', 'Y'], operator: 'OR', negated: true, expected: [0, 1, 3]},
            {value: ['W'], expected: []}
        ];
        for (let filter of filters) {
            const f = Map({
                A: filter
            });
            const filterIdx = filterData(data, f).map(v => v.idx).sort(asc);
            expect(filterIdx).toEqual(filter.expected.sort(asc));
        }
    });

    it('value', () => {
        const filters = [
            {value: ['Y'], expected: [0, 3]},
            {value: ['W'], expected: []},
            {value: ['Y'], negated: true, expected: [1, 2]},
            {value: ['X', 'Y'], operator: 'AND', expected: []},
            {value: ['X', 'Y'], operator: 'OR', expected: [0, 2, 3]},
            {value: ['X'], expected: [2]},
            {value: ['X', 'Y'], operator: 'AND', negated: true, expected: [1]},
            {value: ['X', 'Y'], operator: 'OR', negated: true, expected: [0, 1, 2, 3]},
            {value: ['Y'], negated: false, expected: [0, 3], operator: 'AND'}
        ];

        for (let filter of filters) {
            const f = Map({
                B: filter
            });
            const filterIdx = filterData(data, f).map(v => v.idx).sort(asc);
            expect(filterIdx).toEqual(filter.expected.sort(asc));
        }
    });

    it('range', () => {
        const filters = [
            {min: 0, max: 3, expected: [0, 1, 2]},
            {min: -2, max: 4, expected: [0, 1, 2, 3]},
            {min: 0, max: 0.5, expected: []},
            {min: 0.5, max: 1.5, expected: [0]}
        ];
        for (let filter of filters) {
            const f = Map({
                C: filter
            });
            const filterIdx = filterData(data, f).map(v => v.idx).sort(asc);
            expect(filterIdx).toEqual(filter.expected.sort(asc));
        }
    });
});

function asc(a, b) {
    return a - b;
}