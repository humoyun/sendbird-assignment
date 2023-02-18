const colors = ["#44bb4d", "#F25F5C", "#FFE066", "#247BA0", "#70C1B3"];

class DynamicList {
  constructor(container, items = []) {
    this.container = container;
    this.popupElement = null;
    this.popupElement = null;

    const wrapper = document.createElement("div");
    const popupList = document.createElement("ul");

    addClass(wrapper, "popup-list__wrapper");
    addClass(popupList, "popup-list");

    items.forEach((item) => {
      const elem = this._createListItem(item);
      popupList.appendChild(elem);
    });

    this.popupElement = document.createElement("div");
    addClass(this.popupElement, "popup-list__popup-item"); // TODO: do we need this
    wrapper.appendChild(this.popupElement);
    wrapper.appendChild(popupList);

    container.appendChild(wrapper);
  }

  _mouseenterHandler() {
    const wrapper = this.parentElement.parentElement;
    const popupList = this.parentElement;

    const offsets = wrapper.getBoundingClientRect();
    wrapper.style.width = `calc(${offsets.width}px + 40px)`;
    popupList.style.width = `calc(${offsets.width}px`;

    this.style.transform = "translateX(40px)";

    if (this.previousElementSibling) {
      this.previousElementSibling.style.transform = "translateX(20px)";
    }

    if (this.nextElementSibling) {
      this.nextElementSibling.style.transform = "translateX(20px)";
    }
  }

  _mouseleaveHandler() {
    this.style.transform = "translateX(0px)";
    const wrapper = this.parentElement.parentElement;

    wrapper.style.width = "100%";
    if (this.previousElementSibling) {
      this.previousElementSibling.style.transform = "translateX(0px)";
    }

    if (this.nextElementSibling) {
      this.nextElementSibling.style.transform = "translateX(0px)";
    }
  }

  _createListItem(itemOpt) {
    const item = document.createElement("li");
    addClass(item, "popup-list__item");

    item.innerHTML = `${itemOpt?.label || "no content"}`;

    /**
     * attach necessary event handlers
     */
    item.addEventListener("mouseenter", this._mouseenterHandler);
    item.addEventListener("mouseleave", this._mouseleaveHandler);
    item.addEventListener("click", (e) => {
      this.popupElement.innerHTML = e.target.innerHTML;
      removeClass(this.popupElement, ["display-none"]);
      addClass(this.popupElement, ["display-show", "popup-item__modal"]);

      e.target.removeEventListener("mouseenter", this._mouseenterHandler);

      this.activeElement = e.target;
      let backdrop = document.querySelector(".popup-list__backdrop");
      if (!backdrop) {
        backdrop = this._createBackdrop();
        document.body.appendChild(backdrop);
      }
    });

    return item;
  }

  _createBackdrop() {
    const backdrop = document.createElement("div");
    addClass(backdrop, "popup-list__backdrop");

    backdrop.addEventListener("click", (e) => {
      document.body.removeChild(backdrop);
      if (this.activeElement) {
        addClass(this.popupElement, "display-none");

        removeClass(this.popupElement, ["display-show", "popup-item__modal"]);
      }
    });

    return backdrop;
  }
}

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
