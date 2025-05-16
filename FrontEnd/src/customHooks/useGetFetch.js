import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export function useGetFetch(url){
    const { auth, setAuth } = useAuth();

    
    const [data, setData] = useState([]);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);

    const triggerGet = (url) => {
        setIsPending(false);
        setError(null);
        
        if(!url) {
            setIsPending(false);
            return;
        } 
        const fetchSetUp = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${auth.accessToken}`,
            },
            credentials: 'include'
        }

        fetch(url, fetchSetUp)
        .then(async res => {
            if (res.status === 403) {
                console.log("Access token expired, refreshing token...")
                return fetch("http://localhost:8080/refresh", {
                    method: "POST",
                    credentials: 'include'
                })
                .then(res => res.json())
                .then(async data => {
                    setAuth({
                        accessToken: data.accessToken,
                        ID: data.ID,
                        accountType: data.accountType,
                    });
                    return fetch(url, fetchSetUp)
                    // .then(res => {
                    //     if (!res.ok) throw new Error("Retry after refresh failed")
                    //     return res.json();
                    // })
                })
            }

            if(!res.ok){
                throw new Error ("An unknown error has occured")
            }

            return res.json()

        }).then(data =>  {
            setData(data);
            setError(null);
        }).catch(err => {
            setError(err.message);
        }).finally(() => {
            setIsPending(false);
        })
    }

    return {data, isPending, error, triggerGet};
}

