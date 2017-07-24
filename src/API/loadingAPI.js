export const setLoading = (isStillLoading) => {
  if(Array.isArray(isStillLoading)){
    localStorage.setItem('isStillLoading', JSON.stringify(isStillLoading));
  }
}

export const getLoading = () => {
  const isStillLoadingJSON = localStorage.getItem('isLoading');
  let isStillLoading = [];
  try {
    isStillLoading = JSON.parse(isStillLoadingJSON);
  }catch(e){
    console.log("Error: Cound not decode preferences from localstorage");
  }
  return Array.isArray(isStillLoading) ? isStillLoading : [];
}
