import { mockData } from './mock-data';
import axios from 'axios';
import NProgress from 'nprogress';
import './nprogress.css';

export const extractLocations = (events) => {
    let extractLocations = events.map((event) => event.location);
    let locations = [...new Set(extractLocations)];
    return locations;
}

export const checkToken = async (accessToken) => {
    const result = await fetch(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    )
    .then((res) => res.json())
    .catch((error) => error.json());

    // return result.error ? false : true ;
    return result;
}

const getToken = async (code) => {
    // removeQuery();
    const encodeCode = encodeURIComponent(code);
    const { access_token } = await fetch(
        'https://hymncvcewd.execute-api.us-east-2.amazonaws.com/dev/api/token/' + encodeCode
    )
    .then((res) => {
        return res.json();
    })
    .catch((error) => error);

    access_token && localStorage.setItem('access_token', access_token);
    return access_token;
}

const removeQuery = () => {
    const { protocol, host, pathname } = window.location;
    if (window.history.pushState && window.location.pathname) {
        let newurl = protocol + '//' + host + pathname;
        window.history.pushState('', '', newurl);
    } else {
        let newurl = protocol + '//' + host;
        window.history.pushState('', '', newurl);
    }
}

export const getEvents = async () => {
    NProgress.start();

    if (window.location.href.startsWith('http://localhost')) {
        NProgress.done();
        return mockData;
    }

    if (!navigator.onLine) {
        const data = localStorage.getItem("lastEvents");
        const parsedData = JSON.parse(data).events;
        NProgress.done();
        return parsedData;
    }

    if (!navigator.onLine) {
        const data = localStorage.getItem("lastEvents");
        const parsedLocations = extractLocations(JSON.parse(data).events);
        NProgress.done();
        return parsedLocations;
    }

    const token = await getAccessToken();

    if (token) {
        removeQuery();
        const url = 'https://hymncvcewd.execute-api.us-east-2.amazonaws.com/dev/api/get-events/' + token;
        const result = await axios.get(url);
        if (result.data) {
            let locations = extractLocations(result.data.events);
            localStorage.setItem("lastEvents", JSON.stringify(result.data));
            localStorage.setItem("locations", JSON.stringify(locations));
        }
        NProgress.done();
        return result.data.events;
    }
}

export const getAccessToken = async () => {
    const accessToken = localStorage.getItem('access_token');
    const tokenCheck = accessToken && (await checkToken(accessToken));
    if(!accessToken || tokenCheck.error) {
        await localStorage.removeItem('access-token');
        const searchParams = new URLSearchParams(window.location.search);
        const code = await searchParams.get('code');
        if (!code) {
            const results = await axios.get(
                'https://hymncvcewd.execute-api.us-east-2.amazonaws.com/dev/api/get-auth-url'
            );
            const { authUrl } = results.data;
            return (window.location.href = authUrl);
        }
        return code && getToken(code);
    }
    return accessToken
}