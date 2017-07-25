const data = [
    {x: 'A', y: ['1'], z: 2},
    {x: 'A', y: ['2', '3'], z: 3},
    {x: 'B', y: ['1', '4'], z: 4},
    {x: 'B', y: ['4'], z: 5},
    {x: 'B', y: ['3'], z: 6},
    {x: 'C', y: ['2', '3', '4'], z: 7},
];

export default function dataReducer(state = data) {
    return state;
}
