const DEFAULT_OPTIONS = {
  container: { height: 500 },
  item: { shiftLength: 20 },
};

class DynamicPopupList {
  constructor(container, items = [], options = DEFAULT_OPTIONS) {
    // just simple checks for options
    if (!container) throw new Error("please provide valid container element");
    if (
      (!!options && (!options.container || !options.item)) ||
      !options.container.height ||
      !options.item.shiftLength
    )
      throw new Error(
        "please either provide valid options or just use default options"
      );

    this.container = container;
    this.options = options;
    this.activeElement = null;
    this.popupElement = document.createElement("div");

    addClass(this.popupElement, ["display-none"]);
    container.appendChild(this.popupElement);

    const wrapper = createElement("div");
    wrapper.style.height = `${options.container.height}px`;
    wrapper.style.overflowY = "scroll";
    addClass(wrapper, "popup-list__wrapper");

    const popupList = createElement("ul");
    addClass(popupList, "popup-list");

    items.forEach((item) => {
      const elem = this._createListItem(item);
      popupList.appendChild(elem);
    });

    wrapper.appendChild(popupList);

    container.appendChild(wrapper);
  }

  _mouseenterHandler(e) {
    const { shiftLength } = this.options.item;

    const target = e.target;
    const wrapper = target.parentElement.parentElement;
    const popupList = target.parentElement;

    const offsets = wrapper.getBoundingClientRect();
    wrapper.style.width = `calc(${offsets.width}px + ${shiftLength}px)`;
    popupList.style.width = `calc(${offsets.width}px`;

    target.style.transform = `translateX(${shiftLength}px)`;

    if (target.previousElementSibling) {
      target.previousElementSibling.style.transform = `translateX(${
        shiftLength / 2
      }px)`;
    }

    if (target.nextElementSibling) {
      target.nextElementSibling.style.transform = `translateX(${
        shiftLength / 2
      }px)`;
    }
  }

  _mouseleaveHandler(e) {
    if (!this.activeElement) {
      const target = e.target;
      const wrapper = target.parentElement.parentElement;
      const list = target.parentElement;

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
    item.addEventListener("mouseenter", (e) => this._mouseenterHandler(e));
    item.addEventListener("mouseleave", (e) => this._mouseleaveHandler(e));
    item.addEventListener("click", () => {
      removeClass(this.popupElement, "display-none");
      addClass(this.popupElement, ["popup-list__item-modal", "display-show"]);

      this.popupElement.innerHTML = item.innerHTML;
      this.popupElement.style.top = "50%";
      this.popupElement.style.left = "50%";
      this.popupElement.style.transform = "translate(-50%, -50%)";

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

    backdrop.addEventListener("click", () => {
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
        const wrapper = this.activeElement.parentElement.parentElement;
        wrapper.style.width = "100%";

        removeClass(this.popupElement, [
          "display-show",
          "popup-list__item-modal",
        ]);
        addClass(this.popupElement, "display-none");

        this.activeElement = null;
      }
    });

    return backdrop;
  }
}
