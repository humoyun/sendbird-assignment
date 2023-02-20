/**
 * TODOs
 * - list virtualization can be applied
 * -
 */

const BACKDROP_CLASS = "popup-list__backdrop";
const POPUP_LIST_CLASS = "popup-list";
const POPUP_LIST_ITEM_CLASS = "popup-list__item";

class DynamicList {
  constructor(container, items = [], options = {}) {
    this.activeElement = null;
    this.popupElement = null;
    this.container = container;

    if (container) {
      const popupList = document.createElement("ul");
      addClass(popupList, POPUP_LIST_CLASS);

      items.forEach((item, index) => {
        const elem = this._createListItem(item);
        popupList.appendChild(elem);
      });

      this.popupElement = document.createElement("div");
      addClass(this.popupElement, "popup-list__popup-item");

      container.appendChild(this.popupElement);

      popupList.addEventListener(
        "wheel",
        (e) => {
          const hoverElem =
            e.target.parentElement.parentElement.querySelector("#hover-item");
          hoverElem.style.display = "none";
          hoverElem.previousElementSibling.style.display = "none";
          hoverElem.nextElementSibling.style.display = "none";
          e.target.style.transform = "translateX(0px)";

          if (e.target.previousElementSibling) {
            e.target.previousElementSibling.style.transform = "translateX(0px)";
          }
          if (e.target.nextElementSibling) {
            e.target.nextElementSibling.style.transform = "translateX(0px)";
          }
        },
        { passive: true }
      );

      container.appendChild(popupList);
      this._prepareHoverElements();
    } else {
      // provide better error message or ...
      throw new Error("container element should exist");
    }
  }

  /**
   *
   */
  _prepareHoverElements() {
    const hoverElement = document.createElement("div");
    const hoverElementTopSibling = document.createElement("div");
    const hoverElementBottomSibling = document.createElement("div");

    hoverElementTopSibling.setAttribute("id", "hover-item__top-sibling");
    hoverElementTopSibling.style.display = "none";

    hoverElementBottomSibling.setAttribute("id", "hover-item__bottom-sibling");
    hoverElementBottomSibling.style.display = "none";

    hoverElement.setAttribute("id", "hover-item");
    hoverElement.style.display = "none";

    // needed to trick
    this.container.appendChild(hoverElementTopSibling);
    this.container.appendChild(hoverElement);
    this.container.appendChild(hoverElementBottomSibling);
  }

  _mouseenterHandler() {
    const hoverElem =
      this.parentElement.parentElement.querySelector("#hover-item");

    setBoundingBox(this, hoverElem);

    hoverElem.style.transform = "translateX(40px)";
    hoverElem.style.display = "flex";
    hoverElem.innerText = this.innerText;
    this.style.transform = "translateX(40px)";

    if (this.nextElementSibling) {
      setBoundingBox(this.nextElementSibling, hoverElem.nextElementSibling);

      hoverElem.nextElementSibling.style.display = "flex";
      hoverElem.nextElementSibling.style.transform = "translateX(20px)";

      hoverElem.nextElementSibling.innerText =
        this.nextElementSibling.innerText;
      this.nextElementSibling.style.transform = "translateX(20px)";
    }

    if (this.previousElementSibling) {
      setBoundingBox(
        this.previousElementSibling,
        hoverElem.previousElementSibling
      );

      hoverElem.previousElementSibling.style.display = "flex";
      hoverElem.previousElementSibling.style.transform = "translateX(20px)";

      hoverElem.previousElementSibling.innerText =
        this.previousElementSibling.innerText;
      this.previousElementSibling.style.transform = "translateX(20px)";
    }
  }

  _mouseleaveHandler(e) {
    const hoverElem =
      e.target.parentElement.parentElement.querySelector("#hover-item");

    hoverElem.style.display = "none";
    this.style.transform = "translateX(0px)";

    if (this.nextElementSibling) {
      hoverElem.nextElementSibling.style.display = "none";
      this.nextElementSibling.style.transform = "translateX(0px)";
    }
    if (this.previousElementSibling) {
      hoverElem.previousElementSibling.style.display = "none";
      this.previousElementSibling.style.transform = "translateX(0px)";
    }
  }

  _createListItem(itemOpt) {
    const item = document.createElement("li");
    addClass(item, POPUP_LIST_ITEM_CLASS);

    item.innerHTML = `${itemOpt?.label || "no content"}`;

    /**
     * attach necessary event handlers
     */
    item.addEventListener("mouseenter", this._mouseenterHandler);
    item.addEventListener("mouseleave", this._mouseleaveHandler);
    item.addEventListener("click", (e) => {
      removeClass(this.popupElement, "display-none");
      addClass(this.popupElement, ["display-show", "popup-item__modal"]);
      this.popupElement.innerHTML = e.target.innerHTML;

      e.target.removeEventListener("mouseenter", this._mouseenterHandler);

      this.activeElement = e.target;
      let backdrop = document.querySelector(`.${BACKDROP_CLASS}`);
      if (!backdrop) {
        backdrop = this.createBackdrop();
        document.body.appendChild(backdrop);
      }
    });

    return item;
  }

  createBackdrop() {
    const backdrop = document.createElement("div");
    addClass(backdrop, BACKDROP_CLASS);

    backdrop.addEventListener("click", (e) => {
      document.body.removeChild(backdrop);
      if (this.activeElement) {
        addClass(this.popupElement, "display-none");
        removeClass(this.popupElement, ["display-show", "popup-item__modal"]);
      }
    });

    return backdrop;
  }

  open() {}
  close() {}
  cleanUp() {}
  dispatchEvent() {}
}
