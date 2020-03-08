export const RESET = 'RESET';

export function reduxReset() {
    return {
        type: RESET
    }
}

export function createResetActionWithTag(tag, resetAction) {
    return {
        type: `${tag}#${RESET}`,
        ...resetAction,
    }
}
