landingPage = document.querySelector('.start-container');
countryListDiv = document.querySelector('.country-list');
countryPage = document.querySelector('.country-specific');
searchBar = document.querySelector("#start-search");
footer = document.querySelector(".footer")

// starting the website with the search bar and button to full list visible
landingPage.style.display = '';
searchBar.addEventListener("keyup", (event) => {
    if(event.keyCode == 13)
    {
        getCountryclasses(displayCountry, searchBar.value);
    }
})



// code for working of country list
// function to get list of country names using fetch API
async function getCountryList(callback)
{
    let countryNames = [];

    const res = await fetch('https://restcountries.com/v2/all', {
          headers: {
    'Accept': 'application/json'
  }
    })
    .then((res) => res.json())
    .then((res) => {
        res.forEach(country => {
            countryNames.push(country.name);
        });
    });
    
    callback(countryNames);
}

// code to display country names on website
function showCountryList(countryNames)
{
    let countryClasses = [];

    // making only the list of countries visible
    landingPage.style.display = 'none';
    countryListDiv.style.display = "";
    countryPage.style.display = 'none';

    countryNames.forEach(country => {
        const countryClassFinder = () => {
            return country.toLowerCase().split(' ').join('-');
        }

        let countryClass = countryClassFinder();
        countryClasses.push(countryClass);

        let countryName = document.createElement('p');
        countryName.classList.add(countryClass);

        let para = document.createTextNode(`${country}`);
        countryName.appendChild(para);
        countryListDiv.appendChild(countryName);
    })

    // adding navigation on for when user clicks a country's name
    countryListDiv.addEventListener("click", (e) => {
        if(e.target.nodeName == "P")
        {
            if(countryClasses.includes(e.target.className))
            {
                getCountryclasses(displayCountry, e.target.className);
            }
        }
    })
} 




// code for working of country display
// function to get country's name and class as an object
async function getCountryclasses(callback, country)
{
    let allCountryData = [];
    let countryMetas = [];

    const res = await fetch('https://restcountries.com/v2/all', 
    {
          headers: 
          {
            'Accept': 'application/json'
          }
    })
    .then((res) => res.json())
    .then((res) => {
        res.forEach(country => {
            let countryName = country.name.toLowerCase();
            let countryNameUp = country.name;
            let countryclass = countryName.split(' ').join('-');
            countryMetas.push({name: countryName, class: countryclass});
            
            let countryLanguages = [];
            country.languages.forEach(language => {
                countryLanguages.push(language.name);
            })

            allCountryData.push({name: countryName,
                nameup: countryNameUp, 
                flag: country.flags.png, 
                region: country.region, 
                languages: countryLanguages, 
                coordinates: country.latlng, 

                // extra data
                capital: country.capital, 
                subregion: country.subregion, 
                population: country.population, 
                nativename: country.nativeName, 
                independent: country.independent});
        });
    });
    callback(countryMetas, allCountryData, country);
}

// function to search and display country details
function displayCountry(countryMetas, allCountryData, country)
{
    console.log(countryMetas, allCountryData, country);
    // making the selected country's page visible and hiding the other pages
    landingPage.style.display = 'none';
    countryListDiv.style.display = 'none';
    countryPage.style.display = '';

    let searchCountry = false;

    countryMetas.forEach(countryMeta => {
        if(countryMeta.name == country.toLowerCase() || countryMeta.class == country)
        {
            searchCountry = countryMeta.name;        
            console.log(`country found ${searchCountry}`);
        }
    })

    return new Promise((resolve,reject) => {
        let heading = document.createElement('h1');
        let para = document.createElement('p');

        allCountryData.forEach(countryData => {
            if(searchCountry == countryData.name)
            {
                //adding name of the country
                let text = document.createTextNode(`${countryData.name.toUpperCase()}`);
                heading.appendChild(text);
                countryPage.appendChild(heading);

                //adding flag
                let mapContainer = document.createElement('div');
                mapContainer.classList.add("map-container");
                countryPage.appendChild(mapContainer);

                let img = document.createElement("img");
                img.src = countryData.flag;
                mapContainer.appendChild(img);

                //adding map
                let coords = {lat: countryData.coordinates[0], lng: countryData.coordinates[1]};

                let div = document.createElement('div');
                div.id = "map";
                mapContainer.appendChild(div);

                let options = {
                    zoom: 4,
                    center: coords
                }

                var map = new google.maps.Map(document.getElementById('map'), options);
                
                var marker = new google.maps.Marker({
                    position: coords,
                    map: map
                });
                //  map added
                
                //adding region
                text = document.createTextNode(`Region: ${countryData.region}`);
                para.appendChild(text);
                countryPage.appendChild(para);

                //adding languages (just the word)
                text = document.createTextNode(`Languages:  `);
                para = document.createElement('p');
                para.appendChild(text);
                countryPage.appendChild(para);

                //looping over all the languages spoken in the country and adding them to the para then displaying them
                countryData.languages.forEach(language => {
                    text = document.createTextNode(`${language}, `);
                    para.appendChild(text);
                    countryPage.appendChild(para);
                });

                // adding extra details about the country: 
                if(countryData.independent == true){
                    text = document.createTextNode(`${countryData.name} is an independent country from the ${countryData.subregion} subregion and has a population of ${countryData.population}. And the native name of the country is ${countryData.nativename}`);
                }
                else{
                    text = document.createTextNode(`${countryData.name} is not an independent country from the ${countryData.subregion} subregion and has a population of ${countryData.population}. And the native name of the country is ${countryData.nativename}`);
                }
                para = document.createElement('p');
                para.appendChild(text);
                countryPage.appendChild(para);
            }
        })

        if(searchCountry)
        {
            resolve();
        }
        else 
        {
            reject('COUNTRY NOT FOUND');
        }
    })
}

// AIzaSyCauNOnqe-MKLKyddYullDSjtBGtUR7nFA