export const state = () => ({
  tags: {},
  tagsArray: [],
  selectedTags:{},
  tagsQuery:"",
  categories: {},
  categoriesArray: []
})

export const mutations = {
  updateCategoriesAndTags(state, p){

    state.categoriesArray = p.categories;
    let obj1 = {};
    let selectedTags = {};
    for (let i = 0; i < p.categories.length; i++) {
      obj1[p.categories[i].slug] = p.categories[i];
      selectedTags[p.categories[i].slug] = {"All":true};
      for (let j = 0; j < p.categories[i].tags.length; j++) {
        selectedTags[p.categories[i].slug][p.categories[i].tags[j].name] = false;
      }
    }
    state.categories = obj1;
    state.selectedTags = selectedTags;

    state.tagsArray = p.tags;
    let obj2 = {};
    for (let i = 0; i < p.tags.length; i++) {
      obj2[p.tags[i].name] = p.tags[i];
    }
    state.tags = obj2;
  },
  selectTag(state, p){
    let allFalse = true;
      for (let tag of Object.keys(state.selectedTags[p.category])) {
        if(tag==p.tag){
          if(state.selectedTags[p.category][tag]){
            state.selectedTags[p.category][tag] = false;
          }
          else{
            state.selectedTags[p.category][tag] = true;
            allFalse = false;
          }
        }
        else if(p.deselect || tag == "All"){
          state.selectedTags[p.category][tag] = false;
        }
      }
      if(allFalse){
        state.selectedTags[p.category]["All"] = true;
      }
  },
  selectAllTags(state, p){
    for (let tag of Object.keys(state.selectedTags[p.category])) {
      state.selectedTags[p.category][tag] = (tag == "All");
    }
  },
  queryToSelection(state, query){
    console.log("Query to selection");
    for(let category of Object.keys(query)){
      console.log("category="+category);
      let selection = query[category].split(',');
      state.selectedTags[category]["All"] = false;
      selection.forEach(tag => {
        state.selectedTags[category][decodeURIComponent(tag)] = true;
      });
    }
  }
}

export const getters = {
  tagsForCategory: (state) => (slug) =>{
    let tags = [];
    for (let i = 0; i < state.categories[slug].tags.length; i++) {
      const tag = state.categories[slug].tags[i];
      tags.push(state.tags[tag.name]);
    }
    return tags;
  },
  queryString:(state) =>{
    let querybuilder = {};
    for(let category of Object.keys(state.selectedTags)){
      for(let tag of Object.keys(state.selectedTags[category])){
        //Add every tag which is true, except "All"
        if(state.selectedTags[category][tag] === true && tag != "All"){
          if(!querybuilder[category]) querybuilder[category] = [];
          querybuilder[category].push(encodeURIComponent(tag));
        }
      }
    }
    let queryobj = {};
    let empty = true;
    for(let category of Object.keys(querybuilder)){
      empty = false;
      queryobj[category] = querybuilder[category].join(',');
    }
    if(empty) return null
    else return queryobj;
    console.log(querybuilder);
    let queries = [];
    for(let category of Object.keys(querybuilder)){
      queries.push(category + "="+ querybuilder[category].join(','));
    }
    return new URLSearchParams(querybuilder).toString();
  }
}
