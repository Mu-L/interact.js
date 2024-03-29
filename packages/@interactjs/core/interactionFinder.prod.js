/* interact.js 1.10.27 | https://raw.github.com/taye/interact.js/main/LICENSE */

import*as domUtils from"../utils/domUtils.prod.js";const finder={methodOrder:["simulationResume","mouseOrPen","hasPointer","idle"],search(e){for(const t of finder.methodOrder){const n=finder[t](e);if(n)return n}return null},simulationResume(e){let{pointerType:t,eventType:n,eventTarget:i,scope:r}=e;if(!/down|start/i.test(n))return null;for(const e of r.interactions.list){let n=i;if(e.simulation&&e.simulation.allowResume&&e.pointerType===t)for(;n;){if(n===e.element)return e;n=domUtils.parentNode(n)}}return null},mouseOrPen(e){let t,{pointerId:n,pointerType:i,eventType:r,scope:o}=e;if("mouse"!==i&&"pen"!==i)return null;for(const e of o.interactions.list)if(e.pointerType===i){if(e.simulation&&!hasPointerId(e,n))continue;if(e.interacting())return e;t||(t=e)}if(t)return t;for(const e of o.interactions.list)if(!(e.pointerType!==i||/down/i.test(r)&&e.simulation))return e;return null},hasPointer(e){let{pointerId:t,scope:n}=e;for(const e of n.interactions.list)if(hasPointerId(e,t))return e;return null},idle(e){let{pointerType:t,scope:n}=e;for(const e of n.interactions.list){if(1===e.pointers.length){const t=e.interactable;if(t&&(!t.options.gesture||!t.options.gesture.enabled))continue}else if(e.pointers.length>=2)continue;if(!e.interacting()&&t===e.pointerType)return e}return null}};function hasPointerId(e,t){return e.pointers.some((e=>{let{id:n}=e;return n===t}))}export{finder as default};
//# sourceMappingURL=interactionFinder.prod.js.map