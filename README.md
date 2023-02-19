# Dynamic List Assignment for Sendbird

## Problem analysis: the tricky part

At first, problem seemed to be easy :) but then I saw the tricky part. When an element of a scrollable (`y-axe`) list shifts right side (40px) horizontally its opposite part goes out of view for same the amount (40px), it is due to clip space which `overflow: scroll | hidden | auto` creates, setting `x-axe` as `visible` does not help because:

> If we look at the W3C spec, we find the following explanation:
> **The computed values of ‘overflow-x’ and ‘overflow-y’ are the same as their specified values, except that some combinations with ‘visible’ are not possible: if one is specified as ‘visible’ and the other is ‘scroll’ or ‘auto’, then ‘visible’ is set to ‘auto’.**

So element cannot overflow border of clip space which its parent created (list).

## First solution

After several tries to enable overflow First idea

#### Explanation

#### Drawbacks

The most obvious drawback of this solution is that it is a hacky solution. We are

## Second solution

This solution does not use extra calculation like first solution

#### Explanation

#### Drawbacks

basically like below:

```
  overflow-y: auto;
  overflow-x: visible;
```

but it does not work due to how browser handles overflow with clipping when one of the axis set to any value but visible it automatically sets another axe and actually becomes

```
overflow-x: auto;
overflow-y: auto;
```

- https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context
- https://css-tricks.com/popping-hidden-overflow

tried to solve another element outside of list (container) element, and control absolute positioned
outside element by setting its positions using getBoundingClientRect() but it very jittering effect and was not stable

## Another issue was `CSS-transition flickering on hover`

- https://stackoverflow.com/questions/26101314/css-transition-flickering-on-hover

how to allow an element of a scrollable list to shift right side overflow outside the parent div while keeping scrolling of parent on y axis:

## Comparison with recording or screenshots
