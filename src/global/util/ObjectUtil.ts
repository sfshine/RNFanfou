export function clone(object) {
    if (!object) return object
    let result = {}
    for (let key in object) {
        result[key] = result[key];
    }
    return result
}
