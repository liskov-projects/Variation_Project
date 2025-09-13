export default function filterSearch(items, query) {

  const itemsToShow = items.filter((items) => {
   
    const queryLowercase = query.toLowerCase();
    const founditems =
    items.description.toLowerCase().includes(queryLowercase) ||
    // these are for projects
      items.projectName?.toLowerCase().includes(queryLowercase) ||
      items.propertyAddress?.toLowerCase().includes(queryLowercase) ||
      items.clientName?.toLowerCase().includes(queryLowercase) ||
    // these are for variations
      items.reason?.toLowerCase().includes(queryLowercase) ||
      items.effect?.toLowerCase().includes(queryLowercase);
    return query.length === 0 || founditems;
  });
return itemsToShow
}