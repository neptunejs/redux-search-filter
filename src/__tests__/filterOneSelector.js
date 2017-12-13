import {Map} from 'immutable';
import filterOneSelector from '../filterOneSelector';
import * as kinds from '../constants/kinds';

const data = [
    {X: 'a', Y: ['a', 'b'], T: 1},
    {X: 'a', Y: ['b', 'c'], T: 1},
    {X: 'a'},
    {X: 'b', Z: -12},
    {X: 'b', T: 1},
    {X: 'c', Z: 10},
    {},
    {},
    {X: 'null'},
    {X: null, Z: 4, T: 1},
    {X: false}
];

describe('filterOneSelector', () => {
    it('invalid kind', () => {
        expect(() => filterOneSelector(null, null, null, 'invalid'))
            .toThrow(/^invalid filter kind: invalid$/);
    });

    describe('value kind', () => {
        const propFunc = (v) => v.X;
        it('no other filter', () => {
            const result = filterOneSelector(data, 'test', propFunc, kinds.value);
            expect(result).toEqual([
                {value: 'a', count: 3},
                {value: 'b', count: 2},
                {value: undefined, count: 2},
                {value: 'c', count: 1},
                {value: 'null', count: 1},
                {value: null, count: 1},
                {value: false, count: 1}
            ]);
        });

        it('with one other filter', () => {
            const filters = new Map({
                test: {},
                other: {prop: 'T', value: [1]}
            });
            const result = filterOneSelector(data, 'test', propFunc, kinds.value, filters);
            expect(result).toEqual([
                {value: 'a', count: 2},
                {value: 'b', count: 1},
                {value: null, count: 1}
            ]);
        });
    });

    describe('multiple kind', () => {
        const propFunc = (v) => v.Y;
        it('not negated, no other filter', () => {
            const filters = new Map({
                test: {negated: false}
            });
            const result = filterOneSelector(data, 'test', propFunc, kinds.multiple, filters);
            expect(result).toEqual([
                {value: 'b', count: 2},
                {value: 'a', count: 1},
                {value: 'c', count: 1}
            ]);
        });

        it('negated, no other filter', () => {
            const filters = new Map({
                test: {negated: true}
            });
            const result = filterOneSelector(data, 'test', propFunc, kinds.multiple, filters);
            expect(result).toEqual([
                {value: 'a', count: 10},
                {value: 'c', count: 10},
                {value: 'b', count: 9}
            ]);
        });
    });

    describe('range kind', () => {
        const propFunc = (v) => v.Z;
        it('empty data, no other filter', () => {
            const result = filterOneSelector([{}, {}], 'test', propFunc, kinds.range, new Map());
            expect(result).toEqual({min: 0, max: 0});
        });

        it('with data, no other filter', () => {
            const result = filterOneSelector(data, 'test', propFunc, kinds.range, new Map());
            expect(result).toEqual({min: -12, max: 10});
        });
    });
});
