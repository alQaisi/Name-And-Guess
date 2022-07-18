import { getNameDate,getCountiresData } from "./fetchActions.js";

const form=document.querySelector("form");
const inputBox=document.querySelector("input[type=text]");
const genderPic=document.querySelector(".genderPic")
const ageText=document.querySelector(".age");
const flagsCont=document.querySelector(".flagsCont");
const main=document.querySelector("main");
const loader=document.querySelector(".loader");
const namesContainer=document.querySelector(".namesContainer");

let store={};

inputBox.addEventListener("keyup",function(evt){
    let {value}=evt.target;
    value=value.replace(/[^a-z]/gi,'');
    evt.target.value=value;
});
function setAttribute(element,attributes){
    for(let attribute in attributes){
        element.setAttribute(attribute,attributes[attribute])
    }
}
function createCountriesElem(countries){
    flagsCont.replaceChildren([]);
    countries.forEach(country => {
        const countryContainer=document.createElement('div');
        countryContainer.className="flag";

        const flag=document.createElement("img");
        setAttribute(flag,{src:country.flag,alt:country.name});

        const overlay=document.createElement("div");
        overlay.className="overlay";

        const countryName=document.createElement("h4")
        countryName.textContent=country.name;

        overlay.append(countryName);

        countryContainer.append(flag);
        countryContainer.append(overlay);

        flagsCont.append(countryContainer);
    });
}

form.addEventListener("submit",async function(evt){
    evt.preventDefault();
    const name=inputBox.value.toLowerCase();
    const names=JSON.parse(localStorage.getItem("names"));
    
    if(names && !names.includes(name) || names==null){
        const newNames=names?[...names,name]:[name];
        localStorage.setItem("names",JSON.stringify(newNames));
    }
    if(names && names.includes(name)){
        return getStoredData(name);
    }
    loadNames();
    toggleMain();
    const {gender,nationality,age}=await getNameDate(name);
    if(!gender.gender){
        deleteName(name);
        location.reload();
    }
    setData(gender.gender,age.age);
    getCountries(nationality.country)
});

async function getCountries(countries){
    try{
        const countriesData=await getCountiresData(countries);
        store.countries=countriesData;
        createCountriesElem(countriesData);
        storeData(store);
    }catch(err){
    }finally{
        toggleMain();
    }
}

function setData(gender,age){
    setAttribute(genderPic,{src:`./images/${gender}.png`,alt:gender});
    ageText.textContent=`Age : ${age}`;
    store={gender,age};
}

function toggleMain(){
    main.classList.toggle("hidden");
    loader.classList.toggle("hidden");
}
function deleteName(evt){
    const name=typeof(evt)=="string"?evt:evt.target?.id;
    const names=JSON.parse(localStorage.getItem("names"));
    const index=names.indexOf(name);
    const newNames=names.slice(0,index).concat(names.slice(index+1));
    const data=JSON.parse(localStorage.getItem("data"));
    delete data[name];
    localStorage.setItem("names",JSON.stringify(newNames));
    localStorage.setItem("data",JSON.stringify(data));
    loadNames();
}
function getStoredData(name){
    const data=JSON.parse(localStorage.getItem("data"));
    const userData=data[name];
    setData(userData.gender,userData.age);
    createCountriesElem(userData.countries);
}
function storeData(store){
    const data=JSON.parse(localStorage.getItem("data"))
    const name=inputBox.value.toLowerCase();
    localStorage.setItem("data",JSON.stringify({...data,[name]:store}));
}
function loadNames(){
    const names=JSON.parse(localStorage.getItem("names"));
    names && namesContainer.replaceChildren([]);
    names && names.forEach(name=>{
        const nameElem=document.createElement("h3");
        nameElem.textContent=name;
        setAttribute(nameElem,{class:"SavedName",id:name});
        nameElem.addEventListener("click",deleteName);
        namesContainer.append(nameElem);
    });
}
loadNames();

