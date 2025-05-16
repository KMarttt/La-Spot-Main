import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react"


export function usePutFetch() {
    const [data, setData] = useState([]);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const { auth, setAuth } = useAuth();

    const triggerPut = (url, putData) => {
        setIsPending(true);
        setError(null);

        if(!url || !putData) {
            setIsPending(false);
            return;
        } 

        fetch(url, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${auth.accessToken}`    
            },
            credentials: 'include',
            body: JSON.stringify(putData)
        }).then( async res => {
            
            if (res.status === 403) {
                console.log("Access token expired, refreshing token...")
                return fetch("http://localhost:8080/refresh", {
                    method: "POST",
                    credentials: 'include'
                })
                .then (res => res.json())
                .then (data => {
                    setAuth({
                        accessToken: data.accessToken,
                        ID: data.ID,
                        accountType: data.accountType,
                    });
                    return fetch(url, {
                        method: "PUT",
                        body: JSON.stringify(putData),
                        headers: {
                            "Content-type": "application/json",
                            "Authorization": `Bearer ${data.accessToken}`,
                        },
                        credentials: 'include',
                    })
                })
            }

            const data = await res.json()
            if (!res.ok) {
                setError(data);
                throw new Error (data.message || "An unknown error has occured")
            }

            return data;

        }). then(data => {
            setData(data);
            setError(null)
        }).catch (err => {
            setData(null);
        }). finally(() => {
            setIsPending(false);
        })

    }

    return { data, isPending, error, triggerPut }
}
