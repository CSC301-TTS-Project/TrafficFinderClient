// import { configureStore } from '@reduxjs/toolkit';

// export default configureStore({
//   reducer: {
//   },
// });

import {createStore} from "redux";
import rootReducer from './rootReducer';

const store = createStore(rootReducer);

export default store;
