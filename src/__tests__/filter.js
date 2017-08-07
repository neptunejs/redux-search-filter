import {Map} from 'immutable';
import filterData from '../filterData';

const data = [
    {A: ['Y'], B: 'Y'},
    {A: ['Z'], B: 'Z'},
    {A: ['Z', 'Y'], B: 'X'},
    {A: ['X'], B: 'Y'},
];
data.forEach((d, idx) => d.idx = idx);


describe('Test filter', function () {
    it('multiple', function () {
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

    it('value', function () {
        const filters = [
            {value: ['Y'], expected: [0, 3]},
            {value: ['W'], expected: []},
            {value: ['Y'], negated: true, expected: [1, 2]},
            {value: ['X', 'Y'], operator: 'AND', expected: []},
            {value: ['X', 'Y'], operator: 'OR', expected: [0, 2, 3]},
            {value: ['X'], expected: [2]},
            {value: ['X', 'Y'], operator: 'AND', negated: true, expected: [1]},
            {value: ['X', 'Y'], operator: 'OR', negated: true, expected: [0, 1, 2, 3]}
        ];

        for (let filter of filters) {
            const f = Map({
                B: filter
            });
            const filterIdx = filterData(data, f).map(v => v.idx).sort(asc);
            expect(filterIdx).toEqual(filter.expected.sort(asc));
        }
    });
});

function asc(a, b) {
    return a - b;
}