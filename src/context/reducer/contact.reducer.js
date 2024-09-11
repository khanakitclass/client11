import { ADD_CONTACT } from "../ActionTypes";

export const contactReducer = (state, action) => {
    console.log(action);    //4

    switch (action.type) {
        case ADD_CONTACT:
            return {
                contact: state.contact.concate(action.payload)
            }
        default:
            return state
    }
}