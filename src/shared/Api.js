import Auth from "./Auth";

function get(url) {
    return callApi(url, {
        method: 'GET',
        headers: defaultHeaders(),
        mode: "cors",
        cache: "no-cache"
    });
}

function post(url, data) {
    let headers = defaultHeaders();
    headers['Content-Type'] = 'application/json';
    return callApi(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    });
}

function put(url, data) {
    let headers = defaultHeaders();
    headers['Content-Type'] = 'application/json';
    return callApi(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(data)
    });
}

function del(url) {
    return callApi(url, {
       method: 'DELETE',
       headers: defaultHeaders()
    });
}

function defaultHeaders() {
    let auth = new Auth();
    let headers = {
        'Accept': 'application/json'
    };
    if (auth.isAuthenticated()) {
        headers.Authorization = `Bearer ${auth.getAccessToken()}`;
    }
    return headers;
}

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
    console.log(response)
    if (response.status === 401) {
        let auth = new Auth();
        auth.login();
    }
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response;
}

export { get, post, del, put };