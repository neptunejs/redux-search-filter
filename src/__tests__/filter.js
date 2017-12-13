import {Map} from 'immutable';
import filterData from '../filterData';

const data = [
    {A: ['Y'], B: 'Y', C: 1, D: {X: 'X'}},
    {A: ['Z'], B: 'Z', C: 3},
    {A: ['Z', 'Y'], B: 'X', C: 2, D: {Y: 'Y'}},
    {A: ['X'], B: 'Y', C: -1, D: {X: 'OTHER'}},
];
data.forEach((d, idx) => (d.idx = idx));


describe('Test filter', () => {
    it('multiple', () => {
        const filters = [
            {prop: 'A', value: [], expected: [0, 1, 2, 3]},
            {prop: 'A', value: ['Y'], expected: [0, 2]},
            {prop: 'A', value: ['Y'], negated: true, expected: [1, 3]},
            {prop: 'A', value: ['Y', 'Z'], expected: [2]},
            {prop: 'A', value: ['Y', 'Z'], operator: 'OR', expected: [0, 1, 2]},
            {prop: 'A', value: ['Y', 'Z'], operator: 'AND', negated: true, expected: [3]},
            {prop: 'A', value: ['Z', 'Y'], operator: 'OR', negated: true, expected: [0, 1, 3]},
            {prop: 'A', value: ['W'], expected: []}
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
            {prop: 'B', value: ['Y'], expected: [0, 3]},
            {prop: 'B', value: ['W'], expected: []},
            {prop: 'B', value: ['Y'], negated: true, expected: [1, 2]},
            {prop: 'B', value: ['X', 'Y'], operator: 'AND', expected: []},
            {prop: 'B', value: ['X', 'Y'], operator: 'OR', expected: [0, 2, 3]},
            {prop: 'B', value: ['X'], expected: [2]},
            {prop: 'B', value: ['X', 'Y'], operator: 'AND', negated: true, expected: [1]},
            {prop: 'B', value: ['X', 'Y'], operator: 'OR', negated: true, expected: [0, 1, 2, 3]},
            {prop: 'B', value: ['Y'], negated: false, expected: [0, 3], operator: 'AND'},
            {prop: 'D.X', value: ['X'], expected: [0]},
            {prop: ['D', 'X'], value: ['OTHER'], expected: [3]},
            {prop: 'D.Y', value: ['Y'], expected: [2]},
        ];

        for (let filter of filters) {
            const f = Map({
                filterName: filter
            });
            const filterIdx = filterData(data, f).map(v => v.idx).sort(asc);
            expect(filterIdx).toEqual(filter.expected.sort(asc));
        }
    });

    it('range', () => {
        const filters = [
            {prop: 'C', min: 0, max: 3, expected: [0, 1, 2]},
            {prop: 'C', min: -2, max: 4, expected: [0, 1, 2, 3]},
            {prop: 'C', min: 0, max: 0.5, expected: []},
            {prop: 'C', min: 0.5, max: 1.5, expected: [0]}
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
