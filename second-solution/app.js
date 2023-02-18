const COLORS = ["#44bb4d", "#F25F5C", "#FFE066", "#247BA0", "#70C1B3"];

class DynamicList {
  constructor(container, items = []) {
    this.container = container;

    const wrapper = createElement("div");
    const popupList = createElement("ul");

    addClass(wrapper, "popup-list__wrapper");
    addClass(popupList, "popup-list");

    items.forEach((item) => {
      const elem = this._createListItem(item);
      popupList.appendChild(elem);
    });

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

  _mouseleaveHandler(e) {
    if (!this.activeElement) {
      const target = e.target;
      const wrapper = target.parentElement.parentElement;

      wrapper.style.width = "100%";

      target.style.transform = "translateX(0px)";
      if (target.previousElementSibling) {
        target.previousElementSibling.style.transform = "translateX(0px)";
      }

      if (target.nextElementSibling) {
        target.nextElementSibling.style.transform = "translateX(0px)";
      }
    }
  }

  _createListItem(itemOpt) {
    const item = createElement("li");
    addClass(item, "popup-list__item");

    item.innerHTML = `${itemOpt?.label || "no content"}`;

    /**
     * attach necessary event handlers
     */
    item.addEventListener("mouseenter", this._mouseenterHandler);
    item.addEventListener("mouseleave", (e) => this._mouseleaveHandler(e));
    item.addEventListener("click", () => {
      item.removeEventListener("mouseenter", this._mouseenterHandler);
      addClass(item, "popup-list__item-modal");
      removeClass(item, "popup-list__item");

      item.style.top = "50%";
      item.style.left = "50%";
      item.style.transform = "translate(-50%, -50%)";

      this.activeElement = item;
      let backdrop = document.querySelector(".popup-list__backdrop");
      if (!backdrop) {
        backdrop = this._createBackdrop();
        document.body.appendChild(backdrop);
      }
    });

    return item;
  }

  _createBackdrop() {
    const backdrop = createElement("div");
    addClass(backdrop, "popup-list__backdrop");

    backdrop.addEventListener("click", (e) => {
      document.body.removeChild(backdrop);
      if (this.activeElement) {
        this.activeElement.style.transform = "translateX(0px)";
        if (this.activeElement.previousElementSibling) {
          this.activeElement.previousElementSibling.style.transform =
            "translateX(0px)";
        }

        if (this.activeElement.nextElementSibling) {
          this.activeElement.nextElementSibling.style.transform =
            "translateX(0px)";
        }

        addClass(this.activeElement, "popup-list__item");
        removeClass(this.activeElement, "popup-list__item-modal");
        this.activeElement.addEventListener(
          "mouseenter",
          this._mouseenterHandler
        );
        this.activeElement = null;
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
