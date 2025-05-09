const API_KEY = '2dc79949';
const BASE_URL = 'https://www.omdbapi.com/';

const inputMoveElement = document.querySelector('#searchMoveInput') as HTMLInputElement;
const movieContainerElement = document.querySelector('#movieContainer') as HTMLElement;
const errorContainerElement = document.querySelector('#errorContainer') as HTMLElement;

inputMoveElement.addEventListener('input', onInputText);

enum RespResult{
    True= 'True',
    False = 'False'
}

type SearchResponse = {
    Search: SearchMove[];
    totalResults: string;
    Response: RespResult;
    Error?: string;
}

type SearchMove = {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
}

async function onInputText():Promise<void> {
    movieContainerElement.innerHTML = ''
    errorContainerElement.innerHTML = ''
    const searchText:string = inputMoveElement.value.trim();
    if (!searchText) {
        errorContainerElement.innerHTML = 'The search string is empty';
        return;
    }
    try{
        const movies:SearchMove[] = await onSearchMovie(searchText);
        movieContainerElement.innerHTML = movies.map(movie => getHtmlForMovie(movie)).join('');
    }catch(error: unknown){
       if(error instanceof Error){
           errorContainerElement.innerHTML = `<div class="error">${error.message}</div>`;
       }else{
           errorContainerElement.innerHTML = `<div class="error">An unknown error occurred</div>`;
       }
    }
}


async function onSearchMovie(searchKey: string):Promise<SearchMove[]> {
    const url = `${BASE_URL}?apikey=${API_KEY}&s=${searchKey}`;

    try{
        const response: Response = await fetch(url);
        if(!response.ok){
            throw new Error(`HTTP Error: ${response.status}`);
        }
        const movieData: SearchResponse = await response.json();
        if(movieData.Response === RespResult.False || !movieData.Search){
            throw new Error(movieData.Error || 'No movies found');
        }
        return movieData.Search;
    } catch (error: unknown) {
        throw new Error('Movies is not found');
    }
}


function getHtmlForMovie(movieData:SearchMove):string {
    const imgUrl:string = movieData.Poster?.startsWith('http') ? movieData.Poster : 'images/noImages.jpg';
    return`<div class="movie">
    <img src="${imgUrl}" alt="">
    <p>${movieData.Title}</p>
    <p>${movieData.Year}</p>
    </div>`
}

