import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchImage from './js/fetchImageData';

const searchField = document.querySelector(".js-search-form");
const gallery = document.querySelector(".js-gallery");
const loadMoreBtn = document.querySelector(".js-load-more");
const endText = document.querySelector('.js-end-text');
const btn = document.querySelector(".js-btn");

function renderCardImage(arr) {
 const markup = arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
        <a href='${largeImageURL}'>
            <img class="photo-card__img" src="${webformatURL}" alt="${tags}" loading="lazy"/>
        </a>
        <div class="info">
            <p class="info-item">
                <b>Likes:<span class="info-count"> ${likes}</span></b>
            </p>
            <p class="info-item">
                <b>Views: <span class="info-count">${views}</span></b>
            </p>
            <p class="info-item">
                <b>Comments: <span class="info-count">${comments}</span></b>
            </p>
            <p class="info-item">
                <b>Downloads:<span class="info-count"> ${downloads}</span></b>
            </p>
        </div>
    </div>`
    }).join('');;
    gallery.insertAdjacentHTML('beforeend', markup);
 }
 
  const lightbox = new SimpleLightbox(".gallery a", {
    captionsData: "alt",
    captionDelay: 250,
  });

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

searchField.addEventListener('submit', onSearchFieldSubmit);

async function onSearchFieldSubmit(evt) {
  evt.preventDefault();

  searchQuery = evt.target.searchQuery.value;
  currentPage = 1;

  btn.disabled = true;
  btn.classList.add('disabled');

  if (searchQuery === '') {
     return;
  }
   
  const response = await fetchImage(searchQuery, currentPage);
  currentHits = response.hits.length;

  if (response.totalHits > 40) {
    evt.target.searchQuery.value = "";
    loadMoreBtn.classList.remove('is-hidden');
  }
  else {
    loadMoreBtn.classList.add('is-hidden');
   }
  try {
    
    if (response.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
      gallery.innerHTML = '';
      renderCardImage(response.hits);
      lightbox.refresh();
      endText.classList.add('is-hidden');

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * -100,
        behavior: 'smooth',
      });
    }

    if (response.totalHits === 0) {
      gallery.innerHTML = '';
      evt.target.searchQuery.value = "";
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      loadMoreBtn.classList.add('is-hidden');
      endText.classList.add('is-hidden');
    }
  } catch (err) {
    console.log(err);
  } btn.disabled = false;
    btn.classList.remove('disabled');
}

loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

async function onLoadMoreBtnClick() {
  currentPage += 1;
  const response = await fetchImage(searchQuery, currentPage);
  renderCardImage(response.hits);
  lightbox.refresh();
  currentHits += response.hits.length;

  if (currentHits === response.totalHits) {
    loadMoreBtn.classList.add('is-hidden');
    endText.classList.remove('is-hidden');
  }
}

