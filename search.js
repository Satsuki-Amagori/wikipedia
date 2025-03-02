const basePaths = [
    "/wikipedia/pages/facility/",
    "/wikipedia/pages/person/",
    "/wikipedia/pages/concept/",
    "/wikipedia/pages/history/"
];

async function checkPageExists(pageName) {
    for (const basePath of basePaths) {
        const url = `${basePath}${pageName}.html`;
        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (response.ok) {
                return url; // 最初に見つかったページのURLを返す
            }
        } catch (error) {
            console.error(`Error checking ${url}:`, error);
        }
    }
    return null; // どこにも見つからなかった場合
}

async function search() {
    const query = document.getElementById("search-box").value.trim();
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";

    if (query === "") return;

    const pageUrl = await checkPageExists(query);
    
    if (pageUrl) {
        const link = document.createElement("a");
        link.href = pageUrl;
        link.textContent = pageUrl;
        resultsContainer.appendChild(link);
    } else {
        resultsContainer.innerHTML = "<p>該当するページが見つかりません。</p>";
    }
}

document.getElementById("search-button").addEventListener("click", search);
document.getElementById("search-box").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        search();
    }
});
