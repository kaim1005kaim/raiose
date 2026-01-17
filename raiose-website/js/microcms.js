// microCMS API Configuration
const MICROCMS_SERVICE_ID = 'raiose';
const MICROCMS_API_KEY = 'xXBGmj0Plvoaxl9NbmFLxC6UTu26JJSbvPxr';
const MICROCMS_BASE_URL = `https://${MICROCMS_SERVICE_ID}.microcms.io/api/v1`;

/**
 * Fetch news list from microCMS
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of items to fetch
 * @param {number} options.offset - Offset for pagination
 * @returns {Promise<Object>} - News data
 */
async function fetchNewsList(options = {}) {
    const { limit = 10, offset = 0 } = options;

    const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
    });

    try {
        const response = await fetch(`${MICROCMS_BASE_URL}/news?${params}`, {
            headers: {
                'X-MICROCMS-API-KEY': MICROCMS_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching news:', error);
        return { contents: [], totalCount: 0 };
    }
}

/**
 * Fetch single news article by ID
 * @param {string} id - Content ID
 * @returns {Promise<Object|null>} - News article data
 */
async function fetchNewsDetail(id) {
    try {
        const response = await fetch(`${MICROCMS_BASE_URL}/news/${id}`, {
            headers: {
                'X-MICROCMS-API-KEY': MICROCMS_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching news detail:', error);
        return null;
    }
}

/**
 * Fetch works/portfolio list from microCMS
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of items to fetch
 * @param {number} options.offset - Offset for pagination
 * @param {string} options.category - Filter by category (anime, video, web, 3dprint)
 * @returns {Promise<Object>} - Works data
 */
async function fetchWorksList(options = {}) {
    const { limit = 10, offset = 0, category = '' } = options;

    const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
    });

    // Add category filter if specified
    if (category) {
        params.append('filters', `category[equals]${category}`);
    }

    try {
        const response = await fetch(`${MICROCMS_BASE_URL}/works?${params}`, {
            headers: {
                'X-MICROCMS-API-KEY': MICROCMS_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching works:', error);
        return { contents: [], totalCount: 0 };
    }
}

/**
 * Fetch single work detail by ID
 * @param {string} id - Content ID
 * @returns {Promise<Object|null>} - Work data
 */
async function fetchWorkDetail(id) {
    try {
        const response = await fetch(`${MICROCMS_BASE_URL}/works/${id}`, {
            headers: {
                'X-MICROCMS-API-KEY': MICROCMS_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching work detail:', error);
        return null;
    }
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date (YYYY.MM.DD)
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

/**
 * Render news cards on the homepage
 * @param {string} containerId - Container element ID
 * @param {number} limit - Number of news to show
 */
async function renderNewsCards(containerId, limit = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Show loading state
    container.innerHTML = '<div class="loading">読み込み中...</div>';

    const data = await fetchNewsList({ limit });

    if (data.contents.length === 0) {
        container.innerHTML = '<p class="no-news">ニュースはありません</p>';
        return;
    }

    container.innerHTML = data.contents.map(article => `
        <article class="news-card">
            <a href="pages/news-detail.html?id=${article.id}" class="news-card-link">
                <div class="news-card-image" style="background-image: url('${article.thumbnail?.url || 'images/news/news-placeholder.png'}');"></div>
                <div class="news-card-content">
                    <time class="news-card-date">${formatDate(article.publishedAt || article.createdAt)}</time>
                    <span class="news-card-category">${article.category || 'お知らせ'}</span>
                    <h3>${article.title}</h3>
                    <p>${article.excerpt || ''}</p>
                    <span class="news-link">
                        続きを読む
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                </div>
            </a>
        </article>
    `).join('');

    // Trigger scroll reveal animations
    container.classList.add('revealed');
}

/**
 * Render news detail page
 */
async function renderNewsDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        document.querySelector('.news-detail-content').innerHTML = '<p>記事が見つかりません</p>';
        return;
    }

    const article = await fetchNewsDetail(id);

    if (!article) {
        document.querySelector('.news-detail-content').innerHTML = '<p>記事の読み込みに失敗しました</p>';
        return;
    }

    // Update page title
    document.title = `${article.title} - 株式会社Raiose`;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.content = article.excerpt || article.title;
    }

    // Render article
    const container = document.querySelector('.news-detail-content');
    if (container) {
        container.innerHTML = `
            <article class="news-article">
                <header class="news-article-header">
                    <time class="news-article-date">${formatDate(article.publishedAt || article.createdAt)}</time>
                    <span class="news-article-category">${article.category || 'お知らせ'}</span>
                    <h1 class="news-article-title">${article.title}</h1>
                </header>
                ${article.thumbnail?.url ? `
                    <div class="news-article-thumbnail">
                        <img src="${article.thumbnail.url}" alt="${article.title}">
                    </div>
                ` : ''}
                <div class="news-article-body">
                    ${article.content}
                </div>
            </article>
        `;
    }
}

/**
 * Render works cards for a specific service category
 * @param {string} containerId - Container element ID (e.g., 'works-anime')
 * @param {string} category - Category to filter (anime, video, web, 3dprint)
 * @param {number} limit - Number of works to show
 */
async function renderWorksCards(containerId, category, limit = 4) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Show loading state
    container.innerHTML = '<div class="works-loading">読み込み中...</div>';

    const data = await fetchWorksList({ limit, category });

    if (data.contents.length === 0) {
        container.innerHTML = '<p class="no-works">実績はまだありません</p>';
        return;
    }

    container.innerHTML = data.contents.map(work => `
        <div class="work-card" ${work.id ? `data-work-id="${work.id}"` : ''}>
            <div class="work-thumb" style="background-image:url('${work.thumbnail?.url || '../images/placeholder.png'}');"></div>
            <h4 class="work-title">${work.title}</h4>
            <p class="work-meta">${work.meta || ''}</p>
        </div>
    `).join('');

    // Trigger scroll reveal animations
    container.classList.add('revealed');
}

/**
 * Render all works for service page (loads all categories)
 */
async function renderAllServiceWorks() {
    const categories = ['anime', 'video', 'web', '3dprint'];

    for (const category of categories) {
        const containerId = `works-${category}`;
        await renderWorksCards(containerId, category, 4);
    }
}

/**
 * Render work detail modal or page
 * @param {string} workId - Work ID to display
 */
async function renderWorkDetail(workId) {
    const work = await fetchWorkDetail(workId);

    if (!work) {
        console.error('Work not found');
        return null;
    }

    return work;
}

// Export functions for use in other files
window.microCMS = {
    fetchNewsList,
    fetchNewsDetail,
    fetchWorksList,
    fetchWorkDetail,
    formatDate,
    renderNewsCards,
    renderNewsDetail,
    renderWorksCards,
    renderAllServiceWorks,
    renderWorkDetail,
};
