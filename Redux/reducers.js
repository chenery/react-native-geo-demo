import { combineReducers } from 'redux';
import { loginReducer } from './Reducers/loginReducer';
import { userReducer } from './Reducers/userReducer';

const rootReducer = combineReducers({
  loginReducer,
  userReducer
})

export default rootReducer;
