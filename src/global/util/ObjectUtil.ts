export function clone(object) {
    if (!object) return object
    let result = Object.assign({}, object);
    return result
}
