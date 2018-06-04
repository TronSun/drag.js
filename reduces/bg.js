const bg = (state = [], action) => {
    switch (action.type) {
        case 'CHANGE_BG':
            return [
                ...state,
                {
                    id: action.id,
                    bg: action.bg
                }
            ]
        default:
            return state
    }
}

export default bg