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
    main.classList.toggle("hidden");
    loader.classList.toggle("hidden");
}

form.addEventListener("submit",async function(evt){
    evt.preventDefault();
    
    const names=JSON.parse(localStorage.getItem("names"));
    if(names && !names.includes(inputBox.value) || names==null){
        const newNames=names?[...names,inputBox.value]:[inputBox.value];
        localStorage.setItem("names",JSON.stringify(newNames));
    }
    loadNames();

    main.classList.toggle("hidden");
    loader.classList.toggle("hidden");
    flagsCont.replaceChildren([]);
    const {gender,nationality,age}=await getNameDate(inputBox.value);
    
    setAttribute(genderPic,{src:`./images/${gender.gender}.png`,alt:gender.gender});
    ageText.textContent=`Age : ${age.age}`;

    if(nationality.country.length>0){
        const countries=await getCountiresData(nationality.country);
        createCountriesElem(countries);
    }else{
        main.classList.toggle("hidden");
        loader.classList.toggle("hidden");
    }
});

function loadNames(){
    const names=JSON.parse(localStorage.getItem("names"));
    names && namesContainer.replaceChildren([]);
    names && names.forEach(name=>{
        const nameElem=document.createElement("h3");
        nameElem.textContent=name;
        namesContainer.append(nameElem);
    });
}
loadNames();