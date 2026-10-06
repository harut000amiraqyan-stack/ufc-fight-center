const API_URL = "http://localhost:3000/api";


// ============================================
// ОБЩАЯ ФУНКЦИЯ ЗАПРОСА
// ============================================

async function apiRequest(url) {

    const response =
        await fetch(url);

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data?.error ||
            `Ошибка сервера: ${response.status}`
        );

    }

    return data;
}


// ============================================
// ПОИСК БОЙЦОВ
// ============================================

async function searchUFCFighters(name) {

    const url =
        `${API_URL}/fighters?q=${encodeURIComponent(name)}`;

    return await apiRequest(url);
}


// ============================================
// ПРОФИЛЬ БОЙЦА
// ============================================

async function getUFCFighter(idOrSlug) {

    const url =
        `${API_URL}/fighters/${encodeURIComponent(idOrSlug)}`;

    return await apiRequest(url);
}


// ============================================
// ИСТОРИЯ БОЁВ
// ============================================

async function getFighterHistory(idOrSlug) {

    const url =
        `${API_URL}/fighters/${encodeURIComponent(idOrSlug)}/history`;

    return await apiRequest(url);
}


// ============================================
// СТАТИСТИКА
// ============================================

async function getFighterStats(idOrSlug) {

    const url =
        `${API_URL}/fighters/${encodeURIComponent(idOrSlug)}/stats`;

    return await apiRequest(url);
}


// ============================================
// РЕЙТИНГИ
// ============================================

async function getUFCRankings() {

    const url =
        `${API_URL}/rankings`;

    return await apiRequest(url);
}


// ============================================
// БЛИЖАЙШИЕ СОБЫТИЯ
// ============================================

async function getUpcomingEvents() {

    const url =
        `${API_URL}/events`;

    return await apiRequest(url);
}