import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    // const [accessToken, setAccessToken] = useState(null);
    // const [username, setUsername] = useState(null);
    // const [accountType, setAccountType] = useState(null);
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const refresh = async() => {
            fetch("http://localhost:8080/refresh", {
                method: "POST",
                credentials: 'include',
            }).then(async res => {
                const data = await res.json();
                setAuth({
                    accessToken: data.accessToken,
                    ID: data.ID,
                    accountType: data.accountType,
                });   
            }).catch (err => {
                console.log(err);
                setAuth(null); // not logged in
            }).finally(() => {
                setLoading(false);
            })       
        };
        refresh();
    }, []);

    if (loading) {
        return (
            <>
                <h1>Hey wait up, I'm still loading here :C</h1>
            </>
        )
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
        {children} { /* all components within this provider has access to accessToken and its function */}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
// this hook simplifies the code so you wouldn't constantly type the useContext(AuthContext);