import {createContext, useEffect, useState} from "react"
import { getProfileApi } from "../api/AuthApi";


export const AuthContext=createContext();

function AuthProvider({children}){
    
    const [user, setUser]=useState(
        JSON.parse(localStorage.getItem("user"))
    );
    useEffect(()=>{
        const loadUser=async ()=>{
            const token=localStorage.getItem("token");
            if(!token){
                return;
            }

            try {
                const result=await getProfileApi();
                setUser(result.user);

                localStorage.setItem(
                    "user", JSON.stringify(result.user)
                )
            } catch (e) {
                console.log(e);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            }
        }
        
        loadUser();
    },[]);

    function login(userData){
        setUser(userData);
        localStorage.setItem("user",JSON.stringify(userData));

    }
    function logout(){
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    return(
        <AuthContext.Provider value={{user, setUser, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider;