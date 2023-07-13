import { useAuth0 } from "@auth0/auth0-react";


const useApi = () => {
    const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();


    function callApi(url, options) {
        return fetch(process.env.REACT_APP_API_URL + url, options)
            .then(handleErrors)
            .then(parseJsonIfContentTypeJson);
    }

    function parseJsonIfContentTypeJson(response) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1)
        {
            return response.json();
        }
        return response;
    }

    function handleErrors(response) {
        if (response.status === 401) {
            loginWithRedirect();
        }
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response;
    }

    async function defaultHeaders() {
        let headers = {
            'Accept': 'application/json'
        };
        if (isAuthenticated) {
            const accessToken = await getAccessTokenSilently();
            headers.Authorization = `Bearer ${accessToken}`;
        }
        return headers;
    }

    async function get(url) {
        return await callApi(url, {
            method: 'GET',
            headers: await defaultHeaders(),
            mode: "cors",
            cache: "no-cache"
        });
    }

    async function post(url, data) {
        let headers = await defaultHeaders();
        headers['Content-Type'] = 'application/json';
        return await callApi(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
    }

    async function put(url, data) {
        let headers = await defaultHeaders();
        headers['Content-Type'] = 'application/json';
        return await callApi(url, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(data)
        });
    }

    async function del(url) {
        return await callApi(url, {
        method: 'DELETE',
        headers: await defaultHeaders()
        });
    }

    return { get, post, del, put };
}

export default useApi;
