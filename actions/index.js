export const changeBg = (bg) => {
    return {
        type: 'CHANGE_BG',
        id: +new Date(),
        bg
    }
}