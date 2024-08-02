import PEXEL_ACCESS_KEY from './config.js'

const row1 = document.getElementById('row1');
const row2 = document.getElementById('row2');
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/200x150?text=Image+Not+Found';

const IMAGE_COUNT_PER_ROW = 10;
const SCROLL_ITEM_CLASS = 'scroll-item';

// fetch all images from image api
/**
 * query : 
 */
async function fetchImages(query){
    const promises = [];

    for (let i = 0; i < IMAGE_COUNT_PER_ROW; i++){
        const url = `https://api.pexels.com/v1/search?query=${query}&per_page=1&page=${Math.floor(Math.random() * 100) + 1}`;
        promises.push(fetch(url, { headers : { Authorization: PEXEL_ACCESS_KEY } })
            .then(res => res.json())
            .then(data => data.photos[0].src.large)
            .catch(error => PLACEHOLDER_IMAGE))
    }

    const imageUrls = await Promise.all(promises)
    return imageUrls;
}


// create image tag function
function createImageItem(imageUrl){
    const item = document.createElement('div');
    item.className = SCROLL_ITEM_CLASS;

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Image';
    img.onerror = () => img.src = PLACEHOLDER_IMAGE;

    item.appendChild(img);
    return item;
}

// to populateRow with Image
async function populateRow(rowElement, query){
    const imageUrls = await fetchImages(query);
    imageUrls.forEach(imageUrl => {
        const item = createImageItem(imageUrl)
        rowElement.appendChild(item)
    })
}


// scrolling event 
function handleScroll(event){
    event.preventDefault();

    requestAnimationFrame(() => {
        const scrollAmount = event.deltaY;
        row1.scrollBy({ left : -scrollAmount * 0.7, behavior : 'smooth'});
        row2.scrollBy({ left : scrollAmount * 1.25, behavior : 'smooth'});
    })
}


// init function
async function init(){
    try{
        await populateRow(row1, 'nature')
        await populateRow(row2, 'city')
    } catch(error){
        console.error('Error fetching initial images:', error)
    }

    window.addEventListener('wheel', handleScroll, { passive : false })
}

init();