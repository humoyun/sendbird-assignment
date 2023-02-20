# Dynamic List Assignment for Sendbird

## Problem analysis: the tricky part

At first, problem seemed to be easy :) but then I saw the tricky part. When an element of a scrollable (`y-axis`) list shifts right side (40px) horizontally its opposite part goes out of view for same the amount (40px), it is due to a clip space which `overflow: scroll | hidden | auto` creates, setting `x-axis` as `visible` does not help because:

> If we look at the [W3C spec](https://www.w3.org/TR/css-box-3/#overflow-x), we find the following explanation:
> **The computed values of ‘overflow-x’ and ‘overflow-y’ are the same as their specified values, except that some combinations with ‘visible’ are not possible: if one is specified as ‘visible’ and the other is ‘scroll’ or ‘auto’, then ‘visible’ is set to ‘auto’.**

basically setting overflow axes like below:

```
  overflow-y: scroll;
  overflow-x: visible;
```

actually becomes:

```
overflow-x: scroll;
overflow-y: scroll;
```

So child element cannot overflow border of clipped area which its parent created (scrollable list). You can see this issue on **Figure 1**:

| Figure 1                                                | Figure 2                                        |
| ------------------------------------------------------- | ----------------------------------------------- |
| ![overflow issue](/assets/img/x-axe-overflow-issue.png) | ![overflow issue](/assets/img/scroll-issue.png) |

## First solution

After several unsuccessful tries to enable overflow on `x-axis` (the reason mentioned earlier), an idea came to my mind to handle this overflow issue with extra hidden elements outside of scrollable list as they are not bound to the **clip area** which the scrollable list's overflow property created. I created three elements (lets refer them as _hover elements_) outside of list and made their `display` attribute as `none`. And when some child element of the scrollable list hovered over, hidden hover elements are made visible and displaced on top of the corresponding child element and its immediate neighbors (right up and down) by calculating the bounding boxes of currently hovered child element and its neighbors, with `getBoundingClientRect` like below:

```
function setBoundingBox(sourceEl, targetEl) {
  if (sourceEl && targetEl) {
    const offsets = sourceEl.getBoundingClientRect();

    targetEl.style.top = offsets.top + window.scrollY + "px";
    targetEl.style.left = offsets.left + window.scrollX + "px";
    targetEl.style.width = `${offsets.width}px`;
    targetEl.style.height = `${offsets.height}px`;
  }
}
```

when hover was out of item's boundaries, made hover elements hidden again. I had to add some other subtle tricks also (like removing hover elements while scrolling, see **Figure 2**) in order to support proper scrolling behavior:

#### Drawbacks

The most obvious drawback of this solution is that it is a hacky solution. Although it looks as if it is working as expected mostly (but not smooth :(), it is not stable and highly likely to fail with subtle and unexpected bugs in some cases which in turn again forces to add more code to fix them. So I just abandoned this solution. I included this solution in the repo just to indicate the thought process until I found better and easier solution (though not sure whether it is the optimal solution or not). Let me explain the second (proposed) solution and you will decide whether it is acceptable ot not :).

## Second solution (better)

This solution does not use any extra hidden elements and unnecessary calculations like the first solution. The only thing which is necessary is adding extra wrapper element as a parent for the scrollable list element and let handle scrolling the wrapper itself (`wrapper.style.overflowY = "scroll"`). When child element is hovered the wrapper is automatically resized horizontally according to the predefined length so that clipping area of the wrapper does not affect child of a list when it is also shifted for the same amount (40px in our case). Besides, we also need to keep the width of the list element in tact by setting its width same as its child when resizing the wrapper so that it will not stretch to the width of its wrapper.

#### Drawbacks

Ideally, it would be good

## Another issue was `CSS-transition flickering on hover`

- https://stackoverflow.com/questions/26101314/css-transition-flickering-on-hover

how to allow an element of a scrollable list to shift right side overflow outside the parent div while keeping scrolling of parent on y axis:

## Comparison with recording or screenshots
