export default (context, inject) => {
  inject('filterdocs', async function (docs, store) {
    for (let document of docs) {
      if (store.state.selectedTags[document.category.slug]["All"]) {
        document.hidden = false;
        continue; //All should be visible, continue
      } else {
        let filteredTags = store.state.selectedTags[document.category.slug];
        for (let tag of Object.keys(filteredTags)) {
          let visible = filteredTags[tag];
          if (document.tagTable[tag] && visible) {
            document.hidden = false;
            break;
          } else {
            document.hidden = true;
          }
        }
      }
    }
  });
}
