import { TOGGLE_THEME } from "../ActionTypes";

export const themeReducer = (state, action) => {
    console.log(action); //5

    switch(action.type) {
        case TOGGLE_THEME:
            return {
                theme: action.payload  //6
            }
        default:
            return state;
    }
}