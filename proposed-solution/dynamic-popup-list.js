const DEFAULT_OPTIONS = {
  container: { height: 500 },
  item: { shiftLength: 20 },
};

/**
 * DynamicPopupList: scrollable list in which items of is clickable and
 * when clicked they will be popped up as modal on top of backdrop
 */
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
    this.items = items;
    // keeping ref for currently clicked child element
    this.activeElement = null;

    this._setup();
  }

  _setup() {
    // actual hidden DOM element for popup child element to show its content
    this.popupElement = document.createElement("div");
    addClass(this.popupElement, ["display-none"]);
    this.container.appendChild(this.popupElement);

    // this element is needed to enable shifting child elements properly without being
    // its shifted end clipped on x-axis while keeping list element scrollable on y-axis
    const wrapper = createElement("div");
    wrapper.style.height = `${this.options.container.height}px`;
    wrapper.style.overflowY = "scroll";
    addClass(wrapper, "popup-list__wrapper");

    // this is actual list element which holds items
    const popupList = createElement("ul");
    addClass(popupList, "popup-list");

    this.items.forEach((item) => {
      const elem = this._createListItem(item);
      popupList.appendChild(elem);
    });

    wrapper.appendChild(popupList);

    this.container.appendChild(wrapper);
  }

  _mouseenterHandler(e) {
    const { shiftLength } = this.options.item;

    const target = e.target;
    const wrapper = target.parentElement.parentElement;
    const popupList = target.parentElement;

    const offsets = wrapper.getBoundingClientRect();
    wrapper.style.width = `calc(${offsets.width}px + ${shiftLength}px)`;

    // need to keep the width of popupList in tact by setting its width same
    // as its child so that it will not stretch to the width of the wrapper
    popupList.style.width = `calc(${offsets.width}px`;
    target.style.transform = `translateX(${shiftLength}px)`;

    // immediate up neighbor of hovered (active) child item
    if (target.previousElementSibling) {
      target.previousElementSibling.style.transform = `translateX(${
        shiftLength / 2
      }px)`;
    }
    // immediate bottom neighbor of hovered (active) child item
    if (target.nextElementSibling) {
      target.nextElementSibling.style.transform = `translateX(${
        shiftLength / 2
      }px)`;
    }
  }

  _mouseleaveHandler(e) {
    // this condition is for keeping shifted elements to be in place (shifted state)
    // until dimmed background (backdrop) is clicked and popup element disappears
    if (!this.activeElement) {
      const target = e.target;
      const wrapper = target.parentElement.parentElement;
      const popupList = target.parentElement;
      // put back to initial width
      wrapper.style.width = "100%";
      popupList.style.width = "100%";

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
        // move back shifted child elements to its initial position
        this.activeElement.style.transform = "translateX(0px)";
        if (this.activeElement.previousElementSibling) {
          this.activeElement.previousElementSibling.style.transform =
            "translateX(0px)";
        }
        if (this.activeElement.nextElementSibling) {
          this.activeElement.nextElementSibling.style.transform =
            "translateX(0px)";
        }
        // this causes list and its children to recalculate their width again
        // otherwise after clicking backdrop, list remains in the resized size:
        // (initial width + shiftLength)
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
