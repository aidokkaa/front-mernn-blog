import {configureStore} from '@reduxjs/toolkit';
import { postsrReducer } from './slices/posts';
import { authReducer } from './slices/auth';


const store = configureStore({
    reducer:{
        posts:postsrReducer,
        auth:authReducer

    }
});
export default store