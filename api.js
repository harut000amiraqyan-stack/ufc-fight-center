const API_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000/api"
        : "/api";


async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, options);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data?.error ||
            data?.message ||
            `Ошибка API: ${response.status}`
        );
    }

    return data;
}


async function searchUFCFighters(name) {
    return apiRequest(
        `/fighters?q=${encodeURIComponent(name)}`
    );
}


async function getUFCFighter(idOrSlug) {
    return apiRequest(
        `/fighters/${encodeURIComponent(idOrSlug)}`
    );
}


async function getFighterHistory(idOrSlug) {
    return apiRequest(
        `/fighters/${encodeURIComponent(idOrSlug)}/history`
    );
}


async function getFighterStats(idOrSlug) {
    return apiRequest(
        `/fighters/${encodeURIComponent(idOrSlug)}/stats`
    );
}


async function getUFCRankings() {
    return apiRequest(`/rankings`);
}


async function getUpcomingEvents() {
    return apiRequest(`/events`);
}
