import {Map as ImmutableMap} from 'immutable';

import * as actionTypes from '../constants/actionTypes';
import * as kinds from '../constants/kinds';
import {AND, OR} from '../constants/operators';
import reducer from '../reducer';

describe('reducer', () => {
    it('default state', () => {
        const state = reducer(undefined, {type: '@@init'});
        expect(state).toEqual(ImmutableMap());
    });

    it('RESET empty', () => {
        const initialState = ImmutableMap();
        const state = reducer(initialState, {type: actionTypes.RESET, meta: {name: 'test'}});
        expect(state).toEqual(ImmutableMap({
            test: ImmutableMap()
        }));
    });

    it('RESET not empty', () => {
        const initialState = ImmutableMap({
            test: ImmutableMap({abc: {operator: AND}}),
            test2: ImmutableMap({def: {operator: OR}})
        });
        const state = reducer(initialState, {type: actionTypes.RESET, meta: {name: 'test'}});
        expect(state).toEqual(ImmutableMap({
            test: ImmutableMap(),
            test2: ImmutableMap({def: {operator: OR}})
        }));
    });

    it('UPDATE_FILTER string payload', () => {
        const initialState = ImmutableMap();
        const state = reducer(initialState, {type: actionTypes.UPDATE_FILTER, meta: {name: 'test', prop: 'abc', kind: kinds.multiple}, payload: 'TEST'});
        expect(state).toEqual(ImmutableMap({
            test: ImmutableMap({abc: {negated: false, operator: AND, value: ['TEST']}})
        }));
    });

    it('UPDATE_FILTER array payload one value', () => {
        const initialState = ImmutableMap();
        const state = reducer(initialState, {type: actionTypes.UPDATE_FILTER, meta: {name: 'test', prop: 'abc', kind: kinds.multiple}, payload: ['TEST']});
        expect(state).toEqual(ImmutableMap({
            test: ImmutableMap({abc: {negated: false, operator: AND, value: ['TEST']}})
        }));
    });

    it('UPDATE_FILTER array payload two values', () => {
        const initialState = ImmutableMap();
        const state = reducer(initialState, {type: actionTypes.UPDATE_FILTER, meta: {name: 'test', prop: 'abc', kind: kinds.multiple}, payload: ['TEST1', 'TEST2']});
        expect(state).toEqual(ImmutableMap({
            test: ImmutableMap({abc: {negated: false, operator: AND, value: ['TEST1', 'TEST2']}})
        }));
    });

    it('UPDATE_FILTER value', () => {
        const initialState = ImmutableMap();
        const state = reducer(initialState, {type: actionTypes.UPDATE_FILTER, meta: {name: 'test', prop: 'abc', kind: kinds.value}, payload: 'TEST'});
        expect(state).toEqual(ImmutableMap({
            test: ImmutableMap({abc: {negated: false, operator: OR, value: ['TEST']}})
        }));
    });

    it('UPDATE_FILTER range', () => {
        const initialState = ImmutableMap();
        const state = reducer(initialState, {type: actionTypes.UPDATE_FILTER, meta: {name: 'test', prop: 'abc', kind: kinds.range}, payload: {min: 0, max: 1}});
        expect(state).toEqual(ImmutableMap({
            test: ImmutableMap({abc: {min: 0, max: 1}})
        }));
    });

    it('UPDATE_FILTER range throw on bad value', () => {
        const initialState = ImmutableMap();
        expect(() => reducer(initialState, {type: actionTypes.UPDATE_FILTER, meta: {name: 'test', prop: 'abc', kind: kinds.range}, payload: {max: 1}})).toThrow(/range value must have a min and a max/);
        expect(() => reducer(initialState, {type: actionTypes.UPDATE_FILTER, meta: {name: 'test', prop: 'abc', kind: kinds.range}, payload: {min: 1}})).toThrow(/range value must have a min and a max/);
        expect(() => reducer(initialState, {type: actionTypes.UPDATE_FILTER, meta: {name: 'test', prop: 'abc', kind: kinds.range}, payload: 'not ok'})).toThrow(/range value must have a min and a max/);
        expect(() => reducer(initialState, {type: actionTypes.UPDATE_FILTER, meta: {name: 'test', prop: 'abc', kind: kinds.range}, payload: {}})).toThrow(/range value must have a min and a max/);
        expect(() => reducer(initialState, {type: actionTypes.UPDATE_FILTER, meta: {name: 'test', prop: 'abc', kind: kinds.range}, payload: {min: 0, max: -1}})).toThrow(/range min must be smaller than range max/);
    });

    it('UPDATE_FILTER range throw on unexpected kind', () => {
        const initialState = ImmutableMap();
        expect(() => reducer(initialState, {type: actionTypes.UPDATE_FILTER, meta: {name: 'test', prop: 'abc', kind: 'bad'}, payload: {max: 1}})).toThrow(/unexpected kind: bad/);
    });

    it('UPDATE_FILTER null', () => {
        const initialState = ImmutableMap({
            test: ImmutableMap({abc: {negated: false, operator: AND, value: ['TEST']}})
        });
        const state = reducer(initialState, {type: actionTypes.UPDATE_FILTER, meta: {name: 'test', prop: 'abc', kind: kinds.multiple}, payload: null});
        expect(state).toEqual(ImmutableMap({
            test: ImmutableMap()
        }));
    });

    it('UPDATE_FILTER null with two props', () => {
        const initialState = ImmutableMap({
            test: ImmutableMap({
                abc: {negated: false, operator: AND, value: ['TEST']},
                def: {negated: false, operator: OR, value: ['TEST2']}
            })
        });
        const state = reducer(initialState, {type: actionTypes.UPDATE_FILTER, meta: {name: 'test', prop: 'abc', kind: kinds.multiple}, payload: null});
        expect(state).toEqual(ImmutableMap({
            test: ImmutableMap({
                def: {negated: false, operator: OR, value: ['TEST2']}
            })
        }));
    });

    it('SET_NEGATED empty', () => {
        const initialState = ImmutableMap();
        const state = reducer(initialState, {type: actionTypes.SET_NEGATED, meta: {name: 'test', prop: 'abc', kind: kinds.value}, payload: true});
        expect(state).toEqual(ImmutableMap({
            test: ImmutableMap({abc: {negated: true, operator: OR, value: []}})
        }));
    });

    it('SET_NEGATED existing no change', () => {
        const initialState = ImmutableMap({
            test: ImmutableMap({abc: {negated: true, operator: OR, value: []}})
        });
        const state = reducer(initialState, {type: actionTypes.SET_NEGATED, meta: {name: 'test', prop: 'abc', kind: kinds.value}, payload: true});
        expect(state).toEqual(ImmutableMap({
            test: ImmutableMap({abc: {negated: true, operator: OR, value: []}})
        }));
    });

    it('SET_NEGATED existing change', () => {
        const initialState = ImmutableMap({
            test: ImmutableMap({abc: {negated: true, operator: OR, value: ['X']}})
        });
        const state = reducer(initialState, {type: actionTypes.SET_NEGATED, meta: {name: 'test', prop: 'abc', kind: kinds.value}, payload: false});
        expect(state).toEqual(ImmutableMap({
            test: ImmutableMap({abc: {negated: false, operator: OR, value: ['X']}})
        }));
    });

    it('SET_NEGATED throws on wrong type', () => {
        const initialState = ImmutableMap({
            test: ImmutableMap({abc: {negated: true, operator: OR, value: []}})
        });
        expect(() => reducer(initialState, {type: actionTypes.SET_NEGATED, meta: {name: 'test', prop: 'abc', kind: kinds.value}, payload: undefined})).toThrow(/^SET_NEGATED expects a boolean value. Received undefined$/);
        expect(() => reducer(initialState, {type: actionTypes.SET_NEGATED, meta: {name: 'test', prop: 'abc', kind: kinds.value}, payload: 0})).toThrow(/^SET_NEGATED expects a boolean value. Received number$/);
    });

    it('SET_NEGATED throws on wrong kind', () => {
        const initialState = ImmutableMap({
            test: ImmutableMap({abc: {negated: true, operator: OR, value: []}})
        });
        expect(() => reducer(initialState, {type: actionTypes.SET_NEGATED, meta: {name: 'test', prop: 'abc', kind: 'wrong'}, payload: false})).toThrow(/^unexpected kind: wrong$/);
    });

    it('SET_OPERATOR empty', () => {
        const initialState = ImmutableMap();
        const state = reducer(initialState, {type: actionTypes.SET_OPERATOR, meta: {name: 'test', prop: 'abc', kind: kinds.value}, payload: AND});
        expect(state).toEqual(ImmutableMap({
            test: ImmutableMap({abc: {negated: false, operator: AND, value: []}})
        }));
    });

    it('SET_OPERATOR existing no change', () => {
        const initialState = ImmutableMap({
            test: ImmutableMap({abc: {negated: true, operator: AND, value: []}})
        });
        const state = reducer(initialState, {type: actionTypes.SET_OPERATOR, meta: {name: 'test', prop: 'abc', kind: kinds.value}, payload: AND});
        expect(state).toEqual(ImmutableMap({
            test: ImmutableMap({abc: {negated: true, operator: AND, value: []}})
        }));
    });

    it('SET_OPERATOR existing change', () => {
        const initialState = ImmutableMap({
            test: ImmutableMap({abc: {negated: true, operator: AND, value: []}})
        });
        const state = reducer(initialState, {type: actionTypes.SET_OPERATOR, meta: {name: 'test', prop: 'abc', kind: kinds.value}, payload: OR});
        expect(state).toEqual(ImmutableMap({
            test: ImmutableMap({abc: {negated: true, operator: OR, value: []}})
        }));
    });

    it('SET_OPERATOR throws on wrong kind', () => {
        const initialState = ImmutableMap({
            test: ImmutableMap({abc: {negated: true, operator: AND, value: []}})
        });
        expect(() => reducer(initialState, {type: actionTypes.SET_OPERATOR, meta: {name: 'test', prop: 'abc', kind: 'wrong'}, payload: OR})).toThrow(/^unexpected kind: wrong$/);
    });

    it('SET_OPERATOR throws on wrong value', () => {
        const initialState = ImmutableMap({
            test: ImmutableMap({abc: {negated: true, operator: AND, value: []}})
        });
        expect(() => reducer(initialState, {type: actionTypes.SET_OPERATOR, meta: {name: 'test', prop: 'abc', kind: kinds.value}, payload: 'BAD'})).toThrow(/^wrong operator: BAD$/);
    });
});
