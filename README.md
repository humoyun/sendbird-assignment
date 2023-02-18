## most difficult part

- how to allow a list of elements to overflow outside the parent div while keeping scrolling of parent on y axis:

basically like below:

```
  overflow-y: auto;
  overflow-x: visible;
```

but it does not work due to how browser handles and actually becomes

```
overflow-x: auto;
overflow-y: auto;
```

- https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context
- https://css-tricks.com/popping-hidden-overflow

The Problem
If we look at the W3C spec, we find the following explanation:

The computed values of ‘overflow-x’ and ‘overflow-y’ are the same as their specified values, except that some combinations with ‘visible’ are not possible: if one is specified as ‘visible’ and the other is ‘scroll’ or ‘auto’, then ‘visible’ is set to ‘auto’.

tried to solve another element outside of list (container) element, and control absolute positioned
outside element by setting its positions using getBoundingClientRect() but it very jittering effect and was not stable

## Another issue was `CSS-transition flickering on hover`

- https://stackoverflow.com/questions/26101314/css-transition-flickering-on-hover
