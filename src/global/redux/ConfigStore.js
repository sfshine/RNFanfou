import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {rootReducer} from "../../biz/common/redux/Reducers";
import Logger from "~/global/util/Logger"

const TAG = "ConfigStore"
const logger = store => next => action => {
    const result = next(action);
    if (typeof action === 'function') {
        Logger.log(TAG, 'dispatching function');
    } else {
        Logger.log(TAG, 'dispatching:', action);
    }
    Logger.log(TAG, 'nextState ', store.getState());
    return result;
};

const middlewares = [
    logger,
    thunkMiddleware,
];

export default createStore(rootReducer, applyMiddleware(...middlewares));
