import { getNameDate,getCountiresData } from "./fetchActions.js";

const form=document.querySelector("form");
const inputBox=document.querySelector("input[type=text]");
const genderPic=document.querySelector(".genderPic")
const ageText=document.querySelector(".age");
const flagsCont=document.querySelector(".flagsCont");
const main=document.querySelector("main");
const loader=document.querySelector(".loader");
const namesContainer=document.querySelector(".namesContainer");

inputBox.addEventListener("keyup",function(evt){
    let {value}=evt.target;
    value=value.replace(/\s/g, '');
    evt.target.value=value;
});
function setAttribute(element,attributes){
    for(let attribute in attributes){
        element.setAttribute(attribute,attributes[attribute])
    }
}
function createCountriesElem(countries){
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
    loadNames();
    main.classList.toggle("hidden");
    loader.classList.toggle("hidden");
    flagsCont.replaceChildren([]);
    const {gender,nationality,age}=await getNameDate(name);
    setAttribute(genderPic,{src:`./images/${gender.gender}.png`,alt:gender.gender});
    ageText.textContent=`Age : ${age.age}`;
    try{
        const countries=await getCountiresData(nationality.country);
        createCountriesElem(countries);
    }catch(err){
    }finally{
        main.classList.toggle("hidden");
        loader.classList.toggle("hidden");
    }
});

function deleteName(evt){
    const name=evt.target?.id;
    const names=JSON.parse(localStorage.getItem("names"));
    const index=names.indexOf(name);
    const newNames=names.slice(0,index).concat(names.slice(index+1));
    localStorage.setItem("names",JSON.stringify(newNames));
    loadNames();
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

