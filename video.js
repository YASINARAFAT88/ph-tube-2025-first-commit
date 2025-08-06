// time: hours minutes seconds
function timeString(time) {
    
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours.toString().padStart(2, '0')} h : ${minutes.toString().padStart(2, '0')} mint : ${seconds.toString().padStart(2, '0')} sec `;
    
}

// fetch, load, and show categories in html

// Load categories from the API
const loadCategories = async () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
    .then(response => response.json())
    .then(data => displayCategories(data.categories))
    .catch(error => console.error('Error fetching categories:', error));
}

// Load videos from the API
const loadVideos = async () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/videos')
    .then(response => response.json())
    .then(data => displayVideos(data.videos))
    .catch(error => console.error('Error fetching categories:', error));
}

// load videos from the API based on category
const loadCategoriyVideos = (id) => {
    // alert(id);
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then(response => response.json())
    .then(data => displayVideos(data.category))
}

// show displayCategories
const displayCategories = (categories) => {
    const categoryContainer = document.getElementById('category-container');
    categories.map((item)=>{
    const buttonContainer = document.createElement('div');
    buttonContainer.innerHTML = `
    <button onclick="loadCategoriyVideos(${item.category_id})" class="btn btn-ghost btn-sm rounded-btn">
      ${item.category}
    </button>
    `
    categoryContainer.append(buttonContainer);
    })
}

// show displayVideos
const displayVideos = (videos) => {
    const videoContainer = document.getElementById('videos');
    videoContainer.innerHTML = ''; // Clear previous videos
    videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.classList = "card card-compact bg-base-100 shadow-xl";
        videoCard.innerHTML = `
        <figure class="w-full h-[200px] relative">
    <img
      src="${video.thumbnail}" 
      class="w-full h-full object-cover"/>
      ${video.others.posted_date.length > 0 ? `<span class="absolute right-2 bottom-2 text-xs rounded bg-black bg-opacity-50 text-white px-1">${timeString(video.others.posted_date)}</span>` : ''}
  </figure>



  <div class="px-0 py-2 flex gap-2">
    <div>
      <img class="w-10 h-10 rounded-full object-cover" src=${video.authors[0].profile_picture}/>
    </div>
    <div>
      <h2 class="font-bold">${video.title}</h2>
      <div class="flex items-center gap-2">
      <p class="text-gray-400">${video.authors[0].profile_name} </p>
      ${video.authors[0].verified === true ? '<img class="w-4 h-4" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png">' : ''}
      </div>
      <p></p>
      <p></p>
      </div>
  </div>
        `;
        videoContainer.appendChild(videoCard);
    });
}
// Call the function to load categories
loadCategories();
loadVideos();