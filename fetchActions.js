export async function getNameDate(name){
    const genderApi=`https://api.genderize.io/?name=${name}`;
    const nationalityApi=`https://api.nationalize.io/?name=${name}`;
    const ageApi=`https://api.agify.io/?name=${name}`;
    const apis=[genderApi,nationalityApi,ageApi]
    try{
        const [gender,nationality,age]=await Promise.all(apis.map(async function(api){
            const response=await fetch(api);
            return await response.json();
        }));
        return({gender,nationality,age});
    }catch(err){
        console.log(err);
    }
}

export async function getCountiresData(countriesCodes){
    try{
        const countries=await Promise.all(countriesCodes.map(async function(country){
            const response=await fetch(`https://restcountries.com/v2/alpha/${country.country_id}`);
            const {name,flag}=await response.json();
            return {name,flag};
        }));
        return countries;
    }catch(err){
        console.log(err)
    }
    
} 

