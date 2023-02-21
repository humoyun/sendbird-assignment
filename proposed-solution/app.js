const init = () => {
  const container = document.querySelector(".container");
  const listItems = [];
  for (i = 1; i <= 100; i += 1) {
    listItems.push({ label: `${i}`, value: i, id: i });
  }

  new DynamicPopupList(container, listItems, {
    container: { height: 500 },
    item: { shiftLength: 40 },
  });
};

window.onload = () => {
  init();
};
