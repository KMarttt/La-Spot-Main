import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react"


export function usePostFetch() {
    const [data, setData] = useState([]);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const { auth, setAuth } = useAuth();

    const triggerPost = (url, postData) => {
        setIsPending(true);
        setError(null);

        if(!url || !postData) {
            setIsPending(false);
            return;
        } 

        const isFormData = postData instanceof FormData;

        const fetchOptions = {
            method: "POST",
            headers: {
                ...(isFormData ? {} : { "Content-type": "application/json"}),
                "Authorization": `Bearer ${auth.accessToken}`
            },
            credentials: "include",
            body: isFormData ? postData : JSON.stringify(postData),
        }

        fetch(url, fetchOptions)
        .then( async res => {
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

                    //After refreshing the accesskey, retry the fetch request
                    return fetch(url, fetchOptions);
                })
            }

            if (!res.ok) {
                const responseData = await res.json();
                throw new Error (responseData.message || "An unknown error has occured")
            }

            return res.json();

        }). then(data => {
            setData(data);
            setError(null)
        }).catch (err => {
            setError(err.message)
        }). finally(() => {
            setIsPending(false);
        })

    }

    return { data, isPending, error, triggerPost }
}
