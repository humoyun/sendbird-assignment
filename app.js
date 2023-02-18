const init = () => {
  const container = document.querySelector(".container");
  const listItems = [];
  for (i = 1; i <= 100; i += 1) {
    listItems.push({ label: `${i}`, value: i, id: i });
  }

  new DynamicList(container, listItems);
};

window.onload = () => {
  init();
};
