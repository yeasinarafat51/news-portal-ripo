// /-----------fetch categories  API 
const loadCategories = () => {
    fetch('https://openapi.programming-hero.com/api/news/categories')
        .then(res => res.json())
        .then(data => displayCategories(data.data.news_category))
        .catch(error => console.log(error));
}

// -----------Display Categories...
const displayCategories = categories => {
    const categoriesContainer = document.getElementById('categories-container');
    // categoriesContainer.innerHTML = ``;
    categories.forEach(category => {
        // ---console.log(category);
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('pointer-cursor');
        categoryDiv.innerHTML = `
            ${category.category_name}
        `;
        categoriesContainer.appendChild(categoryDiv);
    })
}


loadCategories();


const spinnerSection = document.getElementById('spinner');

//------------Load News Category
const loadNews = category => {
    // show spinner
    spinnerSection.classList.remove('d-none');
    const url = `https://openapi.programming-hero.com/api/news/category/${category}`;
    fetch(url)
        .then(res => res.json())
        .then(data => displayNews(data.data, category));
}


const displayNews = (allNews, category) => {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = ``;

    const newsCount = document.getElementById('news-count');
    let count = 0;

    //-----------Sort News View...
    allNews.sort((a, b) => {
        return b.total_view - a.total_view;
    })
    allNews.forEach(news => {
        // console.log(news);
        count++;
        const newsDiv = document.createElement('div');
        newsDiv.className = "card mb-3 bg-white p-4";
        newsDiv.innerHTML = `
        <div class="row g-0">
            <div class="col-md-2">
                <img src="${news.thumbnail_url}" class="img-fluid rounded-start w-100" alt="...">
            </div>
            <div class="col-md-10 container-fluid">
                <div class="card-body d-flex flex-column h-100 justify-content-between">
                    <h5 class="card-title">${news.title}</h5>
                    <p class="card-text">${news.details.length > 400 ? news.details.slice(0, 700) + '...' : news.details}</p>
                    
                    <div class="d-flex justify-content-between">
                        <div class="d-flex gap-2 align-items-center">
                            <img  style="width: 40px; height: 40px; border-radius: 50%;" src="${news.author.img}" alt="">
                            <p class="mt-2">${news.author.name ? news.author.name : "No Author Name Found"}</p>
                        </div>
                        <div class="d-flex gap-2">
                            <p><i class="fa-regular fa-eye"></i></p>
                            <p>${news.total_view ? news.total_view : '0'}</p>
                        </div>
                        <div>
                            <p class="pointer-cursor" onclick="loadDetails('${news._id}')" data-bs-toggle="modal"
                            data-bs-target="#exampleModalScrollable"><i class="fa-solid fa-arrow-right-long"></i></p>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        `;
        newsContainer.appendChild(newsDiv);
    })


    //---------------Update Category
    let categoryName;
    fetch('https://openapi.programming-hero.com/api/news/categories')
        .then(res => res.json())
        .then(data => findCategoryName(data.data.news_category, category))
        .catch(error => console.log(error))

    const findCategoryName = (allCategories, categoryId) => {
        allCategories.forEach(c => {
            if (c.category_id === categoryId) {
                if (count === 0) {
                    newsCount.innerText = `No news found for category ${c.category_name}`;
                } else {
                    newsCount.innerText = `${count} item found for category ${c.category_name}`;
                }
            }
        })
    }

    //-------------Hide Spinner icon
    spinnerSection.classList.add('d-none');

}


//-------Load News Details ....
const loadDetails = newsId => {
    const url = `https://openapi.programming-hero.com/api/news/${newsId}`;
    fetch(url)
        .then(res => res.json())
        .then(data => displayDetails(data.data[0]))
        .catch(error => console.log(error))
}
const displayDetails = news => {
    console.log(news);
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
    <div class="modal-header">
        <h5 class="modal-title" id="exampleModalScrollableTitle">${news.title}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
        <h3>Author: ${news.author.name ? news.author.name : "Unknown Author"}</h3>
        <p><small>Date: ${news.author.published_date ? news.author.published_date : "No date found"}</small></p>
        <p><small>Total Views: ${news.total_view ? news.total_view : "0"}</small></p>
        <img class="img-fluid" src="${news.image_url}">
        <p class="mt-3">${news.details}</p>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </div>
    `;
}


//------- Category Id  and Call load news
document.getElementById('categories-container').addEventListener('click', (e) => {
    const selectCategory = e.target.innerText;
    fetch('https://openapi.programming-hero.com/api/news/categories')
        .then(res => res.json())
        .then(data => callLoadNewsByCategory(selectCategory, data.data.news_category))
        .catch(error => console.log(error))
});

const callLoadNewsByCategory = (selectCategory, categories) => {
    categories.forEach(category => {
        // console.log(category);
        if (category.category_name === selectCategory) {
            loadNews(`${category.category_id}`);
        }
    })
}

loadNews('01');