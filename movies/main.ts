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

type SearchMove = {
    Title: string,
    Year: string,
    imdbID: string,
    Type: string,
    Poster: string
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
        const movies:SearchMove[] = await onSearchMovie(inputMoveElement.value);
        movieContainerElement.innerHTML = movies.map(movie => getHtmlForMovie(movie)).join('');
    }catch(RespResult: unknown){
        const error = RespResult as Error;
        errorContainerElement.innerHTML = `<div class="error">${error.message}</div>`;
    }
}


async function onSearchMovie(searchKey: string):Promise<SearchMove[]> {
    const url = `${BASE_URL}?apikey=${API_KEY}&s=${searchKey}`;
   const movieData: any = await fetch(url)
       .then(res   => res.json())
        .then(response => {
            if (response.Response === 'False') {
                throw Error(response.Error);
            }
            return response;
        })
    return movieData?.Search;
}


function getHtmlForMovie(movieData:SearchMove):string {
    const imgUrl:string = movieData.Poster?.startsWith('http') ? movieData.Poster : 'images/noImages.jpg';
    return`<div class="movie">
    <img src="${imgUrl}" alt="">
    <p>${movieData.Title}</p>
    <p>${movieData.Year}</p>
    </div>`
}

