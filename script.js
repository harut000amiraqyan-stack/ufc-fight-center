// ============================================
// UFC FIGHT CENTER
// ============================================


// ============================================
// ПОИСК БОЙЦА
// ============================================

async function searchFighter() {

    const input =
        document.getElementById("fighterSearch");

    const result =
        document.getElementById("fighterResult");

    if (!input || !result) {
        return;
    }

    const name =
        input.value.trim();

    if (!name) {

        result.innerHTML = `
            <div class="fighter-card">

                <h2>
                    Введите имя бойца
                </h2>

            </div>
        `;

        return;
    }

    result.innerHTML = `
        <div class="fighter-card">

            <h2>
                ПОИСК...
            </h2>

            <p>
                Ищем бойцов UFC...
            </p>

        </div>
    `;

    try {

        const searchResult =
            await searchUFCFighters(name);

        const fighters =
            searchResult.data || [];

        if (!fighters.length) {

            result.innerHTML = `
                <div class="fighter-card">

                    <h2>
                        Боец не найден
                    </h2>

                    <p>
                        Попробуйте другое имя.
                    </p>

                </div>
            `;

            return;
        }


        // ====================================
        // ПОКАЗЫВАЕМ ВСЕХ НАЙДЕННЫХ БОЙЦОВ
        // ====================================

        result.innerHTML = `

            <div class="fighter-search-results">

                <h2>
                    НАЙДЕННЫЕ БОЙЦЫ
                </h2>

                ${fighters.map(
                    fighter => {

                        const slug =
                            fighter.slug ||
                            fighter.id ||
                            "";

                        return `

                            <div class="fighter-card">

                                <h2>
                                    ${escapeHTML(
                                        fighter.name ||
                                        "Без имени"
                                    )}
                                </h2>


                                ${
                                    fighter.nickname
                                    ?
                                    `
                                    <h3>
                                        "${escapeHTML(
                                            fighter.nickname
                                        )}"
                                    </h3>
                                    `
                                    :
                                    ""
                                }


                                <p>
                                    <strong>
                                        Страна:
                                    </strong>

                                    ${escapeHTML(
                                        fighter.nationality ||
                                        "Нет данных"
                                    )}
                                </p>


                                <button
                                    class="fighter-button"
                                    onclick="loadFighterProfile('${escapeAttribute(slug)}')"
                                >
                                    ОТКРЫТЬ ПРОФИЛЬ
                                </button>

                            </div>

                        `;

                    }
                ).join("")}

            </div>

        `;

    } catch (error) {

        console.error(error);

        result.innerHTML = `

            <div class="fighter-card">

                <h2>
                    ОШИБКА
                </h2>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}


// ============================================
// ПРОФИЛЬ БОЙЦА
// ============================================

async function loadFighterProfile(slug) {

    const result =
        document.getElementById(
            "fighterResult"
        );

    if (!result) {
        return;
    }

    result.innerHTML = `

        <div class="fighter-card">

            <h2>
                ЗАГРУЗКА...
            </h2>

            <p>
                Получаем профиль бойца.
            </p>

        </div>

    `;

    try {

        const profileResult =
            await getUFCFighter(slug);

        const fighter =
            profileResult.data;

        if (!fighter) {

            throw new Error(
                "Профиль бойца не найден"
            );

        }


        // ====================================
        // RECORD
        // ====================================

        const records =
            fighter.records || {};

        const ufcRecord =
            records.ufc || {};

        const proRecord =
            records.pro_mma || {};


        // ====================================
        // СТАТИСТИКА
        // ====================================

        const stats =
            fighter.stats || {};


        // ====================================
        // ФОТО
        // ====================================

        let imageHTML = "";

        if (
            Array.isArray(fighter.images) &&
            fighter.images.length > 0
        ) {

            const image =
                fighter.images[0];

            if (image.url) {

                imageHTML = `

                    <div class="fighter-photo-wrapper">

                        <img
                            class="fighter-photo"
                            src="${escapeAttribute(image.url)}"
                            alt="${escapeAttribute(fighter.name)}"
                        >

                        <div class="photo-credit">

                            Фото:
                            ${escapeHTML(
                                image.artist ||
                                "Wikimedia Commons"
                            )}

                            ${
                                image.license
                                ?
                                `
                                ·
                                ${escapeHTML(
                                    image.license
                                )}
                                `
                                :
                                ""
                            }

                        </div>

                    </div>

                `;

            }

        }


        // ====================================
        // ФИЗИЧЕСКИЕ ДАННЫЕ
        // ====================================

        const height =
            fighter.height_inches
            ?
            `${Math.round(
                fighter.height_inches * 2.54
            )} см`
            :
            "Нет данных";

        const weight =
            fighter.weight_lbs
            ?
            `${Math.round(
                fighter.weight_lbs * 0.453592
            )} кг`
            :
            "Нет данных";

        const reach =
            fighter.reach_inches
            ?
            `${Math.round(
                fighter.reach_inches * 2.54
            )} см`
            :
            "Нет данных";


        // ====================================
        // ДИВИЗИОН
        // ====================================

        let division =
            fighter.division ||
            fighter.weight_class ||
            "";

        if (!division) {

            division =
                fighter.last_fight?.weight_class ||
                fighter.last_fight?.division ||
                "Нет данных";

        }


        // ====================================
        // РЕКОРД
        // ====================================

        const ufcRecordText =
            ufcRecord.value ||
            "Нет данных";

        const proRecordText =
            proRecord.value ||
            "Нет данных";


        // ====================================
        // СТАТИСТИКА
        // ====================================

        const statsHTML =
            createStatsHTML(stats);


        // ====================================
        // HTML ПРОФИЛЯ
        // ====================================

        result.innerHTML = `

            <div class="fighter-card">

                ${imageHTML}


                <h2>
                    ${escapeHTML(
                        fighter.name ||
                        "Без имени"
                    )}
                </h2>


                ${
                    fighter.nickname
                    ?
                    `
                    <h3>
                        "${escapeHTML(
                            fighter.nickname
                        )}"
                    </h3>
                    `
                    :
                    ""
                }


                <div class="fighter-info-grid">

                    <div class="info-item">

                        <span>
                            СТРАНА
                        </span>

                        <strong>
                            ${escapeHTML(
                                fighter.nationality ||
                                "Нет данных"
                            )}
                        </strong>

                    </div>


                    <div class="info-item">

                        <span>
                            ДИВИЗИОН
                        </span>

                        <strong>
                            ${escapeHTML(
                                division
                            )}
                        </strong>

                    </div>


                    <div class="info-item">

                        <span>
                            СТОЙКА
                        </span>

                        <strong>
                            ${escapeHTML(
                                fighter.stance ||
                                "Нет данных"
                            )}
                        </strong>

                    </div>


                    <div class="info-item">

                        <span>
                            КОМАНДА
                        </span>

                        <strong>
                            ${escapeHTML(
                                fighter.team ||
                                "Нет данных"
                            )}
                        </strong>

                    </div>

                </div>


                <hr>


                <h3>
                    ФИЗИЧЕСКИЕ ДАННЫЕ
                </h3>


                <div class="fighter-info-grid">

                    <div class="info-item">

                        <span>
                            РОСТ
                        </span>

                        <strong>
                            ${height}
                        </strong>

                    </div>


                    <div class="info-item">

                        <span>
                            ВЕС
                        </span>

                        <strong>
                            ${weight}
                        </strong>

                    </div>


                    <div class="info-item">

                        <span>
                            РАЗМАХ РУК
                        </span>

                        <strong>
                            ${reach}
                        </strong>

                    </div>


                    <div class="info-item">

                        <span>
                            ДАТА РОЖДЕНИЯ
                        </span>

                        <strong>
                            ${escapeHTML(
                                fighter.dob ||
                                "Нет данных"
                            )}
                        </strong>

                    </div>

                </div>


                <hr>


                <h3>
                    РЕКОРД
                </h3>


                <div class="record-box">

                    <div>

                        <strong>
                            UFC
                        </strong>

                        <span>
                            ${escapeHTML(
                                ufcRecordText
                            )}
                        </span>

                    </div>


                    <div>

                        <strong>
                            ПРОФЕССИОНАЛЬНЫЙ MMA
                        </strong>

                        <span>
                            ${escapeHTML(
                                proRecordText
                            )}
                        </span>

                    </div>

                </div>


                <hr>


                <h3>
                    СТАТИСТИКА
                </h3>


                ${statsHTML}


                <hr>


                <button
                    class="fighter-button"
                    onclick="showHistory('${escapeAttribute(slug)}')"
                >
                    ПОКАЗАТЬ ИСТОРИЮ БОЁВ
                </button>

            </div>

        `;


        await showHistory(slug);


    } catch (error) {

        console.error(
            "Ошибка профиля:",
            error
        );

        result.innerHTML = `

            <div class="fighter-card">

                <h2>
                    ОШИБКА ЗАГРУЗКИ
                </h2>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}


// ============================================
// СТАТИСТИКА
// ============================================

function createStatsHTML(stats) {

    if (
        !stats ||
        typeof stats !== "object"
    ) {

        return `
            <p>
                Статистика недоступна.
            </p>
        `;

    }


    const values = [

        ["SLpM", stats.slpm],

        ["Str. Acc.", stats.str_acc],

        ["SApM", stats.sapm],

        ["Str. Def.", stats.str_def],

        ["TD Avg.", stats.td_avg],

        ["TD Acc.", stats.td_acc],

        ["TD Def.", stats.td_def],

        ["Sub. Avg.", stats.sub_avg]

    ];


    return `

        <div class="stats-grid">

            ${values.map(
                item => {

                    const title =
                        item[0];

                    const value =
                        item[1];

                    return `

                        <div class="stat-box">

                            <span>
                                ${title}
                            </span>

                            <strong>
                                ${
                                    value !== null &&
                                    value !== undefined
                                    ?
                                    escapeHTML(
                                        String(value)
                                    )
                                    :
                                    "—"
                                }
                            </strong>

                        </div>

                    `;

                }
            ).join("")}

        </div>

    `;

}


// ============================================
// ИСТОРИЯ БОЁВ
// ============================================

async function showHistory(slug) {

    const historyContent =
        document.getElementById(
            "historyContent"
        );

    if (!historyContent) {
        return;
    }

    historyContent.innerHTML = `
        <p>
            Загрузка истории боёв...
        </p>
    `;

    try {

        const historyResult =
            await getFighterHistory(slug);

        const fights =
            historyResult.data || [];


        if (!fights.length) {

            historyContent.innerHTML = `
                <p>
                    История боёв не найдена.
                </p>
            `;

            return;

        }


        historyContent.innerHTML = `

            <div class="fight-history-list">

                ${fights.map(
                    fight => {

                        const opponent =
                            fight.opponent?.name ||
                            "Неизвестно";


                        const date =
                            fight.date ||
                            fight.event?.starts_at ||
                            "";


                        const status =
                            fight.status ||
                            "unknown";


                        const method =
                            fight.method_normalized ||
                            fight.method ||
                            "";


                        const round =
                            fight.round ||
                            "";


                        const time =
                            fight.time ||
                            "";


                        let statusClass =
                            "fight-unknown";


                        if (
                            status === "win"
                        ) {

                            statusClass =
                                "fight-win";

                        }


                        if (
                            status === "loss"
                        ) {

                            statusClass =
                                "fight-loss";

                        }


                        if (
                            status === "draw"
                        ) {

                            statusClass =
                                "fight-draw";

                        }


                        if (
                            status === "no_contest"
                        ) {

                            statusClass =
                                "fight-nc";

                        }


                        return `

                            <div
                                class="
                                    fight-history-card
                                    ${statusClass}
                                "
                            >

                                <div class="fight-result">

                                    ${escapeHTML(
                                        status.toUpperCase()
                                    )}

                                </div>


                                <h3>

                                    ${escapeHTML(
                                        opponent
                                    )}

                                </h3>


                                ${
                                    date
                                    ?
                                    `
                                    <p>

                                        <strong>
                                            Дата:
                                        </strong>

                                        ${escapeHTML(
                                            formatDate(
                                                date
                                            )
                                        )}

                                    </p>
                                    `
                                    :
                                    ""
                                }


                                ${
                                    method
                                    ?
                                    `
                                    <p>

                                        <strong>
                                            Метод:
                                        </strong>

                                        ${escapeHTML(
                                            method
                                        )}

                                    </p>
                                    `
                                    :
                                    ""
                                }


                                ${
                                    round
                                    ?
                                    `
                                    <p>

                                        <strong>
                                            Раунд:
                                        </strong>

                                        ${escapeHTML(
                                            String(round)
                                        )}

                                    </p>
                                    `
                                    :
                                    ""
                                }


                                ${
                                    time
                                    ?
                                    `
                                    <p>

                                        <strong>
                                            Время:
                                        </strong>

                                        ${escapeHTML(
                                            time
                                        )}

                                    </p>
                                    `
                                    :
                                    ""
                                }

                            </div>

                        `;

                    }
                ).join("")}

            </div>

        `;

    } catch (error) {

        console.error(
            "Ошибка истории:",
            error
        );

        historyContent.innerHTML = `

            <div class="fighter-card">

                <h2>
                    Ошибка истории
                </h2>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}


// ============================================
// БЛИЖАЙШИЕ UFC БОИ
// ============================================

async function loadUpcomingFights() {

    const container =
        document.getElementById(
            "fightsContainer"
        );

    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="fight-card">

            <h3>
                ЗАГРУЗКА...
            </h3>

            <p>
                Получаем ближайшие UFC события.
            </p>

        </div>

    `;


    try {

        const result =
            await getUpcomingEvents();


        console.log(
            "UFC EVENTS:",
            result
        );


        const events =
            result.data || [];


        if (!events.length) {

            container.innerHTML = `

                <div class="fight-card">

                    <h3>
                        Ближайших событий нет
                    </h3>

                </div>

            `;

            return;

        }


        // ====================================
        // ГЛАВНОЕ БЛИЖАЙШЕЕ СОБЫТИЕ
        // ====================================

        const nextEvent =
            events[0];


        renderNextEvent(
            nextEvent
        );


        // ====================================
        // СПИСОК СОБЫТИЙ
        // ====================================

        container.innerHTML =

            events
                .slice(0, 8)
                .map(
                    event => {

                        const headline =
                            event.headline ||
                            null;


                        const fighterA =
                            headline?.fighter_a?.name ||
                            "TBA";


                        const fighterB =
                            headline?.fighter_b?.name ||
                            "TBA";


                        const title =
                            event.title ||
                            event.short_title ||
                            "UFC Event";


                        const date =
                            event.starts_at
                            ?
                            formatEventDate(
                                event.starts_at
                            )
                            :
                            "Дата уточняется";


                        const weightClass =
                            headline?.weight_class ||
                            "Весовая категория уточняется";


                        return `

                            <div class="fight-card">

                                <div class="event-date">

                                    ${escapeHTML(
                                        date
                                    )}

                                </div>


                                <h3>

                                    ${escapeHTML(
                                        title
                                    )}

                                </h3>


                                <div class="main-fight">

                                    <strong>

                                        ${escapeHTML(
                                            fighterA
                                        )}

                                    </strong>


                                    <span>
                                        VS
                                    </span>


                                    <strong>

                                        ${escapeHTML(
                                            fighterB
                                        )}

                                    </strong>

                                </div>


                                <p>

                                    ${escapeHTML(
                                        weightClass
                                    )}

                                </p>

                            </div>

                        `;

                    }
                )
                .join("");


    } catch (error) {

        console.error(
            "Ошибка событий:",
            error
        );


        container.innerHTML = `

            <div class="fight-card">

                <h3>
                    ОШИБКА
                </h3>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}


// ============================================
// ГЛАВНОЕ СОБЫТИЕ
// ============================================

let countdownTimer = null;


function renderNextEvent(event) {

    if (!event) {
        return;
    }


    const title =
        event.title ||
        event.short_title ||
        "UFC";


    const headline =
        event.headline ||
        {};


    const fighterA =
        headline.fighter_a?.name ||
        "TBA";


    const fighterB =
        headline.fighter_b?.name ||
        "TBA";


    const titleElement =
        document.getElementById(
            "nextFightTitle"
        );


    const fightersElement =
        document.getElementById(
            "nextFightFighters"
        );


    const dateElement =
        document.getElementById(
            "nextFightDate"
        );


    const countdownElement =
        document.getElementById(
            "countdown"
        );


    if (titleElement) {

        titleElement.textContent =
            title;

    }


    if (fightersElement) {

        fightersElement.innerHTML = `

            <span>
                ${escapeHTML(
                    fighterA
                )}
            </span>

            <b>
                VS
            </b>

            <span>
                ${escapeHTML(
                    fighterB
                )}
            </span>

        `;

    }


    if (dateElement) {

        dateElement.textContent =
            event.starts_at
            ?
            formatEventDate(
                event.starts_at
            )
            :
            "Дата уточняется";

    }


    if (
        countdownElement &&
        event.starts_at
    ) {

        startCountdown(
            event.starts_at,
            countdownElement
        );

    }

}


// ============================================
// ТАЙМЕР
// ============================================

function startCountdown(
    dateString,
    element
) {

    if (countdownTimer) {

        clearInterval(
            countdownTimer
        );

    }


    const target =
        new Date(
            dateString
        ).getTime();


    function updateCountdown() {

        const now =
            Date.now();


        const difference =
            target - now;


        if (
            Number.isNaN(target)
        ) {

            element.innerHTML = `
                <p>
                    Время неизвестно
                </p>
            `;

            return;

        }


        if (
            difference <= 0
        ) {

            element.innerHTML = `

                <div class="countdown-finished">

                    СОБЫТИЕ НАЧАЛОСЬ

                </div>

            `;

            clearInterval(
                countdownTimer
            );

            return;

        }


        const days =
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            );


        const hours =
            Math.floor(
                (
                    difference %
                    (1000 * 60 * 60 * 24)
                )
                /
                (1000 * 60 * 60)
            );


        const minutes =
            Math.floor(
                (
                    difference %
                    (1000 * 60 * 60)
                )
                /
                (1000 * 60)
            );


        const seconds =
            Math.floor(
                (
                    difference %
                    (1000 * 60)
                )
                /
                1000
            );


        element.innerHTML = `

            <div class="countdown-box">

                <div>

                    <strong>
                        ${days}
                    </strong>

                    <span>
                        ДНЕЙ
                    </span>

                </div>


                <div>

                    <strong>
                        ${String(
                            hours
                        ).padStart(2, "0")}
                    </strong>

                    <span>
                        ЧАСОВ
                    </span>

                </div>


                <div>

                    <strong>
                        ${String(
                            minutes
                        ).padStart(2, "0")}
                    </strong>

                    <span>
                        МИНУТ
                    </span>

                </div>


                <div>

                    <strong>
                        ${String(
                            seconds
                        ).padStart(2, "0")}
                    </strong>

                    <span>
                        СЕКУНД
                    </span>

                </div>

            </div>

        `;

    }


    updateCountdown();


    countdownTimer =
        setInterval(
            updateCountdown,
            1000
        );

}


// ============================================
// ДАТА
// ============================================

function formatEventDate(
    dateString
) {

    if (!dateString) {

        return "Дата уточняется";

    }


    const date =
        new Date(
            dateString
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Дата уточняется";

    }


    return date.toLocaleString(
        "ru-RU",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


function formatDate(
    dateString
) {

    return formatEventDate(
        dateString
    );

}


// ============================================
// ENTER В ПОИСКЕ
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const input =
            document.getElementById(
                "fighterSearch"
            );


        if (input) {

            input.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter"
                    ) {

                        searchFighter();

                    }

                }
            );

        }


        // Загружаем ближайшие события

        loadUpcomingFights();

    }
);


// ============================================
// ЗАЩИТА HTML
// ============================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


function escapeAttribute(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replaceAll(
            "\\",
            "\\\\"
        )
        .replaceAll(
            "'",
            "\\'"
        );

}
