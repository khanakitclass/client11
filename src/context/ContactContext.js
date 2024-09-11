import { createContext, useReducer } from "react"
import { contactReducer } from "./reducer/contact.reducer";
import axios from "axios";
import { BASE_URL } from "../utils/baseURL";

const initialState = {
    isLoading: false,
    contact: [],
    error: null
}

export const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
    const [state, dispatch] = useReducer(contactReducer, initialState);

    const addContact = async (data) => {        //2
        try {
            const response = await axios.post(BASE_URL + 'contact', data);  //3
            return response.data
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <ContactContext.Provider
            value={{
                ...state,
                addContact
            }}
        >
            {children}
        </ContactContext.Provider>
    )
}