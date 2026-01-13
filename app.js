// 应用状态管理
const state = {
  searchQuery: '',
  selectedGenre: '全部类型',
  currentPage: 1,
  pageSize: 12,
  filteredGames: [...games]
};

// DOM元素引用
const domElements = {
  totalGames: document.getElementById('total-games'),
  searchInput: document.getElementById('search-input'),
  genreFilter: document.getElementById('genre-filter'),
  filteredCount: document.getElementById('filtered-count'),
  gameGrid: document.getElementById('game-grid'),
  startItem: document.getElementById('start-item'),
  endItem: document.getElementById('end-item'),
  totalItems: document.getElementById('total-items'),
  prevPage: document.getElementById('prev-page'),
  nextPage: document.getElementById('next-page'),
  pageNumbers: document.getElementById('page-numbers'),
  pageSize: document.getElementById('pageSize')
};

// 初始化应用
function initApp() {
  // 设置游戏总数
  domElements.totalGames.textContent = games.length;
  
  // 初始化游戏类型筛选器
  initGenreFilter();
  
  // 初始化事件监听器
  initEventListeners();
  
  // 初始渲染
  filterAndRenderGames();
}

// 初始化游戏类型筛选器
function initGenreFilter() {
  domElements.genreFilter.innerHTML = '';
  
  gameGenres.forEach(genre => {
    const button = document.createElement('button');
    button.className = `genre-button ${genre === state.selectedGenre ? 'active' : ''}`;
    button.textContent = genre;
    button.dataset.genre = genre;
    
    button.addEventListener('click', () => {
      // 移除其他按钮的激活状态
      document.querySelectorAll('.genre-button').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // 设置当前按钮为激活状态
      button.classList.add('active');
      
      // 更新状态并重新渲染
      state.selectedGenre = genre;
      state.currentPage = 1; // 重置到第一页
      filterAndRenderGames();
    });
    
    domElements.genreFilter.appendChild(button);
  });
}

// 初始化事件监听器
function initEventListeners() {
  // 搜索输入监听
  domElements.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase();
    state.currentPage = 1; // 重置到第一页
    filterAndRenderGames();
  });
  
  // 分页按钮监听
  domElements.prevPage.addEventListener('click', () => {
    if (state.currentPage > 1) {
      state.currentPage--;
      filterAndRenderGames();
      scrollToTop();
    }
  });
  
  domElements.nextPage.addEventListener('click', () => {
    const totalPages = Math.ceil(state.filteredGames.length / state.pageSize);
    if (state.currentPage < totalPages) {
      state.currentPage++;
      filterAndRenderGames();
      scrollToTop();
    }
  });
  
  // 每页显示数量监听
  domElements.pageSize.addEventListener('change', (e) => {
    state.pageSize = parseInt(e.target.value);
    state.currentPage = 1; // 重置到第一页
    filterAndRenderGames();
  });
}

// 筛选和渲染游戏
function filterAndRenderGames() {
  // 筛选游戏
  filterGames();
  
  // 更新筛选计数
  domElements.filteredCount.textContent = state.filteredGames.length;
  
  // 更新分页信息
  updatePaginationInfo();
  
  // 渲染游戏网格
  renderGameGrid();
  
  // 渲染分页控件
  renderPagination();
}

// 筛选游戏
function filterGames() {
  state.filteredGames = games.filter(game => {
    // 按名称和描述搜索
    const matchesSearch = state.searchQuery === '' || 
      game.title.toLowerCase().includes(state.searchQuery) ||
      game.description.toLowerCase().includes(state.searchQuery);
    
    // 按类型筛选
    const matchesGenre = state.selectedGenre === '全部类型' || 
      game.genre.includes(state.selectedGenre);
    
    return matchesSearch && matchesGenre;
  });
}

// 更新分页信息
function updatePaginationInfo() {
  const startIndex = (state.currentPage - 1) * state.pageSize;
  const endIndex = Math.min(startIndex + state.pageSize, state.filteredGames.length);
  
  domElements.startItem.textContent = startIndex + 1;
  domElements.endItem.textContent = endIndex;
  domElements.totalItems.textContent = state.filteredGames.length;
}

// 渲染游戏网格
function renderGameGrid() {
  // 清空当前网格
  domElements.gameGrid.innerHTML = '';
  
  // 如果没有匹配的游戏
  if (state.filteredGames.length === 0) {
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.innerHTML = `
      <div class="no-results-icon">🎮</div>
      <h3>未找到匹配的游戏</h3>
      <p>请尝试其他搜索词或游戏类型</p>
    `;
    domElements.gameGrid.appendChild(noResults);
    return;
  }
  
  // 计算当前页的游戏
  const startIndex = (state.currentPage - 1) * state.pageSize;
  const endIndex = Math.min(startIndex + state.pageSize, state.filteredGames.length);
  const currentPageGames = state.filteredGames.slice(startIndex, endIndex);
  
  // 渲染游戏卡片
  currentPageGames.forEach(game => {
    const gameCard = createGameCard(game);
    domElements.gameGrid.appendChild(gameCard);
  });
}

// 创建游戏卡片
function createGameCard(game) {
  const card = document.createElement('a');
  card.className = 'game-card';
  card.href = game.officialWebsite;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  card.title = `访问${game.title}官方网站`;
  
  // 构建游戏类型标签
  const genreTags = game.genre.map(genre => 
    `<span class="genre-tag">${genre}</span>`
  ).join('');
  
  card.innerHTML = `
    <div class="game-image">
      <img src="${game.image}" alt="${game.title}" onerror="this.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop'" />
      <div class="website-badge">官网</div>
    </div>
    <div class="game-info">
      <h3 class="game-title">${game.title}</h3>
      <div class="game-meta">
        <span class="game-rating">⭐ ${game.rating}</span>
        <span class="game-year">📅 ${game.releaseYear}</span>
      </div>
      <div class="game-genres">
        ${genreTags}
      </div>
      <p class="game-description">${game.description}</p>
      <div class="game-footer">
        <div class="game-developer">开发商: ${game.developer}</div>
        <div class="visit-website">
          访问官网 ↗
        </div>
      </div>
    </div>
  `;
  
  return card;
}

// 渲染分页控件
function renderPagination() {
  const totalPages = Math.ceil(state.filteredGames.length / state.pageSize);
  
  // 更新上一页/下一页按钮状态
  domElements.prevPage.disabled = state.currentPage === 1;
  domElements.nextPage.disabled = state.currentPage === totalPages;
  
  // 清空页码按钮
  domElements.pageNumbers.innerHTML = '';
  
  // 计算要显示的页码
  const maxVisiblePages = 5;
  let startPage = Math.max(1, state.currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  // 创建页码按钮
  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement('button');
    pageButton.className = `page-number ${i === state.currentPage ? 'active' : ''}`;
    pageButton.textContent = i;
    
    pageButton.addEventListener('click', () => {
      state.currentPage = i;
      filterAndRenderGames();
      scrollToTop();
    });
    
    domElements.pageNumbers.appendChild(pageButton);
  }
}

// 滚动到顶部
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 动态插入广告脚本（防止重复插入）
function loadAdScript() {
  if (!document.querySelector('script.adScriptClass')) {
    const script = document.createElement('script');
    script.src = 'https://affiliates.serv.adse.site/assets/ads/ad.js';
    script.className = 'adScriptClass';
    script.async = true;
    document.body.appendChild(script);
  }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  loadAdScript();
});