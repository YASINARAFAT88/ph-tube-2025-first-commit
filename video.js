// time: hours minutes seconds
function timeString(time) {
    
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours.toString().padStart(2, '0')} h : ${minutes.toString().padStart(2, '0')} mint : ${seconds.toString().padStart(2, '0')} sec `;
    
}

// remove the active class from all buttons
const removeActiveClass = () => {
    const activeButtons = document.querySelectorAll('.category-btn.active');
    activeButtons.forEach(button => {
        button.classList.remove('active');
    });
}

// show video details
const showVideoDetails = async (videoId) => {
    console.log(videoId);
    const response = await fetch(`https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`);
    const data = await response.json();
    displayVideoDetails(data.video);
}

// display video details in a modal
const displayVideoDetails = (video) => {
    console.log(video);
    const modal = document.getElementById('modal-content');
    modal.innerHTML = `
    <img src="${video.thumbnail}" class="w-full h-[300px] object-cover" alt="Video Thumbnail">
    <h2 class="text-xl font-bold mt-4">${video.title}</h2>
    <p class="text-gray-500 mt-2">${video.description}</p>
    <div class="flex items-center gap-2 mt-4">
        <img src="${video.authors[0].profile_picture}" class="w-10 h-10 rounded-full object-cover" alt="Author Profile Picture">
        <div>
            <p class="font-bold">${video.authors[0].profile_name}</p>
            ${video.authors[0].verified ? '<img class="w-4 h-4" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png">' : ''}
        </div>
    `

    document.getElementById('showModal').click();
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
    fetch('https://openapi.programming-hero.com/api/phero-tube/videos?title=')
    .then(response => response.json())
    .then(data => displayVideos(data.videos))
    .catch(error => console.error('Error fetching categories:', error));
}

// load videos from the API based on category
const loadCategoriyVideos = (id) => {
    // alert(id);
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then(response => response.json())
    .then(data => {
        // Remove active class from all buttons
        removeActiveClass();
        const activeButton = document.getElementById(`category-${id}`);
        activeButton.classList.add('active');
        console.log(activeButton);
        displayVideos(data.category)
    })
}

// show displayCategories
const displayCategories = (categories) => {
    const categoryContainer = document.getElementById('category-container');
    categories.map((item)=>{
    const buttonContainer = document.createElement('div');
    buttonContainer.innerHTML = `
    <button id="category-${item.category_id}" onclick="loadCategoriyVideos(${item.category_id})" class="btn btn-ghost category-btn btn-sm rounded-btn">
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
    if (videos.length === 0) {
        videoContainer.classList.remove('grid');
        videoContainer.innerHTML = `
        <div class="flex flex-col justify-center items-center min-h[300px]">
         <img src="icon.png" alt="No videos found">
        <h1 class="text-center text-gray-500">No videos found for this category.</h1>
        </div>
        `;
        return;
    }else{
        videoContainer.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4');
        videoContainer.classList.remove('flex', 'justify-center', 'items-center', 'h-screen');
    }
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
      <p>
      <button onclick="showVideoDetails('${video.video_id}')" class="btn btn-sm btn-ghost text-gray-500 hover:text-gray-700">
        details
      </button>
      </p>
      <p></p>
      </div>
  </div>
        `;
        videoContainer.appendChild(videoCard);
    });
}

// Event listener for search input
document.getElementById('search-input').addEventListener('keyup', function() {
    const query = this.value.toLowerCase();
    const videoCards = document.querySelectorAll('#videos .card');
    videoCards.forEach(card => {
        const title = card.querySelector('h2').textContent.toLowerCase();
        if (title.includes(query)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
});

// Call the function to load categories
loadCategories();
loadVideos();