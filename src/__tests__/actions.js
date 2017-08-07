import {
    UPDATE_FILTER,
    SET_NEGATED,
    SET_OPERATOR,
    RESET
} from '../constants/actionTypes';
import {
    updateFilter,
    setNegated,
    setOperator,
    reset
} from '../actions';

describe('action creators', () => {
    it('updateFilter', () => {
        const action = updateFilter('name', 'prop', 'kind', 'value');
        expect(action).toEqual({
            type: UPDATE_FILTER,
            meta: {
                name: 'name',
                prop: 'prop',
                kind: 'kind',
            },
            payload: 'value'
        });
    });

    it('updateFilter with event-like object', () => {
        const action = updateFilter('name', 'prop', 'kind', {target: {value: 'xxx'}});
        expect(action).toEqual({
            type: UPDATE_FILTER,
            meta: {
                name: 'name',
                prop: 'prop',
                kind: 'kind',
            },
            payload: 'xxx'
        });
    });

    it('updateFilter with falsy value', () => {
        const action = updateFilter('name', 'prop', 'kind', '');
        expect(action).toEqual({
            type: UPDATE_FILTER,
            meta: {
                name: 'name',
                prop: 'prop',
                kind: 'kind',
            },
            payload: null
        });
    });

    it('setNegated', () => {
        const action = setNegated('name', 'prop', 'kind', true);
        expect(action).toEqual({
            type: SET_NEGATED,
            meta: {
                name: 'name',
                prop: 'prop',
                kind: 'kind',
            },
            payload: true
        });
    });

    it('setNegated with checkbox event', () => {
        const action = setNegated('name', 'prop', 'kind', {target: {checked: true}});
        expect(action).toEqual({
            type: SET_NEGATED,
            meta: {
                name: 'name',
                prop: 'prop',
                kind: 'kind',
            },
            payload: true
        });
    });

    it('setOperator', () => {
        const action = setOperator('name', 'prop', 'kind', true);
        expect(action).toEqual({
            type: SET_OPERATOR,
            meta: {
                name: 'name',
                prop: 'prop',
                kind: 'kind',
            },
            payload: true
        });
    });

    it('setOperator with event-like object', () => {
        const action = setOperator('name', 'prop', 'kind', {target: {value: 'OR'}});
        expect(action).toEqual({
            type: SET_OPERATOR,
            meta: {
                name: 'name',
                prop: 'prop',
                kind: 'kind',
            },
            payload: 'OR'
        });
    });

    it('reset', () => {
        const action = reset('name');
        expect(action).toEqual({
            type: RESET,
            meta: {name: 'name'}
        });
    });
});
