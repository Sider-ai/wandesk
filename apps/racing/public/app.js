var h1=Object.create;var Of=Object.defineProperty;var f1=Object.getOwnPropertyDescriptor;var d1=Object.getOwnPropertyNames;var p1=Object.getPrototypeOf,m1=Object.prototype.hasOwnProperty;var He=(e,t)=>()=>(e&&(t=e(e=0)),t);var Hi=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),g1=(e,t)=>{for(var n in t)Of(e,n,{get:t[n],enumerable:!0})},v1=(e,t,n,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of d1(t))!m1.call(e,s)&&s!==n&&Of(e,s,{get:()=>t[s],enumerable:!(i=f1(t,s))||i.enumerable});return e};var Vi=(e,t,n)=>(n=e!=null?h1(p1(e)):{},v1(t||!e||!e.__esModule?Of(n,"default",{value:e,enumerable:!0}):n,e));var av=Hi(ze=>{"use strict";function Ff(e,t){var n=e.length;e.push(t);t:for(;0<n;){var i=n-1>>>1,s=e[i];if(0<Ic(s,t))e[i]=t,e[n]=s,n=i;else break t}}function Gi(e){return e.length===0?null:e[0]}function Pc(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;t:for(var i=0,s=e.length,a=s>>>1;i<a;){var r=2*(i+1)-1,o=e[r],l=r+1,c=e[l];if(0>Ic(o,n))l<s&&0>Ic(c,o)?(e[i]=c,e[l]=n,i=l):(e[i]=o,e[r]=n,i=r);else if(l<s&&0>Ic(c,n))e[i]=c,e[l]=n,i=l;else break t}}return t}function Ic(e,t){var n=e.sortIndex-t.sortIndex;return n!==0?n:e.id-t.id}ze.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(Q0=performance,ze.unstable_now=function(){return Q0.now()}):(Pf=Date,K0=Pf.now(),ze.unstable_now=function(){return Pf.now()-K0});var Q0,Pf,K0,ss=[],Fs=[],_1=1,di=null,Mn=3,Hf=!1,el=!1,nl=!1,Vf=!1,tv=typeof setTimeout=="function"?setTimeout:null,ev=typeof clearTimeout=="function"?clearTimeout:null,j0=typeof setImmediate<"u"?setImmediate:null;function Oc(e){for(var t=Gi(Fs);t!==null;){if(t.callback===null)Pc(Fs);else if(t.startTime<=e)Pc(Fs),t.sortIndex=t.expirationTime,Ff(ss,t);else break;t=Gi(Fs)}}function Gf(e){if(nl=!1,Oc(e),!el)if(Gi(ss)!==null)el=!0,yr||(yr=!0,_r());else{var t=Gi(Fs);t!==null&&kf(Gf,t.startTime-e)}}var yr=!1,il=-1,nv=5,iv=-1;function sv(){return Vf?!0:!(ze.unstable_now()-iv<nv)}function zf(){if(Vf=!1,yr){var e=ze.unstable_now();iv=e;var t=!0;try{t:{el=!1,nl&&(nl=!1,ev(il),il=-1),Hf=!0;var n=Mn;try{e:{for(Oc(e),di=Gi(ss);di!==null&&!(di.expirationTime>e&&sv());){var i=di.callback;if(typeof i=="function"){di.callback=null,Mn=di.priorityLevel;var s=i(di.expirationTime<=e);if(e=ze.unstable_now(),typeof s=="function"){di.callback=s,Oc(e),t=!0;break e}di===Gi(ss)&&Pc(ss),Oc(e)}else Pc(ss);di=Gi(ss)}if(di!==null)t=!0;else{var a=Gi(Fs);a!==null&&kf(Gf,a.startTime-e),t=!1}}break t}finally{di=null,Mn=n,Hf=!1}t=void 0}}finally{t?_r():yr=!1}}}var _r;typeof j0=="function"?_r=function(){j0(zf)}:typeof MessageChannel<"u"?(Bf=new MessageChannel,$0=Bf.port2,Bf.port1.onmessage=zf,_r=function(){$0.postMessage(null)}):_r=function(){tv(zf,0)};var Bf,$0;function kf(e,t){il=tv(function(){e(ze.unstable_now())},t)}ze.unstable_IdlePriority=5;ze.unstable_ImmediatePriority=1;ze.unstable_LowPriority=4;ze.unstable_NormalPriority=3;ze.unstable_Profiling=null;ze.unstable_UserBlockingPriority=2;ze.unstable_cancelCallback=function(e){e.callback=null};ze.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):nv=0<e?Math.floor(1e3/e):5};ze.unstable_getCurrentPriorityLevel=function(){return Mn};ze.unstable_next=function(e){switch(Mn){case 1:case 2:case 3:var t=3;break;default:t=Mn}var n=Mn;Mn=t;try{return e()}finally{Mn=n}};ze.unstable_requestPaint=function(){Vf=!0};ze.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=Mn;Mn=e;try{return t()}finally{Mn=n}};ze.unstable_scheduleCallback=function(e,t,n){var i=ze.unstable_now();switch(typeof n=="object"&&n!==null?(n=n.delay,n=typeof n=="number"&&0<n?i+n:i):n=i,e){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=n+s,e={id:_1++,callback:t,priorityLevel:e,startTime:n,expirationTime:s,sortIndex:-1},n>i?(e.sortIndex=n,Ff(Fs,e),Gi(ss)===null&&e===Gi(Fs)&&(nl?(ev(il),il=-1):nl=!0,kf(Gf,n-i))):(e.sortIndex=s,Ff(ss,e),el||Hf||(el=!0,yr||(yr=!0,_r()))),e};ze.unstable_shouldYield=sv;ze.unstable_wrapCallback=function(e){var t=Mn;return function(){var n=Mn;Mn=t;try{return e.apply(this,arguments)}finally{Mn=n}}}});var ov=Hi((ND,rv)=>{"use strict";rv.exports=av()});var _v=Hi(Qt=>{"use strict";var qf=Symbol.for("react.transitional.element"),y1=Symbol.for("react.portal"),x1=Symbol.for("react.fragment"),M1=Symbol.for("react.strict_mode"),S1=Symbol.for("react.profiler"),b1=Symbol.for("react.consumer"),E1=Symbol.for("react.context"),T1=Symbol.for("react.forward_ref"),A1=Symbol.for("react.suspense"),w1=Symbol.for("react.memo"),fv=Symbol.for("react.lazy"),R1=Symbol.for("react.activity"),lv=Symbol.iterator;function C1(e){return e===null||typeof e!="object"?null:(e=lv&&e[lv]||e["@@iterator"],typeof e=="function"?e:null)}var dv={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},pv=Object.assign,mv={};function Mr(e,t,n){this.props=e,this.context=t,this.refs=mv,this.updater=n||dv}Mr.prototype.isReactComponent={};Mr.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Mr.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function gv(){}gv.prototype=Mr.prototype;function Yf(e,t,n){this.props=e,this.context=t,this.refs=mv,this.updater=n||dv}var Zf=Yf.prototype=new gv;Zf.constructor=Yf;pv(Zf,Mr.prototype);Zf.isPureReactComponent=!0;var cv=Array.isArray;function Wf(){}var Le={H:null,A:null,T:null,S:null},vv=Object.prototype.hasOwnProperty;function Jf(e,t,n){var i=n.ref;return{$$typeof:qf,type:e,key:t,ref:i!==void 0?i:null,props:n}}function D1(e,t){return Jf(e.type,t,e.props)}function Qf(e){return typeof e=="object"&&e!==null&&e.$$typeof===qf}function U1(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var uv=/\/+/g;function Xf(e,t){return typeof e=="object"&&e!==null&&e.key!=null?U1(""+e.key):t.toString(36)}function N1(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(Wf,Wf):(e.status="pending",e.then(function(t){e.status==="pending"&&(e.status="fulfilled",e.value=t)},function(t){e.status==="pending"&&(e.status="rejected",e.reason=t)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function xr(e,t,n,i,s){var a=typeof e;(a==="undefined"||a==="boolean")&&(e=null);var r=!1;if(e===null)r=!0;else switch(a){case"bigint":case"string":case"number":r=!0;break;case"object":switch(e.$$typeof){case qf:case y1:r=!0;break;case fv:return r=e._init,xr(r(e._payload),t,n,i,s)}}if(r)return s=s(e),r=i===""?"."+Xf(e,0):i,cv(s)?(n="",r!=null&&(n=r.replace(uv,"$&/")+"/"),xr(s,t,n,"",function(c){return c})):s!=null&&(Qf(s)&&(s=D1(s,n+(s.key==null||e&&e.key===s.key?"":(""+s.key).replace(uv,"$&/")+"/")+r)),t.push(s)),1;r=0;var o=i===""?".":i+":";if(cv(e))for(var l=0;l<e.length;l++)i=e[l],a=o+Xf(i,l),r+=xr(i,t,n,a,s);else if(l=C1(e),typeof l=="function")for(e=l.call(e),l=0;!(i=e.next()).done;)i=i.value,a=o+Xf(i,l++),r+=xr(i,t,n,a,s);else if(a==="object"){if(typeof e.then=="function")return xr(N1(e),t,n,i,s);throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.")}return r}function zc(e,t,n){if(e==null)return e;var i=[],s=0;return xr(e,i,"","",function(a){return t.call(n,a,s++)}),i}function L1(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var hv=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},I1={map:zc,forEach:function(e,t,n){zc(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return zc(e,function(){t++}),t},toArray:function(e){return zc(e,function(t){return t})||[]},only:function(e){if(!Qf(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};Qt.Activity=R1;Qt.Children=I1;Qt.Component=Mr;Qt.Fragment=x1;Qt.Profiler=S1;Qt.PureComponent=Yf;Qt.StrictMode=M1;Qt.Suspense=A1;Qt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Le;Qt.__COMPILER_RUNTIME={__proto__:null,c:function(e){return Le.H.useMemoCache(e)}};Qt.cache=function(e){return function(){return e.apply(null,arguments)}};Qt.cacheSignal=function(){return null};Qt.cloneElement=function(e,t,n){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var i=pv({},e.props),s=e.key;if(t!=null)for(a in t.key!==void 0&&(s=""+t.key),t)!vv.call(t,a)||a==="key"||a==="__self"||a==="__source"||a==="ref"&&t.ref===void 0||(i[a]=t[a]);var a=arguments.length-2;if(a===1)i.children=n;else if(1<a){for(var r=Array(a),o=0;o<a;o++)r[o]=arguments[o+2];i.children=r}return Jf(e.type,s,i)};Qt.createContext=function(e){return e={$$typeof:E1,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:b1,_context:e},e};Qt.createElement=function(e,t,n){var i,s={},a=null;if(t!=null)for(i in t.key!==void 0&&(a=""+t.key),t)vv.call(t,i)&&i!=="key"&&i!=="__self"&&i!=="__source"&&(s[i]=t[i]);var r=arguments.length-2;if(r===1)s.children=n;else if(1<r){for(var o=Array(r),l=0;l<r;l++)o[l]=arguments[l+2];s.children=o}if(e&&e.defaultProps)for(i in r=e.defaultProps,r)s[i]===void 0&&(s[i]=r[i]);return Jf(e,a,s)};Qt.createRef=function(){return{current:null}};Qt.forwardRef=function(e){return{$$typeof:T1,render:e}};Qt.isValidElement=Qf;Qt.lazy=function(e){return{$$typeof:fv,_payload:{_status:-1,_result:e},_init:L1}};Qt.memo=function(e,t){return{$$typeof:w1,type:e,compare:t===void 0?null:t}};Qt.startTransition=function(e){var t=Le.T,n={};Le.T=n;try{var i=e(),s=Le.S;s!==null&&s(n,i),typeof i=="object"&&i!==null&&typeof i.then=="function"&&i.then(Wf,hv)}catch(a){hv(a)}finally{t!==null&&n.types!==null&&(t.types=n.types),Le.T=t}};Qt.unstable_useCacheRefresh=function(){return Le.H.useCacheRefresh()};Qt.use=function(e){return Le.H.use(e)};Qt.useActionState=function(e,t,n){return Le.H.useActionState(e,t,n)};Qt.useCallback=function(e,t){return Le.H.useCallback(e,t)};Qt.useContext=function(e){return Le.H.useContext(e)};Qt.useDebugValue=function(){};Qt.useDeferredValue=function(e,t){return Le.H.useDeferredValue(e,t)};Qt.useEffect=function(e,t){return Le.H.useEffect(e,t)};Qt.useEffectEvent=function(e){return Le.H.useEffectEvent(e)};Qt.useId=function(){return Le.H.useId()};Qt.useImperativeHandle=function(e,t,n){return Le.H.useImperativeHandle(e,t,n)};Qt.useInsertionEffect=function(e,t){return Le.H.useInsertionEffect(e,t)};Qt.useLayoutEffect=function(e,t){return Le.H.useLayoutEffect(e,t)};Qt.useMemo=function(e,t){return Le.H.useMemo(e,t)};Qt.useOptimistic=function(e,t){return Le.H.useOptimistic(e,t)};Qt.useReducer=function(e,t,n){return Le.H.useReducer(e,t,n)};Qt.useRef=function(e){return Le.H.useRef(e)};Qt.useState=function(e){return Le.H.useState(e)};Qt.useSyncExternalStore=function(e,t,n){return Le.H.useSyncExternalStore(e,t,n)};Qt.useTransition=function(){return Le.H.useTransition()};Qt.version="19.2.8"});var Bc=Hi((ID,yv)=>{"use strict";yv.exports=_v()});var Mv=Hi(Cn=>{"use strict";var O1=Bc();function xv(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function Hs(){}var Rn={d:{f:Hs,r:function(){throw Error(xv(522))},D:Hs,C:Hs,L:Hs,m:Hs,X:Hs,S:Hs,M:Hs},p:0,findDOMNode:null},P1=Symbol.for("react.portal");function z1(e,t,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:P1,key:i==null?null:""+i,children:e,containerInfo:t,implementation:n}}var sl=O1.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function Fc(e,t){if(e==="font")return"";if(typeof t=="string")return t==="use-credentials"?t:""}Cn.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Rn;Cn.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(xv(299));return z1(e,t,null,n)};Cn.flushSync=function(e){var t=sl.T,n=Rn.p;try{if(sl.T=null,Rn.p=2,e)return e()}finally{sl.T=t,Rn.p=n,Rn.d.f()}};Cn.preconnect=function(e,t){typeof e=="string"&&(t?(t=t.crossOrigin,t=typeof t=="string"?t==="use-credentials"?t:"":void 0):t=null,Rn.d.C(e,t))};Cn.prefetchDNS=function(e){typeof e=="string"&&Rn.d.D(e)};Cn.preinit=function(e,t){if(typeof e=="string"&&t&&typeof t.as=="string"){var n=t.as,i=Fc(n,t.crossOrigin),s=typeof t.integrity=="string"?t.integrity:void 0,a=typeof t.fetchPriority=="string"?t.fetchPriority:void 0;n==="style"?Rn.d.S(e,typeof t.precedence=="string"?t.precedence:void 0,{crossOrigin:i,integrity:s,fetchPriority:a}):n==="script"&&Rn.d.X(e,{crossOrigin:i,integrity:s,fetchPriority:a,nonce:typeof t.nonce=="string"?t.nonce:void 0})}};Cn.preinitModule=function(e,t){if(typeof e=="string")if(typeof t=="object"&&t!==null){if(t.as==null||t.as==="script"){var n=Fc(t.as,t.crossOrigin);Rn.d.M(e,{crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0})}}else t==null&&Rn.d.M(e)};Cn.preload=function(e,t){if(typeof e=="string"&&typeof t=="object"&&t!==null&&typeof t.as=="string"){var n=t.as,i=Fc(n,t.crossOrigin);Rn.d.L(e,n,{crossOrigin:i,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,type:typeof t.type=="string"?t.type:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy=="string"?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet=="string"?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes=="string"?t.imageSizes:void 0,media:typeof t.media=="string"?t.media:void 0})}};Cn.preloadModule=function(e,t){if(typeof e=="string")if(t){var n=Fc(t.as,t.crossOrigin);Rn.d.m(e,{as:typeof t.as=="string"&&t.as!=="script"?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity=="string"?t.integrity:void 0})}else Rn.d.m(e)};Cn.requestFormReset=function(e){Rn.d.r(e)};Cn.unstable_batchedUpdates=function(e,t){return e(t)};Cn.useFormState=function(e,t,n){return sl.H.useFormState(e,t,n)};Cn.useFormStatus=function(){return sl.H.useHostTransitionStatus()};Cn.version="19.2.8"});var Ev=Hi((PD,bv)=>{"use strict";function Sv(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Sv)}catch(e){console.error(e)}}Sv(),bv.exports=Mv()});var PM=Hi(uh=>{"use strict";var an=ov(),Q_=Bc(),B1=Ev();function K(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function K_(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Xl(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function j_(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function $_(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Tv(e){if(Xl(e)!==e)throw Error(K(188))}function F1(e){var t=e.alternate;if(!t){if(t=Xl(e),t===null)throw Error(K(188));return t!==e?null:e}for(var n=e,i=t;;){var s=n.return;if(s===null)break;var a=s.alternate;if(a===null){if(i=s.return,i!==null){n=i;continue}break}if(s.child===a.child){for(a=s.child;a;){if(a===n)return Tv(s),e;if(a===i)return Tv(s),t;a=a.sibling}throw Error(K(188))}if(n.return!==i.return)n=s,i=a;else{for(var r=!1,o=s.child;o;){if(o===n){r=!0,n=s,i=a;break}if(o===i){r=!0,i=s,n=a;break}o=o.sibling}if(!r){for(o=a.child;o;){if(o===n){r=!0,n=a,i=s;break}if(o===i){r=!0,i=a,n=s;break}o=o.sibling}if(!r)throw Error(K(189))}}if(n.alternate!==i)throw Error(K(190))}if(n.tag!==3)throw Error(K(188));return n.stateNode.current===n?e:t}function ty(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=ty(e),t!==null)return t;e=e.sibling}return null}var Pe=Object.assign,H1=Symbol.for("react.element"),Hc=Symbol.for("react.transitional.element"),fl=Symbol.for("react.portal"),wr=Symbol.for("react.fragment"),ey=Symbol.for("react.strict_mode"),Dd=Symbol.for("react.profiler"),ny=Symbol.for("react.consumer"),fs=Symbol.for("react.context"),Tp=Symbol.for("react.forward_ref"),Ud=Symbol.for("react.suspense"),Nd=Symbol.for("react.suspense_list"),Ap=Symbol.for("react.memo"),Vs=Symbol.for("react.lazy");Symbol.for("react.scope");var Ld=Symbol.for("react.activity");Symbol.for("react.legacy_hidden");Symbol.for("react.tracing_marker");var V1=Symbol.for("react.memo_cache_sentinel");Symbol.for("react.view_transition");var Av=Symbol.iterator;function al(e){return e===null||typeof e!="object"?null:(e=Av&&e[Av]||e["@@iterator"],typeof e=="function"?e:null)}var G1=Symbol.for("react.client.reference");function Id(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===G1?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case wr:return"Fragment";case Dd:return"Profiler";case ey:return"StrictMode";case Ud:return"Suspense";case Nd:return"SuspenseList";case Ld:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case fl:return"Portal";case fs:return e.displayName||"Context";case ny:return(e._context.displayName||"Context")+".Consumer";case Tp:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Ap:return t=e.displayName||null,t!==null?t:Id(e.type)||"Memo";case Vs:t=e._payload,e=e._init;try{return Id(e(t))}catch{}}return null}var dl=Array.isArray,kt=Q_.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,pe=B1.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Oa={pending:!1,data:null,method:null,action:null},Od=[],Rr=-1;function Yi(e){return{current:e}}function hn(e){0>Rr||(e.current=Od[Rr],Od[Rr]=null,Rr--)}function De(e,t){Rr++,Od[Rr]=e.current,e.current=t}var qi=Yi(null),Dl=Yi(null),js=Yi(null),yu=Yi(null);function xu(e,t){switch(De(js,t),De(Dl,e),De(qi,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?L_(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=L_(t),e=SM(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}hn(qi),De(qi,e)}function qr(){hn(qi),hn(Dl),hn(js)}function Pd(e){e.memoizedState!==null&&De(yu,e);var t=qi.current,n=SM(t,e.type);t!==n&&(De(Dl,e),De(qi,n))}function Mu(e){Dl.current===e&&(hn(qi),hn(Dl)),yu.current===e&&(hn(yu),Vl._currentValue=Oa)}var Kf,wv;function Ua(e){if(Kf===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);Kf=t&&t[1]||"",wv=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Kf+e+wv}var jf=!1;function $f(e,t){if(!e||jf)return"";jf=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var i={DetermineComponentFrameRoot:function(){try{if(t){var d=function(){throw Error()};if(Object.defineProperty(d.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(d,[])}catch(p){var f=p}Reflect.construct(e,[],d)}else{try{d.call()}catch(p){f=p}e.call(d.prototype)}}else{try{throw Error()}catch(p){f=p}(d=e())&&typeof d.catch=="function"&&d.catch(function(){})}}catch(p){if(p&&f&&typeof p.stack=="string")return[p.stack,f.stack]}return[null,null]}};i.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var s=Object.getOwnPropertyDescriptor(i.DetermineComponentFrameRoot,"name");s&&s.configurable&&Object.defineProperty(i.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var a=i.DetermineComponentFrameRoot(),r=a[0],o=a[1];if(r&&o){var l=r.split(`
`),c=o.split(`
`);for(s=i=0;i<l.length&&!l[i].includes("DetermineComponentFrameRoot");)i++;for(;s<c.length&&!c[s].includes("DetermineComponentFrameRoot");)s++;if(i===l.length||s===c.length)for(i=l.length-1,s=c.length-1;1<=i&&0<=s&&l[i]!==c[s];)s--;for(;1<=i&&0<=s;i--,s--)if(l[i]!==c[s]){if(i!==1||s!==1)do if(i--,s--,0>s||l[i]!==c[s]){var h=`
`+l[i].replace(" at new "," at ");return e.displayName&&h.includes("<anonymous>")&&(h=h.replace("<anonymous>",e.displayName)),h}while(1<=i&&0<=s);break}}}finally{jf=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?Ua(n):""}function k1(e,t){switch(e.tag){case 26:case 27:case 5:return Ua(e.type);case 16:return Ua("Lazy");case 13:return e.child!==t&&t!==null?Ua("Suspense Fallback"):Ua("Suspense");case 19:return Ua("SuspenseList");case 0:case 15:return $f(e.type,!1);case 11:return $f(e.type.render,!1);case 1:return $f(e.type,!0);case 31:return Ua("Activity");default:return""}}function Rv(e){try{var t="",n=null;do t+=k1(e,n),n=e,e=e.return;while(e);return t}catch(i){return`
Error generating stack: `+i.message+`
`+i.stack}}var zd=Object.prototype.hasOwnProperty,wp=an.unstable_scheduleCallback,td=an.unstable_cancelCallback,X1=an.unstable_shouldYield,W1=an.unstable_requestPaint,$n=an.unstable_now,q1=an.unstable_getCurrentPriorityLevel,iy=an.unstable_ImmediatePriority,sy=an.unstable_UserBlockingPriority,Su=an.unstable_NormalPriority,Y1=an.unstable_LowPriority,ay=an.unstable_IdlePriority,Z1=an.log,J1=an.unstable_setDisableYieldValue,Wl=null,ti=null;function Ys(e){if(typeof Z1=="function"&&J1(e),ti&&typeof ti.setStrictMode=="function")try{ti.setStrictMode(Wl,e)}catch{}}var ei=Math.clz32?Math.clz32:j1,Q1=Math.log,K1=Math.LN2;function j1(e){return e>>>=0,e===0?32:31-(Q1(e)/K1|0)|0}var Vc=256,Gc=262144,kc=4194304;function Na(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Zu(e,t,n){var i=e.pendingLanes;if(i===0)return 0;var s=0,a=e.suspendedLanes,r=e.pingedLanes;e=e.warmLanes;var o=i&134217727;return o!==0?(i=o&~a,i!==0?s=Na(i):(r&=o,r!==0?s=Na(r):n||(n=o&~e,n!==0&&(s=Na(n))))):(o=i&~a,o!==0?s=Na(o):r!==0?s=Na(r):n||(n=i&~e,n!==0&&(s=Na(n)))),s===0?0:t!==0&&t!==s&&(t&a)===0&&(a=s&-s,n=t&-t,a>=n||a===32&&(n&4194048)!==0)?t:s}function ql(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function $1(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ry(){var e=kc;return kc<<=1,(kc&62914560)===0&&(kc=4194304),e}function ed(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Yl(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function tE(e,t,n,i,s,a){var r=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var o=e.entanglements,l=e.expirationTimes,c=e.hiddenUpdates;for(n=r&~n;0<n;){var h=31-ei(n),d=1<<h;o[h]=0,l[h]=-1;var f=c[h];if(f!==null)for(c[h]=null,h=0;h<f.length;h++){var p=f[h];p!==null&&(p.lane&=-536870913)}n&=~d}i!==0&&oy(e,i,0),a!==0&&s===0&&e.tag!==0&&(e.suspendedLanes|=a&~(r&~t))}function oy(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var i=31-ei(t);e.entangledLanes|=t,e.entanglements[i]=e.entanglements[i]|1073741824|n&261930}function ly(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var i=31-ei(n),s=1<<i;s&t|e[i]&t&&(e[i]|=t),n&=~s}}function cy(e,t){var n=t&-t;return n=(n&42)!==0?1:Rp(n),(n&(e.suspendedLanes|t))!==0?0:n}function Rp(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Cp(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function uy(){var e=pe.p;return e!==0?e:(e=window.event,e===void 0?32:LM(e.type))}function Cv(e,t){var n=pe.p;try{return pe.p=e,t()}finally{pe.p=n}}var ha=Math.random().toString(36).slice(2),mn="__reactFiber$"+ha,Gn="__reactProps$"+ha,io="__reactContainer$"+ha,Bd="__reactEvents$"+ha,eE="__reactListeners$"+ha,nE="__reactHandles$"+ha,Dv="__reactResources$"+ha,Zl="__reactMarker$"+ha;function Dp(e){delete e[mn],delete e[Gn],delete e[Bd],delete e[eE],delete e[nE]}function Cr(e){var t=e[mn];if(t)return t;for(var n=e.parentNode;n;){if(t=n[io]||n[mn]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=B_(e);e!==null;){if(n=e[mn])return n;e=B_(e)}return t}e=n,n=e.parentNode}return null}function so(e){if(e=e[mn]||e[io]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function pl(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(K(33))}function Fr(e){var t=e[Dv];return t||(t=e[Dv]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function un(e){e[Zl]=!0}var hy=new Set,fy={};function Wa(e,t){Yr(e,t),Yr(e+"Capture",t)}function Yr(e,t){for(fy[e]=t,e=0;e<t.length;e++)hy.add(t[e])}var iE=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Uv={},Nv={};function sE(e){return zd.call(Nv,e)?!0:zd.call(Uv,e)?!1:iE.test(e)?Nv[e]=!0:(Uv[e]=!0,!1)}function su(e,t,n){if(sE(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var i=t.toLowerCase().slice(0,5);if(i!=="data-"&&i!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+n)}}function Xc(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+n)}}function as(e,t,n,i){if(i===null)e.removeAttribute(n);else{switch(typeof i){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,""+i)}}function mi(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function dy(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function aE(e,t,n){var i=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof i<"u"&&typeof i.get=="function"&&typeof i.set=="function"){var s=i.get,a=i.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return s.call(this)},set:function(r){n=""+r,a.call(this,r)}}),Object.defineProperty(e,t,{enumerable:i.enumerable}),{getValue:function(){return n},setValue:function(r){n=""+r},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Fd(e){if(!e._valueTracker){var t=dy(e)?"checked":"value";e._valueTracker=aE(e,t,""+e[t])}}function py(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),i="";return e&&(i=dy(e)?e.checked?"true":"false":e.value),e=i,e!==n?(t.setValue(e),!0):!1}function bu(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var rE=/[\n"\\]/g;function _i(e){return e.replace(rE,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function Hd(e,t,n,i,s,a,r,o){e.name="",r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"?e.type=r:e.removeAttribute("type"),t!=null?r==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+mi(t)):e.value!==""+mi(t)&&(e.value=""+mi(t)):r!=="submit"&&r!=="reset"||e.removeAttribute("value"),t!=null?Vd(e,r,mi(t)):n!=null?Vd(e,r,mi(n)):i!=null&&e.removeAttribute("value"),s==null&&a!=null&&(e.defaultChecked=!!a),s!=null&&(e.checked=s&&typeof s!="function"&&typeof s!="symbol"),o!=null&&typeof o!="function"&&typeof o!="symbol"&&typeof o!="boolean"?e.name=""+mi(o):e.removeAttribute("name")}function my(e,t,n,i,s,a,r,o){if(a!=null&&typeof a!="function"&&typeof a!="symbol"&&typeof a!="boolean"&&(e.type=a),t!=null||n!=null){if(!(a!=="submit"&&a!=="reset"||t!=null)){Fd(e);return}n=n!=null?""+mi(n):"",t=t!=null?""+mi(t):n,o||t===e.value||(e.value=t),e.defaultValue=t}i=i??s,i=typeof i!="function"&&typeof i!="symbol"&&!!i,e.checked=o?e.checked:!!i,e.defaultChecked=!!i,r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"&&(e.name=r),Fd(e)}function Vd(e,t,n){t==="number"&&bu(e.ownerDocument)===e||e.defaultValue===""+n||(e.defaultValue=""+n)}function Hr(e,t,n,i){if(e=e.options,t){t={};for(var s=0;s<n.length;s++)t["$"+n[s]]=!0;for(n=0;n<e.length;n++)s=t.hasOwnProperty("$"+e[n].value),e[n].selected!==s&&(e[n].selected=s),s&&i&&(e[n].defaultSelected=!0)}else{for(n=""+mi(n),t=null,s=0;s<e.length;s++){if(e[s].value===n){e[s].selected=!0,i&&(e[s].defaultSelected=!0);return}t!==null||e[s].disabled||(t=e[s])}t!==null&&(t.selected=!0)}}function gy(e,t,n){if(t!=null&&(t=""+mi(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+mi(n):""}function vy(e,t,n,i){if(t==null){if(i!=null){if(n!=null)throw Error(K(92));if(dl(i)){if(1<i.length)throw Error(K(93));i=i[0]}n=i}n==null&&(n=""),t=n}n=mi(t),e.defaultValue=n,i=e.textContent,i===n&&i!==""&&i!==null&&(e.value=i),Fd(e)}function Zr(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var oE=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Lv(e,t,n){var i=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?i?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":i?e.setProperty(t,n):typeof n!="number"||n===0||oE.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function _y(e,t,n){if(t!=null&&typeof t!="object")throw Error(K(62));if(e=e.style,n!=null){for(var i in n)!n.hasOwnProperty(i)||t!=null&&t.hasOwnProperty(i)||(i.indexOf("--")===0?e.setProperty(i,""):i==="float"?e.cssFloat="":e[i]="");for(var s in t)i=t[s],t.hasOwnProperty(s)&&n[s]!==i&&Lv(e,s,i)}else for(var a in t)t.hasOwnProperty(a)&&Lv(e,a,t[a])}function Up(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var lE=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),cE=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function au(e){return cE.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function ds(){}var Gd=null;function Np(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Dr=null,Vr=null;function Iv(e){var t=so(e);if(t&&(e=t.stateNode)){var n=e[Gn]||null;t:switch(e=t.stateNode,t.type){case"input":if(Hd(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+_i(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var i=n[t];if(i!==e&&i.form===e.form){var s=i[Gn]||null;if(!s)throw Error(K(90));Hd(i,s.value,s.defaultValue,s.defaultValue,s.checked,s.defaultChecked,s.type,s.name)}}for(t=0;t<n.length;t++)i=n[t],i.form===e.form&&py(i)}break t;case"textarea":gy(e,n.value,n.defaultValue);break t;case"select":t=n.value,t!=null&&Hr(e,!!n.multiple,t,!1)}}}var nd=!1;function yy(e,t,n){if(nd)return e(t,n);nd=!0;try{var i=e(t);return i}finally{if(nd=!1,(Dr!==null||Vr!==null)&&(rh(),Dr&&(t=Dr,e=Vr,Vr=Dr=null,Iv(t),e)))for(t=0;t<e.length;t++)Iv(e[t])}}function Ul(e,t){var n=e.stateNode;if(n===null)return null;var i=n[Gn]||null;if(i===null)return null;n=i[t];t:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(e=e.type,i=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!i;break t;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(K(231,t,typeof n));return n}var _s=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),kd=!1;if(_s)try{Sr={},Object.defineProperty(Sr,"passive",{get:function(){kd=!0}}),window.addEventListener("test",Sr,Sr),window.removeEventListener("test",Sr,Sr)}catch{kd=!1}var Sr,Zs=null,Lp=null,ru=null;function xy(){if(ru)return ru;var e,t=Lp,n=t.length,i,s="value"in Zs?Zs.value:Zs.textContent,a=s.length;for(e=0;e<n&&t[e]===s[e];e++);var r=n-e;for(i=1;i<=r&&t[n-i]===s[a-i];i++);return ru=s.slice(e,1<i?1-i:void 0)}function ou(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Wc(){return!0}function Ov(){return!1}function kn(e){function t(n,i,s,a,r){this._reactName=n,this._targetInst=s,this.type=i,this.nativeEvent=a,this.target=r,this.currentTarget=null;for(var o in e)e.hasOwnProperty(o)&&(n=e[o],this[o]=n?n(a):a[o]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?Wc:Ov,this.isPropagationStopped=Ov,this}return Pe(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Wc)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Wc)},persist:function(){},isPersistent:Wc}),t}var qa={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ju=kn(qa),Jl=Pe({},qa,{view:0,detail:0}),uE=kn(Jl),id,sd,rl,Qu=Pe({},Jl,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ip,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==rl&&(rl&&e.type==="mousemove"?(id=e.screenX-rl.screenX,sd=e.screenY-rl.screenY):sd=id=0,rl=e),id)},movementY:function(e){return"movementY"in e?e.movementY:sd}}),Pv=kn(Qu),hE=Pe({},Qu,{dataTransfer:0}),fE=kn(hE),dE=Pe({},Jl,{relatedTarget:0}),ad=kn(dE),pE=Pe({},qa,{animationName:0,elapsedTime:0,pseudoElement:0}),mE=kn(pE),gE=Pe({},qa,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),vE=kn(gE),_E=Pe({},qa,{data:0}),zv=kn(_E),yE={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},xE={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},ME={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function SE(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=ME[e])?!!t[e]:!1}function Ip(){return SE}var bE=Pe({},Jl,{key:function(e){if(e.key){var t=yE[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=ou(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?xE[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ip,charCode:function(e){return e.type==="keypress"?ou(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?ou(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),EE=kn(bE),TE=Pe({},Qu,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Bv=kn(TE),AE=Pe({},Jl,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ip}),wE=kn(AE),RE=Pe({},qa,{propertyName:0,elapsedTime:0,pseudoElement:0}),CE=kn(RE),DE=Pe({},Qu,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),UE=kn(DE),NE=Pe({},qa,{newState:0,oldState:0}),LE=kn(NE),IE=[9,13,27,32],Op=_s&&"CompositionEvent"in window,vl=null;_s&&"documentMode"in document&&(vl=document.documentMode);var OE=_s&&"TextEvent"in window&&!vl,My=_s&&(!Op||vl&&8<vl&&11>=vl),Fv=" ",Hv=!1;function Sy(e,t){switch(e){case"keyup":return IE.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function by(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Ur=!1;function PE(e,t){switch(e){case"compositionend":return by(t);case"keypress":return t.which!==32?null:(Hv=!0,Fv);case"textInput":return e=t.data,e===Fv&&Hv?null:e;default:return null}}function zE(e,t){if(Ur)return e==="compositionend"||!Op&&Sy(e,t)?(e=xy(),ru=Lp=Zs=null,Ur=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return My&&t.locale!=="ko"?null:t.data;default:return null}}var BE={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Vv(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!BE[e.type]:t==="textarea"}function Ey(e,t,n,i){Dr?Vr?Vr.push(i):Vr=[i]:Dr=i,t=Vu(t,"onChange"),0<t.length&&(n=new Ju("onChange","change",null,n,i),e.push({event:n,listeners:t}))}var _l=null,Nl=null;function FE(e){yM(e,0)}function Ku(e){var t=pl(e);if(py(t))return e}function Gv(e,t){if(e==="change")return t}var Ty=!1;_s&&(_s?(Yc="oninput"in document,Yc||(rd=document.createElement("div"),rd.setAttribute("oninput","return;"),Yc=typeof rd.oninput=="function"),qc=Yc):qc=!1,Ty=qc&&(!document.documentMode||9<document.documentMode));var qc,Yc,rd;function kv(){_l&&(_l.detachEvent("onpropertychange",Ay),Nl=_l=null)}function Ay(e){if(e.propertyName==="value"&&Ku(Nl)){var t=[];Ey(t,Nl,e,Np(e)),yy(FE,t)}}function HE(e,t,n){e==="focusin"?(kv(),_l=t,Nl=n,_l.attachEvent("onpropertychange",Ay)):e==="focusout"&&kv()}function VE(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Ku(Nl)}function GE(e,t){if(e==="click")return Ku(t)}function kE(e,t){if(e==="input"||e==="change")return Ku(t)}function XE(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var ii=typeof Object.is=="function"?Object.is:XE;function Ll(e,t){if(ii(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),i=Object.keys(t);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var s=n[i];if(!zd.call(t,s)||!ii(e[s],t[s]))return!1}return!0}function Xv(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Wv(e,t){var n=Xv(e);e=0;for(var i;n;){if(n.nodeType===3){if(i=e+n.textContent.length,e<=t&&i>=t)return{node:n,offset:t-e};e=i}t:{for(;n;){if(n.nextSibling){n=n.nextSibling;break t}n=n.parentNode}n=void 0}n=Xv(n)}}function wy(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?wy(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Ry(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=bu(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=bu(e.document)}return t}function Pp(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var WE=_s&&"documentMode"in document&&11>=document.documentMode,Nr=null,Xd=null,yl=null,Wd=!1;function qv(e,t,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Wd||Nr==null||Nr!==bu(i)||(i=Nr,"selectionStart"in i&&Pp(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),yl&&Ll(yl,i)||(yl=i,i=Vu(Xd,"onSelect"),0<i.length&&(t=new Ju("onSelect","select",null,t,n),e.push({event:t,listeners:i}),t.target=Nr)))}function Da(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Lr={animationend:Da("Animation","AnimationEnd"),animationiteration:Da("Animation","AnimationIteration"),animationstart:Da("Animation","AnimationStart"),transitionrun:Da("Transition","TransitionRun"),transitionstart:Da("Transition","TransitionStart"),transitioncancel:Da("Transition","TransitionCancel"),transitionend:Da("Transition","TransitionEnd")},od={},Cy={};_s&&(Cy=document.createElement("div").style,"AnimationEvent"in window||(delete Lr.animationend.animation,delete Lr.animationiteration.animation,delete Lr.animationstart.animation),"TransitionEvent"in window||delete Lr.transitionend.transition);function Ya(e){if(od[e])return od[e];if(!Lr[e])return e;var t=Lr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Cy)return od[e]=t[n];return e}var Dy=Ya("animationend"),Uy=Ya("animationiteration"),Ny=Ya("animationstart"),qE=Ya("transitionrun"),YE=Ya("transitionstart"),ZE=Ya("transitioncancel"),Ly=Ya("transitionend"),Iy=new Map,qd="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");qd.push("scrollEnd");function Ui(e,t){Iy.set(e,t),Wa(t,[e])}var Eu=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},pi=[],Ir=0,zp=0;function ju(){for(var e=Ir,t=zp=Ir=0;t<e;){var n=pi[t];pi[t++]=null;var i=pi[t];pi[t++]=null;var s=pi[t];pi[t++]=null;var a=pi[t];if(pi[t++]=null,i!==null&&s!==null){var r=i.pending;r===null?s.next=s:(s.next=r.next,r.next=s),i.pending=s}a!==0&&Oy(n,s,a)}}function $u(e,t,n,i){pi[Ir++]=e,pi[Ir++]=t,pi[Ir++]=n,pi[Ir++]=i,zp|=i,e.lanes|=i,e=e.alternate,e!==null&&(e.lanes|=i)}function Bp(e,t,n,i){return $u(e,t,n,i),Tu(e)}function Za(e,t){return $u(e,null,null,t),Tu(e)}function Oy(e,t,n){e.lanes|=n;var i=e.alternate;i!==null&&(i.lanes|=n);for(var s=!1,a=e.return;a!==null;)a.childLanes|=n,i=a.alternate,i!==null&&(i.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(s=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,s&&t!==null&&(s=31-ei(n),e=a.hiddenUpdates,i=e[s],i===null?e[s]=[t]:i.push(t),t.lane=n|536870912),a):null}function Tu(e){if(50<Rl)throw Rl=0,dp=null,Error(K(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Or={};function JE(e,t,n,i){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Kn(e,t,n,i){return new JE(e,t,n,i)}function Fp(e){return e=e.prototype,!(!e||!e.isReactComponent)}function ms(e,t){var n=e.alternate;return n===null?(n=Kn(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function Py(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function lu(e,t,n,i,s,a){var r=0;if(i=e,typeof e=="function")Fp(e)&&(r=1);else if(typeof e=="string")r=jT(e,n,qi.current)?26:e==="html"||e==="head"||e==="body"?27:5;else t:switch(e){case Ld:return e=Kn(31,n,t,s),e.elementType=Ld,e.lanes=a,e;case wr:return Pa(n.children,s,a,t);case ey:r=8,s|=24;break;case Dd:return e=Kn(12,n,t,s|2),e.elementType=Dd,e.lanes=a,e;case Ud:return e=Kn(13,n,t,s),e.elementType=Ud,e.lanes=a,e;case Nd:return e=Kn(19,n,t,s),e.elementType=Nd,e.lanes=a,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case fs:r=10;break t;case ny:r=9;break t;case Tp:r=11;break t;case Ap:r=14;break t;case Vs:r=16,i=null;break t}r=29,n=Error(K(130,e===null?"null":typeof e,"")),i=null}return t=Kn(r,n,t,s),t.elementType=e,t.type=i,t.lanes=a,t}function Pa(e,t,n,i){return e=Kn(7,e,i,t),e.lanes=n,e}function ld(e,t,n){return e=Kn(6,e,null,t),e.lanes=n,e}function zy(e){var t=Kn(18,null,null,0);return t.stateNode=e,t}function cd(e,t,n){return t=Kn(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Yv=new WeakMap;function yi(e,t){if(typeof e=="object"&&e!==null){var n=Yv.get(e);return n!==void 0?n:(t={value:e,source:t,stack:Rv(t)},Yv.set(e,t),t)}return{value:e,source:t,stack:Rv(t)}}var Pr=[],zr=0,Au=null,Il=0,gi=[],vi=0,oa=null,ki=1,Xi="";function us(e,t){Pr[zr++]=Il,Pr[zr++]=Au,Au=e,Il=t}function By(e,t,n){gi[vi++]=ki,gi[vi++]=Xi,gi[vi++]=oa,oa=e;var i=ki;e=Xi;var s=32-ei(i)-1;i&=~(1<<s),n+=1;var a=32-ei(t)+s;if(30<a){var r=s-s%5;a=(i&(1<<r)-1).toString(32),i>>=r,s-=r,ki=1<<32-ei(t)+s|n<<s|i,Xi=a+e}else ki=1<<a|n<<s|i,Xi=e}function Hp(e){e.return!==null&&(us(e,1),By(e,1,0))}function Vp(e){for(;e===Au;)Au=Pr[--zr],Pr[zr]=null,Il=Pr[--zr],Pr[zr]=null;for(;e===oa;)oa=gi[--vi],gi[vi]=null,Xi=gi[--vi],gi[vi]=null,ki=gi[--vi],gi[vi]=null}function Fy(e,t){gi[vi++]=ki,gi[vi++]=Xi,gi[vi++]=oa,ki=t.id,Xi=t.overflow,oa=e}var gn=null,Oe=null,le=!1,$s=null,xi=!1,Yd=Error(K(519));function la(e){var t=Error(K(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Ol(yi(t,e)),Yd}function Zv(e){var t=e.stateNode,n=e.type,i=e.memoizedProps;switch(t[mn]=e,t[Gn]=i,n){case"dialog":se("cancel",t),se("close",t);break;case"iframe":case"object":case"embed":se("load",t);break;case"video":case"audio":for(n=0;n<Fl.length;n++)se(Fl[n],t);break;case"source":se("error",t);break;case"img":case"image":case"link":se("error",t),se("load",t);break;case"details":se("toggle",t);break;case"input":se("invalid",t),my(t,i.value,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name,!0);break;case"select":se("invalid",t);break;case"textarea":se("invalid",t),vy(t,i.value,i.defaultValue,i.children)}n=i.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||i.suppressHydrationWarning===!0||MM(t.textContent,n)?(i.popover!=null&&(se("beforetoggle",t),se("toggle",t)),i.onScroll!=null&&se("scroll",t),i.onScrollEnd!=null&&se("scrollend",t),i.onClick!=null&&(t.onclick=ds),t=!0):t=!1,t||la(e,!0)}function Jv(e){for(gn=e.return;gn;)switch(gn.tag){case 5:case 31:case 13:xi=!1;return;case 27:case 3:xi=!0;return;default:gn=gn.return}}function br(e){if(e!==gn)return!1;if(!le)return Jv(e),le=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||_p(e.type,e.memoizedProps)),n=!n),n&&Oe&&la(e),Jv(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(K(317));Oe=z_(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(K(317));Oe=z_(e)}else t===27?(t=Oe,fa(e.type)?(e=Sp,Sp=null,Oe=e):Oe=t):Oe=gn?Si(e.stateNode.nextSibling):null;return!0}function Ha(){Oe=gn=null,le=!1}function ud(){var e=$s;return e!==null&&(Hn===null?Hn=e:Hn.push.apply(Hn,e),$s=null),e}function Ol(e){$s===null?$s=[e]:$s.push(e)}var Zd=Yi(null),Ja=null,ps=null;function ks(e,t,n){De(Zd,t._currentValue),t._currentValue=n}function gs(e){e._currentValue=Zd.current,hn(Zd)}function Jd(e,t,n){for(;e!==null;){var i=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,i!==null&&(i.childLanes|=t)):i!==null&&(i.childLanes&t)!==t&&(i.childLanes|=t),e===n)break;e=e.return}}function Qd(e,t,n,i){var s=e.child;for(s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){var r=s.child;a=a.firstContext;t:for(;a!==null;){var o=a;a=s;for(var l=0;l<t.length;l++)if(o.context===t[l]){a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),Jd(a.return,n,e),i||(r=null);break t}a=o.next}}else if(s.tag===18){if(r=s.return,r===null)throw Error(K(341));r.lanes|=n,a=r.alternate,a!==null&&(a.lanes|=n),Jd(r,n,e),r=null}else r=s.child;if(r!==null)r.return=s;else for(r=s;r!==null;){if(r===e){r=null;break}if(s=r.sibling,s!==null){s.return=r.return,r=s;break}r=r.return}s=r}}function ao(e,t,n,i){e=null;for(var s=t,a=!1;s!==null;){if(!a){if((s.flags&524288)!==0)a=!0;else if((s.flags&262144)!==0)break}if(s.tag===10){var r=s.alternate;if(r===null)throw Error(K(387));if(r=r.memoizedProps,r!==null){var o=s.type;ii(s.pendingProps.value,r.value)||(e!==null?e.push(o):e=[o])}}else if(s===yu.current){if(r=s.alternate,r===null)throw Error(K(387));r.memoizedState.memoizedState!==s.memoizedState.memoizedState&&(e!==null?e.push(Vl):e=[Vl])}s=s.return}e!==null&&Qd(t,e,n,i),t.flags|=262144}function wu(e){for(e=e.firstContext;e!==null;){if(!ii(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Va(e){Ja=e,ps=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function vn(e){return Hy(Ja,e)}function Zc(e,t){return Ja===null&&Va(e),Hy(e,t)}function Hy(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},ps===null){if(e===null)throw Error(K(308));ps=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else ps=ps.next=t;return n}var QE=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,i){e.push(i)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},KE=an.unstable_scheduleCallback,jE=an.unstable_NormalPriority,je={$$typeof:fs,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Gp(){return{controller:new QE,data:new Map,refCount:0}}function Ql(e){e.refCount--,e.refCount===0&&KE(jE,function(){e.controller.abort()})}var xl=null,Kd=0,Jr=0,Gr=null;function $E(e,t){if(xl===null){var n=xl=[];Kd=0,Jr=dm(),Gr={status:"pending",value:void 0,then:function(i){n.push(i)}}}return Kd++,t.then(Qv,Qv),t}function Qv(){if(--Kd===0&&xl!==null){Gr!==null&&(Gr.status="fulfilled");var e=xl;xl=null,Jr=0,Gr=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function tT(e,t){var n=[],i={status:"pending",value:null,reason:null,then:function(s){n.push(s)}};return e.then(function(){i.status="fulfilled",i.value=t;for(var s=0;s<n.length;s++)(0,n[s])(t)},function(s){for(i.status="rejected",i.reason=s,s=0;s<n.length;s++)(0,n[s])(void 0)}),i}var Kv=kt.S;kt.S=function(e,t){tM=$n(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&$E(e,t),Kv!==null&&Kv(e,t)};var za=Yi(null);function kp(){var e=za.current;return e!==null?e:we.pooledCache}function cu(e,t){t===null?De(za,za.current):De(za,t.pool)}function Vy(){var e=kp();return e===null?null:{parent:je._currentValue,pool:e}}var ro=Error(K(460)),Xp=Error(K(474)),th=Error(K(542)),Ru={then:function(){}};function jv(e){return e=e.status,e==="fulfilled"||e==="rejected"}function Gy(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(ds,ds),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,t_(e),e;default:if(typeof t.status=="string")t.then(ds,ds);else{if(e=we,e!==null&&100<e.shellSuspendCounter)throw Error(K(482));e=t,e.status="pending",e.then(function(i){if(t.status==="pending"){var s=t;s.status="fulfilled",s.value=i}},function(i){if(t.status==="pending"){var s=t;s.status="rejected",s.reason=i}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,t_(e),e}throw Ba=t,ro}}function La(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(Ba=n,ro):n}}var Ba=null;function $v(){if(Ba===null)throw Error(K(459));var e=Ba;return Ba=null,e}function t_(e){if(e===ro||e===th)throw Error(K(483))}var kr=null,Pl=0;function Jc(e){var t=Pl;return Pl+=1,kr===null&&(kr=[]),Gy(kr,e,t)}function ol(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Qc(e,t){throw t.$$typeof===H1?Error(K(525)):(e=Object.prototype.toString.call(t),Error(K(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function ky(e){function t(u,y){if(e){var _=u.deletions;_===null?(u.deletions=[y],u.flags|=16):_.push(y)}}function n(u,y){if(!e)return null;for(;y!==null;)t(u,y),y=y.sibling;return null}function i(u){for(var y=new Map;u!==null;)u.key!==null?y.set(u.key,u):y.set(u.index,u),u=u.sibling;return y}function s(u,y){return u=ms(u,y),u.index=0,u.sibling=null,u}function a(u,y,_){return u.index=_,e?(_=u.alternate,_!==null?(_=_.index,_<y?(u.flags|=67108866,y):_):(u.flags|=67108866,y)):(u.flags|=1048576,y)}function r(u){return e&&u.alternate===null&&(u.flags|=67108866),u}function o(u,y,_,v){return y===null||y.tag!==6?(y=ld(_,u.mode,v),y.return=u,y):(y=s(y,_),y.return=u,y)}function l(u,y,_,v){var R=_.type;return R===wr?h(u,y,_.props.children,v,_.key):y!==null&&(y.elementType===R||typeof R=="object"&&R!==null&&R.$$typeof===Vs&&La(R)===y.type)?(y=s(y,_.props),ol(y,_),y.return=u,y):(y=lu(_.type,_.key,_.props,null,u.mode,v),ol(y,_),y.return=u,y)}function c(u,y,_,v){return y===null||y.tag!==4||y.stateNode.containerInfo!==_.containerInfo||y.stateNode.implementation!==_.implementation?(y=cd(_,u.mode,v),y.return=u,y):(y=s(y,_.children||[]),y.return=u,y)}function h(u,y,_,v,R){return y===null||y.tag!==7?(y=Pa(_,u.mode,v,R),y.return=u,y):(y=s(y,_),y.return=u,y)}function d(u,y,_){if(typeof y=="string"&&y!==""||typeof y=="number"||typeof y=="bigint")return y=ld(""+y,u.mode,_),y.return=u,y;if(typeof y=="object"&&y!==null){switch(y.$$typeof){case Hc:return _=lu(y.type,y.key,y.props,null,u.mode,_),ol(_,y),_.return=u,_;case fl:return y=cd(y,u.mode,_),y.return=u,y;case Vs:return y=La(y),d(u,y,_)}if(dl(y)||al(y))return y=Pa(y,u.mode,_,null),y.return=u,y;if(typeof y.then=="function")return d(u,Jc(y),_);if(y.$$typeof===fs)return d(u,Zc(u,y),_);Qc(u,y)}return null}function f(u,y,_,v){var R=y!==null?y.key:null;if(typeof _=="string"&&_!==""||typeof _=="number"||typeof _=="bigint")return R!==null?null:o(u,y,""+_,v);if(typeof _=="object"&&_!==null){switch(_.$$typeof){case Hc:return _.key===R?l(u,y,_,v):null;case fl:return _.key===R?c(u,y,_,v):null;case Vs:return _=La(_),f(u,y,_,v)}if(dl(_)||al(_))return R!==null?null:h(u,y,_,v,null);if(typeof _.then=="function")return f(u,y,Jc(_),v);if(_.$$typeof===fs)return f(u,y,Zc(u,_),v);Qc(u,_)}return null}function p(u,y,_,v,R){if(typeof v=="string"&&v!==""||typeof v=="number"||typeof v=="bigint")return u=u.get(_)||null,o(y,u,""+v,R);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case Hc:return u=u.get(v.key===null?_:v.key)||null,l(y,u,v,R);case fl:return u=u.get(v.key===null?_:v.key)||null,c(y,u,v,R);case Vs:return v=La(v),p(u,y,_,v,R)}if(dl(v)||al(v))return u=u.get(_)||null,h(y,u,v,R,null);if(typeof v.then=="function")return p(u,y,_,Jc(v),R);if(v.$$typeof===fs)return p(u,y,_,Zc(y,v),R);Qc(y,v)}return null}function g(u,y,_,v){for(var R=null,w=null,A=y,C=y=0,b=null;A!==null&&C<_.length;C++){A.index>C?(b=A,A=null):b=A.sibling;var S=f(u,A,_[C],v);if(S===null){A===null&&(A=b);break}e&&A&&S.alternate===null&&t(u,A),y=a(S,y,C),w===null?R=S:w.sibling=S,w=S,A=b}if(C===_.length)return n(u,A),le&&us(u,C),R;if(A===null){for(;C<_.length;C++)A=d(u,_[C],v),A!==null&&(y=a(A,y,C),w===null?R=A:w.sibling=A,w=A);return le&&us(u,C),R}for(A=i(A);C<_.length;C++)b=p(A,u,C,_[C],v),b!==null&&(e&&b.alternate!==null&&A.delete(b.key===null?C:b.key),y=a(b,y,C),w===null?R=b:w.sibling=b,w=b);return e&&A.forEach(function(U){return t(u,U)}),le&&us(u,C),R}function M(u,y,_,v){if(_==null)throw Error(K(151));for(var R=null,w=null,A=y,C=y=0,b=null,S=_.next();A!==null&&!S.done;C++,S=_.next()){A.index>C?(b=A,A=null):b=A.sibling;var U=f(u,A,S.value,v);if(U===null){A===null&&(A=b);break}e&&A&&U.alternate===null&&t(u,A),y=a(U,y,C),w===null?R=U:w.sibling=U,w=U,A=b}if(S.done)return n(u,A),le&&us(u,C),R;if(A===null){for(;!S.done;C++,S=_.next())S=d(u,S.value,v),S!==null&&(y=a(S,y,C),w===null?R=S:w.sibling=S,w=S);return le&&us(u,C),R}for(A=i(A);!S.done;C++,S=_.next())S=p(A,u,C,S.value,v),S!==null&&(e&&S.alternate!==null&&A.delete(S.key===null?C:S.key),y=a(S,y,C),w===null?R=S:w.sibling=S,w=S);return e&&A.forEach(function(F){return t(u,F)}),le&&us(u,C),R}function m(u,y,_,v){if(typeof _=="object"&&_!==null&&_.type===wr&&_.key===null&&(_=_.props.children),typeof _=="object"&&_!==null){switch(_.$$typeof){case Hc:t:{for(var R=_.key;y!==null;){if(y.key===R){if(R=_.type,R===wr){if(y.tag===7){n(u,y.sibling),v=s(y,_.props.children),v.return=u,u=v;break t}}else if(y.elementType===R||typeof R=="object"&&R!==null&&R.$$typeof===Vs&&La(R)===y.type){n(u,y.sibling),v=s(y,_.props),ol(v,_),v.return=u,u=v;break t}n(u,y);break}else t(u,y);y=y.sibling}_.type===wr?(v=Pa(_.props.children,u.mode,v,_.key),v.return=u,u=v):(v=lu(_.type,_.key,_.props,null,u.mode,v),ol(v,_),v.return=u,u=v)}return r(u);case fl:t:{for(R=_.key;y!==null;){if(y.key===R)if(y.tag===4&&y.stateNode.containerInfo===_.containerInfo&&y.stateNode.implementation===_.implementation){n(u,y.sibling),v=s(y,_.children||[]),v.return=u,u=v;break t}else{n(u,y);break}else t(u,y);y=y.sibling}v=cd(_,u.mode,v),v.return=u,u=v}return r(u);case Vs:return _=La(_),m(u,y,_,v)}if(dl(_))return g(u,y,_,v);if(al(_)){if(R=al(_),typeof R!="function")throw Error(K(150));return _=R.call(_),M(u,y,_,v)}if(typeof _.then=="function")return m(u,y,Jc(_),v);if(_.$$typeof===fs)return m(u,y,Zc(u,_),v);Qc(u,_)}return typeof _=="string"&&_!==""||typeof _=="number"||typeof _=="bigint"?(_=""+_,y!==null&&y.tag===6?(n(u,y.sibling),v=s(y,_),v.return=u,u=v):(n(u,y),v=ld(_,u.mode,v),v.return=u,u=v),r(u)):n(u,y)}return function(u,y,_,v){try{Pl=0;var R=m(u,y,_,v);return kr=null,R}catch(A){if(A===ro||A===th)throw A;var w=Kn(29,A,null,u.mode);return w.lanes=v,w.return=u,w}finally{}}}var Ga=ky(!0),Xy=ky(!1),Gs=!1;function Wp(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function jd(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function ta(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function ea(e,t,n){var i=e.updateQueue;if(i===null)return null;if(i=i.shared,(de&2)!==0){var s=i.pending;return s===null?t.next=t:(t.next=s.next,s.next=t),i.pending=t,t=Tu(e),Oy(e,null,n),t}return $u(e,i,t,n),Tu(e)}function Ml(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var i=t.lanes;i&=e.pendingLanes,n|=i,t.lanes=n,ly(e,n)}}function hd(e,t){var n=e.updateQueue,i=e.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var s=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var r={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?s=a=r:a=a.next=r,n=n.next}while(n!==null);a===null?s=a=t:a=a.next=t}else s=a=t;n={baseState:i.baseState,firstBaseUpdate:s,lastBaseUpdate:a,shared:i.shared,callbacks:i.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var $d=!1;function Sl(){if($d){var e=Gr;if(e!==null)throw e}}function bl(e,t,n,i){$d=!1;var s=e.updateQueue;Gs=!1;var a=s.firstBaseUpdate,r=s.lastBaseUpdate,o=s.shared.pending;if(o!==null){s.shared.pending=null;var l=o,c=l.next;l.next=null,r===null?a=c:r.next=c,r=l;var h=e.alternate;h!==null&&(h=h.updateQueue,o=h.lastBaseUpdate,o!==r&&(o===null?h.firstBaseUpdate=c:o.next=c,h.lastBaseUpdate=l))}if(a!==null){var d=s.baseState;r=0,h=c=l=null,o=a;do{var f=o.lane&-536870913,p=f!==o.lane;if(p?(re&f)===f:(i&f)===f){f!==0&&f===Jr&&($d=!0),h!==null&&(h=h.next={lane:0,tag:o.tag,payload:o.payload,callback:null,next:null});t:{var g=e,M=o;f=t;var m=n;switch(M.tag){case 1:if(g=M.payload,typeof g=="function"){d=g.call(m,d,f);break t}d=g;break t;case 3:g.flags=g.flags&-65537|128;case 0:if(g=M.payload,f=typeof g=="function"?g.call(m,d,f):g,f==null)break t;d=Pe({},d,f);break t;case 2:Gs=!0}}f=o.callback,f!==null&&(e.flags|=64,p&&(e.flags|=8192),p=s.callbacks,p===null?s.callbacks=[f]:p.push(f))}else p={lane:f,tag:o.tag,payload:o.payload,callback:o.callback,next:null},h===null?(c=h=p,l=d):h=h.next=p,r|=f;if(o=o.next,o===null){if(o=s.shared.pending,o===null)break;p=o,o=p.next,p.next=null,s.lastBaseUpdate=p,s.shared.pending=null}}while(!0);h===null&&(l=d),s.baseState=l,s.firstBaseUpdate=c,s.lastBaseUpdate=h,a===null&&(s.shared.lanes=0),ua|=r,e.lanes=r,e.memoizedState=d}}function Wy(e,t){if(typeof e!="function")throw Error(K(191,e));e.call(t)}function qy(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)Wy(n[e],t)}var Qr=Yi(null),Cu=Yi(0);function e_(e,t){e=Ss,De(Cu,e),De(Qr,t),Ss=e|t.baseLanes}function tp(){De(Cu,Ss),De(Qr,Qr.current)}function qp(){Ss=Cu.current,hn(Qr),hn(Cu)}var si=Yi(null),Mi=null;function Xs(e){var t=e.alternate;De(We,We.current&1),De(si,e),Mi===null&&(t===null||Qr.current!==null||t.memoizedState!==null)&&(Mi=e)}function ep(e){De(We,We.current),De(si,e),Mi===null&&(Mi=e)}function Yy(e){e.tag===22?(De(We,We.current),De(si,e),Mi===null&&(Mi=e)):Ws(e)}function Ws(){De(We,We.current),De(si,si.current)}function Qn(e){hn(si),Mi===e&&(Mi=null),hn(We)}var We=Yi(0);function Du(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||xp(n)||Mp(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var ys=0,jt=null,Ee=null,Qe=null,Uu=!1,Xr=!1,ka=!1,Nu=0,zl=0,Wr=null,eT=0;function Ge(){throw Error(K(321))}function Yp(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!ii(e[n],t[n]))return!1;return!0}function Zp(e,t,n,i,s,a){return ys=a,jt=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,kt.H=e===null||e.memoizedState===null?Ex:am,ka=!1,a=n(i,s),ka=!1,Xr&&(a=Jy(t,n,i,s)),Zy(e),a}function Zy(e){kt.H=Bl;var t=Ee!==null&&Ee.next!==null;if(ys=0,Qe=Ee=jt=null,Uu=!1,zl=0,Wr=null,t)throw Error(K(300));e===null||$e||(e=e.dependencies,e!==null&&wu(e)&&($e=!0))}function Jy(e,t,n,i){jt=e;var s=0;do{if(Xr&&(Wr=null),zl=0,Xr=!1,25<=s)throw Error(K(301));if(s+=1,Qe=Ee=null,e.updateQueue!=null){var a=e.updateQueue;a.lastEffect=null,a.events=null,a.stores=null,a.memoCache!=null&&(a.memoCache.index=0)}kt.H=Tx,a=t(n,i)}while(Xr);return a}function nT(){var e=kt.H,t=e.useState()[0];return t=typeof t.then=="function"?Kl(t):t,e=e.useState()[0],(Ee!==null?Ee.memoizedState:null)!==e&&(jt.flags|=1024),t}function Jp(){var e=Nu!==0;return Nu=0,e}function Qp(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function Kp(e){if(Uu){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Uu=!1}ys=0,Qe=Ee=jt=null,Xr=!1,zl=Nu=0,Wr=null}function Dn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Qe===null?jt.memoizedState=Qe=e:Qe=Qe.next=e,Qe}function qe(){if(Ee===null){var e=jt.alternate;e=e!==null?e.memoizedState:null}else e=Ee.next;var t=Qe===null?jt.memoizedState:Qe.next;if(t!==null)Qe=t,Ee=e;else{if(e===null)throw jt.alternate===null?Error(K(467)):Error(K(310));Ee=e,e={memoizedState:Ee.memoizedState,baseState:Ee.baseState,baseQueue:Ee.baseQueue,queue:Ee.queue,next:null},Qe===null?jt.memoizedState=Qe=e:Qe=Qe.next=e}return Qe}function eh(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Kl(e){var t=zl;return zl+=1,Wr===null&&(Wr=[]),e=Gy(Wr,e,t),t=jt,(Qe===null?t.memoizedState:Qe.next)===null&&(t=t.alternate,kt.H=t===null||t.memoizedState===null?Ex:am),e}function nh(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Kl(e);if(e.$$typeof===fs)return vn(e)}throw Error(K(438,String(e)))}function jp(e){var t=null,n=jt.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var i=jt.alternate;i!==null&&(i=i.updateQueue,i!==null&&(i=i.memoCache,i!=null&&(t={data:i.data.map(function(s){return s.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=eh(),jt.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),i=0;i<e;i++)n[i]=V1;return t.index++,n}function xs(e,t){return typeof t=="function"?t(e):t}function uu(e){var t=qe();return $p(t,Ee,e)}function $p(e,t,n){var i=e.queue;if(i===null)throw Error(K(311));i.lastRenderedReducer=n;var s=e.baseQueue,a=i.pending;if(a!==null){if(s!==null){var r=s.next;s.next=a.next,a.next=r}t.baseQueue=s=a,i.pending=null}if(a=e.baseState,s===null)e.memoizedState=a;else{t=s.next;var o=r=null,l=null,c=t,h=!1;do{var d=c.lane&-536870913;if(d!==c.lane?(re&d)===d:(ys&d)===d){var f=c.revertLane;if(f===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),d===Jr&&(h=!0);else if((ys&f)===f){c=c.next,f===Jr&&(h=!0);continue}else d={lane:0,revertLane:c.revertLane,gesture:null,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null},l===null?(o=l=d,r=a):l=l.next=d,jt.lanes|=f,ua|=f;d=c.action,ka&&n(a,d),a=c.hasEagerState?c.eagerState:n(a,d)}else f={lane:d,revertLane:c.revertLane,gesture:c.gesture,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null},l===null?(o=l=f,r=a):l=l.next=f,jt.lanes|=d,ua|=d;c=c.next}while(c!==null&&c!==t);if(l===null?r=a:l.next=o,!ii(a,e.memoizedState)&&($e=!0,h&&(n=Gr,n!==null)))throw n;e.memoizedState=a,e.baseState=r,e.baseQueue=l,i.lastRenderedState=a}return s===null&&(i.lanes=0),[e.memoizedState,i.dispatch]}function fd(e){var t=qe(),n=t.queue;if(n===null)throw Error(K(311));n.lastRenderedReducer=e;var i=n.dispatch,s=n.pending,a=t.memoizedState;if(s!==null){n.pending=null;var r=s=s.next;do a=e(a,r.action),r=r.next;while(r!==s);ii(a,t.memoizedState)||($e=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),n.lastRenderedState=a}return[a,i]}function Qy(e,t,n){var i=jt,s=qe(),a=le;if(a){if(n===void 0)throw Error(K(407));n=n()}else n=t();var r=!ii((Ee||s).memoizedState,n);if(r&&(s.memoizedState=n,$e=!0),s=s.queue,tm($y.bind(null,i,s,e),[e]),s.getSnapshot!==t||r||Qe!==null&&Qe.memoizedState.tag&1){if(i.flags|=2048,Kr(9,{destroy:void 0},jy.bind(null,i,s,n,t),null),we===null)throw Error(K(349));a||(ys&127)!==0||Ky(i,t,n)}return n}function Ky(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=jt.updateQueue,t===null?(t=eh(),jt.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function jy(e,t,n,i){t.value=n,t.getSnapshot=i,tx(t)&&ex(e)}function $y(e,t,n){return n(function(){tx(t)&&ex(e)})}function tx(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!ii(e,n)}catch{return!0}}function ex(e){var t=Za(e,2);t!==null&&Vn(t,e,2)}function np(e){var t=Dn();if(typeof e=="function"){var n=e;if(e=n(),ka){Ys(!0);try{n()}finally{Ys(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:xs,lastRenderedState:e},t}function nx(e,t,n,i){return e.baseState=n,$p(e,Ee,typeof i=="function"?i:xs)}function iT(e,t,n,i,s){if(sh(e))throw Error(K(485));if(e=t.action,e!==null){var a={payload:s,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(r){a.listeners.push(r)}};kt.T!==null?n(!0):a.isTransition=!1,i(a),n=t.pending,n===null?(a.next=t.pending=a,ix(t,a)):(a.next=n.next,t.pending=n.next=a)}}function ix(e,t){var n=t.action,i=t.payload,s=e.state;if(t.isTransition){var a=kt.T,r={};kt.T=r;try{var o=n(s,i),l=kt.S;l!==null&&l(r,o),n_(e,t,o)}catch(c){ip(e,t,c)}finally{a!==null&&r.types!==null&&(a.types=r.types),kt.T=a}}else try{a=n(s,i),n_(e,t,a)}catch(c){ip(e,t,c)}}function n_(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(i){i_(e,t,i)},function(i){return ip(e,t,i)}):i_(e,t,n)}function i_(e,t,n){t.status="fulfilled",t.value=n,sx(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,ix(e,n)))}function ip(e,t,n){var i=e.pending;if(e.pending=null,i!==null){i=i.next;do t.status="rejected",t.reason=n,sx(t),t=t.next;while(t!==i)}e.action=null}function sx(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function ax(e,t){return t}function s_(e,t){if(le){var n=we.formState;if(n!==null){t:{var i=jt;if(le){if(Oe){e:{for(var s=Oe,a=xi;s.nodeType!==8;){if(!a){s=null;break e}if(s=Si(s.nextSibling),s===null){s=null;break e}}a=s.data,s=a==="F!"||a==="F"?s:null}if(s){Oe=Si(s.nextSibling),i=s.data==="F!";break t}}la(i)}i=!1}i&&(t=n[0])}}return n=Dn(),n.memoizedState=n.baseState=t,i={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ax,lastRenderedState:t},n.queue=i,n=Mx.bind(null,jt,i),i.dispatch=n,i=np(!1),a=sm.bind(null,jt,!1,i.queue),i=Dn(),s={state:t,dispatch:null,action:e,pending:null},i.queue=s,n=iT.bind(null,jt,s,a,n),s.dispatch=n,i.memoizedState=e,[t,n,!1]}function a_(e){var t=qe();return rx(t,Ee,e)}function rx(e,t,n){if(t=$p(e,t,ax)[0],e=uu(xs)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var i=Kl(t)}catch(r){throw r===ro?th:r}else i=t;t=qe();var s=t.queue,a=s.dispatch;return n!==t.memoizedState&&(jt.flags|=2048,Kr(9,{destroy:void 0},sT.bind(null,s,n),null)),[i,a,e]}function sT(e,t){e.action=t}function r_(e){var t=qe(),n=Ee;if(n!==null)return rx(t,n,e);qe(),t=t.memoizedState,n=qe();var i=n.queue.dispatch;return n.memoizedState=e,[t,i,!1]}function Kr(e,t,n,i){return e={tag:e,create:n,deps:i,inst:t,next:null},t=jt.updateQueue,t===null&&(t=eh(),jt.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(i=n.next,n.next=e,e.next=i,t.lastEffect=e),e}function ox(){return qe().memoizedState}function hu(e,t,n,i){var s=Dn();jt.flags|=e,s.memoizedState=Kr(1|t,{destroy:void 0},n,i===void 0?null:i)}function ih(e,t,n,i){var s=qe();i=i===void 0?null:i;var a=s.memoizedState.inst;Ee!==null&&i!==null&&Yp(i,Ee.memoizedState.deps)?s.memoizedState=Kr(t,a,n,i):(jt.flags|=e,s.memoizedState=Kr(1|t,a,n,i))}function o_(e,t){hu(8390656,8,e,t)}function tm(e,t){ih(2048,8,e,t)}function aT(e){jt.flags|=4;var t=jt.updateQueue;if(t===null)t=eh(),jt.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function lx(e){var t=qe().memoizedState;return aT({ref:t,nextImpl:e}),function(){if((de&2)!==0)throw Error(K(440));return t.impl.apply(void 0,arguments)}}function cx(e,t){return ih(4,2,e,t)}function ux(e,t){return ih(4,4,e,t)}function hx(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function fx(e,t,n){n=n!=null?n.concat([e]):null,ih(4,4,hx.bind(null,t,e),n)}function em(){}function dx(e,t){var n=qe();t=t===void 0?null:t;var i=n.memoizedState;return t!==null&&Yp(t,i[1])?i[0]:(n.memoizedState=[e,t],e)}function px(e,t){var n=qe();t=t===void 0?null:t;var i=n.memoizedState;if(t!==null&&Yp(t,i[1]))return i[0];if(i=e(),ka){Ys(!0);try{e()}finally{Ys(!1)}}return n.memoizedState=[i,t],i}function nm(e,t,n){return n===void 0||(ys&1073741824)!==0&&(re&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=nM(),jt.lanes|=e,ua|=e,n)}function mx(e,t,n,i){return ii(n,t)?n:Qr.current!==null?(e=nm(e,n,i),ii(e,t)||($e=!0),e):(ys&42)===0||(ys&1073741824)!==0&&(re&261930)===0?($e=!0,e.memoizedState=n):(e=nM(),jt.lanes|=e,ua|=e,t)}function gx(e,t,n,i,s){var a=pe.p;pe.p=a!==0&&8>a?a:8;var r=kt.T,o={};kt.T=o,sm(e,!1,t,n);try{var l=s(),c=kt.S;if(c!==null&&c(o,l),l!==null&&typeof l=="object"&&typeof l.then=="function"){var h=tT(l,i);El(e,t,h,ni(e))}else El(e,t,i,ni(e))}catch(d){El(e,t,{then:function(){},status:"rejected",reason:d},ni())}finally{pe.p=a,r!==null&&o.types!==null&&(r.types=o.types),kt.T=r}}function rT(){}function sp(e,t,n,i){if(e.tag!==5)throw Error(K(476));var s=vx(e).queue;gx(e,s,t,Oa,n===null?rT:function(){return _x(e),n(i)})}function vx(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:Oa,baseState:Oa,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:xs,lastRenderedState:Oa},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:xs,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function _x(e){var t=vx(e);t.next===null&&(t=e.alternate.memoizedState),El(e,t.next.queue,{},ni())}function im(){return vn(Vl)}function yx(){return qe().memoizedState}function xx(){return qe().memoizedState}function oT(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=ni();e=ta(n);var i=ea(t,e,n);i!==null&&(Vn(i,t,n),Ml(i,t,n)),t={cache:Gp()},e.payload=t;return}t=t.return}}function lT(e,t,n){var i=ni();n={lane:i,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},sh(e)?Sx(t,n):(n=Bp(e,t,n,i),n!==null&&(Vn(n,e,i),bx(n,t,i)))}function Mx(e,t,n){var i=ni();El(e,t,n,i)}function El(e,t,n,i){var s={lane:i,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(sh(e))Sx(t,s);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var r=t.lastRenderedState,o=a(r,n);if(s.hasEagerState=!0,s.eagerState=o,ii(o,r))return $u(e,t,s,0),we===null&&ju(),!1}catch{}finally{}if(n=Bp(e,t,s,i),n!==null)return Vn(n,e,i),bx(n,t,i),!0}return!1}function sm(e,t,n,i){if(i={lane:2,revertLane:dm(),gesture:null,action:i,hasEagerState:!1,eagerState:null,next:null},sh(e)){if(t)throw Error(K(479))}else t=Bp(e,n,i,2),t!==null&&Vn(t,e,2)}function sh(e){var t=e.alternate;return e===jt||t!==null&&t===jt}function Sx(e,t){Xr=Uu=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function bx(e,t,n){if((n&4194048)!==0){var i=t.lanes;i&=e.pendingLanes,n|=i,t.lanes=n,ly(e,n)}}var Bl={readContext:vn,use:nh,useCallback:Ge,useContext:Ge,useEffect:Ge,useImperativeHandle:Ge,useLayoutEffect:Ge,useInsertionEffect:Ge,useMemo:Ge,useReducer:Ge,useRef:Ge,useState:Ge,useDebugValue:Ge,useDeferredValue:Ge,useTransition:Ge,useSyncExternalStore:Ge,useId:Ge,useHostTransitionStatus:Ge,useFormState:Ge,useActionState:Ge,useOptimistic:Ge,useMemoCache:Ge,useCacheRefresh:Ge};Bl.useEffectEvent=Ge;var Ex={readContext:vn,use:nh,useCallback:function(e,t){return Dn().memoizedState=[e,t===void 0?null:t],e},useContext:vn,useEffect:o_,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,hu(4194308,4,hx.bind(null,t,e),n)},useLayoutEffect:function(e,t){return hu(4194308,4,e,t)},useInsertionEffect:function(e,t){hu(4,2,e,t)},useMemo:function(e,t){var n=Dn();t=t===void 0?null:t;var i=e();if(ka){Ys(!0);try{e()}finally{Ys(!1)}}return n.memoizedState=[i,t],i},useReducer:function(e,t,n){var i=Dn();if(n!==void 0){var s=n(t);if(ka){Ys(!0);try{n(t)}finally{Ys(!1)}}}else s=t;return i.memoizedState=i.baseState=s,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:s},i.queue=e,e=e.dispatch=lT.bind(null,jt,e),[i.memoizedState,e]},useRef:function(e){var t=Dn();return e={current:e},t.memoizedState=e},useState:function(e){e=np(e);var t=e.queue,n=Mx.bind(null,jt,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:em,useDeferredValue:function(e,t){var n=Dn();return nm(n,e,t)},useTransition:function(){var e=np(!1);return e=gx.bind(null,jt,e.queue,!0,!1),Dn().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var i=jt,s=Dn();if(le){if(n===void 0)throw Error(K(407));n=n()}else{if(n=t(),we===null)throw Error(K(349));(re&127)!==0||Ky(i,t,n)}s.memoizedState=n;var a={value:n,getSnapshot:t};return s.queue=a,o_($y.bind(null,i,a,e),[e]),i.flags|=2048,Kr(9,{destroy:void 0},jy.bind(null,i,a,n,t),null),n},useId:function(){var e=Dn(),t=we.identifierPrefix;if(le){var n=Xi,i=ki;n=(i&~(1<<32-ei(i)-1)).toString(32)+n,t="_"+t+"R_"+n,n=Nu++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=eT++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:im,useFormState:s_,useActionState:s_,useOptimistic:function(e){var t=Dn();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=sm.bind(null,jt,!0,n),n.dispatch=t,[e,t]},useMemoCache:jp,useCacheRefresh:function(){return Dn().memoizedState=oT.bind(null,jt)},useEffectEvent:function(e){var t=Dn(),n={impl:e};return t.memoizedState=n,function(){if((de&2)!==0)throw Error(K(440));return n.impl.apply(void 0,arguments)}}},am={readContext:vn,use:nh,useCallback:dx,useContext:vn,useEffect:tm,useImperativeHandle:fx,useInsertionEffect:cx,useLayoutEffect:ux,useMemo:px,useReducer:uu,useRef:ox,useState:function(){return uu(xs)},useDebugValue:em,useDeferredValue:function(e,t){var n=qe();return mx(n,Ee.memoizedState,e,t)},useTransition:function(){var e=uu(xs)[0],t=qe().memoizedState;return[typeof e=="boolean"?e:Kl(e),t]},useSyncExternalStore:Qy,useId:yx,useHostTransitionStatus:im,useFormState:a_,useActionState:a_,useOptimistic:function(e,t){var n=qe();return nx(n,Ee,e,t)},useMemoCache:jp,useCacheRefresh:xx};am.useEffectEvent=lx;var Tx={readContext:vn,use:nh,useCallback:dx,useContext:vn,useEffect:tm,useImperativeHandle:fx,useInsertionEffect:cx,useLayoutEffect:ux,useMemo:px,useReducer:fd,useRef:ox,useState:function(){return fd(xs)},useDebugValue:em,useDeferredValue:function(e,t){var n=qe();return Ee===null?nm(n,e,t):mx(n,Ee.memoizedState,e,t)},useTransition:function(){var e=fd(xs)[0],t=qe().memoizedState;return[typeof e=="boolean"?e:Kl(e),t]},useSyncExternalStore:Qy,useId:yx,useHostTransitionStatus:im,useFormState:r_,useActionState:r_,useOptimistic:function(e,t){var n=qe();return Ee!==null?nx(n,Ee,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:jp,useCacheRefresh:xx};Tx.useEffectEvent=lx;function dd(e,t,n,i){t=e.memoizedState,n=n(i,t),n=n==null?t:Pe({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var ap={enqueueSetState:function(e,t,n){e=e._reactInternals;var i=ni(),s=ta(i);s.payload=t,n!=null&&(s.callback=n),t=ea(e,s,i),t!==null&&(Vn(t,e,i),Ml(t,e,i))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var i=ni(),s=ta(i);s.tag=1,s.payload=t,n!=null&&(s.callback=n),t=ea(e,s,i),t!==null&&(Vn(t,e,i),Ml(t,e,i))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=ni(),i=ta(n);i.tag=2,t!=null&&(i.callback=t),t=ea(e,i,n),t!==null&&(Vn(t,e,n),Ml(t,e,n))}};function l_(e,t,n,i,s,a,r){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(i,a,r):t.prototype&&t.prototype.isPureReactComponent?!Ll(n,i)||!Ll(s,a):!0}function c_(e,t,n,i){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,i),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,i),t.state!==e&&ap.enqueueReplaceState(t,t.state,null)}function Xa(e,t){var n=t;if("ref"in t){n={};for(var i in t)i!=="ref"&&(n[i]=t[i])}if(e=e.defaultProps){n===t&&(n=Pe({},n));for(var s in e)n[s]===void 0&&(n[s]=e[s])}return n}function Ax(e){Eu(e)}function wx(e){console.error(e)}function Rx(e){Eu(e)}function Lu(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(i){setTimeout(function(){throw i})}}function u_(e,t,n){try{var i=e.onCaughtError;i(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(s){setTimeout(function(){throw s})}}function rp(e,t,n){return n=ta(n),n.tag=3,n.payload={element:null},n.callback=function(){Lu(e,t)},n}function Cx(e){return e=ta(e),e.tag=3,e}function Dx(e,t,n,i){var s=n.type.getDerivedStateFromError;if(typeof s=="function"){var a=i.value;e.payload=function(){return s(a)},e.callback=function(){u_(t,n,i)}}var r=n.stateNode;r!==null&&typeof r.componentDidCatch=="function"&&(e.callback=function(){u_(t,n,i),typeof s!="function"&&(na===null?na=new Set([this]):na.add(this));var o=i.stack;this.componentDidCatch(i.value,{componentStack:o!==null?o:""})})}function cT(e,t,n,i,s){if(n.flags|=32768,i!==null&&typeof i=="object"&&typeof i.then=="function"){if(t=n.alternate,t!==null&&ao(t,n,s,!0),n=si.current,n!==null){switch(n.tag){case 31:case 13:return Mi===null?Bu():n.alternate===null&&ke===0&&(ke=3),n.flags&=-257,n.flags|=65536,n.lanes=s,i===Ru?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([i]):t.add(i),Ed(e,i,s)),!1;case 22:return n.flags|=65536,i===Ru?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([i])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([i]):n.add(i)),Ed(e,i,s)),!1}throw Error(K(435,n.tag))}return Ed(e,i,s),Bu(),!1}if(le)return t=si.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=s,i!==Yd&&(e=Error(K(422),{cause:i}),Ol(yi(e,n)))):(i!==Yd&&(t=Error(K(423),{cause:i}),Ol(yi(t,n))),e=e.current.alternate,e.flags|=65536,s&=-s,e.lanes|=s,i=yi(i,n),s=rp(e.stateNode,i,s),hd(e,s),ke!==4&&(ke=2)),!1;var a=Error(K(520),{cause:i});if(a=yi(a,n),wl===null?wl=[a]:wl.push(a),ke!==4&&(ke=2),t===null)return!0;i=yi(i,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=s&-s,n.lanes|=e,e=rp(n.stateNode,i,e),hd(n,e),!1;case 1:if(t=n.type,a=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||a!==null&&typeof a.componentDidCatch=="function"&&(na===null||!na.has(a))))return n.flags|=65536,s&=-s,n.lanes|=s,s=Cx(s),Dx(s,e,n,i),hd(n,s),!1}n=n.return}while(n!==null);return!1}var rm=Error(K(461)),$e=!1;function pn(e,t,n,i){t.child=e===null?Xy(t,null,n,i):Ga(t,e.child,n,i)}function h_(e,t,n,i,s){n=n.render;var a=t.ref;if("ref"in i){var r={};for(var o in i)o!=="ref"&&(r[o]=i[o])}else r=i;return Va(t),i=Zp(e,t,n,r,a,s),o=Jp(),e!==null&&!$e?(Qp(e,t,s),Ms(e,t,s)):(le&&o&&Hp(t),t.flags|=1,pn(e,t,i,s),t.child)}function f_(e,t,n,i,s){if(e===null){var a=n.type;return typeof a=="function"&&!Fp(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,Ux(e,t,a,i,s)):(e=lu(n.type,null,i,t,t.mode,s),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!om(e,s)){var r=a.memoizedProps;if(n=n.compare,n=n!==null?n:Ll,n(r,i)&&e.ref===t.ref)return Ms(e,t,s)}return t.flags|=1,e=ms(a,i),e.ref=t.ref,e.return=t,t.child=e}function Ux(e,t,n,i,s){if(e!==null){var a=e.memoizedProps;if(Ll(a,i)&&e.ref===t.ref)if($e=!1,t.pendingProps=i=a,om(e,s))(e.flags&131072)!==0&&($e=!0);else return t.lanes=e.lanes,Ms(e,t,s)}return op(e,t,n,i,s)}function Nx(e,t,n,i){var s=i.children,a=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),i.mode==="hidden"){if((t.flags&128)!==0){if(a=a!==null?a.baseLanes|n:n,e!==null){for(i=t.child=e.child,s=0;i!==null;)s=s|i.lanes|i.childLanes,i=i.sibling;i=s&~a}else i=0,t.child=null;return d_(e,t,a,n,i)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&cu(t,a!==null?a.cachePool:null),a!==null?e_(t,a):tp(),Yy(t);else return i=t.lanes=536870912,d_(e,t,a!==null?a.baseLanes|n:n,n,i)}else a!==null?(cu(t,a.cachePool),e_(t,a),Ws(t),t.memoizedState=null):(e!==null&&cu(t,null),tp(),Ws(t));return pn(e,t,s,n),t.child}function ml(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function d_(e,t,n,i,s){var a=kp();return a=a===null?null:{parent:je._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&cu(t,null),tp(),Yy(t),e!==null&&ao(e,t,i,!0),t.childLanes=s,null}function fu(e,t){return t=Iu({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function p_(e,t,n){return Ga(t,e.child,null,n),e=fu(t,t.pendingProps),e.flags|=2,Qn(t),t.memoizedState=null,e}function uT(e,t,n){var i=t.pendingProps,s=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(le){if(i.mode==="hidden")return e=fu(t,i),t.lanes=536870912,ml(null,e);if(ep(t),(e=Oe)?(e=EM(e,xi),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:oa!==null?{id:ki,overflow:Xi}:null,retryLane:536870912,hydrationErrors:null},n=zy(e),n.return=t,t.child=n,gn=t,Oe=null)):e=null,e===null)throw la(t);return t.lanes=536870912,null}return fu(t,i)}var a=e.memoizedState;if(a!==null){var r=a.dehydrated;if(ep(t),s)if(t.flags&256)t.flags&=-257,t=p_(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(K(558));else if($e||ao(e,t,n,!1),s=(n&e.childLanes)!==0,$e||s){if(i=we,i!==null&&(r=cy(i,n),r!==0&&r!==a.retryLane))throw a.retryLane=r,Za(e,r),Vn(i,e,r),rm;Bu(),t=p_(e,t,n)}else e=a.treeContext,Oe=Si(r.nextSibling),gn=t,le=!0,$s=null,xi=!1,e!==null&&Fy(t,e),t=fu(t,i),t.flags|=4096;return t}return e=ms(e.child,{mode:i.mode,children:i.children}),e.ref=t.ref,t.child=e,e.return=t,e}function du(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(K(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function op(e,t,n,i,s){return Va(t),n=Zp(e,t,n,i,void 0,s),i=Jp(),e!==null&&!$e?(Qp(e,t,s),Ms(e,t,s)):(le&&i&&Hp(t),t.flags|=1,pn(e,t,n,s),t.child)}function m_(e,t,n,i,s,a){return Va(t),t.updateQueue=null,n=Jy(t,i,n,s),Zy(e),i=Jp(),e!==null&&!$e?(Qp(e,t,a),Ms(e,t,a)):(le&&i&&Hp(t),t.flags|=1,pn(e,t,n,a),t.child)}function g_(e,t,n,i,s){if(Va(t),t.stateNode===null){var a=Or,r=n.contextType;typeof r=="object"&&r!==null&&(a=vn(r)),a=new n(i,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=ap,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=i,a.state=t.memoizedState,a.refs={},Wp(t),r=n.contextType,a.context=typeof r=="object"&&r!==null?vn(r):Or,a.state=t.memoizedState,r=n.getDerivedStateFromProps,typeof r=="function"&&(dd(t,n,r,i),a.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof a.getSnapshotBeforeUpdate=="function"||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(r=a.state,typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount(),r!==a.state&&ap.enqueueReplaceState(a,a.state,null),bl(t,i,a,s),Sl(),a.state=t.memoizedState),typeof a.componentDidMount=="function"&&(t.flags|=4194308),i=!0}else if(e===null){a=t.stateNode;var o=t.memoizedProps,l=Xa(n,o);a.props=l;var c=a.context,h=n.contextType;r=Or,typeof h=="object"&&h!==null&&(r=vn(h));var d=n.getDerivedStateFromProps;h=typeof d=="function"||typeof a.getSnapshotBeforeUpdate=="function",o=t.pendingProps!==o,h||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o||c!==r)&&c_(t,a,i,r),Gs=!1;var f=t.memoizedState;a.state=f,bl(t,i,a,s),Sl(),c=t.memoizedState,o||f!==c||Gs?(typeof d=="function"&&(dd(t,n,d,i),c=t.memoizedState),(l=Gs||l_(t,n,l,i,f,c,r))?(h||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(t.flags|=4194308)):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=i,t.memoizedState=c),a.props=i,a.state=c,a.context=r,i=l):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),i=!1)}else{a=t.stateNode,jd(e,t),r=t.memoizedProps,h=Xa(n,r),a.props=h,d=t.pendingProps,f=a.context,c=n.contextType,l=Or,typeof c=="object"&&c!==null&&(l=vn(c)),o=n.getDerivedStateFromProps,(c=typeof o=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(r!==d||f!==l)&&c_(t,a,i,l),Gs=!1,f=t.memoizedState,a.state=f,bl(t,i,a,s),Sl();var p=t.memoizedState;r!==d||f!==p||Gs||e!==null&&e.dependencies!==null&&wu(e.dependencies)?(typeof o=="function"&&(dd(t,n,o,i),p=t.memoizedState),(h=Gs||l_(t,n,h,i,f,p,l)||e!==null&&e.dependencies!==null&&wu(e.dependencies))?(c||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,p,l),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,p,l)),typeof a.componentDidUpdate=="function"&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof a.componentDidUpdate!="function"||r===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||r===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=i,t.memoizedState=p),a.props=i,a.state=p,a.context=l,i=h):(typeof a.componentDidUpdate!="function"||r===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||r===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),i=!1)}return a=i,du(e,t),i=(t.flags&128)!==0,a||i?(a=t.stateNode,n=i&&typeof n.getDerivedStateFromError!="function"?null:a.render(),t.flags|=1,e!==null&&i?(t.child=Ga(t,e.child,null,s),t.child=Ga(t,null,n,s)):pn(e,t,n,s),t.memoizedState=a.state,e=t.child):e=Ms(e,t,s),e}function v_(e,t,n,i){return Ha(),t.flags|=256,pn(e,t,n,i),t.child}var pd={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function md(e){return{baseLanes:e,cachePool:Vy()}}function gd(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=jn),e}function Lx(e,t,n){var i=t.pendingProps,s=!1,a=(t.flags&128)!==0,r;if((r=a)||(r=e!==null&&e.memoizedState===null?!1:(We.current&2)!==0),r&&(s=!0,t.flags&=-129),r=(t.flags&32)!==0,t.flags&=-33,e===null){if(le){if(s?Xs(t):Ws(t),(e=Oe)?(e=EM(e,xi),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:oa!==null?{id:ki,overflow:Xi}:null,retryLane:536870912,hydrationErrors:null},n=zy(e),n.return=t,t.child=n,gn=t,Oe=null)):e=null,e===null)throw la(t);return Mp(e)?t.lanes=32:t.lanes=536870912,null}var o=i.children;return i=i.fallback,s?(Ws(t),s=t.mode,o=Iu({mode:"hidden",children:o},s),i=Pa(i,s,n,null),o.return=t,i.return=t,o.sibling=i,t.child=o,i=t.child,i.memoizedState=md(n),i.childLanes=gd(e,r,n),t.memoizedState=pd,ml(null,i)):(Xs(t),lp(t,o))}var l=e.memoizedState;if(l!==null&&(o=l.dehydrated,o!==null)){if(a)t.flags&256?(Xs(t),t.flags&=-257,t=vd(e,t,n)):t.memoizedState!==null?(Ws(t),t.child=e.child,t.flags|=128,t=null):(Ws(t),o=i.fallback,s=t.mode,i=Iu({mode:"visible",children:i.children},s),o=Pa(o,s,n,null),o.flags|=2,i.return=t,o.return=t,i.sibling=o,t.child=i,Ga(t,e.child,null,n),i=t.child,i.memoizedState=md(n),i.childLanes=gd(e,r,n),t.memoizedState=pd,t=ml(null,i));else if(Xs(t),Mp(o)){if(r=o.nextSibling&&o.nextSibling.dataset,r)var c=r.dgst;r=c,i=Error(K(419)),i.stack="",i.digest=r,Ol({value:i,source:null,stack:null}),t=vd(e,t,n)}else if($e||ao(e,t,n,!1),r=(n&e.childLanes)!==0,$e||r){if(r=we,r!==null&&(i=cy(r,n),i!==0&&i!==l.retryLane))throw l.retryLane=i,Za(e,i),Vn(r,e,i),rm;xp(o)||Bu(),t=vd(e,t,n)}else xp(o)?(t.flags|=192,t.child=e.child,t=null):(e=l.treeContext,Oe=Si(o.nextSibling),gn=t,le=!0,$s=null,xi=!1,e!==null&&Fy(t,e),t=lp(t,i.children),t.flags|=4096);return t}return s?(Ws(t),o=i.fallback,s=t.mode,l=e.child,c=l.sibling,i=ms(l,{mode:"hidden",children:i.children}),i.subtreeFlags=l.subtreeFlags&65011712,c!==null?o=ms(c,o):(o=Pa(o,s,n,null),o.flags|=2),o.return=t,i.return=t,i.sibling=o,t.child=i,ml(null,i),i=t.child,o=e.child.memoizedState,o===null?o=md(n):(s=o.cachePool,s!==null?(l=je._currentValue,s=s.parent!==l?{parent:l,pool:l}:s):s=Vy(),o={baseLanes:o.baseLanes|n,cachePool:s}),i.memoizedState=o,i.childLanes=gd(e,r,n),t.memoizedState=pd,ml(e.child,i)):(Xs(t),n=e.child,e=n.sibling,n=ms(n,{mode:"visible",children:i.children}),n.return=t,n.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=n,t.memoizedState=null,n)}function lp(e,t){return t=Iu({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function Iu(e,t){return e=Kn(22,e,null,t),e.lanes=0,e}function vd(e,t,n){return Ga(t,e.child,null,n),e=lp(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function __(e,t,n){e.lanes|=t;var i=e.alternate;i!==null&&(i.lanes|=t),Jd(e.return,t,n)}function _d(e,t,n,i,s,a){var r=e.memoizedState;r===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:s,treeForkCount:a}:(r.isBackwards=t,r.rendering=null,r.renderingStartTime=0,r.last=i,r.tail=n,r.tailMode=s,r.treeForkCount=a)}function Ix(e,t,n){var i=t.pendingProps,s=i.revealOrder,a=i.tail;i=i.children;var r=We.current,o=(r&2)!==0;if(o?(r=r&1|2,t.flags|=128):r&=1,De(We,r),pn(e,t,i,n),i=le?Il:0,!o&&e!==null&&(e.flags&128)!==0)t:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&__(e,n,t);else if(e.tag===19)__(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break t;for(;e.sibling===null;){if(e.return===null||e.return===t)break t;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(s){case"forwards":for(n=t.child,s=null;n!==null;)e=n.alternate,e!==null&&Du(e)===null&&(s=n),n=n.sibling;n=s,n===null?(s=t.child,t.child=null):(s=n.sibling,n.sibling=null),_d(t,!1,s,n,a,i);break;case"backwards":case"unstable_legacy-backwards":for(n=null,s=t.child,t.child=null;s!==null;){if(e=s.alternate,e!==null&&Du(e)===null){t.child=s;break}e=s.sibling,s.sibling=n,n=s,s=e}_d(t,!0,n,null,a,i);break;case"together":_d(t,!1,null,null,void 0,i);break;default:t.memoizedState=null}return t.child}function Ms(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),ua|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(ao(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(K(153));if(t.child!==null){for(e=t.child,n=ms(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=ms(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function om(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&wu(e)))}function hT(e,t,n){switch(t.tag){case 3:xu(t,t.stateNode.containerInfo),ks(t,je,e.memoizedState.cache),Ha();break;case 27:case 5:Pd(t);break;case 4:xu(t,t.stateNode.containerInfo);break;case 10:ks(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,ep(t),null;break;case 13:var i=t.memoizedState;if(i!==null)return i.dehydrated!==null?(Xs(t),t.flags|=128,null):(n&t.child.childLanes)!==0?Lx(e,t,n):(Xs(t),e=Ms(e,t,n),e!==null?e.sibling:null);Xs(t);break;case 19:var s=(e.flags&128)!==0;if(i=(n&t.childLanes)!==0,i||(ao(e,t,n,!1),i=(n&t.childLanes)!==0),s){if(i)return Ix(e,t,n);t.flags|=128}if(s=t.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),De(We,We.current),i)break;return null;case 22:return t.lanes=0,Nx(e,t,n,t.pendingProps);case 24:ks(t,je,e.memoizedState.cache)}return Ms(e,t,n)}function Ox(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)$e=!0;else{if(!om(e,n)&&(t.flags&128)===0)return $e=!1,hT(e,t,n);$e=(e.flags&131072)!==0}else $e=!1,le&&(t.flags&1048576)!==0&&By(t,Il,t.index);switch(t.lanes=0,t.tag){case 16:t:{var i=t.pendingProps;if(e=La(t.elementType),t.type=e,typeof e=="function")Fp(e)?(i=Xa(e,i),t.tag=1,t=g_(null,t,e,i,n)):(t.tag=0,t=op(null,t,e,i,n));else{if(e!=null){var s=e.$$typeof;if(s===Tp){t.tag=11,t=h_(null,t,e,i,n);break t}else if(s===Ap){t.tag=14,t=f_(null,t,e,i,n);break t}}throw t=Id(e)||e,Error(K(306,t,""))}}return t;case 0:return op(e,t,t.type,t.pendingProps,n);case 1:return i=t.type,s=Xa(i,t.pendingProps),g_(e,t,i,s,n);case 3:t:{if(xu(t,t.stateNode.containerInfo),e===null)throw Error(K(387));i=t.pendingProps;var a=t.memoizedState;s=a.element,jd(e,t),bl(t,i,null,n);var r=t.memoizedState;if(i=r.cache,ks(t,je,i),i!==a.cache&&Qd(t,[je],n,!0),Sl(),i=r.element,a.isDehydrated)if(a={element:i,isDehydrated:!1,cache:r.cache},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){t=v_(e,t,i,n);break t}else if(i!==s){s=yi(Error(K(424)),t),Ol(s),t=v_(e,t,i,n);break t}else{switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName==="HTML"?e.ownerDocument.body:e}for(Oe=Si(e.firstChild),gn=t,le=!0,$s=null,xi=!0,n=Xy(t,null,i,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling}else{if(Ha(),i===s){t=Ms(e,t,n);break t}pn(e,t,i,n)}t=t.child}return t;case 26:return du(e,t),e===null?(n=H_(t.type,null,t.pendingProps,null))?t.memoizedState=n:le||(n=t.type,e=t.pendingProps,i=Gu(js.current).createElement(n),i[mn]=t,i[Gn]=e,_n(i,n,e),un(i),t.stateNode=i):t.memoizedState=H_(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return Pd(t),e===null&&le&&(i=t.stateNode=TM(t.type,t.pendingProps,js.current),gn=t,xi=!0,s=Oe,fa(t.type)?(Sp=s,Oe=Si(i.firstChild)):Oe=s),pn(e,t,t.pendingProps.children,n),du(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&le&&((s=i=Oe)&&(i=FT(i,t.type,t.pendingProps,xi),i!==null?(t.stateNode=i,gn=t,Oe=Si(i.firstChild),xi=!1,s=!0):s=!1),s||la(t)),Pd(t),s=t.type,a=t.pendingProps,r=e!==null?e.memoizedProps:null,i=a.children,_p(s,a)?i=null:r!==null&&_p(s,r)&&(t.flags|=32),t.memoizedState!==null&&(s=Zp(e,t,nT,null,null,n),Vl._currentValue=s),du(e,t),pn(e,t,i,n),t.child;case 6:return e===null&&le&&((e=n=Oe)&&(n=HT(n,t.pendingProps,xi),n!==null?(t.stateNode=n,gn=t,Oe=null,e=!0):e=!1),e||la(t)),null;case 13:return Lx(e,t,n);case 4:return xu(t,t.stateNode.containerInfo),i=t.pendingProps,e===null?t.child=Ga(t,null,i,n):pn(e,t,i,n),t.child;case 11:return h_(e,t,t.type,t.pendingProps,n);case 7:return pn(e,t,t.pendingProps,n),t.child;case 8:return pn(e,t,t.pendingProps.children,n),t.child;case 12:return pn(e,t,t.pendingProps.children,n),t.child;case 10:return i=t.pendingProps,ks(t,t.type,i.value),pn(e,t,i.children,n),t.child;case 9:return s=t.type._context,i=t.pendingProps.children,Va(t),s=vn(s),i=i(s),t.flags|=1,pn(e,t,i,n),t.child;case 14:return f_(e,t,t.type,t.pendingProps,n);case 15:return Ux(e,t,t.type,t.pendingProps,n);case 19:return Ix(e,t,n);case 31:return uT(e,t,n);case 22:return Nx(e,t,n,t.pendingProps);case 24:return Va(t),i=vn(je),e===null?(s=kp(),s===null&&(s=we,a=Gp(),s.pooledCache=a,a.refCount++,a!==null&&(s.pooledCacheLanes|=n),s=a),t.memoizedState={parent:i,cache:s},Wp(t),ks(t,je,s)):((e.lanes&n)!==0&&(jd(e,t),bl(t,null,null,n),Sl()),s=e.memoizedState,a=t.memoizedState,s.parent!==i?(s={parent:i,cache:i},t.memoizedState=s,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=s),ks(t,je,i)):(i=a.cache,ks(t,je,i),i!==s.cache&&Qd(t,[je],n,!0))),pn(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(K(156,t.tag))}function rs(e){e.flags|=4}function yd(e,t,n,i,s){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(s&335544128)===s)if(e.stateNode.complete)e.flags|=8192;else if(aM())e.flags|=8192;else throw Ba=Ru,Xp}else e.flags&=-16777217}function y_(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!RM(t))if(aM())e.flags|=8192;else throw Ba=Ru,Xp}function Kc(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?ry():536870912,e.lanes|=t,jr|=t)}function ll(e,t){if(!le)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:i.sibling=null}}function Ie(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,i=0;if(t)for(var s=e.child;s!==null;)n|=s.lanes|s.childLanes,i|=s.subtreeFlags&65011712,i|=s.flags&65011712,s.return=e,s=s.sibling;else for(s=e.child;s!==null;)n|=s.lanes|s.childLanes,i|=s.subtreeFlags,i|=s.flags,s.return=e,s=s.sibling;return e.subtreeFlags|=i,e.childLanes=n,t}function fT(e,t,n){var i=t.pendingProps;switch(Vp(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ie(t),null;case 1:return Ie(t),null;case 3:return n=t.stateNode,i=null,e!==null&&(i=e.memoizedState.cache),t.memoizedState.cache!==i&&(t.flags|=2048),gs(je),qr(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(br(t)?rs(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,ud())),Ie(t),null;case 26:var s=t.type,a=t.memoizedState;return e===null?(rs(t),a!==null?(Ie(t),y_(t,a)):(Ie(t),yd(t,s,null,i,n))):a?a!==e.memoizedState?(rs(t),Ie(t),y_(t,a)):(Ie(t),t.flags&=-16777217):(e=e.memoizedProps,e!==i&&rs(t),Ie(t),yd(t,s,e,i,n)),null;case 27:if(Mu(t),n=js.current,s=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==i&&rs(t);else{if(!i){if(t.stateNode===null)throw Error(K(166));return Ie(t),null}e=qi.current,br(t)?Zv(t,e):(e=TM(s,i,n),t.stateNode=e,rs(t))}return Ie(t),null;case 5:if(Mu(t),s=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==i&&rs(t);else{if(!i){if(t.stateNode===null)throw Error(K(166));return Ie(t),null}if(a=qi.current,br(t))Zv(t,a);else{var r=Gu(js.current);switch(a){case 1:a=r.createElementNS("http://www.w3.org/2000/svg",s);break;case 2:a=r.createElementNS("http://www.w3.org/1998/Math/MathML",s);break;default:switch(s){case"svg":a=r.createElementNS("http://www.w3.org/2000/svg",s);break;case"math":a=r.createElementNS("http://www.w3.org/1998/Math/MathML",s);break;case"script":a=r.createElement("div"),a.innerHTML="<script><\/script>",a=a.removeChild(a.firstChild);break;case"select":a=typeof i.is=="string"?r.createElement("select",{is:i.is}):r.createElement("select"),i.multiple?a.multiple=!0:i.size&&(a.size=i.size);break;default:a=typeof i.is=="string"?r.createElement(s,{is:i.is}):r.createElement(s)}}a[mn]=t,a[Gn]=i;t:for(r=t.child;r!==null;){if(r.tag===5||r.tag===6)a.appendChild(r.stateNode);else if(r.tag!==4&&r.tag!==27&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break t;for(;r.sibling===null;){if(r.return===null||r.return===t)break t;r=r.return}r.sibling.return=r.return,r=r.sibling}t.stateNode=a;t:switch(_n(a,s,i),s){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break t;case"img":i=!0;break t;default:i=!1}i&&rs(t)}}return Ie(t),yd(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==i&&rs(t);else{if(typeof i!="string"&&t.stateNode===null)throw Error(K(166));if(e=js.current,br(t)){if(e=t.stateNode,n=t.memoizedProps,i=null,s=gn,s!==null)switch(s.tag){case 27:case 5:i=s.memoizedProps}e[mn]=t,e=!!(e.nodeValue===n||i!==null&&i.suppressHydrationWarning===!0||MM(e.nodeValue,n)),e||la(t,!0)}else e=Gu(e).createTextNode(i),e[mn]=t,t.stateNode=e}return Ie(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(i=br(t),n!==null){if(e===null){if(!i)throw Error(K(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(K(557));e[mn]=t}else Ha(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ie(t),e=!1}else n=ud(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(Qn(t),t):(Qn(t),null);if((t.flags&128)!==0)throw Error(K(558))}return Ie(t),null;case 13:if(i=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(s=br(t),i!==null&&i.dehydrated!==null){if(e===null){if(!s)throw Error(K(318));if(s=t.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(K(317));s[mn]=t}else Ha(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ie(t),s=!1}else s=ud(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=s),s=!0;if(!s)return t.flags&256?(Qn(t),t):(Qn(t),null)}return Qn(t),(t.flags&128)!==0?(t.lanes=n,t):(n=i!==null,e=e!==null&&e.memoizedState!==null,n&&(i=t.child,s=null,i.alternate!==null&&i.alternate.memoizedState!==null&&i.alternate.memoizedState.cachePool!==null&&(s=i.alternate.memoizedState.cachePool.pool),a=null,i.memoizedState!==null&&i.memoizedState.cachePool!==null&&(a=i.memoizedState.cachePool.pool),a!==s&&(i.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Kc(t,t.updateQueue),Ie(t),null);case 4:return qr(),e===null&&pm(t.stateNode.containerInfo),Ie(t),null;case 10:return gs(t.type),Ie(t),null;case 19:if(hn(We),i=t.memoizedState,i===null)return Ie(t),null;if(s=(t.flags&128)!==0,a=i.rendering,a===null)if(s)ll(i,!1);else{if(ke!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(a=Du(e),a!==null){for(t.flags|=128,ll(i,!1),e=a.updateQueue,t.updateQueue=e,Kc(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)Py(n,e),n=n.sibling;return De(We,We.current&1|2),le&&us(t,i.treeForkCount),t.child}e=e.sibling}i.tail!==null&&$n()>Pu&&(t.flags|=128,s=!0,ll(i,!1),t.lanes=4194304)}else{if(!s)if(e=Du(a),e!==null){if(t.flags|=128,s=!0,e=e.updateQueue,t.updateQueue=e,Kc(t,e),ll(i,!0),i.tail===null&&i.tailMode==="hidden"&&!a.alternate&&!le)return Ie(t),null}else 2*$n()-i.renderingStartTime>Pu&&n!==536870912&&(t.flags|=128,s=!0,ll(i,!1),t.lanes=4194304);i.isBackwards?(a.sibling=t.child,t.child=a):(e=i.last,e!==null?e.sibling=a:t.child=a,i.last=a)}return i.tail!==null?(e=i.tail,i.rendering=e,i.tail=e.sibling,i.renderingStartTime=$n(),e.sibling=null,n=We.current,De(We,s?n&1|2:n&1),le&&us(t,i.treeForkCount),e):(Ie(t),null);case 22:case 23:return Qn(t),qp(),i=t.memoizedState!==null,e!==null?e.memoizedState!==null!==i&&(t.flags|=8192):i&&(t.flags|=8192),i?(n&536870912)!==0&&(t.flags&128)===0&&(Ie(t),t.subtreeFlags&6&&(t.flags|=8192)):Ie(t),n=t.updateQueue,n!==null&&Kc(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),i=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(i=t.memoizedState.cachePool.pool),i!==n&&(t.flags|=2048),e!==null&&hn(za),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),gs(je),Ie(t),null;case 25:return null;case 30:return null}throw Error(K(156,t.tag))}function dT(e,t){switch(Vp(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return gs(je),qr(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Mu(t),null;case 31:if(t.memoizedState!==null){if(Qn(t),t.alternate===null)throw Error(K(340));Ha()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Qn(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(K(340));Ha()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return hn(We),null;case 4:return qr(),null;case 10:return gs(t.type),null;case 22:case 23:return Qn(t),qp(),e!==null&&hn(za),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return gs(je),null;case 25:return null;default:return null}}function Px(e,t){switch(Vp(t),t.tag){case 3:gs(je),qr();break;case 26:case 27:case 5:Mu(t);break;case 4:qr();break;case 31:t.memoizedState!==null&&Qn(t);break;case 13:Qn(t);break;case 19:hn(We);break;case 10:gs(t.type);break;case 22:case 23:Qn(t),qp(),e!==null&&hn(za);break;case 24:gs(je)}}function jl(e,t){try{var n=t.updateQueue,i=n!==null?n.lastEffect:null;if(i!==null){var s=i.next;n=s;do{if((n.tag&e)===e){i=void 0;var a=n.create,r=n.inst;i=a(),r.destroy=i}n=n.next}while(n!==s)}}catch(o){Me(t,t.return,o)}}function ca(e,t,n){try{var i=t.updateQueue,s=i!==null?i.lastEffect:null;if(s!==null){var a=s.next;i=a;do{if((i.tag&e)===e){var r=i.inst,o=r.destroy;if(o!==void 0){r.destroy=void 0,s=t;var l=n,c=o;try{c()}catch(h){Me(s,l,h)}}}i=i.next}while(i!==a)}}catch(h){Me(t,t.return,h)}}function zx(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{qy(t,n)}catch(i){Me(e,e.return,i)}}}function Bx(e,t,n){n.props=Xa(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(i){Me(e,t,i)}}function Tl(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var i=e.stateNode;break;case 30:i=e.stateNode;break;default:i=e.stateNode}typeof n=="function"?e.refCleanup=n(i):n.current=i}}catch(s){Me(e,t,s)}}function Wi(e,t){var n=e.ref,i=e.refCleanup;if(n!==null)if(typeof i=="function")try{i()}catch(s){Me(e,t,s)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(s){Me(e,t,s)}else n.current=null}function Fx(e){var t=e.type,n=e.memoizedProps,i=e.stateNode;try{t:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&i.focus();break t;case"img":n.src?i.src=n.src:n.srcSet&&(i.srcset=n.srcSet)}}catch(s){Me(e,e.return,s)}}function xd(e,t,n){try{var i=e.stateNode;LT(i,e.type,n,t),i[Gn]=t}catch(s){Me(e,e.return,s)}}function Hx(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&fa(e.type)||e.tag===4}function Md(e){t:for(;;){for(;e.sibling===null;){if(e.return===null||Hx(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&fa(e.type)||e.flags&2||e.child===null||e.tag===4)continue t;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function cp(e,t,n){var i=e.tag;if(i===5||i===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=ds));else if(i!==4&&(i===27&&fa(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(cp(e,t,n),e=e.sibling;e!==null;)cp(e,t,n),e=e.sibling}function Ou(e,t,n){var i=e.tag;if(i===5||i===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(i!==4&&(i===27&&fa(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(Ou(e,t,n),e=e.sibling;e!==null;)Ou(e,t,n),e=e.sibling}function Vx(e){var t=e.stateNode,n=e.memoizedProps;try{for(var i=e.type,s=t.attributes;s.length;)t.removeAttributeNode(s[0]);_n(t,i,n),t[mn]=e,t[Gn]=n}catch(a){Me(e,e.return,a)}}var hs=!1,Ke=!1,Sd=!1,x_=typeof WeakSet=="function"?WeakSet:Set,cn=null;function pT(e,t){if(e=e.containerInfo,gp=qu,e=Ry(e),Pp(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else t:{n=(n=e.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var s=i.anchorOffset,a=i.focusNode;i=i.focusOffset;try{n.nodeType,a.nodeType}catch{n=null;break t}var r=0,o=-1,l=-1,c=0,h=0,d=e,f=null;e:for(;;){for(var p;d!==n||s!==0&&d.nodeType!==3||(o=r+s),d!==a||i!==0&&d.nodeType!==3||(l=r+i),d.nodeType===3&&(r+=d.nodeValue.length),(p=d.firstChild)!==null;)f=d,d=p;for(;;){if(d===e)break e;if(f===n&&++c===s&&(o=r),f===a&&++h===i&&(l=r),(p=d.nextSibling)!==null)break;d=f,f=d.parentNode}d=p}n=o===-1||l===-1?null:{start:o,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(vp={focusedElem:e,selectionRange:n},qu=!1,cn=t;cn!==null;)if(t=cn,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,cn=e;else for(;cn!==null;){switch(t=cn,a=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(n=0;n<e.length;n++)s=e[n],s.ref.impl=s.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&a!==null){e=void 0,n=t,s=a.memoizedProps,a=a.memoizedState,i=n.stateNode;try{var g=Xa(n.type,s);e=i.getSnapshotBeforeUpdate(g,a),i.__reactInternalSnapshotBeforeUpdate=e}catch(M){Me(n,n.return,M)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)yp(e);else if(n===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":yp(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(K(163))}if(e=t.sibling,e!==null){e.return=t.return,cn=e;break}cn=t.return}}function Gx(e,t,n){var i=n.flags;switch(n.tag){case 0:case 11:case 15:ls(e,n),i&4&&jl(5,n);break;case 1:if(ls(e,n),i&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(r){Me(n,n.return,r)}else{var s=Xa(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(s,t,e.__reactInternalSnapshotBeforeUpdate)}catch(r){Me(n,n.return,r)}}i&64&&zx(n),i&512&&Tl(n,n.return);break;case 3:if(ls(e,n),i&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{qy(e,t)}catch(r){Me(n,n.return,r)}}break;case 27:t===null&&i&4&&Vx(n);case 26:case 5:ls(e,n),t===null&&i&4&&Fx(n),i&512&&Tl(n,n.return);break;case 12:ls(e,n);break;case 31:ls(e,n),i&4&&Wx(e,n);break;case 13:ls(e,n),i&4&&qx(e,n),i&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=bT.bind(null,n),VT(e,n))));break;case 22:if(i=n.memoizedState!==null||hs,!i){t=t!==null&&t.memoizedState!==null||Ke,s=hs;var a=Ke;hs=i,(Ke=t)&&!a?cs(e,n,(n.subtreeFlags&8772)!==0):ls(e,n),hs=s,Ke=a}break;case 30:break;default:ls(e,n)}}function kx(e){var t=e.alternate;t!==null&&(e.alternate=null,kx(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&Dp(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Be=null,Fn=!1;function os(e,t,n){for(n=n.child;n!==null;)Xx(e,t,n),n=n.sibling}function Xx(e,t,n){if(ti&&typeof ti.onCommitFiberUnmount=="function")try{ti.onCommitFiberUnmount(Wl,n)}catch{}switch(n.tag){case 26:Ke||Wi(n,t),os(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:Ke||Wi(n,t);var i=Be,s=Fn;fa(n.type)&&(Be=n.stateNode,Fn=!1),os(e,t,n),Cl(n.stateNode),Be=i,Fn=s;break;case 5:Ke||Wi(n,t);case 6:if(i=Be,s=Fn,Be=null,os(e,t,n),Be=i,Fn=s,Be!==null)if(Fn)try{(Be.nodeType===9?Be.body:Be.nodeName==="HTML"?Be.ownerDocument.body:Be).removeChild(n.stateNode)}catch(a){Me(n,t,a)}else try{Be.removeChild(n.stateNode)}catch(a){Me(n,t,a)}break;case 18:Be!==null&&(Fn?(e=Be,O_(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),no(e)):O_(Be,n.stateNode));break;case 4:i=Be,s=Fn,Be=n.stateNode.containerInfo,Fn=!0,os(e,t,n),Be=i,Fn=s;break;case 0:case 11:case 14:case 15:ca(2,n,t),Ke||ca(4,n,t),os(e,t,n);break;case 1:Ke||(Wi(n,t),i=n.stateNode,typeof i.componentWillUnmount=="function"&&Bx(n,t,i)),os(e,t,n);break;case 21:os(e,t,n);break;case 22:Ke=(i=Ke)||n.memoizedState!==null,os(e,t,n),Ke=i;break;default:os(e,t,n)}}function Wx(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{no(e)}catch(n){Me(t,t.return,n)}}}function qx(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{no(e)}catch(n){Me(t,t.return,n)}}function mT(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new x_),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new x_),t;default:throw Error(K(435,e.tag))}}function jc(e,t){var n=mT(e);t.forEach(function(i){if(!n.has(i)){n.add(i);var s=ET.bind(null,e,i);i.then(s,s)}})}function zn(e,t){var n=t.deletions;if(n!==null)for(var i=0;i<n.length;i++){var s=n[i],a=e,r=t,o=r;t:for(;o!==null;){switch(o.tag){case 27:if(fa(o.type)){Be=o.stateNode,Fn=!1;break t}break;case 5:Be=o.stateNode,Fn=!1;break t;case 3:case 4:Be=o.stateNode.containerInfo,Fn=!0;break t}o=o.return}if(Be===null)throw Error(K(160));Xx(a,r,s),Be=null,Fn=!1,a=s.alternate,a!==null&&(a.return=null),s.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Yx(t,e),t=t.sibling}var Di=null;function Yx(e,t){var n=e.alternate,i=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:zn(t,e),Bn(e),i&4&&(ca(3,e,e.return),jl(3,e),ca(5,e,e.return));break;case 1:zn(t,e),Bn(e),i&512&&(Ke||n===null||Wi(n,n.return)),i&64&&hs&&(e=e.updateQueue,e!==null&&(i=e.callbacks,i!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?i:n.concat(i))));break;case 26:var s=Di;if(zn(t,e),Bn(e),i&512&&(Ke||n===null||Wi(n,n.return)),i&4){var a=n!==null?n.memoizedState:null;if(i=e.memoizedState,n===null)if(i===null)if(e.stateNode===null){t:{i=e.type,n=e.memoizedProps,s=s.ownerDocument||s;e:switch(i){case"title":a=s.getElementsByTagName("title")[0],(!a||a[Zl]||a[mn]||a.namespaceURI==="http://www.w3.org/2000/svg"||a.hasAttribute("itemprop"))&&(a=s.createElement(i),s.head.insertBefore(a,s.querySelector("head > title"))),_n(a,i,n),a[mn]=e,un(a),i=a;break t;case"link":var r=G_("link","href",s).get(i+(n.href||""));if(r){for(var o=0;o<r.length;o++)if(a=r[o],a.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&a.getAttribute("rel")===(n.rel==null?null:n.rel)&&a.getAttribute("title")===(n.title==null?null:n.title)&&a.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){r.splice(o,1);break e}}a=s.createElement(i),_n(a,i,n),s.head.appendChild(a);break;case"meta":if(r=G_("meta","content",s).get(i+(n.content||""))){for(o=0;o<r.length;o++)if(a=r[o],a.getAttribute("content")===(n.content==null?null:""+n.content)&&a.getAttribute("name")===(n.name==null?null:n.name)&&a.getAttribute("property")===(n.property==null?null:n.property)&&a.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&a.getAttribute("charset")===(n.charSet==null?null:n.charSet)){r.splice(o,1);break e}}a=s.createElement(i),_n(a,i,n),s.head.appendChild(a);break;default:throw Error(K(468,i))}a[mn]=e,un(a),i=a}e.stateNode=i}else k_(s,e.type,e.stateNode);else e.stateNode=V_(s,i,e.memoizedProps);else a!==i?(a===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):a.count--,i===null?k_(s,e.type,e.stateNode):V_(s,i,e.memoizedProps)):i===null&&e.stateNode!==null&&xd(e,e.memoizedProps,n.memoizedProps)}break;case 27:zn(t,e),Bn(e),i&512&&(Ke||n===null||Wi(n,n.return)),n!==null&&i&4&&xd(e,e.memoizedProps,n.memoizedProps);break;case 5:if(zn(t,e),Bn(e),i&512&&(Ke||n===null||Wi(n,n.return)),e.flags&32){s=e.stateNode;try{Zr(s,"")}catch(g){Me(e,e.return,g)}}i&4&&e.stateNode!=null&&(s=e.memoizedProps,xd(e,s,n!==null?n.memoizedProps:s)),i&1024&&(Sd=!0);break;case 6:if(zn(t,e),Bn(e),i&4){if(e.stateNode===null)throw Error(K(162));i=e.memoizedProps,n=e.stateNode;try{n.nodeValue=i}catch(g){Me(e,e.return,g)}}break;case 3:if(gu=null,s=Di,Di=ku(t.containerInfo),zn(t,e),Di=s,Bn(e),i&4&&n!==null&&n.memoizedState.isDehydrated)try{no(t.containerInfo)}catch(g){Me(e,e.return,g)}Sd&&(Sd=!1,Zx(e));break;case 4:i=Di,Di=ku(e.stateNode.containerInfo),zn(t,e),Bn(e),Di=i;break;case 12:zn(t,e),Bn(e);break;case 31:zn(t,e),Bn(e),i&4&&(i=e.updateQueue,i!==null&&(e.updateQueue=null,jc(e,i)));break;case 13:zn(t,e),Bn(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(ah=$n()),i&4&&(i=e.updateQueue,i!==null&&(e.updateQueue=null,jc(e,i)));break;case 22:s=e.memoizedState!==null;var l=n!==null&&n.memoizedState!==null,c=hs,h=Ke;if(hs=c||s,Ke=h||l,zn(t,e),Ke=h,hs=c,Bn(e),i&8192)t:for(t=e.stateNode,t._visibility=s?t._visibility&-2:t._visibility|1,s&&(n===null||l||hs||Ke||Ia(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){l=n=t;try{if(a=l.stateNode,s)r=a.style,typeof r.setProperty=="function"?r.setProperty("display","none","important"):r.display="none";else{o=l.stateNode;var d=l.memoizedProps.style,f=d!=null&&d.hasOwnProperty("display")?d.display:null;o.style.display=f==null||typeof f=="boolean"?"":(""+f).trim()}}catch(g){Me(l,l.return,g)}}}else if(t.tag===6){if(n===null){l=t;try{l.stateNode.nodeValue=s?"":l.memoizedProps}catch(g){Me(l,l.return,g)}}}else if(t.tag===18){if(n===null){l=t;try{var p=l.stateNode;s?P_(p,!0):P_(l.stateNode,!1)}catch(g){Me(l,l.return,g)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break t;for(;t.sibling===null;){if(t.return===null||t.return===e)break t;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}i&4&&(i=e.updateQueue,i!==null&&(n=i.retryQueue,n!==null&&(i.retryQueue=null,jc(e,n))));break;case 19:zn(t,e),Bn(e),i&4&&(i=e.updateQueue,i!==null&&(e.updateQueue=null,jc(e,i)));break;case 30:break;case 21:break;default:zn(t,e),Bn(e)}}function Bn(e){var t=e.flags;if(t&2){try{for(var n,i=e.return;i!==null;){if(Hx(i)){n=i;break}i=i.return}if(n==null)throw Error(K(160));switch(n.tag){case 27:var s=n.stateNode,a=Md(e);Ou(e,a,s);break;case 5:var r=n.stateNode;n.flags&32&&(Zr(r,""),n.flags&=-33);var o=Md(e);Ou(e,o,r);break;case 3:case 4:var l=n.stateNode.containerInfo,c=Md(e);cp(e,c,l);break;default:throw Error(K(161))}}catch(h){Me(e,e.return,h)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Zx(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Zx(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function ls(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)Gx(e,t.alternate,t),t=t.sibling}function Ia(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:ca(4,t,t.return),Ia(t);break;case 1:Wi(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount=="function"&&Bx(t,t.return,n),Ia(t);break;case 27:Cl(t.stateNode);case 26:case 5:Wi(t,t.return),Ia(t);break;case 22:t.memoizedState===null&&Ia(t);break;case 30:Ia(t);break;default:Ia(t)}e=e.sibling}}function cs(e,t,n){for(n=n&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var i=t.alternate,s=e,a=t,r=a.flags;switch(a.tag){case 0:case 11:case 15:cs(s,a,n),jl(4,a);break;case 1:if(cs(s,a,n),i=a,s=i.stateNode,typeof s.componentDidMount=="function")try{s.componentDidMount()}catch(c){Me(i,i.return,c)}if(i=a,s=i.updateQueue,s!==null){var o=i.stateNode;try{var l=s.shared.hiddenCallbacks;if(l!==null)for(s.shared.hiddenCallbacks=null,s=0;s<l.length;s++)Wy(l[s],o)}catch(c){Me(i,i.return,c)}}n&&r&64&&zx(a),Tl(a,a.return);break;case 27:Vx(a);case 26:case 5:cs(s,a,n),n&&i===null&&r&4&&Fx(a),Tl(a,a.return);break;case 12:cs(s,a,n);break;case 31:cs(s,a,n),n&&r&4&&Wx(s,a);break;case 13:cs(s,a,n),n&&r&4&&qx(s,a);break;case 22:a.memoizedState===null&&cs(s,a,n),Tl(a,a.return);break;case 30:break;default:cs(s,a,n)}t=t.sibling}}function lm(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&Ql(n))}function cm(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Ql(e))}function Ci(e,t,n,i){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Jx(e,t,n,i),t=t.sibling}function Jx(e,t,n,i){var s=t.flags;switch(t.tag){case 0:case 11:case 15:Ci(e,t,n,i),s&2048&&jl(9,t);break;case 1:Ci(e,t,n,i);break;case 3:Ci(e,t,n,i),s&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Ql(e)));break;case 12:if(s&2048){Ci(e,t,n,i),e=t.stateNode;try{var a=t.memoizedProps,r=a.id,o=a.onPostCommit;typeof o=="function"&&o(r,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(l){Me(t,t.return,l)}}else Ci(e,t,n,i);break;case 31:Ci(e,t,n,i);break;case 13:Ci(e,t,n,i);break;case 23:break;case 22:a=t.stateNode,r=t.alternate,t.memoizedState!==null?a._visibility&2?Ci(e,t,n,i):Al(e,t):a._visibility&2?Ci(e,t,n,i):(a._visibility|=2,Tr(e,t,n,i,(t.subtreeFlags&10256)!==0||!1)),s&2048&&lm(r,t);break;case 24:Ci(e,t,n,i),s&2048&&cm(t.alternate,t);break;default:Ci(e,t,n,i)}}function Tr(e,t,n,i,s){for(s=s&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var a=e,r=t,o=n,l=i,c=r.flags;switch(r.tag){case 0:case 11:case 15:Tr(a,r,o,l,s),jl(8,r);break;case 23:break;case 22:var h=r.stateNode;r.memoizedState!==null?h._visibility&2?Tr(a,r,o,l,s):Al(a,r):(h._visibility|=2,Tr(a,r,o,l,s)),s&&c&2048&&lm(r.alternate,r);break;case 24:Tr(a,r,o,l,s),s&&c&2048&&cm(r.alternate,r);break;default:Tr(a,r,o,l,s)}t=t.sibling}}function Al(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,i=t,s=i.flags;switch(i.tag){case 22:Al(n,i),s&2048&&lm(i.alternate,i);break;case 24:Al(n,i),s&2048&&cm(i.alternate,i);break;default:Al(n,i)}t=t.sibling}}var gl=8192;function Er(e,t,n){if(e.subtreeFlags&gl)for(e=e.child;e!==null;)Qx(e,t,n),e=e.sibling}function Qx(e,t,n){switch(e.tag){case 26:Er(e,t,n),e.flags&gl&&e.memoizedState!==null&&$T(n,Di,e.memoizedState,e.memoizedProps);break;case 5:Er(e,t,n);break;case 3:case 4:var i=Di;Di=ku(e.stateNode.containerInfo),Er(e,t,n),Di=i;break;case 22:e.memoizedState===null&&(i=e.alternate,i!==null&&i.memoizedState!==null?(i=gl,gl=16777216,Er(e,t,n),gl=i):Er(e,t,n));break;default:Er(e,t,n)}}function Kx(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function cl(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var i=t[n];cn=i,$x(i,e)}Kx(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)jx(e),e=e.sibling}function jx(e){switch(e.tag){case 0:case 11:case 15:cl(e),e.flags&2048&&ca(9,e,e.return);break;case 3:cl(e);break;case 12:cl(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,pu(e)):cl(e);break;default:cl(e)}}function pu(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var i=t[n];cn=i,$x(i,e)}Kx(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:ca(8,t,t.return),pu(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,pu(t));break;default:pu(t)}e=e.sibling}}function $x(e,t){for(;cn!==null;){var n=cn;switch(n.tag){case 0:case 11:case 15:ca(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var i=n.memoizedState.cachePool.pool;i!=null&&i.refCount++}break;case 24:Ql(n.memoizedState.cache)}if(i=n.child,i!==null)i.return=n,cn=i;else t:for(n=e;cn!==null;){i=cn;var s=i.sibling,a=i.return;if(kx(i),i===n){cn=null;break t}if(s!==null){s.return=a,cn=s;break t}cn=a}}}var gT={getCacheForType:function(e){var t=vn(je),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return vn(je).controller.signal}},vT=typeof WeakMap=="function"?WeakMap:Map,de=0,we=null,ae=null,re=0,xe=0,Jn=null,Js=!1,oo=!1,um=!1,Ss=0,ke=0,ua=0,Fa=0,hm=0,jn=0,jr=0,wl=null,Hn=null,up=!1,ah=0,tM=0,Pu=1/0,zu=null,na=null,sn=0,ia=null,$r=null,vs=0,hp=0,fp=null,eM=null,Rl=0,dp=null;function ni(){return(de&2)!==0&&re!==0?re&-re:kt.T!==null?dm():uy()}function nM(){if(jn===0)if((re&536870912)===0||le){var e=Gc;Gc<<=1,(Gc&3932160)===0&&(Gc=262144),jn=e}else jn=536870912;return e=si.current,e!==null&&(e.flags|=32),jn}function Vn(e,t,n){(e===we&&(xe===2||xe===9)||e.cancelPendingCommit!==null)&&(to(e,0),Qs(e,re,jn,!1)),Yl(e,n),((de&2)===0||e!==we)&&(e===we&&((de&2)===0&&(Fa|=n),ke===4&&Qs(e,re,jn,!1)),Zi(e))}function iM(e,t,n){if((de&6)!==0)throw Error(K(327));var i=!n&&(t&127)===0&&(t&e.expiredLanes)===0||ql(e,t),s=i?xT(e,t):bd(e,t,!0),a=i;do{if(s===0){oo&&!i&&Qs(e,t,0,!1);break}else{if(n=e.current.alternate,a&&!_T(n)){s=bd(e,t,!1),a=!1;continue}if(s===2){if(a=t,e.errorRecoveryDisabledLanes&a)var r=0;else r=e.pendingLanes&-536870913,r=r!==0?r:r&536870912?536870912:0;if(r!==0){t=r;t:{var o=e;s=wl;var l=o.current.memoizedState.isDehydrated;if(l&&(to(o,r).flags|=256),r=bd(o,r,!1),r!==2){if(um&&!l){o.errorRecoveryDisabledLanes|=a,Fa|=a,s=4;break t}a=Hn,Hn=s,a!==null&&(Hn===null?Hn=a:Hn.push.apply(Hn,a))}s=r}if(a=!1,s!==2)continue}}if(s===1){to(e,0),Qs(e,t,0,!0);break}t:{switch(i=e,a=s,a){case 0:case 1:throw Error(K(345));case 4:if((t&4194048)!==t)break;case 6:Qs(i,t,jn,!Js);break t;case 2:Hn=null;break;case 3:case 5:break;default:throw Error(K(329))}if((t&62914560)===t&&(s=ah+300-$n(),10<s)){if(Qs(i,t,jn,!Js),Zu(i,0,!0)!==0)break t;vs=t,i.timeoutHandle=bM(M_.bind(null,i,n,Hn,zu,up,t,jn,Fa,jr,Js,a,"Throttled",-0,0),s);break t}M_(i,n,Hn,zu,up,t,jn,Fa,jr,Js,a,null,-0,0)}}break}while(!0);Zi(e)}function M_(e,t,n,i,s,a,r,o,l,c,h,d,f,p){if(e.timeoutHandle=-1,d=t.subtreeFlags,d&8192||(d&16785408)===16785408){d={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:ds},Qx(t,a,d);var g=(a&62914560)===a?ah-$n():(a&4194048)===a?tM-$n():0;if(g=tA(d,g),g!==null){vs=a,e.cancelPendingCommit=g(b_.bind(null,e,t,a,n,i,s,r,o,l,h,d,null,f,p)),Qs(e,a,r,!c);return}}b_(e,t,a,n,i,s,r,o,l)}function _T(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var i=0;i<n.length;i++){var s=n[i],a=s.getSnapshot;s=s.value;try{if(!ii(a(),s))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Qs(e,t,n,i){t&=~hm,t&=~Fa,e.suspendedLanes|=t,e.pingedLanes&=~t,i&&(e.warmLanes|=t),i=e.expirationTimes;for(var s=t;0<s;){var a=31-ei(s),r=1<<a;i[a]=-1,s&=~r}n!==0&&oy(e,n,t)}function rh(){return(de&6)===0?($l(0,!1),!1):!0}function fm(){if(ae!==null){if(xe===0)var e=ae.return;else e=ae,ps=Ja=null,Kp(e),kr=null,Pl=0,e=ae;for(;e!==null;)Px(e.alternate,e),e=e.return;ae=null}}function to(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,PT(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),vs=0,fm(),we=e,ae=n=ms(e.current,null),re=t,xe=0,Jn=null,Js=!1,oo=ql(e,t),um=!1,jr=jn=hm=Fa=ua=ke=0,Hn=wl=null,up=!1,(t&8)!==0&&(t|=t&32);var i=e.entangledLanes;if(i!==0)for(e=e.entanglements,i&=t;0<i;){var s=31-ei(i),a=1<<s;t|=e[s],i&=~a}return Ss=t,ju(),n}function sM(e,t){jt=null,kt.H=Bl,t===ro||t===th?(t=$v(),xe=3):t===Xp?(t=$v(),xe=4):xe=t===rm?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Jn=t,ae===null&&(ke=1,Lu(e,yi(t,e.current)))}function aM(){var e=si.current;return e===null?!0:(re&4194048)===re?Mi===null:(re&62914560)===re||(re&536870912)!==0?e===Mi:!1}function rM(){var e=kt.H;return kt.H=Bl,e===null?Bl:e}function oM(){var e=kt.A;return kt.A=gT,e}function Bu(){ke=4,Js||(re&4194048)!==re&&si.current!==null||(oo=!0),(ua&134217727)===0&&(Fa&134217727)===0||we===null||Qs(we,re,jn,!1)}function bd(e,t,n){var i=de;de|=2;var s=rM(),a=oM();(we!==e||re!==t)&&(zu=null,to(e,t)),t=!1;var r=ke;t:do try{if(xe!==0&&ae!==null){var o=ae,l=Jn;switch(xe){case 8:fm(),r=6;break t;case 3:case 2:case 9:case 6:si.current===null&&(t=!0);var c=xe;if(xe=0,Jn=null,Br(e,o,l,c),n&&oo){r=0;break t}break;default:c=xe,xe=0,Jn=null,Br(e,o,l,c)}}yT(),r=ke;break}catch(h){sM(e,h)}while(!0);return t&&e.shellSuspendCounter++,ps=Ja=null,de=i,kt.H=s,kt.A=a,ae===null&&(we=null,re=0,ju()),r}function yT(){for(;ae!==null;)lM(ae)}function xT(e,t){var n=de;de|=2;var i=rM(),s=oM();we!==e||re!==t?(zu=null,Pu=$n()+500,to(e,t)):oo=ql(e,t);t:do try{if(xe!==0&&ae!==null){t=ae;var a=Jn;e:switch(xe){case 1:xe=0,Jn=null,Br(e,t,a,1);break;case 2:case 9:if(jv(a)){xe=0,Jn=null,S_(t);break}t=function(){xe!==2&&xe!==9||we!==e||(xe=7),Zi(e)},a.then(t,t);break t;case 3:xe=7;break t;case 4:xe=5;break t;case 7:jv(a)?(xe=0,Jn=null,S_(t)):(xe=0,Jn=null,Br(e,t,a,7));break;case 5:var r=null;switch(ae.tag){case 26:r=ae.memoizedState;case 5:case 27:var o=ae;if(r?RM(r):o.stateNode.complete){xe=0,Jn=null;var l=o.sibling;if(l!==null)ae=l;else{var c=o.return;c!==null?(ae=c,oh(c)):ae=null}break e}}xe=0,Jn=null,Br(e,t,a,5);break;case 6:xe=0,Jn=null,Br(e,t,a,6);break;case 8:fm(),ke=6;break t;default:throw Error(K(462))}}MT();break}catch(h){sM(e,h)}while(!0);return ps=Ja=null,kt.H=i,kt.A=s,de=n,ae!==null?0:(we=null,re=0,ju(),ke)}function MT(){for(;ae!==null&&!X1();)lM(ae)}function lM(e){var t=Ox(e.alternate,e,Ss);e.memoizedProps=e.pendingProps,t===null?oh(e):ae=t}function S_(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=m_(n,t,t.pendingProps,t.type,void 0,re);break;case 11:t=m_(n,t,t.pendingProps,t.type.render,t.ref,re);break;case 5:Kp(t);default:Px(n,t),t=ae=Py(t,Ss),t=Ox(n,t,Ss)}e.memoizedProps=e.pendingProps,t===null?oh(e):ae=t}function Br(e,t,n,i){ps=Ja=null,Kp(t),kr=null,Pl=0;var s=t.return;try{if(cT(e,s,t,n,re)){ke=1,Lu(e,yi(n,e.current)),ae=null;return}}catch(a){if(s!==null)throw ae=s,a;ke=1,Lu(e,yi(n,e.current)),ae=null;return}t.flags&32768?(le||i===1?e=!0:oo||(re&536870912)!==0?e=!1:(Js=e=!0,(i===2||i===9||i===3||i===6)&&(i=si.current,i!==null&&i.tag===13&&(i.flags|=16384))),cM(t,e)):oh(t)}function oh(e){var t=e;do{if((t.flags&32768)!==0){cM(t,Js);return}e=t.return;var n=fT(t.alternate,t,Ss);if(n!==null){ae=n;return}if(t=t.sibling,t!==null){ae=t;return}ae=t=e}while(t!==null);ke===0&&(ke=5)}function cM(e,t){do{var n=dT(e.alternate,e);if(n!==null){n.flags&=32767,ae=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){ae=e;return}ae=e=n}while(e!==null);ke=6,ae=null}function b_(e,t,n,i,s,a,r,o,l){e.cancelPendingCommit=null;do lh();while(sn!==0);if((de&6)!==0)throw Error(K(327));if(t!==null){if(t===e.current)throw Error(K(177));if(a=t.lanes|t.childLanes,a|=zp,tE(e,n,a,r,o,l),e===we&&(ae=we=null,re=0),$r=t,ia=e,vs=n,hp=a,fp=s,eM=i,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,TT(Su,function(){return pM(),null})):(e.callbackNode=null,e.callbackPriority=0),i=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||i){i=kt.T,kt.T=null,s=pe.p,pe.p=2,r=de,de|=4;try{pT(e,t,n)}finally{de=r,pe.p=s,kt.T=i}}sn=1,uM(),hM(),fM()}}function uM(){if(sn===1){sn=0;var e=ia,t=$r,n=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||n){n=kt.T,kt.T=null;var i=pe.p;pe.p=2;var s=de;de|=4;try{Yx(t,e);var a=vp,r=Ry(e.containerInfo),o=a.focusedElem,l=a.selectionRange;if(r!==o&&o&&o.ownerDocument&&wy(o.ownerDocument.documentElement,o)){if(l!==null&&Pp(o)){var c=l.start,h=l.end;if(h===void 0&&(h=c),"selectionStart"in o)o.selectionStart=c,o.selectionEnd=Math.min(h,o.value.length);else{var d=o.ownerDocument||document,f=d&&d.defaultView||window;if(f.getSelection){var p=f.getSelection(),g=o.textContent.length,M=Math.min(l.start,g),m=l.end===void 0?M:Math.min(l.end,g);!p.extend&&M>m&&(r=m,m=M,M=r);var u=Wv(o,M),y=Wv(o,m);if(u&&y&&(p.rangeCount!==1||p.anchorNode!==u.node||p.anchorOffset!==u.offset||p.focusNode!==y.node||p.focusOffset!==y.offset)){var _=d.createRange();_.setStart(u.node,u.offset),p.removeAllRanges(),M>m?(p.addRange(_),p.extend(y.node,y.offset)):(_.setEnd(y.node,y.offset),p.addRange(_))}}}}for(d=[],p=o;p=p.parentNode;)p.nodeType===1&&d.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<d.length;o++){var v=d[o];v.element.scrollLeft=v.left,v.element.scrollTop=v.top}}qu=!!gp,vp=gp=null}finally{de=s,pe.p=i,kt.T=n}}e.current=t,sn=2}}function hM(){if(sn===2){sn=0;var e=ia,t=$r,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=kt.T,kt.T=null;var i=pe.p;pe.p=2;var s=de;de|=4;try{Gx(e,t.alternate,t)}finally{de=s,pe.p=i,kt.T=n}}sn=3}}function fM(){if(sn===4||sn===3){sn=0,W1();var e=ia,t=$r,n=vs,i=eM;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?sn=5:(sn=0,$r=ia=null,dM(e,e.pendingLanes));var s=e.pendingLanes;if(s===0&&(na=null),Cp(n),t=t.stateNode,ti&&typeof ti.onCommitFiberRoot=="function")try{ti.onCommitFiberRoot(Wl,t,void 0,(t.current.flags&128)===128)}catch{}if(i!==null){t=kt.T,s=pe.p,pe.p=2,kt.T=null;try{for(var a=e.onRecoverableError,r=0;r<i.length;r++){var o=i[r];a(o.value,{componentStack:o.stack})}}finally{kt.T=t,pe.p=s}}(vs&3)!==0&&lh(),Zi(e),s=e.pendingLanes,(n&261930)!==0&&(s&42)!==0?e===dp?Rl++:(Rl=0,dp=e):Rl=0,$l(0,!1)}}function dM(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,Ql(t)))}function lh(){return uM(),hM(),fM(),pM()}function pM(){if(sn!==5)return!1;var e=ia,t=hp;hp=0;var n=Cp(vs),i=kt.T,s=pe.p;try{pe.p=32>n?32:n,kt.T=null,n=fp,fp=null;var a=ia,r=vs;if(sn=0,$r=ia=null,vs=0,(de&6)!==0)throw Error(K(331));var o=de;if(de|=4,jx(a.current),Jx(a,a.current,r,n),de=o,$l(0,!1),ti&&typeof ti.onPostCommitFiberRoot=="function")try{ti.onPostCommitFiberRoot(Wl,a)}catch{}return!0}finally{pe.p=s,kt.T=i,dM(e,t)}}function E_(e,t,n){t=yi(n,t),t=rp(e.stateNode,t,2),e=ea(e,t,2),e!==null&&(Yl(e,2),Zi(e))}function Me(e,t,n){if(e.tag===3)E_(e,e,n);else for(;t!==null;){if(t.tag===3){E_(t,e,n);break}else if(t.tag===1){var i=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(na===null||!na.has(i))){e=yi(n,e),n=Cx(2),i=ea(t,n,2),i!==null&&(Dx(n,i,t,e),Yl(i,2),Zi(i));break}}t=t.return}}function Ed(e,t,n){var i=e.pingCache;if(i===null){i=e.pingCache=new vT;var s=new Set;i.set(t,s)}else s=i.get(t),s===void 0&&(s=new Set,i.set(t,s));s.has(n)||(um=!0,s.add(n),e=ST.bind(null,e,t,n),t.then(e,e))}function ST(e,t,n){var i=e.pingCache;i!==null&&i.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,we===e&&(re&n)===n&&(ke===4||ke===3&&(re&62914560)===re&&300>$n()-ah?(de&2)===0&&to(e,0):hm|=n,jr===re&&(jr=0)),Zi(e)}function mM(e,t){t===0&&(t=ry()),e=Za(e,t),e!==null&&(Yl(e,t),Zi(e))}function bT(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),mM(e,n)}function ET(e,t){var n=0;switch(e.tag){case 31:case 13:var i=e.stateNode,s=e.memoizedState;s!==null&&(n=s.retryLane);break;case 19:i=e.stateNode;break;case 22:i=e.stateNode._retryCache;break;default:throw Error(K(314))}i!==null&&i.delete(t),mM(e,n)}function TT(e,t){return wp(e,t)}var Fu=null,Ar=null,pp=!1,Hu=!1,Td=!1,Ks=0;function Zi(e){e!==Ar&&e.next===null&&(Ar===null?Fu=Ar=e:Ar=Ar.next=e),Hu=!0,pp||(pp=!0,wT())}function $l(e,t){if(!Td&&Hu){Td=!0;do for(var n=!1,i=Fu;i!==null;){if(!t)if(e!==0){var s=i.pendingLanes;if(s===0)var a=0;else{var r=i.suspendedLanes,o=i.pingedLanes;a=(1<<31-ei(42|e)+1)-1,a&=s&~(r&~o),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,T_(i,a))}else a=re,a=Zu(i,i===we?a:0,i.cancelPendingCommit!==null||i.timeoutHandle!==-1),(a&3)===0||ql(i,a)||(n=!0,T_(i,a));i=i.next}while(n);Td=!1}}function AT(){gM()}function gM(){Hu=pp=!1;var e=0;Ks!==0&&OT()&&(e=Ks);for(var t=$n(),n=null,i=Fu;i!==null;){var s=i.next,a=vM(i,t);a===0?(i.next=null,n===null?Fu=s:n.next=s,s===null&&(Ar=n)):(n=i,(e!==0||(a&3)!==0)&&(Hu=!0)),i=s}sn!==0&&sn!==5||$l(e,!1),Ks!==0&&(Ks=0)}function vM(e,t){for(var n=e.suspendedLanes,i=e.pingedLanes,s=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var r=31-ei(a),o=1<<r,l=s[r];l===-1?((o&n)===0||(o&i)!==0)&&(s[r]=$1(o,t)):l<=t&&(e.expiredLanes|=o),a&=~o}if(t=we,n=re,n=Zu(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),i=e.callbackNode,n===0||e===t&&(xe===2||xe===9)||e.cancelPendingCommit!==null)return i!==null&&i!==null&&td(i),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||ql(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(i!==null&&td(i),Cp(n)){case 2:case 8:n=sy;break;case 32:n=Su;break;case 268435456:n=ay;break;default:n=Su}return i=_M.bind(null,e),n=wp(n,i),e.callbackPriority=t,e.callbackNode=n,t}return i!==null&&i!==null&&td(i),e.callbackPriority=2,e.callbackNode=null,2}function _M(e,t){if(sn!==0&&sn!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(lh()&&e.callbackNode!==n)return null;var i=re;return i=Zu(e,e===we?i:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),i===0?null:(iM(e,i,t),vM(e,$n()),e.callbackNode!=null&&e.callbackNode===n?_M.bind(null,e):null)}function T_(e,t){if(lh())return null;iM(e,t,!0)}function wT(){zT(function(){(de&6)!==0?wp(iy,AT):gM()})}function dm(){if(Ks===0){var e=Jr;e===0&&(e=Vc,Vc<<=1,(Vc&261888)===0&&(Vc=256)),Ks=e}return Ks}function A_(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:au(""+e)}function w_(e,t){var n=t.ownerDocument.createElement("input");return n.name=t.name,n.value=t.value,e.id&&n.setAttribute("form",e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function RT(e,t,n,i,s){if(t==="submit"&&n&&n.stateNode===s){var a=A_((s[Gn]||null).action),r=i.submitter;r&&(t=(t=r[Gn]||null)?A_(t.formAction):r.getAttribute("formAction"),t!==null&&(a=t,r=null));var o=new Ju("action","action",null,i,s);e.push({event:o,listeners:[{instance:null,listener:function(){if(i.defaultPrevented){if(Ks!==0){var l=r?w_(s,r):new FormData(s);sp(n,{pending:!0,data:l,method:s.method,action:a},null,l)}}else typeof a=="function"&&(o.preventDefault(),l=r?w_(s,r):new FormData(s),sp(n,{pending:!0,data:l,method:s.method,action:a},a,l))},currentTarget:s}]})}}for($c=0;$c<qd.length;$c++)tu=qd[$c],R_=tu.toLowerCase(),C_=tu[0].toUpperCase()+tu.slice(1),Ui(R_,"on"+C_);var tu,R_,C_,$c;Ui(Dy,"onAnimationEnd");Ui(Uy,"onAnimationIteration");Ui(Ny,"onAnimationStart");Ui("dblclick","onDoubleClick");Ui("focusin","onFocus");Ui("focusout","onBlur");Ui(qE,"onTransitionRun");Ui(YE,"onTransitionStart");Ui(ZE,"onTransitionCancel");Ui(Ly,"onTransitionEnd");Yr("onMouseEnter",["mouseout","mouseover"]);Yr("onMouseLeave",["mouseout","mouseover"]);Yr("onPointerEnter",["pointerout","pointerover"]);Yr("onPointerLeave",["pointerout","pointerover"]);Wa("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Wa("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Wa("onBeforeInput",["compositionend","keypress","textInput","paste"]);Wa("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Wa("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Wa("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Fl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),CT=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Fl));function yM(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var i=e[n],s=i.event;i=i.listeners;t:{var a=void 0;if(t)for(var r=i.length-1;0<=r;r--){var o=i[r],l=o.instance,c=o.currentTarget;if(o=o.listener,l!==a&&s.isPropagationStopped())break t;a=o,s.currentTarget=c;try{a(s)}catch(h){Eu(h)}s.currentTarget=null,a=l}else for(r=0;r<i.length;r++){if(o=i[r],l=o.instance,c=o.currentTarget,o=o.listener,l!==a&&s.isPropagationStopped())break t;a=o,s.currentTarget=c;try{a(s)}catch(h){Eu(h)}s.currentTarget=null,a=l}}}}function se(e,t){var n=t[Bd];n===void 0&&(n=t[Bd]=new Set);var i=e+"__bubble";n.has(i)||(xM(t,e,2,!1),n.add(i))}function Ad(e,t,n){var i=0;t&&(i|=4),xM(n,e,i,t)}var eu="_reactListening"+Math.random().toString(36).slice(2);function pm(e){if(!e[eu]){e[eu]=!0,hy.forEach(function(n){n!=="selectionchange"&&(CT.has(n)||Ad(n,!1,e),Ad(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[eu]||(t[eu]=!0,Ad("selectionchange",!1,t))}}function xM(e,t,n,i){switch(LM(t)){case 2:var s=iA;break;case 8:s=sA;break;default:s=_m}n=s.bind(null,t,n,e),s=void 0,!kd||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(s=!0),i?s!==void 0?e.addEventListener(t,n,{capture:!0,passive:s}):e.addEventListener(t,n,!0):s!==void 0?e.addEventListener(t,n,{passive:s}):e.addEventListener(t,n,!1)}function wd(e,t,n,i,s){var a=i;if((t&1)===0&&(t&2)===0&&i!==null)t:for(;;){if(i===null)return;var r=i.tag;if(r===3||r===4){var o=i.stateNode.containerInfo;if(o===s)break;if(r===4)for(r=i.return;r!==null;){var l=r.tag;if((l===3||l===4)&&r.stateNode.containerInfo===s)return;r=r.return}for(;o!==null;){if(r=Cr(o),r===null)return;if(l=r.tag,l===5||l===6||l===26||l===27){i=a=r;continue t}o=o.parentNode}}i=i.return}yy(function(){var c=a,h=Np(n),d=[];t:{var f=Iy.get(e);if(f!==void 0){var p=Ju,g=e;switch(e){case"keypress":if(ou(n)===0)break t;case"keydown":case"keyup":p=EE;break;case"focusin":g="focus",p=ad;break;case"focusout":g="blur",p=ad;break;case"beforeblur":case"afterblur":p=ad;break;case"click":if(n.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=Pv;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=fE;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=wE;break;case Dy:case Uy:case Ny:p=mE;break;case Ly:p=CE;break;case"scroll":case"scrollend":p=uE;break;case"wheel":p=UE;break;case"copy":case"cut":case"paste":p=vE;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=Bv;break;case"toggle":case"beforetoggle":p=LE}var M=(t&4)!==0,m=!M&&(e==="scroll"||e==="scrollend"),u=M?f!==null?f+"Capture":null:f;M=[];for(var y=c,_;y!==null;){var v=y;if(_=v.stateNode,v=v.tag,v!==5&&v!==26&&v!==27||_===null||u===null||(v=Ul(y,u),v!=null&&M.push(Hl(y,v,_))),m)break;y=y.return}0<M.length&&(f=new p(f,g,null,n,h),d.push({event:f,listeners:M}))}}if((t&7)===0){t:{if(f=e==="mouseover"||e==="pointerover",p=e==="mouseout"||e==="pointerout",f&&n!==Gd&&(g=n.relatedTarget||n.fromElement)&&(Cr(g)||g[io]))break t;if((p||f)&&(f=h.window===h?h:(f=h.ownerDocument)?f.defaultView||f.parentWindow:window,p?(g=n.relatedTarget||n.toElement,p=c,g=g?Cr(g):null,g!==null&&(m=Xl(g),M=g.tag,g!==m||M!==5&&M!==27&&M!==6)&&(g=null)):(p=null,g=c),p!==g)){if(M=Pv,v="onMouseLeave",u="onMouseEnter",y="mouse",(e==="pointerout"||e==="pointerover")&&(M=Bv,v="onPointerLeave",u="onPointerEnter",y="pointer"),m=p==null?f:pl(p),_=g==null?f:pl(g),f=new M(v,y+"leave",p,n,h),f.target=m,f.relatedTarget=_,v=null,Cr(h)===c&&(M=new M(u,y+"enter",g,n,h),M.target=_,M.relatedTarget=m,v=M),m=v,p&&g)e:{for(M=DT,u=p,y=g,_=0,v=u;v;v=M(v))_++;v=0;for(var R=y;R;R=M(R))v++;for(;0<_-v;)u=M(u),_--;for(;0<v-_;)y=M(y),v--;for(;_--;){if(u===y||y!==null&&u===y.alternate){M=u;break e}u=M(u),y=M(y)}M=null}else M=null;p!==null&&D_(d,f,p,M,!1),g!==null&&m!==null&&D_(d,m,g,M,!0)}}t:{if(f=c?pl(c):window,p=f.nodeName&&f.nodeName.toLowerCase(),p==="select"||p==="input"&&f.type==="file")var w=Gv;else if(Vv(f))if(Ty)w=kE;else{w=VE;var A=HE}else p=f.nodeName,!p||p.toLowerCase()!=="input"||f.type!=="checkbox"&&f.type!=="radio"?c&&Up(c.elementType)&&(w=Gv):w=GE;if(w&&(w=w(e,c))){Ey(d,w,n,h);break t}A&&A(e,f,c),e==="focusout"&&c&&f.type==="number"&&c.memoizedProps.value!=null&&Vd(f,"number",f.value)}switch(A=c?pl(c):window,e){case"focusin":(Vv(A)||A.contentEditable==="true")&&(Nr=A,Xd=c,yl=null);break;case"focusout":yl=Xd=Nr=null;break;case"mousedown":Wd=!0;break;case"contextmenu":case"mouseup":case"dragend":Wd=!1,qv(d,n,h);break;case"selectionchange":if(WE)break;case"keydown":case"keyup":qv(d,n,h)}var C;if(Op)t:{switch(e){case"compositionstart":var b="onCompositionStart";break t;case"compositionend":b="onCompositionEnd";break t;case"compositionupdate":b="onCompositionUpdate";break t}b=void 0}else Ur?Sy(e,n)&&(b="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(b="onCompositionStart");b&&(My&&n.locale!=="ko"&&(Ur||b!=="onCompositionStart"?b==="onCompositionEnd"&&Ur&&(C=xy()):(Zs=h,Lp="value"in Zs?Zs.value:Zs.textContent,Ur=!0)),A=Vu(c,b),0<A.length&&(b=new zv(b,e,null,n,h),d.push({event:b,listeners:A}),C?b.data=C:(C=by(n),C!==null&&(b.data=C)))),(C=OE?PE(e,n):zE(e,n))&&(b=Vu(c,"onBeforeInput"),0<b.length&&(A=new zv("onBeforeInput","beforeinput",null,n,h),d.push({event:A,listeners:b}),A.data=C)),RT(d,e,c,n,h)}yM(d,t)})}function Hl(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Vu(e,t){for(var n=t+"Capture",i=[];e!==null;){var s=e,a=s.stateNode;if(s=s.tag,s!==5&&s!==26&&s!==27||a===null||(s=Ul(e,n),s!=null&&i.unshift(Hl(e,s,a)),s=Ul(e,t),s!=null&&i.push(Hl(e,s,a))),e.tag===3)return i;e=e.return}return[]}function DT(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function D_(e,t,n,i,s){for(var a=t._reactName,r=[];n!==null&&n!==i;){var o=n,l=o.alternate,c=o.stateNode;if(o=o.tag,l!==null&&l===i)break;o!==5&&o!==26&&o!==27||c===null||(l=c,s?(c=Ul(n,a),c!=null&&r.unshift(Hl(n,c,l))):s||(c=Ul(n,a),c!=null&&r.push(Hl(n,c,l)))),n=n.return}r.length!==0&&e.push({event:t,listeners:r})}var UT=/\r\n?/g,NT=/\u0000|\uFFFD/g;function U_(e){return(typeof e=="string"?e:""+e).replace(UT,`
`).replace(NT,"")}function MM(e,t){return t=U_(t),U_(e)===t}function be(e,t,n,i,s,a){switch(n){case"children":typeof i=="string"?t==="body"||t==="textarea"&&i===""||Zr(e,i):(typeof i=="number"||typeof i=="bigint")&&t!=="body"&&Zr(e,""+i);break;case"className":Xc(e,"class",i);break;case"tabIndex":Xc(e,"tabindex",i);break;case"dir":case"role":case"viewBox":case"width":case"height":Xc(e,n,i);break;case"style":_y(e,i,a);break;case"data":if(t!=="object"){Xc(e,"data",i);break}case"src":case"href":if(i===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(i==null||typeof i=="function"||typeof i=="symbol"||typeof i=="boolean"){e.removeAttribute(n);break}i=au(""+i),e.setAttribute(n,i);break;case"action":case"formAction":if(typeof i=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof a=="function"&&(n==="formAction"?(t!=="input"&&be(e,t,"name",s.name,s,null),be(e,t,"formEncType",s.formEncType,s,null),be(e,t,"formMethod",s.formMethod,s,null),be(e,t,"formTarget",s.formTarget,s,null)):(be(e,t,"encType",s.encType,s,null),be(e,t,"method",s.method,s,null),be(e,t,"target",s.target,s,null)));if(i==null||typeof i=="symbol"||typeof i=="boolean"){e.removeAttribute(n);break}i=au(""+i),e.setAttribute(n,i);break;case"onClick":i!=null&&(e.onclick=ds);break;case"onScroll":i!=null&&se("scroll",e);break;case"onScrollEnd":i!=null&&se("scrollend",e);break;case"dangerouslySetInnerHTML":if(i!=null){if(typeof i!="object"||!("__html"in i))throw Error(K(61));if(n=i.__html,n!=null){if(s.children!=null)throw Error(K(60));e.innerHTML=n}}break;case"multiple":e.multiple=i&&typeof i!="function"&&typeof i!="symbol";break;case"muted":e.muted=i&&typeof i!="function"&&typeof i!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(i==null||typeof i=="function"||typeof i=="boolean"||typeof i=="symbol"){e.removeAttribute("xlink:href");break}n=au(""+i),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":i!=null&&typeof i!="function"&&typeof i!="symbol"?e.setAttribute(n,""+i):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":i&&typeof i!="function"&&typeof i!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":i===!0?e.setAttribute(n,""):i!==!1&&i!=null&&typeof i!="function"&&typeof i!="symbol"?e.setAttribute(n,i):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":i!=null&&typeof i!="function"&&typeof i!="symbol"&&!isNaN(i)&&1<=i?e.setAttribute(n,i):e.removeAttribute(n);break;case"rowSpan":case"start":i==null||typeof i=="function"||typeof i=="symbol"||isNaN(i)?e.removeAttribute(n):e.setAttribute(n,i);break;case"popover":se("beforetoggle",e),se("toggle",e),su(e,"popover",i);break;case"xlinkActuate":as(e,"http://www.w3.org/1999/xlink","xlink:actuate",i);break;case"xlinkArcrole":as(e,"http://www.w3.org/1999/xlink","xlink:arcrole",i);break;case"xlinkRole":as(e,"http://www.w3.org/1999/xlink","xlink:role",i);break;case"xlinkShow":as(e,"http://www.w3.org/1999/xlink","xlink:show",i);break;case"xlinkTitle":as(e,"http://www.w3.org/1999/xlink","xlink:title",i);break;case"xlinkType":as(e,"http://www.w3.org/1999/xlink","xlink:type",i);break;case"xmlBase":as(e,"http://www.w3.org/XML/1998/namespace","xml:base",i);break;case"xmlLang":as(e,"http://www.w3.org/XML/1998/namespace","xml:lang",i);break;case"xmlSpace":as(e,"http://www.w3.org/XML/1998/namespace","xml:space",i);break;case"is":su(e,"is",i);break;case"innerText":case"textContent":break;default:(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(n=lE.get(n)||n,su(e,n,i))}}function mp(e,t,n,i,s,a){switch(n){case"style":_y(e,i,a);break;case"dangerouslySetInnerHTML":if(i!=null){if(typeof i!="object"||!("__html"in i))throw Error(K(61));if(n=i.__html,n!=null){if(s.children!=null)throw Error(K(60));e.innerHTML=n}}break;case"children":typeof i=="string"?Zr(e,i):(typeof i=="number"||typeof i=="bigint")&&Zr(e,""+i);break;case"onScroll":i!=null&&se("scroll",e);break;case"onScrollEnd":i!=null&&se("scrollend",e);break;case"onClick":i!=null&&(e.onclick=ds);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!fy.hasOwnProperty(n))t:{if(n[0]==="o"&&n[1]==="n"&&(s=n.endsWith("Capture"),t=n.slice(2,s?n.length-7:void 0),a=e[Gn]||null,a=a!=null?a[n]:null,typeof a=="function"&&e.removeEventListener(t,a,s),typeof i=="function")){typeof a!="function"&&a!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,i,s);break t}n in e?e[n]=i:i===!0?e.setAttribute(n,""):su(e,n,i)}}}function _n(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":se("error",e),se("load",e);var i=!1,s=!1,a;for(a in n)if(n.hasOwnProperty(a)){var r=n[a];if(r!=null)switch(a){case"src":i=!0;break;case"srcSet":s=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(K(137,t));default:be(e,t,a,r,n,null)}}s&&be(e,t,"srcSet",n.srcSet,n,null),i&&be(e,t,"src",n.src,n,null);return;case"input":se("invalid",e);var o=a=r=s=null,l=null,c=null;for(i in n)if(n.hasOwnProperty(i)){var h=n[i];if(h!=null)switch(i){case"name":s=h;break;case"type":r=h;break;case"checked":l=h;break;case"defaultChecked":c=h;break;case"value":a=h;break;case"defaultValue":o=h;break;case"children":case"dangerouslySetInnerHTML":if(h!=null)throw Error(K(137,t));break;default:be(e,t,i,h,n,null)}}my(e,a,o,l,c,r,s,!1);return;case"select":se("invalid",e),i=r=a=null;for(s in n)if(n.hasOwnProperty(s)&&(o=n[s],o!=null))switch(s){case"value":a=o;break;case"defaultValue":r=o;break;case"multiple":i=o;default:be(e,t,s,o,n,null)}t=a,n=r,e.multiple=!!i,t!=null?Hr(e,!!i,t,!1):n!=null&&Hr(e,!!i,n,!0);return;case"textarea":se("invalid",e),a=s=i=null;for(r in n)if(n.hasOwnProperty(r)&&(o=n[r],o!=null))switch(r){case"value":i=o;break;case"defaultValue":s=o;break;case"children":a=o;break;case"dangerouslySetInnerHTML":if(o!=null)throw Error(K(91));break;default:be(e,t,r,o,n,null)}vy(e,i,s,a);return;case"option":for(l in n)if(n.hasOwnProperty(l)&&(i=n[l],i!=null))switch(l){case"selected":e.selected=i&&typeof i!="function"&&typeof i!="symbol";break;default:be(e,t,l,i,n,null)}return;case"dialog":se("beforetoggle",e),se("toggle",e),se("cancel",e),se("close",e);break;case"iframe":case"object":se("load",e);break;case"video":case"audio":for(i=0;i<Fl.length;i++)se(Fl[i],e);break;case"image":se("error",e),se("load",e);break;case"details":se("toggle",e);break;case"embed":case"source":case"link":se("error",e),se("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(c in n)if(n.hasOwnProperty(c)&&(i=n[c],i!=null))switch(c){case"children":case"dangerouslySetInnerHTML":throw Error(K(137,t));default:be(e,t,c,i,n,null)}return;default:if(Up(t)){for(h in n)n.hasOwnProperty(h)&&(i=n[h],i!==void 0&&mp(e,t,h,i,n,void 0));return}}for(o in n)n.hasOwnProperty(o)&&(i=n[o],i!=null&&be(e,t,o,i,n,null))}function LT(e,t,n,i){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var s=null,a=null,r=null,o=null,l=null,c=null,h=null;for(p in n){var d=n[p];if(n.hasOwnProperty(p)&&d!=null)switch(p){case"checked":break;case"value":break;case"defaultValue":l=d;default:i.hasOwnProperty(p)||be(e,t,p,null,i,d)}}for(var f in i){var p=i[f];if(d=n[f],i.hasOwnProperty(f)&&(p!=null||d!=null))switch(f){case"type":a=p;break;case"name":s=p;break;case"checked":c=p;break;case"defaultChecked":h=p;break;case"value":r=p;break;case"defaultValue":o=p;break;case"children":case"dangerouslySetInnerHTML":if(p!=null)throw Error(K(137,t));break;default:p!==d&&be(e,t,f,p,i,d)}}Hd(e,r,o,l,c,h,a,s);return;case"select":p=r=o=f=null;for(a in n)if(l=n[a],n.hasOwnProperty(a)&&l!=null)switch(a){case"value":break;case"multiple":p=l;default:i.hasOwnProperty(a)||be(e,t,a,null,i,l)}for(s in i)if(a=i[s],l=n[s],i.hasOwnProperty(s)&&(a!=null||l!=null))switch(s){case"value":f=a;break;case"defaultValue":o=a;break;case"multiple":r=a;default:a!==l&&be(e,t,s,a,i,l)}t=o,n=r,i=p,f!=null?Hr(e,!!n,f,!1):!!i!=!!n&&(t!=null?Hr(e,!!n,t,!0):Hr(e,!!n,n?[]:"",!1));return;case"textarea":p=f=null;for(o in n)if(s=n[o],n.hasOwnProperty(o)&&s!=null&&!i.hasOwnProperty(o))switch(o){case"value":break;case"children":break;default:be(e,t,o,null,i,s)}for(r in i)if(s=i[r],a=n[r],i.hasOwnProperty(r)&&(s!=null||a!=null))switch(r){case"value":f=s;break;case"defaultValue":p=s;break;case"children":break;case"dangerouslySetInnerHTML":if(s!=null)throw Error(K(91));break;default:s!==a&&be(e,t,r,s,i,a)}gy(e,f,p);return;case"option":for(var g in n)if(f=n[g],n.hasOwnProperty(g)&&f!=null&&!i.hasOwnProperty(g))switch(g){case"selected":e.selected=!1;break;default:be(e,t,g,null,i,f)}for(l in i)if(f=i[l],p=n[l],i.hasOwnProperty(l)&&f!==p&&(f!=null||p!=null))switch(l){case"selected":e.selected=f&&typeof f!="function"&&typeof f!="symbol";break;default:be(e,t,l,f,i,p)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var M in n)f=n[M],n.hasOwnProperty(M)&&f!=null&&!i.hasOwnProperty(M)&&be(e,t,M,null,i,f);for(c in i)if(f=i[c],p=n[c],i.hasOwnProperty(c)&&f!==p&&(f!=null||p!=null))switch(c){case"children":case"dangerouslySetInnerHTML":if(f!=null)throw Error(K(137,t));break;default:be(e,t,c,f,i,p)}return;default:if(Up(t)){for(var m in n)f=n[m],n.hasOwnProperty(m)&&f!==void 0&&!i.hasOwnProperty(m)&&mp(e,t,m,void 0,i,f);for(h in i)f=i[h],p=n[h],!i.hasOwnProperty(h)||f===p||f===void 0&&p===void 0||mp(e,t,h,f,i,p);return}}for(var u in n)f=n[u],n.hasOwnProperty(u)&&f!=null&&!i.hasOwnProperty(u)&&be(e,t,u,null,i,f);for(d in i)f=i[d],p=n[d],!i.hasOwnProperty(d)||f===p||f==null&&p==null||be(e,t,d,f,i,p)}function N_(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function IT(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),i=0;i<n.length;i++){var s=n[i],a=s.transferSize,r=s.initiatorType,o=s.duration;if(a&&o&&N_(r)){for(r=0,o=s.responseEnd,i+=1;i<n.length;i++){var l=n[i],c=l.startTime;if(c>o)break;var h=l.transferSize,d=l.initiatorType;h&&N_(d)&&(l=l.responseEnd,r+=h*(l<o?1:(o-c)/(l-c)))}if(--i,t+=8*(a+r)/(s.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var gp=null,vp=null;function Gu(e){return e.nodeType===9?e:e.ownerDocument}function L_(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function SM(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function _p(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Rd=null;function OT(){var e=window.event;return e&&e.type==="popstate"?e===Rd?!1:(Rd=e,!0):(Rd=null,!1)}var bM=typeof setTimeout=="function"?setTimeout:void 0,PT=typeof clearTimeout=="function"?clearTimeout:void 0,I_=typeof Promise=="function"?Promise:void 0,zT=typeof queueMicrotask=="function"?queueMicrotask:typeof I_<"u"?function(e){return I_.resolve(null).then(e).catch(BT)}:bM;function BT(e){setTimeout(function(){throw e})}function fa(e){return e==="head"}function O_(e,t){var n=t,i=0;do{var s=n.nextSibling;if(e.removeChild(n),s&&s.nodeType===8)if(n=s.data,n==="/$"||n==="/&"){if(i===0){e.removeChild(s),no(t);return}i--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")i++;else if(n==="html")Cl(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,Cl(n);for(var a=n.firstChild;a;){var r=a.nextSibling,o=a.nodeName;a[Zl]||o==="SCRIPT"||o==="STYLE"||o==="LINK"&&a.rel.toLowerCase()==="stylesheet"||n.removeChild(a),a=r}}else n==="body"&&Cl(e.ownerDocument.body);n=s}while(n);no(t)}function P_(e,t){var n=e;e=0;do{var i=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=i}while(n)}function yp(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":yp(n),Dp(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function FT(e,t,n,i){for(;e.nodeType===1;){var s=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!i&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(i){if(!e[Zl])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(a=e.getAttribute("rel"),a==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(a!==s.rel||e.getAttribute("href")!==(s.href==null||s.href===""?null:s.href)||e.getAttribute("crossorigin")!==(s.crossOrigin==null?null:s.crossOrigin)||e.getAttribute("title")!==(s.title==null?null:s.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(a=e.getAttribute("src"),(a!==(s.src==null?null:s.src)||e.getAttribute("type")!==(s.type==null?null:s.type)||e.getAttribute("crossorigin")!==(s.crossOrigin==null?null:s.crossOrigin))&&a&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var a=s.name==null?null:""+s.name;if(s.type==="hidden"&&e.getAttribute("name")===a)return e}else return e;if(e=Si(e.nextSibling),e===null)break}return null}function HT(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=Si(e.nextSibling),e===null))return null;return e}function EM(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=Si(e.nextSibling),e===null))return null;return e}function xp(e){return e.data==="$?"||e.data==="$~"}function Mp(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function VT(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var i=function(){t(),n.removeEventListener("DOMContentLoaded",i)};n.addEventListener("DOMContentLoaded",i),e._reactRetry=i}}function Si(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Sp=null;function z_(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return Si(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function B_(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function TM(e,t,n){switch(t=Gu(n),e){case"html":if(e=t.documentElement,!e)throw Error(K(452));return e;case"head":if(e=t.head,!e)throw Error(K(453));return e;case"body":if(e=t.body,!e)throw Error(K(454));return e;default:throw Error(K(451))}}function Cl(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);Dp(e)}var bi=new Map,F_=new Set;function ku(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var bs=pe.d;pe.d={f:GT,r:kT,D:XT,C:WT,L:qT,m:YT,X:JT,S:ZT,M:QT};function GT(){var e=bs.f(),t=rh();return e||t}function kT(e){var t=so(e);t!==null&&t.tag===5&&t.type==="form"?_x(t):bs.r(e)}var lo=typeof document>"u"?null:document;function AM(e,t,n){var i=lo;if(i&&typeof t=="string"&&t){var s=_i(t);s='link[rel="'+e+'"][href="'+s+'"]',typeof n=="string"&&(s+='[crossorigin="'+n+'"]'),F_.has(s)||(F_.add(s),e={rel:e,crossOrigin:n,href:t},i.querySelector(s)===null&&(t=i.createElement("link"),_n(t,"link",e),un(t),i.head.appendChild(t)))}}function XT(e){bs.D(e),AM("dns-prefetch",e,null)}function WT(e,t){bs.C(e,t),AM("preconnect",e,t)}function qT(e,t,n){bs.L(e,t,n);var i=lo;if(i&&e&&t){var s='link[rel="preload"][as="'+_i(t)+'"]';t==="image"&&n&&n.imageSrcSet?(s+='[imagesrcset="'+_i(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(s+='[imagesizes="'+_i(n.imageSizes)+'"]')):s+='[href="'+_i(e)+'"]';var a=s;switch(t){case"style":a=eo(e);break;case"script":a=co(e)}bi.has(a)||(e=Pe({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),bi.set(a,e),i.querySelector(s)!==null||t==="style"&&i.querySelector(tc(a))||t==="script"&&i.querySelector(ec(a))||(t=i.createElement("link"),_n(t,"link",e),un(t),i.head.appendChild(t)))}}function YT(e,t){bs.m(e,t);var n=lo;if(n&&e){var i=t&&typeof t.as=="string"?t.as:"script",s='link[rel="modulepreload"][as="'+_i(i)+'"][href="'+_i(e)+'"]',a=s;switch(i){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":a=co(e)}if(!bi.has(a)&&(e=Pe({rel:"modulepreload",href:e},t),bi.set(a,e),n.querySelector(s)===null)){switch(i){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(ec(a)))return}i=n.createElement("link"),_n(i,"link",e),un(i),n.head.appendChild(i)}}}function ZT(e,t,n){bs.S(e,t,n);var i=lo;if(i&&e){var s=Fr(i).hoistableStyles,a=eo(e);t=t||"default";var r=s.get(a);if(!r){var o={loading:0,preload:null};if(r=i.querySelector(tc(a)))o.loading=5;else{e=Pe({rel:"stylesheet",href:e,"data-precedence":t},n),(n=bi.get(a))&&mm(e,n);var l=r=i.createElement("link");un(l),_n(l,"link",e),l._p=new Promise(function(c,h){l.onload=c,l.onerror=h}),l.addEventListener("load",function(){o.loading|=1}),l.addEventListener("error",function(){o.loading|=2}),o.loading|=4,mu(r,t,i)}r={type:"stylesheet",instance:r,count:1,state:o},s.set(a,r)}}}function JT(e,t){bs.X(e,t);var n=lo;if(n&&e){var i=Fr(n).hoistableScripts,s=co(e),a=i.get(s);a||(a=n.querySelector(ec(s)),a||(e=Pe({src:e,async:!0},t),(t=bi.get(s))&&gm(e,t),a=n.createElement("script"),un(a),_n(a,"link",e),n.head.appendChild(a)),a={type:"script",instance:a,count:1,state:null},i.set(s,a))}}function QT(e,t){bs.M(e,t);var n=lo;if(n&&e){var i=Fr(n).hoistableScripts,s=co(e),a=i.get(s);a||(a=n.querySelector(ec(s)),a||(e=Pe({src:e,async:!0,type:"module"},t),(t=bi.get(s))&&gm(e,t),a=n.createElement("script"),un(a),_n(a,"link",e),n.head.appendChild(a)),a={type:"script",instance:a,count:1,state:null},i.set(s,a))}}function H_(e,t,n,i){var s=(s=js.current)?ku(s):null;if(!s)throw Error(K(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(t=eo(n.href),n=Fr(s).hoistableStyles,i=n.get(t),i||(i={type:"style",instance:null,count:0,state:null},n.set(t,i)),i):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=eo(n.href);var a=Fr(s).hoistableStyles,r=a.get(e);if(r||(s=s.ownerDocument||s,r={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},a.set(e,r),(a=s.querySelector(tc(e)))&&!a._p&&(r.instance=a,r.state.loading=5),bi.has(e)||(n={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},bi.set(e,n),a||KT(s,e,n,r.state))),t&&i===null)throw Error(K(528,""));return r}if(t&&i!==null)throw Error(K(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=co(n),n=Fr(s).hoistableScripts,i=n.get(t),i||(i={type:"script",instance:null,count:0,state:null},n.set(t,i)),i):{type:"void",instance:null,count:0,state:null};default:throw Error(K(444,e))}}function eo(e){return'href="'+_i(e)+'"'}function tc(e){return'link[rel="stylesheet"]['+e+"]"}function wM(e){return Pe({},e,{"data-precedence":e.precedence,precedence:null})}function KT(e,t,n,i){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?i.loading=1:(t=e.createElement("link"),i.preload=t,t.addEventListener("load",function(){return i.loading|=1}),t.addEventListener("error",function(){return i.loading|=2}),_n(t,"link",n),un(t),e.head.appendChild(t))}function co(e){return'[src="'+_i(e)+'"]'}function ec(e){return"script[async]"+e}function V_(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var i=e.querySelector('style[data-href~="'+_i(n.href)+'"]');if(i)return t.instance=i,un(i),i;var s=Pe({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return i=(e.ownerDocument||e).createElement("style"),un(i),_n(i,"style",s),mu(i,n.precedence,e),t.instance=i;case"stylesheet":s=eo(n.href);var a=e.querySelector(tc(s));if(a)return t.state.loading|=4,t.instance=a,un(a),a;i=wM(n),(s=bi.get(s))&&mm(i,s),a=(e.ownerDocument||e).createElement("link"),un(a);var r=a;return r._p=new Promise(function(o,l){r.onload=o,r.onerror=l}),_n(a,"link",i),t.state.loading|=4,mu(a,n.precedence,e),t.instance=a;case"script":return a=co(n.src),(s=e.querySelector(ec(a)))?(t.instance=s,un(s),s):(i=n,(s=bi.get(a))&&(i=Pe({},n),gm(i,s)),e=e.ownerDocument||e,s=e.createElement("script"),un(s),_n(s,"link",i),e.head.appendChild(s),t.instance=s);case"void":return null;default:throw Error(K(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(i=t.instance,t.state.loading|=4,mu(i,n.precedence,e));return t.instance}function mu(e,t,n){for(var i=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),s=i.length?i[i.length-1]:null,a=s,r=0;r<i.length;r++){var o=i[r];if(o.dataset.precedence===t)a=o;else if(a!==s)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function mm(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function gm(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var gu=null;function G_(e,t,n){if(gu===null){var i=new Map,s=gu=new Map;s.set(n,i)}else s=gu,i=s.get(n),i||(i=new Map,s.set(n,i));if(i.has(e))return i;for(i.set(e,null),n=n.getElementsByTagName(e),s=0;s<n.length;s++){var a=n[s];if(!(a[Zl]||a[mn]||e==="link"&&a.getAttribute("rel")==="stylesheet")&&a.namespaceURI!=="http://www.w3.org/2000/svg"){var r=a.getAttribute(t)||"";r=e+r;var o=i.get(r);o?o.push(a):i.set(r,[a])}}return i}function k_(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function jT(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;switch(t.rel){case"stylesheet":return e=t.disabled,typeof t.precedence=="string"&&e==null;default:return!0}case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function RM(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function $T(e,t,n,i){if(n.type==="stylesheet"&&(typeof i.media!="string"||matchMedia(i.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var s=eo(i.href),a=t.querySelector(tc(s));if(a){t=a._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=Xu.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,un(a);return}a=t.ownerDocument||t,i=wM(i),(s=bi.get(s))&&mm(i,s),a=a.createElement("link"),un(a);var r=a;r._p=new Promise(function(o,l){r.onload=o,r.onerror=l}),_n(a,"link",i),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=Xu.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var Cd=0;function tA(e,t){return e.stylesheets&&e.count===0&&vu(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var i=setTimeout(function(){if(e.stylesheets&&vu(e,e.stylesheets),e.unsuspend){var a=e.unsuspend;e.unsuspend=null,a()}},6e4+t);0<e.imgBytes&&Cd===0&&(Cd=62500*IT());var s=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&vu(e,e.stylesheets),e.unsuspend)){var a=e.unsuspend;e.unsuspend=null,a()}},(e.imgBytes>Cd?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(i),clearTimeout(s)}}:null}function Xu(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)vu(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Wu=null;function vu(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Wu=new Map,t.forEach(eA,e),Wu=null,Xu.call(e))}function eA(e,t){if(!(t.state.loading&4)){var n=Wu.get(e);if(n)var i=n.get(null);else{n=new Map,Wu.set(e,n);for(var s=e.querySelectorAll("link[data-precedence],style[data-precedence]"),a=0;a<s.length;a++){var r=s[a];(r.nodeName==="LINK"||r.getAttribute("media")!=="not all")&&(n.set(r.dataset.precedence,r),i=r)}i&&n.set(null,i)}s=t.instance,r=s.getAttribute("data-precedence"),a=n.get(r)||i,a===i&&n.set(null,s),n.set(r,s),this.count++,i=Xu.bind(this),s.addEventListener("load",i),s.addEventListener("error",i),a?a.parentNode.insertBefore(s,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(s,e.firstChild)),t.state.loading|=4}}var Vl={$$typeof:fs,Provider:null,Consumer:null,_currentValue:Oa,_currentValue2:Oa,_threadCount:0};function nA(e,t,n,i,s,a,r,o,l){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=ed(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ed(0),this.hiddenUpdates=ed(null),this.identifierPrefix=i,this.onUncaughtError=s,this.onCaughtError=a,this.onRecoverableError=r,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=l,this.incompleteTransitions=new Map}function CM(e,t,n,i,s,a,r,o,l,c,h,d){return e=new nA(e,t,n,r,l,c,h,d,o),t=1,a===!0&&(t|=24),a=Kn(3,null,null,t),e.current=a,a.stateNode=e,t=Gp(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:i,isDehydrated:n,cache:t},Wp(a),e}function DM(e){return e?(e=Or,e):Or}function UM(e,t,n,i,s,a){s=DM(s),i.context===null?i.context=s:i.pendingContext=s,i=ta(t),i.payload={element:n},a=a===void 0?null:a,a!==null&&(i.callback=a),n=ea(e,i,t),n!==null&&(Vn(n,e,t),Ml(n,e,t))}function X_(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function vm(e,t){X_(e,t),(e=e.alternate)&&X_(e,t)}function NM(e){if(e.tag===13||e.tag===31){var t=Za(e,67108864);t!==null&&Vn(t,e,67108864),vm(e,67108864)}}function W_(e){if(e.tag===13||e.tag===31){var t=ni();t=Rp(t);var n=Za(e,t);n!==null&&Vn(n,e,t),vm(e,t)}}var qu=!0;function iA(e,t,n,i){var s=kt.T;kt.T=null;var a=pe.p;try{pe.p=2,_m(e,t,n,i)}finally{pe.p=a,kt.T=s}}function sA(e,t,n,i){var s=kt.T;kt.T=null;var a=pe.p;try{pe.p=8,_m(e,t,n,i)}finally{pe.p=a,kt.T=s}}function _m(e,t,n,i){if(qu){var s=bp(i);if(s===null)wd(e,t,i,Yu,n),q_(e,i);else if(rA(s,e,t,n,i))i.stopPropagation();else if(q_(e,i),t&4&&-1<aA.indexOf(e)){for(;s!==null;){var a=so(s);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var r=Na(a.pendingLanes);if(r!==0){var o=a;for(o.pendingLanes|=2,o.entangledLanes|=2;r;){var l=1<<31-ei(r);o.entanglements[1]|=l,r&=~l}Zi(a),(de&6)===0&&(Pu=$n()+500,$l(0,!1))}}break;case 31:case 13:o=Za(a,2),o!==null&&Vn(o,a,2),rh(),vm(a,2)}if(a=bp(i),a===null&&wd(e,t,i,Yu,n),a===s)break;s=a}s!==null&&i.stopPropagation()}else wd(e,t,i,null,n)}}function bp(e){return e=Np(e),ym(e)}var Yu=null;function ym(e){if(Yu=null,e=Cr(e),e!==null){var t=Xl(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=j_(t),e!==null)return e;e=null}else if(n===31){if(e=$_(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return Yu=e,null}function LM(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(q1()){case iy:return 2;case sy:return 8;case Su:case Y1:return 32;case ay:return 268435456;default:return 32}default:return 32}}var Ep=!1,sa=null,aa=null,ra=null,Gl=new Map,kl=new Map,qs=[],aA="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function q_(e,t){switch(e){case"focusin":case"focusout":sa=null;break;case"dragenter":case"dragleave":aa=null;break;case"mouseover":case"mouseout":ra=null;break;case"pointerover":case"pointerout":Gl.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":kl.delete(t.pointerId)}}function ul(e,t,n,i,s,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:i,nativeEvent:a,targetContainers:[s]},t!==null&&(t=so(t),t!==null&&NM(t)),e):(e.eventSystemFlags|=i,t=e.targetContainers,s!==null&&t.indexOf(s)===-1&&t.push(s),e)}function rA(e,t,n,i,s){switch(t){case"focusin":return sa=ul(sa,e,t,n,i,s),!0;case"dragenter":return aa=ul(aa,e,t,n,i,s),!0;case"mouseover":return ra=ul(ra,e,t,n,i,s),!0;case"pointerover":var a=s.pointerId;return Gl.set(a,ul(Gl.get(a)||null,e,t,n,i,s)),!0;case"gotpointercapture":return a=s.pointerId,kl.set(a,ul(kl.get(a)||null,e,t,n,i,s)),!0}return!1}function IM(e){var t=Cr(e.target);if(t!==null){var n=Xl(t);if(n!==null){if(t=n.tag,t===13){if(t=j_(n),t!==null){e.blockedOn=t,Cv(e.priority,function(){W_(n)});return}}else if(t===31){if(t=$_(n),t!==null){e.blockedOn=t,Cv(e.priority,function(){W_(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function _u(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=bp(e.nativeEvent);if(n===null){n=e.nativeEvent;var i=new n.constructor(n.type,n);Gd=i,n.target.dispatchEvent(i),Gd=null}else return t=so(n),t!==null&&NM(t),e.blockedOn=n,!1;t.shift()}return!0}function Y_(e,t,n){_u(e)&&n.delete(t)}function oA(){Ep=!1,sa!==null&&_u(sa)&&(sa=null),aa!==null&&_u(aa)&&(aa=null),ra!==null&&_u(ra)&&(ra=null),Gl.forEach(Y_),kl.forEach(Y_)}function nu(e,t){e.blockedOn===t&&(e.blockedOn=null,Ep||(Ep=!0,an.unstable_scheduleCallback(an.unstable_NormalPriority,oA)))}var iu=null;function Z_(e){iu!==e&&(iu=e,an.unstable_scheduleCallback(an.unstable_NormalPriority,function(){iu===e&&(iu=null);for(var t=0;t<e.length;t+=3){var n=e[t],i=e[t+1],s=e[t+2];if(typeof i!="function"){if(ym(i||n)===null)continue;break}var a=so(n);a!==null&&(e.splice(t,3),t-=3,sp(a,{pending:!0,data:s,method:n.method,action:i},i,s))}}))}function no(e){function t(l){return nu(l,e)}sa!==null&&nu(sa,e),aa!==null&&nu(aa,e),ra!==null&&nu(ra,e),Gl.forEach(t),kl.forEach(t);for(var n=0;n<qs.length;n++){var i=qs[n];i.blockedOn===e&&(i.blockedOn=null)}for(;0<qs.length&&(n=qs[0],n.blockedOn===null);)IM(n),n.blockedOn===null&&qs.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(i=0;i<n.length;i+=3){var s=n[i],a=n[i+1],r=s[Gn]||null;if(typeof a=="function")r||Z_(n);else if(r){var o=null;if(a&&a.hasAttribute("formAction")){if(s=a,r=a[Gn]||null)o=r.formAction;else if(ym(s)!==null)continue}else o=r.action;typeof o=="function"?n[i+1]=o:(n.splice(i,3),i-=3),Z_(n)}}}function OM(){function e(a){a.canIntercept&&a.info==="react-transition"&&a.intercept({handler:function(){return new Promise(function(r){return s=r})},focusReset:"manual",scroll:"manual"})}function t(){s!==null&&(s(),s=null),i||setTimeout(n,20)}function n(){if(!i&&!navigation.transition){var a=navigation.currentEntry;a&&a.url!=null&&navigation.navigate(a.url,{state:a.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var i=!1,s=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){i=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),s!==null&&(s(),s=null)}}}function xm(e){this._internalRoot=e}ch.prototype.render=xm.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(K(409));var n=t.current,i=ni();UM(n,i,e,t,null,null)};ch.prototype.unmount=xm.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;UM(e.current,2,null,e,null,null),rh(),t[io]=null}};function ch(e){this._internalRoot=e}ch.prototype.unstable_scheduleHydration=function(e){if(e){var t=uy();e={blockedOn:null,target:e,priority:t};for(var n=0;n<qs.length&&t!==0&&t<qs[n].priority;n++);qs.splice(n,0,e),n===0&&IM(e)}};var J_=Q_.version;if(J_!=="19.2.8")throw Error(K(527,J_,"19.2.8"));pe.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(K(188)):(e=Object.keys(e).join(","),Error(K(268,e)));return e=F1(t),e=e!==null?ty(e):null,e=e===null?null:e.stateNode,e};var lA={bundleType:0,version:"19.2.8",rendererPackageName:"react-dom",currentDispatcherRef:kt,reconcilerVersion:"19.2.8"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(hl=__REACT_DEVTOOLS_GLOBAL_HOOK__,!hl.isDisabled&&hl.supportsFiber))try{Wl=hl.inject(lA),ti=hl}catch{}var hl;uh.createRoot=function(e,t){if(!K_(e))throw Error(K(299));var n=!1,i="",s=Ax,a=wx,r=Rx;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(i=t.identifierPrefix),t.onUncaughtError!==void 0&&(s=t.onUncaughtError),t.onCaughtError!==void 0&&(a=t.onCaughtError),t.onRecoverableError!==void 0&&(r=t.onRecoverableError)),t=CM(e,1,!1,null,null,n,i,null,s,a,r,OM),e[io]=t.current,pm(e),new xm(t)};uh.hydrateRoot=function(e,t,n){if(!K_(e))throw Error(K(299));var i=!1,s="",a=Ax,r=wx,o=Rx,l=null;return n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onUncaughtError!==void 0&&(a=n.onUncaughtError),n.onCaughtError!==void 0&&(r=n.onCaughtError),n.onRecoverableError!==void 0&&(o=n.onRecoverableError),n.formState!==void 0&&(l=n.formState)),t=CM(e,1,!0,t,n??null,i,s,l,a,r,o,OM),t.context=DM(null),n=t.current,i=ni(),i=Rp(i),s=ta(i),s.callback=null,ea(n,s,i),n=i,t.current.lanes=n,Yl(t,n),Zi(t),e[io]=t.current,pm(e),new ch(t)};uh.version="19.2.8"});var FM=Hi((BD,BM)=>{"use strict";function zM(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(zM)}catch(e){console.error(e)}}zM(),BM.exports=PM()});var VM=Hi(hh=>{"use strict";var cA=Symbol.for("react.transitional.element"),uA=Symbol.for("react.fragment");function HM(e,t,n){var i=null;if(n!==void 0&&(i=""+n),t.key!==void 0&&(i=""+t.key),"key"in t){n={};for(var s in t)s!=="key"&&(n[s]=t[s])}else n=t;return t=n.ref,{$$typeof:cA,type:e,key:i,ref:t!==void 0?t:null,props:n}}hh.Fragment=uA;hh.jsx=HM;hh.jsxs=HM});var Es=Hi((GD,GM)=>{"use strict";GM.exports=VM()});function Ls(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Sn[e&255]+Sn[e>>8&255]+Sn[e>>16&255]+Sn[e>>24&255]+"-"+Sn[t&255]+Sn[t>>8&255]+"-"+Sn[t>>16&15|64]+Sn[t>>24&255]+"-"+Sn[n&63|128]+Sn[n>>8&255]+"-"+Sn[n>>16&255]+Sn[n>>24&255]+Sn[i&255]+Sn[i>>8&255]+Sn[i>>16&255]+Sn[i>>24&255]).toLowerCase()}function yn(e,t,n){return Math.max(t,Math.min(n,e))}function WA(e,t){return(e%t+t)%t}function Em(e,t,n){return(1-n)*e+n*t}function Qi(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw new Error("Invalid component type.")}}function Te(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw new Error("Invalid component type.")}}function vb(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Zh(e){return document.createElementNS("http://www.w3.org/1999/xhtml",e)}function qA(){let e=Zh("canvas");return e.style.display="block",e}function hc(e){e in nS||(nS[e]=!0,console.warn(e))}function YA(e,t,n){return new Promise(function(i,s){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:s();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:i()}}setTimeout(a,n)})}function ZA(e){let t=e.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function JA(e){let t=e.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}function Is(e){return e<.04045?e*.0773993808:Math.pow(e*.9478672986+.0521327014,2.4)}function Lo(e){return e<.0031308?e*12.92:1.055*Math.pow(e,.41666)-.055}function Am(e){return typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap?kg.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}function Rm(e,t,n,i,s){for(let a=0,r=e.length-3;a<=r;a+=3){Ka.fromArray(e,a);let o=s.x*Math.abs(Ka.x)+s.y*Math.abs(Ka.y)+s.z*Math.abs(Ka.z),l=t.dot(Ka),c=n.dot(Ka),h=i.dot(Ka);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}function Vm(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}function ow(e,t,n,i,s,a,r,o){let l;if(t.side===En?l=i.intersectTriangle(r,a,s,!0,o):l=i.intersectTriangle(s,a,r,t.side===ba,o),l===null)return null;wh.copy(o),wh.applyMatrix4(e.matrixWorld);let c=n.ray.origin.distanceTo(wh);return c<n.near||c>n.far?null:{distance:c,point:wh.clone(),object:e}}function Rh(e,t,n,i,s,a,r,o,l,c){e.getVertexPosition(o,bh),e.getVertexPosition(l,Eh),e.getVertexPosition(c,Th);let h=ow(e,t,n,i,bh,Eh,Th,yS);if(h){let d=new N;xa.getBarycoord(yS,bh,Eh,Th,d),s&&(h.uv=xa.getInterpolatedAttribute(s,o,l,c,d,new ct)),a&&(h.uv1=xa.getInterpolatedAttribute(a,o,l,c,d,new ct)),r&&(h.normal=xa.getInterpolatedAttribute(r,o,l,c,d,new N),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let f={a:o,b:l,c,normal:new N,materialIndex:0};xa.getNormal(bh,Eh,Th,f.normal),h.face=f,h.barycoord=d}return h}function Vo(e){let t={};for(let n in e){t[n]={};for(let i in e[n]){let s=e[n][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[n][i]=null):t[n][i]=s.clone():Array.isArray(s)?t[n][i]=s.slice():t[n][i]=s}}return t}function Nn(e){let t={};for(let n=0;n<e.length;n++){let i=Vo(e[n]);for(let s in i)t[s]=i[s]}return t}function lw(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function yb(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ce.workingColorSpace}function xb(){let e=null,t=!1,n=null,i=null;function s(a,r){n(a,r),i=e.requestAnimationFrame(s)}return{start:function(){t!==!0&&n!==null&&(i=e.requestAnimationFrame(s),t=!0)},stop:function(){e.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(a){n=a},setContext:function(a){e=a}}}function dw(e){let t=new WeakMap;function n(o,l){let c=o.array,h=o.usage,d=c.byteLength,f=e.createBuffer();e.bindBuffer(l,f),e.bufferData(l,c,h),o.onUploadCallback();let p;if(c instanceof Float32Array)p=e.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=e.HALF_FLOAT:p=e.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=e.SHORT;else if(c instanceof Uint32Array)p=e.UNSIGNED_INT;else if(c instanceof Int32Array)p=e.INT;else if(c instanceof Int8Array)p=e.BYTE;else if(c instanceof Uint8Array)p=e.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function i(o,l,c){let h=l.array,d=l.updateRanges;if(e.bindBuffer(c,o),d.length===0)e.bufferSubData(c,0,h);else{d.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<d.length;p++){let g=d[f],M=d[p];M.start<=g.start+g.count+1?g.count=Math.max(g.count,M.start+M.count-g.start):(++f,d[f]=M)}d.length=f+1;for(let p=0,g=d.length;p<g;p++){let M=d[p];e.bufferSubData(c,M.start*h.BYTES_PER_ELEMENT,h,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(e.deleteBuffer(l.buffer),t.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,n(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:a,update:r}}function ZR(e,t,n,i,s,a,r){let o=new qt(0),l=a===!0?0:1,c,h,d=null,f=0,p=null;function g(y){let _=y.isScene===!0?y.background:null;return _&&_.isTexture&&(_=(y.backgroundBlurriness>0?n:t).get(_)),_}function M(y){let _=!1,v=g(y);v===null?u(o,l):v&&v.isColor&&(u(v,1),_=!0);let R=e.xr.getEnvironmentBlendMode();R==="additive"?i.buffers.color.setClear(0,0,0,1,r):R==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,r),(e.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function m(y,_){let v=g(_);v&&(v.isCubeTexture||v.mapping===Sf)?(h===void 0&&(h=new Zt(new On(1,1,1),new Ye({name:"BackgroundCubeMaterial",uniforms:Vo(Ji.backgroundCube.uniforms),vertexShader:Ji.backgroundCube.vertexShader,fragmentShader:Ji.backgroundCube.fragmentShader,side:En,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,w,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),tr.copy(_.backgroundRotation),tr.x*=-1,tr.y*=-1,tr.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(tr.y*=-1,tr.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(YR.makeRotationFromEuler(tr)),h.material.toneMapped=ce.getTransfer(v.colorSpace)!==ye,(d!==v||f!==v.version||p!==e.toneMapping)&&(h.material.needsUpdate=!0,d=v,f=v.version,p=e.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new Zt(new Pi(2,2),new Ye({name:"BackgroundMaterial",uniforms:Vo(Ji.background.uniforms),vertexShader:Ji.background.vertexShader,fragmentShader:Ji.background.fragmentShader,side:ba,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=ce.getTransfer(v.colorSpace)!==ye,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(d!==v||f!==v.version||p!==e.toneMapping)&&(c.material.needsUpdate=!0,d=v,f=v.version,p=e.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function u(y,_){y.getRGB(Dh,yb(e)),i.buffers.color.setClear(Dh.r,Dh.g,Dh.b,_,r)}return{getClearColor:function(){return o},setClearColor:function(y,_=1){o.set(y),l=_,u(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,u(o,l)},render:M,addToRenderList:m}}function JR(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},s=f(null),a=s,r=!1;function o(S,U,F,P,z){let Y=!1,G=d(P,F,U);a!==G&&(a=G,c(a.object)),Y=p(S,P,F,z),Y&&g(S,P,F,z),z!==null&&t.update(z,e.ELEMENT_ARRAY_BUFFER),(Y||r)&&(r=!1,v(S,U,F,P),z!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function l(){return e.createVertexArray()}function c(S){return e.bindVertexArray(S)}function h(S){return e.deleteVertexArray(S)}function d(S,U,F){let P=F.wireframe===!0,z=i[S.id];z===void 0&&(z={},i[S.id]=z);let Y=z[U.id];Y===void 0&&(Y={},z[U.id]=Y);let G=Y[P];return G===void 0&&(G=f(l()),Y[P]=G),G}function f(S){let U=[],F=[],P=[];for(let z=0;z<n;z++)U[z]=0,F[z]=0,P[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:F,attributeDivisors:P,object:S,attributes:{},index:null}}function p(S,U,F,P){let z=a.attributes,Y=U.attributes,G=0,j=F.getAttributes();for(let H in j)if(j[H].location>=0){let vt=z[H],yt=Y[H];if(yt===void 0&&(H==="instanceMatrix"&&S.instanceMatrix&&(yt=S.instanceMatrix),H==="instanceColor"&&S.instanceColor&&(yt=S.instanceColor)),vt===void 0||vt.attribute!==yt||yt&&vt.data!==yt.data)return!0;G++}return a.attributesNum!==G||a.index!==P}function g(S,U,F,P){let z={},Y=U.attributes,G=0,j=F.getAttributes();for(let H in j)if(j[H].location>=0){let vt=Y[H];vt===void 0&&(H==="instanceMatrix"&&S.instanceMatrix&&(vt=S.instanceMatrix),H==="instanceColor"&&S.instanceColor&&(vt=S.instanceColor));let yt={};yt.attribute=vt,vt&&vt.data&&(yt.data=vt.data),z[H]=yt,G++}a.attributes=z,a.attributesNum=G,a.index=P}function M(){let S=a.newAttributes;for(let U=0,F=S.length;U<F;U++)S[U]=0}function m(S){u(S,0)}function u(S,U){let F=a.newAttributes,P=a.enabledAttributes,z=a.attributeDivisors;F[S]=1,P[S]===0&&(e.enableVertexAttribArray(S),P[S]=1),z[S]!==U&&(e.vertexAttribDivisor(S,U),z[S]=U)}function y(){let S=a.newAttributes,U=a.enabledAttributes;for(let F=0,P=U.length;F<P;F++)U[F]!==S[F]&&(e.disableVertexAttribArray(F),U[F]=0)}function _(S,U,F,P,z,Y,G){G===!0?e.vertexAttribIPointer(S,U,F,z,Y):e.vertexAttribPointer(S,U,F,P,z,Y)}function v(S,U,F,P){M();let z=P.attributes,Y=F.getAttributes(),G=U.defaultAttributeValues;for(let j in Y){let H=Y[j];if(H.location>=0){let ut=z[j];if(ut===void 0&&(j==="instanceMatrix"&&S.instanceMatrix&&(ut=S.instanceMatrix),j==="instanceColor"&&S.instanceColor&&(ut=S.instanceColor)),ut!==void 0){let vt=ut.normalized,yt=ut.itemSize,Ft=t.get(ut);if(Ft===void 0)continue;let Nt=Ft.buffer,W=Ft.type,it=Ft.bytesPerElement,mt=W===e.INT||W===e.UNSIGNED_INT||ut.gpuType===L0;if(ut.isInterleavedBufferAttribute){let tt=ut.data,Et=tt.stride,gt=ut.offset;if(tt.isInstancedInterleavedBuffer){for(let wt=0;wt<H.locationSize;wt++)u(H.location+wt,tt.meshPerAttribute);S.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let wt=0;wt<H.locationSize;wt++)m(H.location+wt);e.bindBuffer(e.ARRAY_BUFFER,Nt);for(let wt=0;wt<H.locationSize;wt++)_(H.location+wt,yt/H.locationSize,W,vt,Et*it,(gt+yt/H.locationSize*wt)*it,mt)}else{if(ut.isInstancedBufferAttribute){for(let tt=0;tt<H.locationSize;tt++)u(H.location+tt,ut.meshPerAttribute);S.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=ut.meshPerAttribute*ut.count)}else for(let tt=0;tt<H.locationSize;tt++)m(H.location+tt);e.bindBuffer(e.ARRAY_BUFFER,Nt);for(let tt=0;tt<H.locationSize;tt++)_(H.location+tt,yt/H.locationSize,W,vt,yt*it,yt/H.locationSize*tt*it,mt)}}else if(G!==void 0){let vt=G[j];if(vt!==void 0)switch(vt.length){case 2:e.vertexAttrib2fv(H.location,vt);break;case 3:e.vertexAttrib3fv(H.location,vt);break;case 4:e.vertexAttrib4fv(H.location,vt);break;default:e.vertexAttrib1fv(H.location,vt)}}}}y()}function R(){C();for(let S in i){let U=i[S];for(let F in U){let P=U[F];for(let z in P)h(P[z].object),delete P[z];delete U[F]}delete i[S]}}function w(S){if(i[S.id]===void 0)return;let U=i[S.id];for(let F in U){let P=U[F];for(let z in P)h(P[z].object),delete P[z];delete U[F]}delete i[S.id]}function A(S){for(let U in i){let F=i[U];if(F[S.id]===void 0)continue;let P=F[S.id];for(let z in P)h(P[z].object),delete P[z];delete F[S.id]}}function C(){b(),r=!0,a!==s&&(a=s,c(a.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:C,resetDefaultState:b,dispose:R,releaseStatesOfGeometry:w,releaseStatesOfProgram:A,initAttributes:M,enableAttribute:m,disableUnusedAttributes:y}}function QR(e,t,n){let i;function s(c){i=c}function a(c,h){e.drawArrays(i,c,h),n.update(h,i,1)}function r(c,h,d){d!==0&&(e.drawArraysInstanced(i,c,h,d),n.update(h,i,d))}function o(c,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,d);let p=0;for(let g=0;g<d;g++)p+=h[g];n.update(p,i,1)}function l(c,h,d,f){if(d===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)r(c[g],h[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,h,0,f,0,d);let g=0;for(let M=0;M<d;M++)g+=h[M]*f[M];n.update(g,i,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function KR(e,t,n,i){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let A=t.get("EXT_texture_filter_anisotropic");s=e.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(A){return!(A!==Oi&&i.convert(A)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){let C=A===ci&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Os&&i.convert(A)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==ji&&!C)}function l(A){if(A==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=n.logarithmicDepthBuffer===!0,f=n.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),g=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=e.getParameter(e.MAX_TEXTURE_SIZE),m=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),u=e.getParameter(e.MAX_VERTEX_ATTRIBS),y=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),_=e.getParameter(e.MAX_VARYING_VECTORS),v=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),R=g>0,w=e.getParameter(e.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:M,maxCubemapSize:m,maxAttributes:u,maxVertexUniforms:y,maxVaryings:_,maxFragmentUniforms:v,vertexTextures:R,maxSamples:w}}function jR(e){let t=this,n=null,i=0,s=!1,a=!1,r=new Us,o=new te,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){let p=d.length!==0||f||i!==0||s;return s=f,i=d.length,p},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(d,f){n=h(d,f,0)},this.setState=function(d,f,p){let g=d.clippingPlanes,M=d.clipIntersection,m=d.clipShadows,u=e.get(d);if(!s||g===null||g.length===0||a&&!m)a?h(null):c();else{let y=a?0:i,_=y*4,v=u.clippingState||null;l.value=v,v=h(g,f,_,p);for(let R=0;R!==_;++R)v[R]=n[R];u.clippingState=v,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(d,f,p,g){let M=d!==null?d.length:0,m=null;if(M!==0){if(m=l.value,g!==!0||m===null){let u=p+M*4,y=f.matrixWorldInverse;o.getNormalMatrix(y),(m===null||m.length<u)&&(m=new Float32Array(u));for(let _=0,v=p;_!==M;++_,v+=4)r.copy(d[_]).applyMatrix4(y,o),r.normal.toArray(m,v),m[v+3]=r.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=M,t.numIntersection=0,m}}function $R(e){let t=new WeakMap;function n(r,o){return o===hg?r.mapping=Po:o===fg&&(r.mapping=zo),r}function i(r){if(r&&r.isTexture){let o=r.mapping;if(o===hg||o===fg)if(t.has(r)){let l=t.get(r).texture;return n(l,r.mapping)}else{let l=r.image;if(l&&l.height>0){let c=new Zg(l.height);return c.fromEquirectangularTexture(e,r),t.set(r,c),r.addEventListener("dispose",s),n(c.texture,r.mapping)}else return null}}return r}function s(r){let o=r.target;o.removeEventListener("dispose",s);let l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function a(){t=new WeakMap}return{get:i,dispose:a}}function tC(e){let t=[],n=[],i=[],s=e,a=e-Do+1+SS.length;for(let r=0;r<a;r++){let o=Math.pow(2,s);n.push(o);let l=1/o;r>e-Do?l=SS[r-e+Do-1]:r===0&&(l=0),i.push(l);let c=1/(o-2),h=-c,d=1+c,f=[h,h,d,h,d,d,h,h,d,d,h,d],p=6,g=6,M=3,m=2,u=1,y=new Float32Array(M*g*p),_=new Float32Array(m*g*p),v=new Float32Array(u*g*p);for(let w=0;w<p;w++){let A=w%3*2/3-1,C=w>2?0:-1,b=[A,C,0,A+2/3,C,0,A+2/3,C+1,0,A,C,0,A+2/3,C+1,0,A,C+1,0];y.set(b,M*g*w),_.set(f,m*g*w);let S=[w,w,w,w,w,w];v.set(S,u*g*w)}let R=new rn;R.setAttribute("position",new Tn(y,M)),R.setAttribute("uv",new Tn(_,m)),R.setAttribute("faceIndex",new Tn(v,u)),t.push(R),s>Do&&s--}return{lodPlanes:t,sizeLods:n,sigmas:i}}function TS(e,t,n){let i=new xn(e,t,n);return i.texture.mapping=Sf,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Uh(e,t,n,i,s){e.viewport.set(t,n,i,s),e.scissor.set(t,n,i,s)}function eC(e,t,n){let i=new Float32Array(sr),s=new N(0,1,0);return new Ye({name:"SphericalGaussianBlur",defines:{n:sr,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:H0(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:$i,depthTest:!1,depthWrite:!1})}function AS(){return new Ye({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:H0(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:$i,depthTest:!1,depthWrite:!1})}function wS(){return new Ye({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:H0(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:$i,depthTest:!1,depthWrite:!1})}function H0(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function nC(e){let t=new WeakMap,n=null;function i(o){if(o&&o.isTexture){let l=o.mapping,c=l===hg||l===fg,h=l===Po||l===zo;if(c||h){let d=t.get(o),f=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return n===null&&(n=new ko(e)),d=c?n.fromEquirectangular(o,d):n.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,t.set(o,d),d.texture;if(d!==void 0)return d.texture;{let p=o.image;return c&&p&&p.height>0||h&&p&&s(p)?(n===null&&(n=new ko(e)),d=c?n.fromEquirectangular(o):n.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,t.set(o,d),o.addEventListener("dispose",a),d.texture):null}}}return o}function s(o){let l=0,c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function a(o){let l=o.target;l.removeEventListener("dispose",a);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function r(){t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:r}}function iC(e){let t={};function n(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=e.getExtension("WEBGL_depth_texture")||e.getExtension("MOZ_WEBGL_depth_texture")||e.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=e.getExtension("EXT_texture_filter_anisotropic")||e.getExtension("MOZ_EXT_texture_filter_anisotropic")||e.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=e.getExtension("WEBGL_compressed_texture_s3tc")||e.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=e.getExtension("WEBGL_compressed_texture_pvrtc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=e.getExtension(i)}return t[i]=s,s}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){let s=n(i);return s===null&&hc("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function sC(e,t,n,i){let s={},a=new WeakMap;function r(d){let f=d.target;f.index!==null&&t.remove(f.index);for(let g in f.attributes)t.remove(f.attributes[g]);for(let g in f.morphAttributes){let M=f.morphAttributes[g];for(let m=0,u=M.length;m<u;m++)t.remove(M[m])}f.removeEventListener("dispose",r),delete s[f.id];let p=a.get(f);p&&(t.remove(p),a.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,n.memory.geometries--}function o(d,f){return s[f.id]===!0||(f.addEventListener("dispose",r),s[f.id]=!0,n.memory.geometries++),f}function l(d){let f=d.attributes;for(let g in f)t.update(f[g],e.ARRAY_BUFFER);let p=d.morphAttributes;for(let g in p){let M=p[g];for(let m=0,u=M.length;m<u;m++)t.update(M[m],e.ARRAY_BUFFER)}}function c(d){let f=[],p=d.index,g=d.attributes.position,M=0;if(p!==null){let y=p.array;M=p.version;for(let _=0,v=y.length;_<v;_+=3){let R=y[_+0],w=y[_+1],A=y[_+2];f.push(R,w,w,A,A,R)}}else if(g!==void 0){let y=g.array;M=g.version;for(let _=0,v=y.length/3-1;_<v;_+=3){let R=_+0,w=_+1,A=_+2;f.push(R,w,w,A,A,R)}}else return;let m=new(vb(f)?$h:jh)(f,1);m.version=M;let u=a.get(d);u&&t.remove(u),a.set(d,m)}function h(d){let f=a.get(d);if(f){let p=d.index;p!==null&&f.version<p.version&&c(d)}else c(d);return a.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function aC(e,t,n){let i;function s(f){i=f}let a,r;function o(f){a=f.type,r=f.bytesPerElement}function l(f,p){e.drawElements(i,p,a,f*r),n.update(p,i,1)}function c(f,p,g){g!==0&&(e.drawElementsInstanced(i,p,a,f*r,g),n.update(p,i,g))}function h(f,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,a,f,0,g);let m=0;for(let u=0;u<g;u++)m+=p[u];n.update(m,i,1)}function d(f,p,g,M){if(g===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let u=0;u<f.length;u++)c(f[u]/r,p[u],M[u]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,a,f,0,M,0,g);let u=0;for(let y=0;y<g;y++)u+=p[y]*M[y];n.update(u,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function rC(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=o*(a/3);break;case e.LINES:n.lines+=o*(a/2);break;case e.LINE_STRIP:n.lines+=o*(a-1);break;case e.LINE_LOOP:n.lines+=o*a;break;case e.POINTS:n.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:s,update:i}}function oC(e,t,n){let i=new WeakMap,s=new Xe;function a(r,o,l){let c=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0,f=i.get(o);if(f===void 0||f.count!==d){let b=function(){A.dispose(),i.delete(o),o.removeEventListener("dispose",b)};f!==void 0&&f.texture.dispose();let p=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,M=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],u=o.morphAttributes.normal||[],y=o.morphAttributes.color||[],_=0;p===!0&&(_=1),g===!0&&(_=2),M===!0&&(_=3);let v=o.attributes.position.count*_,R=1;v>t.maxTextureSize&&(R=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let w=new Float32Array(v*R*4*d),A=new Qh(w,v,R,d);A.type=ji,A.needsUpdate=!0;let C=_*4;for(let S=0;S<d;S++){let U=m[S],F=u[S],P=y[S],z=v*R*4*S;for(let Y=0;Y<U.count;Y++){let G=Y*C;p===!0&&(s.fromBufferAttribute(U,Y),w[z+G+0]=s.x,w[z+G+1]=s.y,w[z+G+2]=s.z,w[z+G+3]=0),g===!0&&(s.fromBufferAttribute(F,Y),w[z+G+4]=s.x,w[z+G+5]=s.y,w[z+G+6]=s.z,w[z+G+7]=0),M===!0&&(s.fromBufferAttribute(P,Y),w[z+G+8]=s.x,w[z+G+9]=s.y,w[z+G+10]=s.z,w[z+G+11]=P.itemSize===4?s.w:1)}}f={count:d,texture:A,size:new ct(v,R)},i.set(o,f),o.addEventListener("dispose",b)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(e,"morphTexture",r.morphTexture,n);else{let p=0;for(let M=0;M<c.length;M++)p+=c[M];let g=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(e,"morphTargetBaseInfluence",g),l.getUniforms().setValue(e,"morphTargetInfluences",c)}l.getUniforms().setValue(e,"morphTargetsTexture",f.texture,n),l.getUniforms().setValue(e,"morphTargetsTextureSize",f.size)}return{update:a}}function lC(e,t,n,i){let s=new WeakMap;function a(l){let c=i.render.frame,h=l.geometry,d=t.get(l,h);if(s.get(d)!==c&&(t.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(n.update(l.instanceMatrix,e.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,e.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return d}function r(){s=new WeakMap}function o(l){let c=l.target;c.removeEventListener("dispose",o),n.remove(c.instanceMatrix),c.instanceColor!==null&&n.remove(c.instanceColor)}return{update:a,dispose:r}}function Yo(e,t,n){let i=e[0];if(i<=0||i>0)return e;let s=t*n,a=CS[s];if(a===void 0&&(a=new Float32Array(s),CS[s]=a),t!==0){i.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=n,e[r].toArray(a,o)}return a}function on(e,t){if(e.length!==t.length)return!1;for(let n=0,i=e.length;n<i;n++)if(e[n]!==t[n])return!1;return!0}function ln(e,t){for(let n=0,i=t.length;n<i;n++)e[n]=t[n]}function Ef(e,t){let n=DS[t];n===void 0&&(n=new Int32Array(t),DS[t]=n);for(let i=0;i!==t;++i)n[i]=e.allocateTextureUnit();return n}function cC(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function uC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(on(n,t))return;e.uniform2fv(this.addr,t),ln(n,t)}}function hC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(on(n,t))return;e.uniform3fv(this.addr,t),ln(n,t)}}function fC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(on(n,t))return;e.uniform4fv(this.addr,t),ln(n,t)}}function dC(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(on(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),ln(n,t)}else{if(on(n,i))return;LS.set(i),e.uniformMatrix2fv(this.addr,!1,LS),ln(n,i)}}function pC(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(on(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),ln(n,t)}else{if(on(n,i))return;NS.set(i),e.uniformMatrix3fv(this.addr,!1,NS),ln(n,i)}}function mC(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(on(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),ln(n,t)}else{if(on(n,i))return;US.set(i),e.uniformMatrix4fv(this.addr,!1,US),ln(n,i)}}function gC(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function vC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(on(n,t))return;e.uniform2iv(this.addr,t),ln(n,t)}}function _C(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(on(n,t))return;e.uniform3iv(this.addr,t),ln(n,t)}}function yC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(on(n,t))return;e.uniform4iv(this.addr,t),ln(n,t)}}function xC(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function MC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(on(n,t))return;e.uniform2uiv(this.addr,t),ln(n,t)}}function SC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(on(n,t))return;e.uniform3uiv(this.addr,t),ln(n,t)}}function bC(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(on(n,t))return;e.uniform4uiv(this.addr,t),ln(n,t)}}function EC(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s);let a;this.type===e.SAMPLER_2D_SHADOW?(RS.compareFunction=gb,a=RS):a=Mb,n.setTexture2D(t||a,s)}function TC(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTexture3D(t||bb,s)}function AC(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTextureCube(t||Eb,s)}function wC(e,t,n){let i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(e.uniform1i(this.addr,s),i[0]=s),n.setTexture2DArray(t||Sb,s)}function RC(e){switch(e){case 5126:return cC;case 35664:return uC;case 35665:return hC;case 35666:return fC;case 35674:return dC;case 35675:return pC;case 35676:return mC;case 5124:case 35670:return gC;case 35667:case 35671:return vC;case 35668:case 35672:return _C;case 35669:case 35673:return yC;case 5125:return xC;case 36294:return MC;case 36295:return SC;case 36296:return bC;case 35678:case 36198:case 36298:case 36306:case 35682:return EC;case 35679:case 36299:case 36307:return TC;case 35680:case 36300:case 36308:case 36293:return AC;case 36289:case 36303:case 36311:case 36292:return wC}}function CC(e,t){e.uniform1fv(this.addr,t)}function DC(e,t){let n=Yo(t,this.size,2);e.uniform2fv(this.addr,n)}function UC(e,t){let n=Yo(t,this.size,3);e.uniform3fv(this.addr,n)}function NC(e,t){let n=Yo(t,this.size,4);e.uniform4fv(this.addr,n)}function LC(e,t){let n=Yo(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function IC(e,t){let n=Yo(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function OC(e,t){let n=Yo(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function PC(e,t){e.uniform1iv(this.addr,t)}function zC(e,t){e.uniform2iv(this.addr,t)}function BC(e,t){e.uniform3iv(this.addr,t)}function FC(e,t){e.uniform4iv(this.addr,t)}function HC(e,t){e.uniform1uiv(this.addr,t)}function VC(e,t){e.uniform2uiv(this.addr,t)}function GC(e,t){e.uniform3uiv(this.addr,t)}function kC(e,t){e.uniform4uiv(this.addr,t)}function XC(e,t,n){let i=this.cache,s=t.length,a=Ef(n,s);on(i,a)||(e.uniform1iv(this.addr,a),ln(i,a));for(let r=0;r!==s;++r)n.setTexture2D(t[r]||Mb,a[r])}function WC(e,t,n){let i=this.cache,s=t.length,a=Ef(n,s);on(i,a)||(e.uniform1iv(this.addr,a),ln(i,a));for(let r=0;r!==s;++r)n.setTexture3D(t[r]||bb,a[r])}function qC(e,t,n){let i=this.cache,s=t.length,a=Ef(n,s);on(i,a)||(e.uniform1iv(this.addr,a),ln(i,a));for(let r=0;r!==s;++r)n.setTextureCube(t[r]||Eb,a[r])}function YC(e,t,n){let i=this.cache,s=t.length,a=Ef(n,s);on(i,a)||(e.uniform1iv(this.addr,a),ln(i,a));for(let r=0;r!==s;++r)n.setTexture2DArray(t[r]||Sb,a[r])}function ZC(e){switch(e){case 5126:return CC;case 35664:return DC;case 35665:return UC;case 35666:return NC;case 35674:return LC;case 35675:return IC;case 35676:return OC;case 5124:case 35670:return PC;case 35667:case 35671:return zC;case 35668:case 35672:return BC;case 35669:case 35673:return FC;case 5125:return HC;case 36294:return VC;case 36295:return GC;case 36296:return kC;case 35678:case 36198:case 36298:case 36306:case 35682:return XC;case 35679:case 36299:case 36307:return WC;case 35680:case 36300:case 36308:case 36293:return qC;case 36289:case 36303:case 36311:case 36292:return YC}}function IS(e,t){e.seq.push(t),e.map[t.id]=t}function JC(e,t,n){let i=e.name,s=i.length;for(Qm.lastIndex=0;;){let a=Qm.exec(i),r=Qm.lastIndex,o=a[1],l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===s){IS(n,c===void 0?new Jg(o,e,t):new Qg(o,e,t));break}else{let d=n.map[o];d===void 0&&(d=new Kg(o),IS(n,d)),n=d}}}function OS(e,t,n){let i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),i}function jC(e,t){let n=e.split(`
`),i=[],s=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let r=s;r<a;r++){let o=r+1;i.push(`${o===t?">":" "} ${o}: ${n[r]}`)}return i.join(`
`)}function $C(e){ce._getMatrix(PS,ce.workingColorSpace,e);let t=`mat3( ${PS.elements.map(n=>n.toFixed(4))} )`;switch(ce.getTransfer(e)){case bf:return[t,"LinearTransferOETF"];case ye:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}function zS(e,t,n){let i=e.getShaderParameter(t,e.COMPILE_STATUS),s=e.getShaderInfoLog(t).trim();if(i&&s==="")return"";let a=/ERROR: 0:(\d+)/.exec(s);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+s+`

`+jC(e.getShaderSource(t),r)}else return s}function t3(e,t){let n=$C(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}function e3(e,t){let n;switch(t){case R0:n="Linear";break;case C0:n="Reinhard";break;case D0:n="Cineon";break;case Dc:n="ACESFilmic";break;case U0:n="AgX";break;case N0:n="Neutral";break;case LA:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),n="Linear"}return"vec3 "+e+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}function n3(){ce.getLuminanceCoefficients(Nh);let e=Nh.x.toFixed(4),t=Nh.y.toFixed(4),n=Nh.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${t}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function i3(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(fc).join(`
`)}function s3(e){let t=[];for(let n in e){let i=e[n];i!==!1&&t.push("#define "+n+" "+i)}return t.join(`
`)}function a3(e,t){let n={},i=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let a=e.getActiveAttrib(t,s),r=a.name,o=1;a.type===e.FLOAT_MAT2&&(o=2),a.type===e.FLOAT_MAT3&&(o=3),a.type===e.FLOAT_MAT4&&(o=4),n[r]={type:a.type,location:e.getAttribLocation(t,r),locationSize:o}}return n}function fc(e){return e!==""}function BS(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function FS(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}function jg(e){return e.replace(r3,l3)}function l3(e,t){let n=ee[t];if(n===void 0){let i=o3.get(t);if(i!==void 0)n=ee[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return jg(n)}function HS(e){return e.replace(c3,u3)}function u3(e,t,n,i){let s="";for(let a=parseInt(t);a<parseInt(n);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function VS(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision==="highp"?t+=`
#define HIGH_PRECISION`:e.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function h3(e){let t="SHADOWMAP_TYPE_BASIC";return e.shadowMapType===ib?t="SHADOWMAP_TYPE_PCF":e.shadowMapType===w0?t="SHADOWMAP_TYPE_PCF_SOFT":e.shadowMapType===Ds&&(t="SHADOWMAP_TYPE_VSM"),t}function f3(e){let t="ENVMAP_TYPE_CUBE";if(e.envMap)switch(e.envMapMode){case Po:case zo:t="ENVMAP_TYPE_CUBE";break;case Sf:t="ENVMAP_TYPE_CUBE_UV";break}return t}function d3(e){let t="ENVMAP_MODE_REFLECTION";if(e.envMap)switch(e.envMapMode){case zo:t="ENVMAP_MODE_REFRACTION";break}return t}function p3(e){let t="ENVMAP_BLENDING_NONE";if(e.envMap)switch(e.combine){case sb:t="ENVMAP_BLENDING_MULTIPLY";break;case UA:t="ENVMAP_BLENDING_MIX";break;case NA:t="ENVMAP_BLENDING_ADD";break}return t}function m3(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function g3(e,t,n,i){let s=e.getContext(),a=n.defines,r=n.vertexShader,o=n.fragmentShader,l=h3(n),c=f3(n),h=d3(n),d=p3(n),f=m3(n),p=i3(n),g=s3(a),M=s.createProgram(),m,u,y=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(fc).join(`
`),m.length>0&&(m+=`
`),u=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(fc).join(`
`),u.length>0&&(u+=`
`)):(m=[VS(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+h:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(fc).join(`
`),u=[VS(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+h:"",n.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Sa?"#define TONE_MAPPING":"",n.toneMapping!==Sa?ee.tonemapping_pars_fragment:"",n.toneMapping!==Sa?e3("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",ee.colorspace_pars_fragment,t3("linearToOutputTexel",n.outputColorSpace),n3(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(fc).join(`
`)),r=jg(r),r=BS(r,n),r=FS(r,n),o=jg(o),o=BS(o,n),o=FS(o,n),r=HS(r),o=HS(o),n.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,u=["#define varying in",n.glslVersion===eS?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===eS?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);let _=y+m+r,v=y+u+o,R=OS(s,s.VERTEX_SHADER,_),w=OS(s,s.FRAGMENT_SHADER,v);s.attachShader(M,R),s.attachShader(M,w),n.index0AttributeName!==void 0?s.bindAttribLocation(M,0,n.index0AttributeName):n.morphTargets===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function A(U){if(e.debug.checkShaderErrors){let F=s.getProgramInfoLog(M).trim(),P=s.getShaderInfoLog(R).trim(),z=s.getShaderInfoLog(w).trim(),Y=!0,G=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(Y=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(s,M,R,w);else{let j=zS(s,R,"vertex"),H=zS(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+U.name+`
Material Type: `+U.type+`

Program Info Log: `+F+`
`+j+`
`+H)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(P===""||z==="")&&(G=!1);G&&(U.diagnostics={runnable:Y,programLog:F,vertexShader:{log:P,prefix:m},fragmentShader:{log:z,prefix:u}})}s.deleteShader(R),s.deleteShader(w),C=new Io(s,M),b=a3(s,M)}let C;this.getUniforms=function(){return C===void 0&&A(this),C};let b;this.getAttributes=function(){return b===void 0&&A(this),b};let S=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(M,QC)),S},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=KC++,this.cacheKey=t,this.usedTimes=1,this.program=M,this.vertexShader=R,this.fragmentShader=w,this}function _3(e,t,n,i,s,a,r){let o=new Kh,l=new $g,c=new Set,h=[],d=s.logarithmicDepthBuffer,f=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,S,U,F,P){let z=F.fog,Y=P.geometry,G=b.isMeshStandardMaterial?F.environment:null,j=(b.isMeshStandardMaterial?n:t).get(b.envMap||G),H=j&&j.mapping===Sf?j.image.height:null,ut=g[b.type];b.precision!==null&&(p=s.getMaxPrecision(b.precision),p!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",p,"instead."));let vt=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,yt=vt!==void 0?vt.length:0,Ft=0;Y.morphAttributes.position!==void 0&&(Ft=1),Y.morphAttributes.normal!==void 0&&(Ft=2),Y.morphAttributes.color!==void 0&&(Ft=3);let Nt,W,it,mt;if(ut){let ue=Ji[ut];Nt=ue.vertexShader,W=ue.fragmentShader}else Nt=b.vertexShader,W=b.fragmentShader,l.update(b),it=l.getVertexShaderID(b),mt=l.getFragmentShaderID(b);let tt=e.getRenderTarget(),Et=e.state.buffers.depth.getReversed(),gt=P.isInstancedMesh===!0,wt=P.isBatchedMesh===!0,Ht=!!b.map,Q=!!b.matcap,ot=!!j,D=!!b.aoMap,ft=!!b.lightMap,at=!!b.bumpMap,rt=!!b.normalMap,$=!!b.displacementMap,Rt=!!b.emissiveMap,dt=!!b.metalnessMap,T=!!b.roughnessMap,x=b.anisotropy>0,B=b.clearcoat>0,Z=b.dispersion>0,st=b.iridescence>0,J=b.sheen>0,Lt=b.transmission>0,xt=x&&!!b.anisotropyMap,Tt=B&&!!b.clearcoatMap,Gt=B&&!!b.clearcoatNormalMap,lt=B&&!!b.clearcoatRoughnessMap,Ut=st&&!!b.iridescenceMap,Vt=st&&!!b.iridescenceThicknessMap,Xt=J&&!!b.sheenColorMap,Mt=J&&!!b.sheenRoughnessMap,ie=!!b.specularMap,Wt=!!b.specularColorMap,ge=!!b.specularIntensityMap,L=Lt&&!!b.transmissionMap,St=Lt&&!!b.thicknessMap,q=!!b.gradientMap,et=!!b.alphaMap,At=b.alphaTest>0,_t=!!b.alphaHash,Jt=!!b.extensions,Re=Sa;b.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&(Re=e.toneMapping);let Je={shaderID:ut,shaderType:b.type,shaderName:b.name,vertexShader:Nt,fragmentShader:W,defines:b.defines,customVertexShaderID:it,customFragmentShaderID:mt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:p,batching:wt,batchingColor:wt&&P._colorsTexture!==null,instancing:gt,instancingColor:gt&&P.instanceColor!==null,instancingMorph:gt&&P.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:tt===null?e.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:qo,alphaToCoverage:!!b.alphaToCoverage,map:Ht,matcap:Q,envMap:ot,envMapMode:ot&&j.mapping,envMapCubeUVHeight:H,aoMap:D,lightMap:ft,bumpMap:at,normalMap:rt,displacementMap:f&&$,emissiveMap:Rt,normalMapObjectSpace:rt&&b.normalMapType===zA,normalMapTangentSpace:rt&&b.normalMapType===mb,metalnessMap:dt,roughnessMap:T,anisotropy:x,anisotropyMap:xt,clearcoat:B,clearcoatMap:Tt,clearcoatNormalMap:Gt,clearcoatRoughnessMap:lt,dispersion:Z,iridescence:st,iridescenceMap:Ut,iridescenceThicknessMap:Vt,sheen:J,sheenColorMap:Xt,sheenRoughnessMap:Mt,specularMap:ie,specularColorMap:Wt,specularIntensityMap:ge,transmission:Lt,transmissionMap:L,thicknessMap:St,gradientMap:q,opaque:b.transparent===!1&&b.blending===Ma&&b.alphaToCoverage===!1,alphaMap:et,alphaTest:At,alphaHash:_t,combine:b.combine,mapUv:Ht&&M(b.map.channel),aoMapUv:D&&M(b.aoMap.channel),lightMapUv:ft&&M(b.lightMap.channel),bumpMapUv:at&&M(b.bumpMap.channel),normalMapUv:rt&&M(b.normalMap.channel),displacementMapUv:$&&M(b.displacementMap.channel),emissiveMapUv:Rt&&M(b.emissiveMap.channel),metalnessMapUv:dt&&M(b.metalnessMap.channel),roughnessMapUv:T&&M(b.roughnessMap.channel),anisotropyMapUv:xt&&M(b.anisotropyMap.channel),clearcoatMapUv:Tt&&M(b.clearcoatMap.channel),clearcoatNormalMapUv:Gt&&M(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:lt&&M(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Ut&&M(b.iridescenceMap.channel),iridescenceThicknessMapUv:Vt&&M(b.iridescenceThicknessMap.channel),sheenColorMapUv:Xt&&M(b.sheenColorMap.channel),sheenRoughnessMapUv:Mt&&M(b.sheenRoughnessMap.channel),specularMapUv:ie&&M(b.specularMap.channel),specularColorMapUv:Wt&&M(b.specularColorMap.channel),specularIntensityMapUv:ge&&M(b.specularIntensityMap.channel),transmissionMapUv:L&&M(b.transmissionMap.channel),thicknessMapUv:St&&M(b.thicknessMap.channel),alphaMapUv:et&&M(b.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(rt||x),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!Y.attributes.uv&&(Ht||et),fog:!!z,useFog:b.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:Et,skinning:P.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:yt,morphTextureStride:Ft,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:b.dithering,shadowMapEnabled:e.shadowMap.enabled&&U.length>0,shadowMapType:e.shadowMap.type,toneMapping:Re,decodeVideoTexture:Ht&&b.map.isVideoTexture===!0&&ce.getTransfer(b.map.colorSpace)===ye,decodeVideoTextureEmissive:Rt&&b.emissiveMap.isVideoTexture===!0&&ce.getTransfer(b.emissiveMap.colorSpace)===ye,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===oi,flipSided:b.side===En,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Jt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Jt&&b.extensions.multiDraw===!0||wt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Je.vertexUv1s=c.has(1),Je.vertexUv2s=c.has(2),Je.vertexUv3s=c.has(3),c.clear(),Je}function u(b){let S=[];if(b.shaderID?S.push(b.shaderID):(S.push(b.customVertexShaderID),S.push(b.customFragmentShaderID)),b.defines!==void 0)for(let U in b.defines)S.push(U),S.push(b.defines[U]);return b.isRawShaderMaterial===!1&&(y(S,b),_(S,b),S.push(e.outputColorSpace)),S.push(b.customProgramCacheKey),S.join()}function y(b,S){b.push(S.precision),b.push(S.outputColorSpace),b.push(S.envMapMode),b.push(S.envMapCubeUVHeight),b.push(S.mapUv),b.push(S.alphaMapUv),b.push(S.lightMapUv),b.push(S.aoMapUv),b.push(S.bumpMapUv),b.push(S.normalMapUv),b.push(S.displacementMapUv),b.push(S.emissiveMapUv),b.push(S.metalnessMapUv),b.push(S.roughnessMapUv),b.push(S.anisotropyMapUv),b.push(S.clearcoatMapUv),b.push(S.clearcoatNormalMapUv),b.push(S.clearcoatRoughnessMapUv),b.push(S.iridescenceMapUv),b.push(S.iridescenceThicknessMapUv),b.push(S.sheenColorMapUv),b.push(S.sheenRoughnessMapUv),b.push(S.specularMapUv),b.push(S.specularColorMapUv),b.push(S.specularIntensityMapUv),b.push(S.transmissionMapUv),b.push(S.thicknessMapUv),b.push(S.combine),b.push(S.fogExp2),b.push(S.sizeAttenuation),b.push(S.morphTargetsCount),b.push(S.morphAttributeCount),b.push(S.numDirLights),b.push(S.numPointLights),b.push(S.numSpotLights),b.push(S.numSpotLightMaps),b.push(S.numHemiLights),b.push(S.numRectAreaLights),b.push(S.numDirLightShadows),b.push(S.numPointLightShadows),b.push(S.numSpotLightShadows),b.push(S.numSpotLightShadowsWithMaps),b.push(S.numLightProbes),b.push(S.shadowMapType),b.push(S.toneMapping),b.push(S.numClippingPlanes),b.push(S.numClipIntersection),b.push(S.depthPacking)}function _(b,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),b.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reverseDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),b.push(o.mask)}function v(b){let S=g[b.type],U;if(S){let F=Ji[S];U=wa.clone(F.uniforms)}else U=b.uniforms;return U}function R(b,S){let U;for(let F=0,P=h.length;F<P;F++){let z=h[F];if(z.cacheKey===S){U=z,++U.usedTimes;break}}return U===void 0&&(U=new g3(e,S,b,a),h.push(U)),U}function w(b){if(--b.usedTimes===0){let S=h.indexOf(b);h[S]=h[h.length-1],h.pop(),b.destroy()}}function A(b){l.remove(b)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:u,getUniforms:v,acquireProgram:R,releaseProgram:w,releaseShaderCache:A,programs:h,dispose:C}}function y3(){let e=new WeakMap;function t(r){return e.has(r)}function n(r){let o=e.get(r);return o===void 0&&(o={},e.set(r,o)),o}function i(r){e.delete(r)}function s(r,o,l){e.get(r)[o]=l}function a(){e=new WeakMap}return{has:t,get:n,remove:i,update:s,dispose:a}}function x3(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.material.id!==t.material.id?e.material.id-t.material.id:e.z!==t.z?e.z-t.z:e.id-t.id}function GS(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.z!==t.z?t.z-e.z:e.id-t.id}function kS(){let e=[],t=0,n=[],i=[],s=[];function a(){t=0,n.length=0,i.length=0,s.length=0}function r(d,f,p,g,M,m){let u=e[t];return u===void 0?(u={id:d.id,object:d,geometry:f,material:p,groupOrder:g,renderOrder:d.renderOrder,z:M,group:m},e[t]=u):(u.id=d.id,u.object=d,u.geometry=f,u.material=p,u.groupOrder=g,u.renderOrder=d.renderOrder,u.z=M,u.group=m),t++,u}function o(d,f,p,g,M,m){let u=r(d,f,p,g,M,m);p.transmission>0?i.push(u):p.transparent===!0?s.push(u):n.push(u)}function l(d,f,p,g,M,m){let u=r(d,f,p,g,M,m);p.transmission>0?i.unshift(u):p.transparent===!0?s.unshift(u):n.unshift(u)}function c(d,f){n.length>1&&n.sort(d||x3),i.length>1&&i.sort(f||GS),s.length>1&&s.sort(f||GS)}function h(){for(let d=t,f=e.length;d<f;d++){let p=e[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:n,transmissive:i,transparent:s,init:a,push:o,unshift:l,finish:h,sort:c}}function M3(){let e=new WeakMap;function t(i,s){let a=e.get(i),r;return a===void 0?(r=new kS,e.set(i,[r])):s>=a.length?(r=new kS,a.push(r)):r=a[s],r}function n(){e=new WeakMap}return{get:t,dispose:n}}function S3(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"DirectionalLight":n={direction:new N,color:new qt};break;case"SpotLight":n={position:new N,direction:new N,color:new qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new N,color:new qt,distance:0,decay:0};break;case"HemisphereLight":n={direction:new N,skyColor:new qt,groundColor:new qt};break;case"RectAreaLight":n={color:new qt,position:new N,halfWidth:new N,halfHeight:new N};break}return e[t.id]=n,n}}}function b3(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ct};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ct};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ct,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=n,n}}}function T3(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+(t.map?1:0)-(e.map?1:0)}function A3(e){let t=new S3,n=b3(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new N);let s=new N,a=new fe,r=new fe;function o(c){let h=0,d=0,f=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let p=0,g=0,M=0,m=0,u=0,y=0,_=0,v=0,R=0,w=0,A=0;c.sort(T3);for(let b=0,S=c.length;b<S;b++){let U=c[b],F=U.color,P=U.intensity,z=U.distance,Y=U.shadow&&U.shadow.map?U.shadow.map.texture:null;if(U.isAmbientLight)h+=F.r*P,d+=F.g*P,f+=F.b*P;else if(U.isLightProbe){for(let G=0;G<9;G++)i.probe[G].addScaledVector(U.sh.coefficients[G],P);A++}else if(U.isDirectionalLight){let G=t.get(U);if(G.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){let j=U.shadow,H=n.get(U);H.shadowIntensity=j.intensity,H.shadowBias=j.bias,H.shadowNormalBias=j.normalBias,H.shadowRadius=j.radius,H.shadowMapSize=j.mapSize,i.directionalShadow[p]=H,i.directionalShadowMap[p]=Y,i.directionalShadowMatrix[p]=U.shadow.matrix,y++}i.directional[p]=G,p++}else if(U.isSpotLight){let G=t.get(U);G.position.setFromMatrixPosition(U.matrixWorld),G.color.copy(F).multiplyScalar(P),G.distance=z,G.coneCos=Math.cos(U.angle),G.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),G.decay=U.decay,i.spot[M]=G;let j=U.shadow;if(U.map&&(i.spotLightMap[R]=U.map,R++,j.updateMatrices(U),U.castShadow&&w++),i.spotLightMatrix[M]=j.matrix,U.castShadow){let H=n.get(U);H.shadowIntensity=j.intensity,H.shadowBias=j.bias,H.shadowNormalBias=j.normalBias,H.shadowRadius=j.radius,H.shadowMapSize=j.mapSize,i.spotShadow[M]=H,i.spotShadowMap[M]=Y,v++}M++}else if(U.isRectAreaLight){let G=t.get(U);G.color.copy(F).multiplyScalar(P),G.halfWidth.set(U.width*.5,0,0),G.halfHeight.set(0,U.height*.5,0),i.rectArea[m]=G,m++}else if(U.isPointLight){let G=t.get(U);if(G.color.copy(U.color).multiplyScalar(U.intensity),G.distance=U.distance,G.decay=U.decay,U.castShadow){let j=U.shadow,H=n.get(U);H.shadowIntensity=j.intensity,H.shadowBias=j.bias,H.shadowNormalBias=j.normalBias,H.shadowRadius=j.radius,H.shadowMapSize=j.mapSize,H.shadowCameraNear=j.camera.near,H.shadowCameraFar=j.camera.far,i.pointShadow[g]=H,i.pointShadowMap[g]=Y,i.pointShadowMatrix[g]=U.shadow.matrix,_++}i.point[g]=G,g++}else if(U.isHemisphereLight){let G=t.get(U);G.skyColor.copy(U.color).multiplyScalar(P),G.groundColor.copy(U.groundColor).multiplyScalar(P),i.hemi[u]=G,u++}}m>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=bt.LTC_FLOAT_1,i.rectAreaLTC2=bt.LTC_FLOAT_2):(i.rectAreaLTC1=bt.LTC_HALF_1,i.rectAreaLTC2=bt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=f;let C=i.hash;(C.directionalLength!==p||C.pointLength!==g||C.spotLength!==M||C.rectAreaLength!==m||C.hemiLength!==u||C.numDirectionalShadows!==y||C.numPointShadows!==_||C.numSpotShadows!==v||C.numSpotMaps!==R||C.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=M,i.rectArea.length=m,i.point.length=g,i.hemi.length=u,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=v+R-w,i.spotLightMap.length=R,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=A,C.directionalLength=p,C.pointLength=g,C.spotLength=M,C.rectAreaLength=m,C.hemiLength=u,C.numDirectionalShadows=y,C.numPointShadows=_,C.numSpotShadows=v,C.numSpotMaps=R,C.numLightProbes=A,i.version=E3++)}function l(c,h){let d=0,f=0,p=0,g=0,M=0,m=h.matrixWorldInverse;for(let u=0,y=c.length;u<y;u++){let _=c[u];if(_.isDirectionalLight){let v=i.directional[d];v.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),d++}else if(_.isSpotLight){let v=i.spot[p];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),p++}else if(_.isRectAreaLight){let v=i.rectArea[g];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(m),r.identity(),a.copy(_.matrixWorld),a.premultiply(m),r.extractRotation(a),v.halfWidth.set(_.width*.5,0,0),v.halfHeight.set(0,_.height*.5,0),v.halfWidth.applyMatrix4(r),v.halfHeight.applyMatrix4(r),g++}else if(_.isPointLight){let v=i.point[f];v.position.setFromMatrixPosition(_.matrixWorld),v.position.applyMatrix4(m),f++}else if(_.isHemisphereLight){let v=i.hemi[M];v.direction.setFromMatrixPosition(_.matrixWorld),v.direction.transformDirection(m),M++}}}return{setup:o,setupView:l,state:i}}function XS(e){let t=new A3(e),n=[],i=[];function s(h){c.camera=h,n.length=0,i.length=0}function a(h){n.push(h)}function r(h){i.push(h)}function o(){t.setup(n)}function l(h){t.setupView(n,h)}let c={lightsArray:n,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:a,pushShadow:r}}function w3(e){let t=new WeakMap;function n(s,a=0){let r=t.get(s),o;return r===void 0?(o=new XS(e),t.set(s,[o])):a>=r.length?(o=new XS(e),r.push(o)):o=r[a],o}function i(){t=new WeakMap}return{get:n,dispose:i}}function D3(e,t,n){let i=new _c,s=new ct,a=new ct,r=new Xe,o=new e0({depthPacking:PA}),l=new n0,c={},h=n.maxTextureSize,d={[ba]:En,[En]:ba,[oi]:oi},f=new Ye({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ct},radius:{value:4}},vertexShader:R3,fragmentShader:C3}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let g=new rn;g.setAttribute("position",new Tn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let M=new Zt(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ib;let u=this.type;this.render=function(w,A,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;let b=e.getRenderTarget(),S=e.getActiveCubeFace(),U=e.getActiveMipmapLevel(),F=e.state;F.setBlending($i),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let P=u!==Ds&&this.type===Ds,z=u===Ds&&this.type!==Ds;for(let Y=0,G=w.length;Y<G;Y++){let j=w[Y],H=j.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);let ut=H.getFrameExtents();if(s.multiply(ut),a.copy(H.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/ut.x),s.x=a.x*ut.x,H.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/ut.y),s.y=a.y*ut.y,H.mapSize.y=a.y)),H.map===null||P===!0||z===!0){let yt=this.type!==Ds?{minFilter:li,magFilter:li}:{};H.map!==null&&H.map.dispose(),H.map=new xn(s.x,s.y,yt),H.map.texture.name=j.name+".shadowMap",H.camera.updateProjectionMatrix()}e.setRenderTarget(H.map),e.clear();let vt=H.getViewportCount();for(let yt=0;yt<vt;yt++){let Ft=H.getViewport(yt);r.set(a.x*Ft.x,a.y*Ft.y,a.x*Ft.z,a.y*Ft.w),F.viewport(r),H.updateMatrices(j,yt),i=H.getFrustum(),v(A,C,H.camera,j,this.type)}H.isPointLightShadow!==!0&&this.type===Ds&&y(H,C),H.needsUpdate=!1}u=this.type,m.needsUpdate=!1,e.setRenderTarget(b,S,U)};function y(w,A){let C=t.update(M);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new xn(s.x,s.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,e.setRenderTarget(w.mapPass),e.clear(),e.renderBufferDirect(A,null,C,f,M,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,e.setRenderTarget(w.map),e.clear(),e.renderBufferDirect(A,null,C,p,M,null)}function _(w,A,C,b){let S=null,U=C.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(U!==void 0)S=U;else if(S=C.isPointLight===!0?l:o,e.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){let F=S.uuid,P=A.uuid,z=c[F];z===void 0&&(z={},c[F]=z);let Y=z[P];Y===void 0&&(Y=S.clone(),z[P]=Y,A.addEventListener("dispose",R)),S=Y}if(S.visible=A.visible,S.wireframe=A.wireframe,b===Ds?S.side=A.shadowSide!==null?A.shadowSide:A.side:S.side=A.shadowSide!==null?A.shadowSide:d[A.side],S.alphaMap=A.alphaMap,S.alphaTest=A.alphaTest,S.map=A.map,S.clipShadows=A.clipShadows,S.clippingPlanes=A.clippingPlanes,S.clipIntersection=A.clipIntersection,S.displacementMap=A.displacementMap,S.displacementScale=A.displacementScale,S.displacementBias=A.displacementBias,S.wireframeLinewidth=A.wireframeLinewidth,S.linewidth=A.linewidth,C.isPointLight===!0&&S.isMeshDistanceMaterial===!0){let F=e.properties.get(S);F.light=C}return S}function v(w,A,C,b,S){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&S===Ds)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,w.matrixWorld);let P=t.update(w),z=w.material;if(Array.isArray(z)){let Y=P.groups;for(let G=0,j=Y.length;G<j;G++){let H=Y[G],ut=z[H.materialIndex];if(ut&&ut.visible){let vt=_(w,ut,b,S);w.onBeforeShadow(e,w,A,C,P,vt,H),e.renderBufferDirect(C,null,P,vt,w,H),w.onAfterShadow(e,w,A,C,P,vt,H)}}}else if(z.visible){let Y=_(w,z,b,S);w.onBeforeShadow(e,w,A,C,P,Y,null),e.renderBufferDirect(C,null,P,Y,w,null),w.onAfterShadow(e,w,A,C,P,Y,null)}}let F=w.children;for(let P=0,z=F.length;P<z;P++)v(F[P],A,C,b,S)}function R(w){w.target.removeEventListener("dispose",R);for(let C in c){let b=c[C],S=w.target.uuid;S in b&&(b[S].dispose(),delete b[S])}}}function N3(e,t){function n(){let L=!1,St=new Xe,q=null,et=new Xe(0,0,0,0);return{setMask:function(At){q!==At&&!L&&(e.colorMask(At,At,At,At),q=At)},setLocked:function(At){L=At},setClear:function(At,_t,Jt,Re,Je){Je===!0&&(At*=Re,_t*=Re,Jt*=Re),St.set(At,_t,Jt,Re),et.equals(St)===!1&&(e.clearColor(At,_t,Jt,Re),et.copy(St))},reset:function(){L=!1,q=null,et.set(-1,0,0,0)}}}function i(){let L=!1,St=!1,q=null,et=null,At=null;return{setReversed:function(_t){if(St!==_t){let Jt=t.get("EXT_clip_control");St?Jt.clipControlEXT(Jt.LOWER_LEFT_EXT,Jt.ZERO_TO_ONE_EXT):Jt.clipControlEXT(Jt.LOWER_LEFT_EXT,Jt.NEGATIVE_ONE_TO_ONE_EXT);let Re=At;At=null,this.setClear(Re)}St=_t},getReversed:function(){return St},setTest:function(_t){_t?tt(e.DEPTH_TEST):Et(e.DEPTH_TEST)},setMask:function(_t){q!==_t&&!L&&(e.depthMask(_t),q=_t)},setFunc:function(_t){if(St&&(_t=U3[_t]),et!==_t){switch(_t){case sg:e.depthFunc(e.NEVER);break;case ag:e.depthFunc(e.ALWAYS);break;case rg:e.depthFunc(e.LESS);break;case Oo:e.depthFunc(e.LEQUAL);break;case og:e.depthFunc(e.EQUAL);break;case lg:e.depthFunc(e.GEQUAL);break;case cg:e.depthFunc(e.GREATER);break;case ug:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}et=_t}},setLocked:function(_t){L=_t},setClear:function(_t){At!==_t&&(St&&(_t=1-_t),e.clearDepth(_t),At=_t)},reset:function(){L=!1,q=null,et=null,At=null,St=!1}}}function s(){let L=!1,St=null,q=null,et=null,At=null,_t=null,Jt=null,Re=null,Je=null;return{setTest:function(ue){L||(ue?tt(e.STENCIL_TEST):Et(e.STENCIL_TEST))},setMask:function(ue){St!==ue&&!L&&(e.stencilMask(ue),St=ue)},setFunc:function(ue,wn,hi){(q!==ue||et!==wn||At!==hi)&&(e.stencilFunc(ue,wn,hi),q=ue,et=wn,At=hi)},setOp:function(ue,wn,hi){(_t!==ue||Jt!==wn||Re!==hi)&&(e.stencilOp(ue,wn,hi),_t=ue,Jt=wn,Re=hi)},setLocked:function(ue){L=ue},setClear:function(ue){Je!==ue&&(e.clearStencil(ue),Je=ue)},reset:function(){L=!1,St=null,q=null,et=null,At=null,_t=null,Jt=null,Re=null,Je=null}}}let a=new n,r=new i,o=new s,l=new WeakMap,c=new WeakMap,h={},d={},f=new WeakMap,p=[],g=null,M=!1,m=null,u=null,y=null,_=null,v=null,R=null,w=null,A=new qt(0,0,0),C=0,b=!1,S=null,U=null,F=null,P=null,z=null,Y=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),G=!1,j=0,H=e.getParameter(e.VERSION);H.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(H)[1]),G=j>=1):H.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),G=j>=2);let ut=null,vt={},yt=e.getParameter(e.SCISSOR_BOX),Ft=e.getParameter(e.VIEWPORT),Nt=new Xe().fromArray(yt),W=new Xe().fromArray(Ft);function it(L,St,q,et){let At=new Uint8Array(4),_t=e.createTexture();e.bindTexture(L,_t),e.texParameteri(L,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(L,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let Jt=0;Jt<q;Jt++)L===e.TEXTURE_3D||L===e.TEXTURE_2D_ARRAY?e.texImage3D(St,0,e.RGBA,1,1,et,0,e.RGBA,e.UNSIGNED_BYTE,At):e.texImage2D(St+Jt,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,At);return _t}let mt={};mt[e.TEXTURE_2D]=it(e.TEXTURE_2D,e.TEXTURE_2D,1),mt[e.TEXTURE_CUBE_MAP]=it(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),mt[e.TEXTURE_2D_ARRAY]=it(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),mt[e.TEXTURE_3D]=it(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),tt(e.DEPTH_TEST),r.setFunc(Oo),at(!1),rt(ZM),tt(e.CULL_FACE),D($i);function tt(L){h[L]!==!0&&(e.enable(L),h[L]=!0)}function Et(L){h[L]!==!1&&(e.disable(L),h[L]=!1)}function gt(L,St){return d[L]!==St?(e.bindFramebuffer(L,St),d[L]=St,L===e.DRAW_FRAMEBUFFER&&(d[e.FRAMEBUFFER]=St),L===e.FRAMEBUFFER&&(d[e.DRAW_FRAMEBUFFER]=St),!0):!1}function wt(L,St){let q=p,et=!1;if(L){q=f.get(St),q===void 0&&(q=[],f.set(St,q));let At=L.textures;if(q.length!==At.length||q[0]!==e.COLOR_ATTACHMENT0){for(let _t=0,Jt=At.length;_t<Jt;_t++)q[_t]=e.COLOR_ATTACHMENT0+_t;q.length=At.length,et=!0}}else q[0]!==e.BACK&&(q[0]=e.BACK,et=!0);et&&e.drawBuffers(q)}function Ht(L){return g!==L?(e.useProgram(L),g=L,!0):!1}let Q={[ir]:e.FUNC_ADD,[pA]:e.FUNC_SUBTRACT,[mA]:e.FUNC_REVERSE_SUBTRACT};Q[gA]=e.MIN,Q[vA]=e.MAX;let ot={[_A]:e.ZERO,[yA]:e.ONE,[xA]:e.SRC_COLOR,[ng]:e.SRC_ALPHA,[AA]:e.SRC_ALPHA_SATURATE,[EA]:e.DST_COLOR,[SA]:e.DST_ALPHA,[MA]:e.ONE_MINUS_SRC_COLOR,[ig]:e.ONE_MINUS_SRC_ALPHA,[TA]:e.ONE_MINUS_DST_COLOR,[bA]:e.ONE_MINUS_DST_ALPHA,[wA]:e.CONSTANT_COLOR,[RA]:e.ONE_MINUS_CONSTANT_COLOR,[CA]:e.CONSTANT_ALPHA,[DA]:e.ONE_MINUS_CONSTANT_ALPHA};function D(L,St,q,et,At,_t,Jt,Re,Je,ue){if(L===$i){M===!0&&(Et(e.BLEND),M=!1);return}if(M===!1&&(tt(e.BLEND),M=!0),L!==dA){if(L!==m||ue!==b){if((u!==ir||v!==ir)&&(e.blendEquation(e.FUNC_ADD),u=ir,v=ir),ue)switch(L){case Ma:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Ea:e.blendFunc(e.ONE,e.ONE);break;case JM:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case QM:e.blendFuncSeparate(e.ZERO,e.SRC_COLOR,e.ZERO,e.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Ma:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Ea:e.blendFunc(e.SRC_ALPHA,e.ONE);break;case JM:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case QM:e.blendFunc(e.ZERO,e.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}y=null,_=null,R=null,w=null,A.set(0,0,0),C=0,m=L,b=ue}return}At=At||St,_t=_t||q,Jt=Jt||et,(St!==u||At!==v)&&(e.blendEquationSeparate(Q[St],Q[At]),u=St,v=At),(q!==y||et!==_||_t!==R||Jt!==w)&&(e.blendFuncSeparate(ot[q],ot[et],ot[_t],ot[Jt]),y=q,_=et,R=_t,w=Jt),(Re.equals(A)===!1||Je!==C)&&(e.blendColor(Re.r,Re.g,Re.b,Je),A.copy(Re),C=Je),m=L,b=!1}function ft(L,St){L.side===oi?Et(e.CULL_FACE):tt(e.CULL_FACE);let q=L.side===En;St&&(q=!q),at(q),L.blending===Ma&&L.transparent===!1?D($i):D(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),r.setFunc(L.depthFunc),r.setTest(L.depthTest),r.setMask(L.depthWrite),a.setMask(L.colorWrite);let et=L.stencilWrite;o.setTest(et),et&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Rt(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?tt(e.SAMPLE_ALPHA_TO_COVERAGE):Et(e.SAMPLE_ALPHA_TO_COVERAGE)}function at(L){S!==L&&(L?e.frontFace(e.CW):e.frontFace(e.CCW),S=L)}function rt(L){L!==hA?(tt(e.CULL_FACE),L!==U&&(L===ZM?e.cullFace(e.BACK):L===fA?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):Et(e.CULL_FACE),U=L}function $(L){L!==F&&(G&&e.lineWidth(L),F=L)}function Rt(L,St,q){L?(tt(e.POLYGON_OFFSET_FILL),(P!==St||z!==q)&&(e.polygonOffset(St,q),P=St,z=q)):Et(e.POLYGON_OFFSET_FILL)}function dt(L){L?tt(e.SCISSOR_TEST):Et(e.SCISSOR_TEST)}function T(L){L===void 0&&(L=e.TEXTURE0+Y-1),ut!==L&&(e.activeTexture(L),ut=L)}function x(L,St,q){q===void 0&&(ut===null?q=e.TEXTURE0+Y-1:q=ut);let et=vt[q];et===void 0&&(et={type:void 0,texture:void 0},vt[q]=et),(et.type!==L||et.texture!==St)&&(ut!==q&&(e.activeTexture(q),ut=q),e.bindTexture(L,St||mt[L]),et.type=L,et.texture=St)}function B(){let L=vt[ut];L!==void 0&&L.type!==void 0&&(e.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function Z(){try{e.compressedTexImage2D.apply(e,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function st(){try{e.compressedTexImage3D.apply(e,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function J(){try{e.texSubImage2D.apply(e,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Lt(){try{e.texSubImage3D.apply(e,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function xt(){try{e.compressedTexSubImage2D.apply(e,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Tt(){try{e.compressedTexSubImage3D.apply(e,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Gt(){try{e.texStorage2D.apply(e,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function lt(){try{e.texStorage3D.apply(e,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Ut(){try{e.texImage2D.apply(e,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Vt(){try{e.texImage3D.apply(e,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Xt(L){Nt.equals(L)===!1&&(e.scissor(L.x,L.y,L.z,L.w),Nt.copy(L))}function Mt(L){W.equals(L)===!1&&(e.viewport(L.x,L.y,L.z,L.w),W.copy(L))}function ie(L,St){let q=c.get(St);q===void 0&&(q=new WeakMap,c.set(St,q));let et=q.get(L);et===void 0&&(et=e.getUniformBlockIndex(St,L.name),q.set(L,et))}function Wt(L,St){let et=c.get(St).get(L);l.get(St)!==et&&(e.uniformBlockBinding(St,et,L.__bindingPointIndex),l.set(St,et))}function ge(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),r.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),h={},ut=null,vt={},d={},f=new WeakMap,p=[],g=null,M=!1,m=null,u=null,y=null,_=null,v=null,R=null,w=null,A=new qt(0,0,0),C=0,b=!1,S=null,U=null,F=null,P=null,z=null,Nt.set(0,0,e.canvas.width,e.canvas.height),W.set(0,0,e.canvas.width,e.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:tt,disable:Et,bindFramebuffer:gt,drawBuffers:wt,useProgram:Ht,setBlending:D,setMaterial:ft,setFlipSided:at,setCullFace:rt,setLineWidth:$,setPolygonOffset:Rt,setScissorTest:dt,activeTexture:T,bindTexture:x,unbindTexture:B,compressedTexImage2D:Z,compressedTexImage3D:st,texImage2D:Ut,texImage3D:Vt,updateUBOMapping:ie,uniformBlockBinding:Wt,texStorage2D:Gt,texStorage3D:lt,texSubImage2D:J,texSubImage3D:Lt,compressedTexSubImage2D:xt,compressedTexSubImage3D:Tt,scissor:Xt,viewport:Mt,reset:ge}}function WS(e,t,n,i){let s=L3(i);switch(n){case cb:return e*t;case hb:return e*t;case fb:return e*t*2;case P0:return e*t/s.components*s.byteLength;case z0:return e*t/s.components*s.byteLength;case db:return e*t*2/s.components*s.byteLength;case B0:return e*t*2/s.components*s.byteLength;case ub:return e*t*3/s.components*s.byteLength;case Oi:return e*t*4/s.components*s.byteLength;case F0:return e*t*4/s.components*s.byteLength;case Vh:case Gh:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case kh:case Xh:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case mg:case vg:return Math.max(e,16)*Math.max(t,8)/4;case pg:case gg:return Math.max(e,8)*Math.max(t,8)/2;case _g:case yg:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case xg:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Mg:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Sg:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case bg:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Eg:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case Tg:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Ag:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case wg:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case Rg:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Cg:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Dg:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Ug:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Ng:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Lg:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Ig:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Wh:case Og:case Pg:return Math.ceil(e/4)*Math.ceil(t/4)*16;case pb:case zg:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Bg:case Fg:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function L3(e){switch(e){case Os:case rb:return{byteLength:1,components:1};case vc:case ob:case ci:return{byteLength:2,components:1};case I0:case O0:return{byteLength:2,components:4};case or:case L0:case ji:return{byteLength:4,components:1};case lb:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${e}.`)}function I3(e,t,n,i,s,a,r){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ct,h=new WeakMap,d,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,x){return p?new OffscreenCanvas(T,x):Zh("canvas")}function M(T,x,B){let Z=1,st=dt(T);if((st.width>B||st.height>B)&&(Z=B/Math.max(st.width,st.height)),Z<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){let J=Math.floor(Z*st.width),Lt=Math.floor(Z*st.height);d===void 0&&(d=g(J,Lt));let xt=x?g(J,Lt):d;return xt.width=J,xt.height=Lt,xt.getContext("2d").drawImage(T,0,0,J,Lt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+st.width+"x"+st.height+") to ("+J+"x"+Lt+")."),xt}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+st.width+"x"+st.height+")."),T;return T}function m(T){return T.generateMipmaps}function u(T){e.generateMipmap(T)}function y(T){return T.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?e.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function _(T,x,B,Z,st=!1){if(T!==null){if(e[T]!==void 0)return e[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let J=x;if(x===e.RED&&(B===e.FLOAT&&(J=e.R32F),B===e.HALF_FLOAT&&(J=e.R16F),B===e.UNSIGNED_BYTE&&(J=e.R8)),x===e.RED_INTEGER&&(B===e.UNSIGNED_BYTE&&(J=e.R8UI),B===e.UNSIGNED_SHORT&&(J=e.R16UI),B===e.UNSIGNED_INT&&(J=e.R32UI),B===e.BYTE&&(J=e.R8I),B===e.SHORT&&(J=e.R16I),B===e.INT&&(J=e.R32I)),x===e.RG&&(B===e.FLOAT&&(J=e.RG32F),B===e.HALF_FLOAT&&(J=e.RG16F),B===e.UNSIGNED_BYTE&&(J=e.RG8)),x===e.RG_INTEGER&&(B===e.UNSIGNED_BYTE&&(J=e.RG8UI),B===e.UNSIGNED_SHORT&&(J=e.RG16UI),B===e.UNSIGNED_INT&&(J=e.RG32UI),B===e.BYTE&&(J=e.RG8I),B===e.SHORT&&(J=e.RG16I),B===e.INT&&(J=e.RG32I)),x===e.RGB_INTEGER&&(B===e.UNSIGNED_BYTE&&(J=e.RGB8UI),B===e.UNSIGNED_SHORT&&(J=e.RGB16UI),B===e.UNSIGNED_INT&&(J=e.RGB32UI),B===e.BYTE&&(J=e.RGB8I),B===e.SHORT&&(J=e.RGB16I),B===e.INT&&(J=e.RGB32I)),x===e.RGBA_INTEGER&&(B===e.UNSIGNED_BYTE&&(J=e.RGBA8UI),B===e.UNSIGNED_SHORT&&(J=e.RGBA16UI),B===e.UNSIGNED_INT&&(J=e.RGBA32UI),B===e.BYTE&&(J=e.RGBA8I),B===e.SHORT&&(J=e.RGBA16I),B===e.INT&&(J=e.RGBA32I)),x===e.RGB&&B===e.UNSIGNED_INT_5_9_9_9_REV&&(J=e.RGB9_E5),x===e.RGBA){let Lt=st?bf:ce.getTransfer(Z);B===e.FLOAT&&(J=e.RGBA32F),B===e.HALF_FLOAT&&(J=e.RGBA16F),B===e.UNSIGNED_BYTE&&(J=Lt===ye?e.SRGB8_ALPHA8:e.RGBA8),B===e.UNSIGNED_SHORT_4_4_4_4&&(J=e.RGBA4),B===e.UNSIGNED_SHORT_5_5_5_1&&(J=e.RGB5_A1)}return(J===e.R16F||J===e.R32F||J===e.RG16F||J===e.RG32F||J===e.RGBA16F||J===e.RGBA32F)&&t.get("EXT_color_buffer_float"),J}function v(T,x){let B;return T?x===null||x===or||x===Fo?B=e.DEPTH24_STENCIL8:x===ji?B=e.DEPTH32F_STENCIL8:x===vc&&(B=e.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===or||x===Fo?B=e.DEPTH_COMPONENT24:x===ji?B=e.DEPTH_COMPONENT32F:x===vc&&(B=e.DEPTH_COMPONENT16),B}function R(T,x){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==li&&T.minFilter!==Ki?Math.log2(Math.max(x.width,x.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?x.mipmaps.length:1}function w(T){let x=T.target;x.removeEventListener("dispose",w),C(x),x.isVideoTexture&&h.delete(x)}function A(T){let x=T.target;x.removeEventListener("dispose",A),S(x)}function C(T){let x=i.get(T);if(x.__webglInit===void 0)return;let B=T.source,Z=f.get(B);if(Z){let st=Z[x.__cacheKey];st.usedTimes--,st.usedTimes===0&&b(T),Object.keys(Z).length===0&&f.delete(B)}i.remove(T)}function b(T){let x=i.get(T);e.deleteTexture(x.__webglTexture);let B=T.source,Z=f.get(B);delete Z[x.__cacheKey],r.memory.textures--}function S(T){let x=i.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),i.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(x.__webglFramebuffer[Z]))for(let st=0;st<x.__webglFramebuffer[Z].length;st++)e.deleteFramebuffer(x.__webglFramebuffer[Z][st]);else e.deleteFramebuffer(x.__webglFramebuffer[Z]);x.__webglDepthbuffer&&e.deleteRenderbuffer(x.__webglDepthbuffer[Z])}else{if(Array.isArray(x.__webglFramebuffer))for(let Z=0;Z<x.__webglFramebuffer.length;Z++)e.deleteFramebuffer(x.__webglFramebuffer[Z]);else e.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&e.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&e.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let Z=0;Z<x.__webglColorRenderbuffer.length;Z++)x.__webglColorRenderbuffer[Z]&&e.deleteRenderbuffer(x.__webglColorRenderbuffer[Z]);x.__webglDepthRenderbuffer&&e.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let B=T.textures;for(let Z=0,st=B.length;Z<st;Z++){let J=i.get(B[Z]);J.__webglTexture&&(e.deleteTexture(J.__webglTexture),r.memory.textures--),i.remove(B[Z])}i.remove(T)}let U=0;function F(){U=0}function P(){let T=U;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),U+=1,T}function z(T){let x=[];return x.push(T.wrapS),x.push(T.wrapT),x.push(T.wrapR||0),x.push(T.magFilter),x.push(T.minFilter),x.push(T.anisotropy),x.push(T.internalFormat),x.push(T.format),x.push(T.type),x.push(T.generateMipmaps),x.push(T.premultiplyAlpha),x.push(T.flipY),x.push(T.unpackAlignment),x.push(T.colorSpace),x.join()}function Y(T,x){let B=i.get(T);if(T.isVideoTexture&&$(T),T.isRenderTargetTexture===!1&&T.version>0&&B.__version!==T.version){let Z=T.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{W(B,T,x);return}}n.bindTexture(e.TEXTURE_2D,B.__webglTexture,e.TEXTURE0+x)}function G(T,x){let B=i.get(T);if(T.version>0&&B.__version!==T.version){W(B,T,x);return}n.bindTexture(e.TEXTURE_2D_ARRAY,B.__webglTexture,e.TEXTURE0+x)}function j(T,x){let B=i.get(T);if(T.version>0&&B.__version!==T.version){W(B,T,x);return}n.bindTexture(e.TEXTURE_3D,B.__webglTexture,e.TEXTURE0+x)}function H(T,x){let B=i.get(T);if(T.version>0&&B.__version!==T.version){it(B,T,x);return}n.bindTexture(e.TEXTURE_CUBE_MAP,B.__webglTexture,e.TEXTURE0+x)}let ut={[Bo]:e.REPEAT,[ar]:e.CLAMP_TO_EDGE,[dg]:e.MIRRORED_REPEAT},vt={[li]:e.NEAREST,[IA]:e.NEAREST_MIPMAP_NEAREST,[fh]:e.NEAREST_MIPMAP_LINEAR,[Ki]:e.LINEAR,[Mm]:e.LINEAR_MIPMAP_NEAREST,[rr]:e.LINEAR_MIPMAP_LINEAR},yt={[BA]:e.NEVER,[XA]:e.ALWAYS,[FA]:e.LESS,[gb]:e.LEQUAL,[HA]:e.EQUAL,[kA]:e.GEQUAL,[VA]:e.GREATER,[GA]:e.NOTEQUAL};function Ft(T,x){if(x.type===ji&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===Ki||x.magFilter===Mm||x.magFilter===fh||x.magFilter===rr||x.minFilter===Ki||x.minFilter===Mm||x.minFilter===fh||x.minFilter===rr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(T,e.TEXTURE_WRAP_S,ut[x.wrapS]),e.texParameteri(T,e.TEXTURE_WRAP_T,ut[x.wrapT]),(T===e.TEXTURE_3D||T===e.TEXTURE_2D_ARRAY)&&e.texParameteri(T,e.TEXTURE_WRAP_R,ut[x.wrapR]),e.texParameteri(T,e.TEXTURE_MAG_FILTER,vt[x.magFilter]),e.texParameteri(T,e.TEXTURE_MIN_FILTER,vt[x.minFilter]),x.compareFunction&&(e.texParameteri(T,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(T,e.TEXTURE_COMPARE_FUNC,yt[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===li||x.minFilter!==fh&&x.minFilter!==rr||x.type===ji&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){let B=t.get("EXT_texture_filter_anisotropic");e.texParameterf(T,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function Nt(T,x){let B=!1;T.__webglInit===void 0&&(T.__webglInit=!0,x.addEventListener("dispose",w));let Z=x.source,st=f.get(Z);st===void 0&&(st={},f.set(Z,st));let J=z(x);if(J!==T.__cacheKey){st[J]===void 0&&(st[J]={texture:e.createTexture(),usedTimes:0},r.memory.textures++,B=!0),st[J].usedTimes++;let Lt=st[T.__cacheKey];Lt!==void 0&&(st[T.__cacheKey].usedTimes--,Lt.usedTimes===0&&b(x)),T.__cacheKey=J,T.__webglTexture=st[J].texture}return B}function W(T,x,B){let Z=e.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(Z=e.TEXTURE_2D_ARRAY),x.isData3DTexture&&(Z=e.TEXTURE_3D);let st=Nt(T,x),J=x.source;n.bindTexture(Z,T.__webglTexture,e.TEXTURE0+B);let Lt=i.get(J);if(J.version!==Lt.__version||st===!0){n.activeTexture(e.TEXTURE0+B);let xt=ce.getPrimaries(ce.workingColorSpace),Tt=x.colorSpace===ya?null:ce.getPrimaries(x.colorSpace),Gt=x.colorSpace===ya||xt===Tt?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,x.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,Gt);let lt=M(x.image,!1,s.maxTextureSize);lt=Rt(x,lt);let Ut=a.convert(x.format,x.colorSpace),Vt=a.convert(x.type),Xt=_(x.internalFormat,Ut,Vt,x.colorSpace,x.isVideoTexture);Ft(Z,x);let Mt,ie=x.mipmaps,Wt=x.isVideoTexture!==!0,ge=Lt.__version===void 0||st===!0,L=J.dataReady,St=R(x,lt);if(x.isDepthTexture)Xt=v(x.format===Ho,x.type),ge&&(Wt?n.texStorage2D(e.TEXTURE_2D,1,Xt,lt.width,lt.height):n.texImage2D(e.TEXTURE_2D,0,Xt,lt.width,lt.height,0,Ut,Vt,null));else if(x.isDataTexture)if(ie.length>0){Wt&&ge&&n.texStorage2D(e.TEXTURE_2D,St,Xt,ie[0].width,ie[0].height);for(let q=0,et=ie.length;q<et;q++)Mt=ie[q],Wt?L&&n.texSubImage2D(e.TEXTURE_2D,q,0,0,Mt.width,Mt.height,Ut,Vt,Mt.data):n.texImage2D(e.TEXTURE_2D,q,Xt,Mt.width,Mt.height,0,Ut,Vt,Mt.data);x.generateMipmaps=!1}else Wt?(ge&&n.texStorage2D(e.TEXTURE_2D,St,Xt,lt.width,lt.height),L&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,lt.width,lt.height,Ut,Vt,lt.data)):n.texImage2D(e.TEXTURE_2D,0,Xt,lt.width,lt.height,0,Ut,Vt,lt.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Wt&&ge&&n.texStorage3D(e.TEXTURE_2D_ARRAY,St,Xt,ie[0].width,ie[0].height,lt.depth);for(let q=0,et=ie.length;q<et;q++)if(Mt=ie[q],x.format!==Oi)if(Ut!==null)if(Wt){if(L)if(x.layerUpdates.size>0){let At=WS(Mt.width,Mt.height,x.format,x.type);for(let _t of x.layerUpdates){let Jt=Mt.data.subarray(_t*At/Mt.data.BYTES_PER_ELEMENT,(_t+1)*At/Mt.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,q,0,0,_t,Mt.width,Mt.height,1,Ut,Jt)}x.clearLayerUpdates()}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,q,0,0,0,Mt.width,Mt.height,lt.depth,Ut,Mt.data)}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,q,Xt,Mt.width,Mt.height,lt.depth,0,Mt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Wt?L&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,q,0,0,0,Mt.width,Mt.height,lt.depth,Ut,Vt,Mt.data):n.texImage3D(e.TEXTURE_2D_ARRAY,q,Xt,Mt.width,Mt.height,lt.depth,0,Ut,Vt,Mt.data)}else{Wt&&ge&&n.texStorage2D(e.TEXTURE_2D,St,Xt,ie[0].width,ie[0].height);for(let q=0,et=ie.length;q<et;q++)Mt=ie[q],x.format!==Oi?Ut!==null?Wt?L&&n.compressedTexSubImage2D(e.TEXTURE_2D,q,0,0,Mt.width,Mt.height,Ut,Mt.data):n.compressedTexImage2D(e.TEXTURE_2D,q,Xt,Mt.width,Mt.height,0,Mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Wt?L&&n.texSubImage2D(e.TEXTURE_2D,q,0,0,Mt.width,Mt.height,Ut,Vt,Mt.data):n.texImage2D(e.TEXTURE_2D,q,Xt,Mt.width,Mt.height,0,Ut,Vt,Mt.data)}else if(x.isDataArrayTexture)if(Wt){if(ge&&n.texStorage3D(e.TEXTURE_2D_ARRAY,St,Xt,lt.width,lt.height,lt.depth),L)if(x.layerUpdates.size>0){let q=WS(lt.width,lt.height,x.format,x.type);for(let et of x.layerUpdates){let At=lt.data.subarray(et*q/lt.data.BYTES_PER_ELEMENT,(et+1)*q/lt.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,et,lt.width,lt.height,1,Ut,Vt,At)}x.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,lt.width,lt.height,lt.depth,Ut,Vt,lt.data)}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,Xt,lt.width,lt.height,lt.depth,0,Ut,Vt,lt.data);else if(x.isData3DTexture)Wt?(ge&&n.texStorage3D(e.TEXTURE_3D,St,Xt,lt.width,lt.height,lt.depth),L&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,lt.width,lt.height,lt.depth,Ut,Vt,lt.data)):n.texImage3D(e.TEXTURE_3D,0,Xt,lt.width,lt.height,lt.depth,0,Ut,Vt,lt.data);else if(x.isFramebufferTexture){if(ge)if(Wt)n.texStorage2D(e.TEXTURE_2D,St,Xt,lt.width,lt.height);else{let q=lt.width,et=lt.height;for(let At=0;At<St;At++)n.texImage2D(e.TEXTURE_2D,At,Xt,q,et,0,Ut,Vt,null),q>>=1,et>>=1}}else if(ie.length>0){if(Wt&&ge){let q=dt(ie[0]);n.texStorage2D(e.TEXTURE_2D,St,Xt,q.width,q.height)}for(let q=0,et=ie.length;q<et;q++)Mt=ie[q],Wt?L&&n.texSubImage2D(e.TEXTURE_2D,q,0,0,Ut,Vt,Mt):n.texImage2D(e.TEXTURE_2D,q,Xt,Ut,Vt,Mt);x.generateMipmaps=!1}else if(Wt){if(ge){let q=dt(lt);n.texStorage2D(e.TEXTURE_2D,St,Xt,q.width,q.height)}L&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,Ut,Vt,lt)}else n.texImage2D(e.TEXTURE_2D,0,Xt,Ut,Vt,lt);m(x)&&u(Z),Lt.__version=J.version,x.onUpdate&&x.onUpdate(x)}T.__version=x.version}function it(T,x,B){if(x.image.length!==6)return;let Z=Nt(T,x),st=x.source;n.bindTexture(e.TEXTURE_CUBE_MAP,T.__webglTexture,e.TEXTURE0+B);let J=i.get(st);if(st.version!==J.__version||Z===!0){n.activeTexture(e.TEXTURE0+B);let Lt=ce.getPrimaries(ce.workingColorSpace),xt=x.colorSpace===ya?null:ce.getPrimaries(x.colorSpace),Tt=x.colorSpace===ya||Lt===xt?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,x.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,Tt);let Gt=x.isCompressedTexture||x.image[0].isCompressedTexture,lt=x.image[0]&&x.image[0].isDataTexture,Ut=[];for(let et=0;et<6;et++)!Gt&&!lt?Ut[et]=M(x.image[et],!0,s.maxCubemapSize):Ut[et]=lt?x.image[et].image:x.image[et],Ut[et]=Rt(x,Ut[et]);let Vt=Ut[0],Xt=a.convert(x.format,x.colorSpace),Mt=a.convert(x.type),ie=_(x.internalFormat,Xt,Mt,x.colorSpace),Wt=x.isVideoTexture!==!0,ge=J.__version===void 0||Z===!0,L=st.dataReady,St=R(x,Vt);Ft(e.TEXTURE_CUBE_MAP,x);let q;if(Gt){Wt&&ge&&n.texStorage2D(e.TEXTURE_CUBE_MAP,St,ie,Vt.width,Vt.height);for(let et=0;et<6;et++){q=Ut[et].mipmaps;for(let At=0;At<q.length;At++){let _t=q[At];x.format!==Oi?Xt!==null?Wt?L&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,At,0,0,_t.width,_t.height,Xt,_t.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,At,ie,_t.width,_t.height,0,_t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Wt?L&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,At,0,0,_t.width,_t.height,Xt,Mt,_t.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,At,ie,_t.width,_t.height,0,Xt,Mt,_t.data)}}}else{if(q=x.mipmaps,Wt&&ge){q.length>0&&St++;let et=dt(Ut[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,St,ie,et.width,et.height)}for(let et=0;et<6;et++)if(lt){Wt?L&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Ut[et].width,Ut[et].height,Xt,Mt,Ut[et].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,ie,Ut[et].width,Ut[et].height,0,Xt,Mt,Ut[et].data);for(let At=0;At<q.length;At++){let Jt=q[At].image[et].image;Wt?L&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,At+1,0,0,Jt.width,Jt.height,Xt,Mt,Jt.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,At+1,ie,Jt.width,Jt.height,0,Xt,Mt,Jt.data)}}else{Wt?L&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Xt,Mt,Ut[et]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,ie,Xt,Mt,Ut[et]);for(let At=0;At<q.length;At++){let _t=q[At];Wt?L&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,At+1,0,0,Xt,Mt,_t.image[et]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+et,At+1,ie,Xt,Mt,_t.image[et])}}}m(x)&&u(e.TEXTURE_CUBE_MAP),J.__version=st.version,x.onUpdate&&x.onUpdate(x)}T.__version=x.version}function mt(T,x,B,Z,st,J){let Lt=a.convert(B.format,B.colorSpace),xt=a.convert(B.type),Tt=_(B.internalFormat,Lt,xt,B.colorSpace),Gt=i.get(x),lt=i.get(B);if(lt.__renderTarget=x,!Gt.__hasExternalTextures){let Ut=Math.max(1,x.width>>J),Vt=Math.max(1,x.height>>J);st===e.TEXTURE_3D||st===e.TEXTURE_2D_ARRAY?n.texImage3D(st,J,Tt,Ut,Vt,x.depth,0,Lt,xt,null):n.texImage2D(st,J,Tt,Ut,Vt,0,Lt,xt,null)}n.bindFramebuffer(e.FRAMEBUFFER,T),rt(x)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,Z,st,lt.__webglTexture,0,at(x)):(st===e.TEXTURE_2D||st>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&st<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,Z,st,lt.__webglTexture,J),n.bindFramebuffer(e.FRAMEBUFFER,null)}function tt(T,x,B){if(e.bindRenderbuffer(e.RENDERBUFFER,T),x.depthBuffer){let Z=x.depthTexture,st=Z&&Z.isDepthTexture?Z.type:null,J=v(x.stencilBuffer,st),Lt=x.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,xt=at(x);rt(x)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,xt,J,x.width,x.height):B?e.renderbufferStorageMultisample(e.RENDERBUFFER,xt,J,x.width,x.height):e.renderbufferStorage(e.RENDERBUFFER,J,x.width,x.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,Lt,e.RENDERBUFFER,T)}else{let Z=x.textures;for(let st=0;st<Z.length;st++){let J=Z[st],Lt=a.convert(J.format,J.colorSpace),xt=a.convert(J.type),Tt=_(J.internalFormat,Lt,xt,J.colorSpace),Gt=at(x);B&&rt(x)===!1?e.renderbufferStorageMultisample(e.RENDERBUFFER,Gt,Tt,x.width,x.height):rt(x)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Gt,Tt,x.width,x.height):e.renderbufferStorage(e.RENDERBUFFER,Tt,x.width,x.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Et(T,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(e.FRAMEBUFFER,T),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let Z=i.get(x.depthTexture);Z.__renderTarget=x,(!Z.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),Y(x.depthTexture,0);let st=Z.__webglTexture,J=at(x);if(x.depthTexture.format===No)rt(x)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,st,0,J):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,st,0);else if(x.depthTexture.format===Ho)rt(x)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,st,0,J):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,st,0);else throw new Error("Unknown depthTexture format")}function gt(T){let x=i.get(T),B=T.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==T.depthTexture){let Z=T.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),Z){let st=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,Z.removeEventListener("dispose",st)};Z.addEventListener("dispose",st),x.__depthDisposeCallback=st}x.__boundDepthTexture=Z}if(T.depthTexture&&!x.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");Et(x.__webglFramebuffer,T)}else if(B){x.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(n.bindFramebuffer(e.FRAMEBUFFER,x.__webglFramebuffer[Z]),x.__webglDepthbuffer[Z]===void 0)x.__webglDepthbuffer[Z]=e.createRenderbuffer(),tt(x.__webglDepthbuffer[Z],T,!1);else{let st=T.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,J=x.__webglDepthbuffer[Z];e.bindRenderbuffer(e.RENDERBUFFER,J),e.framebufferRenderbuffer(e.FRAMEBUFFER,st,e.RENDERBUFFER,J)}}else if(n.bindFramebuffer(e.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=e.createRenderbuffer(),tt(x.__webglDepthbuffer,T,!1);else{let Z=T.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,st=x.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,st),e.framebufferRenderbuffer(e.FRAMEBUFFER,Z,e.RENDERBUFFER,st)}n.bindFramebuffer(e.FRAMEBUFFER,null)}function wt(T,x,B){let Z=i.get(T);x!==void 0&&mt(Z.__webglFramebuffer,T,T.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),B!==void 0&&gt(T)}function Ht(T){let x=T.texture,B=i.get(T),Z=i.get(x);T.addEventListener("dispose",A);let st=T.textures,J=T.isWebGLCubeRenderTarget===!0,Lt=st.length>1;if(Lt||(Z.__webglTexture===void 0&&(Z.__webglTexture=e.createTexture()),Z.__version=x.version,r.memory.textures++),J){B.__webglFramebuffer=[];for(let xt=0;xt<6;xt++)if(x.mipmaps&&x.mipmaps.length>0){B.__webglFramebuffer[xt]=[];for(let Tt=0;Tt<x.mipmaps.length;Tt++)B.__webglFramebuffer[xt][Tt]=e.createFramebuffer()}else B.__webglFramebuffer[xt]=e.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){B.__webglFramebuffer=[];for(let xt=0;xt<x.mipmaps.length;xt++)B.__webglFramebuffer[xt]=e.createFramebuffer()}else B.__webglFramebuffer=e.createFramebuffer();if(Lt)for(let xt=0,Tt=st.length;xt<Tt;xt++){let Gt=i.get(st[xt]);Gt.__webglTexture===void 0&&(Gt.__webglTexture=e.createTexture(),r.memory.textures++)}if(T.samples>0&&rt(T)===!1){B.__webglMultisampledFramebuffer=e.createFramebuffer(),B.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let xt=0;xt<st.length;xt++){let Tt=st[xt];B.__webglColorRenderbuffer[xt]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,B.__webglColorRenderbuffer[xt]);let Gt=a.convert(Tt.format,Tt.colorSpace),lt=a.convert(Tt.type),Ut=_(Tt.internalFormat,Gt,lt,Tt.colorSpace,T.isXRRenderTarget===!0),Vt=at(T);e.renderbufferStorageMultisample(e.RENDERBUFFER,Vt,Ut,T.width,T.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+xt,e.RENDERBUFFER,B.__webglColorRenderbuffer[xt])}e.bindRenderbuffer(e.RENDERBUFFER,null),T.depthBuffer&&(B.__webglDepthRenderbuffer=e.createRenderbuffer(),tt(B.__webglDepthRenderbuffer,T,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(J){n.bindTexture(e.TEXTURE_CUBE_MAP,Z.__webglTexture),Ft(e.TEXTURE_CUBE_MAP,x);for(let xt=0;xt<6;xt++)if(x.mipmaps&&x.mipmaps.length>0)for(let Tt=0;Tt<x.mipmaps.length;Tt++)mt(B.__webglFramebuffer[xt][Tt],T,x,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+xt,Tt);else mt(B.__webglFramebuffer[xt],T,x,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0);m(x)&&u(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Lt){for(let xt=0,Tt=st.length;xt<Tt;xt++){let Gt=st[xt],lt=i.get(Gt);n.bindTexture(e.TEXTURE_2D,lt.__webglTexture),Ft(e.TEXTURE_2D,Gt),mt(B.__webglFramebuffer,T,Gt,e.COLOR_ATTACHMENT0+xt,e.TEXTURE_2D,0),m(Gt)&&u(e.TEXTURE_2D)}n.unbindTexture()}else{let xt=e.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(xt=T.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(xt,Z.__webglTexture),Ft(xt,x),x.mipmaps&&x.mipmaps.length>0)for(let Tt=0;Tt<x.mipmaps.length;Tt++)mt(B.__webglFramebuffer[Tt],T,x,e.COLOR_ATTACHMENT0,xt,Tt);else mt(B.__webglFramebuffer,T,x,e.COLOR_ATTACHMENT0,xt,0);m(x)&&u(xt),n.unbindTexture()}T.depthBuffer&&gt(T)}function Q(T){let x=T.textures;for(let B=0,Z=x.length;B<Z;B++){let st=x[B];if(m(st)){let J=y(T),Lt=i.get(st).__webglTexture;n.bindTexture(J,Lt),u(J),n.unbindTexture()}}}let ot=[],D=[];function ft(T){if(T.samples>0){if(rt(T)===!1){let x=T.textures,B=T.width,Z=T.height,st=e.COLOR_BUFFER_BIT,J=T.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,Lt=i.get(T),xt=x.length>1;if(xt)for(let Tt=0;Tt<x.length;Tt++)n.bindFramebuffer(e.FRAMEBUFFER,Lt.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Tt,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,Lt.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+Tt,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,Lt.__webglMultisampledFramebuffer),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,Lt.__webglFramebuffer);for(let Tt=0;Tt<x.length;Tt++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(st|=e.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(st|=e.STENCIL_BUFFER_BIT)),xt){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,Lt.__webglColorRenderbuffer[Tt]);let Gt=i.get(x[Tt]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,Gt,0)}e.blitFramebuffer(0,0,B,Z,0,0,B,Z,st,e.NEAREST),l===!0&&(ot.length=0,D.length=0,ot.push(e.COLOR_ATTACHMENT0+Tt),T.depthBuffer&&T.resolveDepthBuffer===!1&&(ot.push(J),D.push(J),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,D)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,ot))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),xt)for(let Tt=0;Tt<x.length;Tt++){n.bindFramebuffer(e.FRAMEBUFFER,Lt.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Tt,e.RENDERBUFFER,Lt.__webglColorRenderbuffer[Tt]);let Gt=i.get(x[Tt]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,Lt.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+Tt,e.TEXTURE_2D,Gt,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,Lt.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){let x=T.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[x])}}}function at(T){return Math.min(s.maxSamples,T.samples)}function rt(T){let x=i.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function $(T){let x=r.render.frame;h.get(T)!==x&&(h.set(T,x),T.update())}function Rt(T,x){let B=T.colorSpace,Z=T.format,st=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||B!==qo&&B!==ya&&(ce.getTransfer(B)===ye?(Z!==Oi||st!==Os)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),x}function dt(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=P,this.resetTextureUnits=F,this.setTexture2D=Y,this.setTexture2DArray=G,this.setTexture3D=j,this.setTextureCube=H,this.rebindTextures=wt,this.setupRenderTarget=Ht,this.updateRenderTargetMipmap=Q,this.updateMultisampleRenderTarget=ft,this.setupDepthRenderbuffer=gt,this.setupFrameBufferTexture=mt,this.useMultisampledRTT=rt}function O3(e,t){function n(i,s=ya){let a,r=ce.getTransfer(s);if(i===Os)return e.UNSIGNED_BYTE;if(i===I0)return e.UNSIGNED_SHORT_4_4_4_4;if(i===O0)return e.UNSIGNED_SHORT_5_5_5_1;if(i===lb)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===rb)return e.BYTE;if(i===ob)return e.SHORT;if(i===vc)return e.UNSIGNED_SHORT;if(i===L0)return e.INT;if(i===or)return e.UNSIGNED_INT;if(i===ji)return e.FLOAT;if(i===ci)return e.HALF_FLOAT;if(i===cb)return e.ALPHA;if(i===ub)return e.RGB;if(i===Oi)return e.RGBA;if(i===hb)return e.LUMINANCE;if(i===fb)return e.LUMINANCE_ALPHA;if(i===No)return e.DEPTH_COMPONENT;if(i===Ho)return e.DEPTH_STENCIL;if(i===P0)return e.RED;if(i===z0)return e.RED_INTEGER;if(i===db)return e.RG;if(i===B0)return e.RG_INTEGER;if(i===F0)return e.RGBA_INTEGER;if(i===Vh||i===Gh||i===kh||i===Xh)if(r===ye)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===Vh)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Gh)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===kh)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Xh)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===Vh)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Gh)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===kh)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Xh)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===pg||i===mg||i===gg||i===vg)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===pg)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===mg)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===gg)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===vg)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===_g||i===yg||i===xg)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(i===_g||i===yg)return r===ye?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===xg)return r===ye?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Mg||i===Sg||i===bg||i===Eg||i===Tg||i===Ag||i===wg||i===Rg||i===Cg||i===Dg||i===Ug||i===Ng||i===Lg||i===Ig)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Mg)return r===ye?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Sg)return r===ye?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===bg)return r===ye?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Eg)return r===ye?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Tg)return r===ye?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ag)return r===ye?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===wg)return r===ye?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Rg)return r===ye?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Cg)return r===ye?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Dg)return r===ye?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ug)return r===ye?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ng)return r===ye?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Lg)return r===ye?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ig)return r===ye?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Wh||i===Og||i===Pg)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(i===Wh)return r===ye?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Og)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Pg)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===pb||i===zg||i===Bg||i===Fg)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(i===Wh)return a.COMPRESSED_RED_RGTC1_EXT;if(i===zg)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Bg)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Fg)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Fo?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:n}}function H3(e,t){function n(m,u){m.matrixAutoUpdate===!0&&m.updateMatrix(),u.value.copy(m.matrix)}function i(m,u){u.color.getRGB(m.fogColor.value,yb(e)),u.isFog?(m.fogNear.value=u.near,m.fogFar.value=u.far):u.isFogExp2&&(m.fogDensity.value=u.density)}function s(m,u,y,_,v){u.isMeshBasicMaterial||u.isMeshLambertMaterial?a(m,u):u.isMeshToonMaterial?(a(m,u),d(m,u)):u.isMeshPhongMaterial?(a(m,u),h(m,u)):u.isMeshStandardMaterial?(a(m,u),f(m,u),u.isMeshPhysicalMaterial&&p(m,u,v)):u.isMeshMatcapMaterial?(a(m,u),g(m,u)):u.isMeshDepthMaterial?a(m,u):u.isMeshDistanceMaterial?(a(m,u),M(m,u)):u.isMeshNormalMaterial?a(m,u):u.isLineBasicMaterial?(r(m,u),u.isLineDashedMaterial&&o(m,u)):u.isPointsMaterial?l(m,u,y,_):u.isSpriteMaterial?c(m,u):u.isShadowMaterial?(m.color.value.copy(u.color),m.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function a(m,u){m.opacity.value=u.opacity,u.color&&m.diffuse.value.copy(u.color),u.emissive&&m.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(m.map.value=u.map,n(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,n(u.alphaMap,m.alphaMapTransform)),u.bumpMap&&(m.bumpMap.value=u.bumpMap,n(u.bumpMap,m.bumpMapTransform),m.bumpScale.value=u.bumpScale,u.side===En&&(m.bumpScale.value*=-1)),u.normalMap&&(m.normalMap.value=u.normalMap,n(u.normalMap,m.normalMapTransform),m.normalScale.value.copy(u.normalScale),u.side===En&&m.normalScale.value.negate()),u.displacementMap&&(m.displacementMap.value=u.displacementMap,n(u.displacementMap,m.displacementMapTransform),m.displacementScale.value=u.displacementScale,m.displacementBias.value=u.displacementBias),u.emissiveMap&&(m.emissiveMap.value=u.emissiveMap,n(u.emissiveMap,m.emissiveMapTransform)),u.specularMap&&(m.specularMap.value=u.specularMap,n(u.specularMap,m.specularMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest);let y=t.get(u),_=y.envMap,v=y.envMapRotation;_&&(m.envMap.value=_,er.copy(v),er.x*=-1,er.y*=-1,er.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(er.y*=-1,er.z*=-1),m.envMapRotation.value.setFromMatrix4(F3.makeRotationFromEuler(er)),m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=u.reflectivity,m.ior.value=u.ior,m.refractionRatio.value=u.refractionRatio),u.lightMap&&(m.lightMap.value=u.lightMap,m.lightMapIntensity.value=u.lightMapIntensity,n(u.lightMap,m.lightMapTransform)),u.aoMap&&(m.aoMap.value=u.aoMap,m.aoMapIntensity.value=u.aoMapIntensity,n(u.aoMap,m.aoMapTransform))}function r(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,u.map&&(m.map.value=u.map,n(u.map,m.mapTransform))}function o(m,u){m.dashSize.value=u.dashSize,m.totalSize.value=u.dashSize+u.gapSize,m.scale.value=u.scale}function l(m,u,y,_){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.size.value=u.size*y,m.scale.value=_*.5,u.map&&(m.map.value=u.map,n(u.map,m.uvTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,n(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function c(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.rotation.value=u.rotation,u.map&&(m.map.value=u.map,n(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,n(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function h(m,u){m.specular.value.copy(u.specular),m.shininess.value=Math.max(u.shininess,1e-4)}function d(m,u){u.gradientMap&&(m.gradientMap.value=u.gradientMap)}function f(m,u){m.metalness.value=u.metalness,u.metalnessMap&&(m.metalnessMap.value=u.metalnessMap,n(u.metalnessMap,m.metalnessMapTransform)),m.roughness.value=u.roughness,u.roughnessMap&&(m.roughnessMap.value=u.roughnessMap,n(u.roughnessMap,m.roughnessMapTransform)),u.envMap&&(m.envMapIntensity.value=u.envMapIntensity)}function p(m,u,y){m.ior.value=u.ior,u.sheen>0&&(m.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),m.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(m.sheenColorMap.value=u.sheenColorMap,n(u.sheenColorMap,m.sheenColorMapTransform)),u.sheenRoughnessMap&&(m.sheenRoughnessMap.value=u.sheenRoughnessMap,n(u.sheenRoughnessMap,m.sheenRoughnessMapTransform))),u.clearcoat>0&&(m.clearcoat.value=u.clearcoat,m.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(m.clearcoatMap.value=u.clearcoatMap,n(u.clearcoatMap,m.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,n(u.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(m.clearcoatNormalMap.value=u.clearcoatNormalMap,n(u.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===En&&m.clearcoatNormalScale.value.negate())),u.dispersion>0&&(m.dispersion.value=u.dispersion),u.iridescence>0&&(m.iridescence.value=u.iridescence,m.iridescenceIOR.value=u.iridescenceIOR,m.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(m.iridescenceMap.value=u.iridescenceMap,n(u.iridescenceMap,m.iridescenceMapTransform)),u.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=u.iridescenceThicknessMap,n(u.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),u.transmission>0&&(m.transmission.value=u.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),u.transmissionMap&&(m.transmissionMap.value=u.transmissionMap,n(u.transmissionMap,m.transmissionMapTransform)),m.thickness.value=u.thickness,u.thicknessMap&&(m.thicknessMap.value=u.thicknessMap,n(u.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=u.attenuationDistance,m.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(m.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(m.anisotropyMap.value=u.anisotropyMap,n(u.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=u.specularIntensity,m.specularColor.value.copy(u.specularColor),u.specularColorMap&&(m.specularColorMap.value=u.specularColorMap,n(u.specularColorMap,m.specularColorMapTransform)),u.specularIntensityMap&&(m.specularIntensityMap.value=u.specularIntensityMap,n(u.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,u){u.matcap&&(m.matcap.value=u.matcap)}function M(m,u){let y=t.get(u).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function V3(e,t,n,i){let s={},a={},r=[],o=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,_){let v=_.program;i.uniformBlockBinding(y,v)}function c(y,_){let v=s[y.id];v===void 0&&(g(y),v=h(y),s[y.id]=v,y.addEventListener("dispose",m));let R=_.program;i.updateUBOMapping(y,R);let w=t.render.frame;a[y.id]!==w&&(f(y),a[y.id]=w)}function h(y){let _=d();y.__bindingPointIndex=_;let v=e.createBuffer(),R=y.__size,w=y.usage;return e.bindBuffer(e.UNIFORM_BUFFER,v),e.bufferData(e.UNIFORM_BUFFER,R,w),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,_,v),v}function d(){for(let y=0;y<o;y++)if(r.indexOf(y)===-1)return r.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(y){let _=s[y.id],v=y.uniforms,R=y.__cache;e.bindBuffer(e.UNIFORM_BUFFER,_);for(let w=0,A=v.length;w<A;w++){let C=Array.isArray(v[w])?v[w]:[v[w]];for(let b=0,S=C.length;b<S;b++){let U=C[b];if(p(U,w,b,R)===!0){let F=U.__offset,P=Array.isArray(U.value)?U.value:[U.value],z=0;for(let Y=0;Y<P.length;Y++){let G=P[Y],j=M(G);typeof G=="number"||typeof G=="boolean"?(U.__data[0]=G,e.bufferSubData(e.UNIFORM_BUFFER,F+z,U.__data)):G.isMatrix3?(U.__data[0]=G.elements[0],U.__data[1]=G.elements[1],U.__data[2]=G.elements[2],U.__data[3]=0,U.__data[4]=G.elements[3],U.__data[5]=G.elements[4],U.__data[6]=G.elements[5],U.__data[7]=0,U.__data[8]=G.elements[6],U.__data[9]=G.elements[7],U.__data[10]=G.elements[8],U.__data[11]=0):(G.toArray(U.__data,z),z+=j.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,F,U.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(y,_,v,R){let w=y.value,A=_+"_"+v;if(R[A]===void 0)return typeof w=="number"||typeof w=="boolean"?R[A]=w:R[A]=w.clone(),!0;{let C=R[A];if(typeof w=="number"||typeof w=="boolean"){if(C!==w)return R[A]=w,!0}else if(C.equals(w)===!1)return C.copy(w),!0}return!1}function g(y){let _=y.uniforms,v=0,R=16;for(let A=0,C=_.length;A<C;A++){let b=Array.isArray(_[A])?_[A]:[_[A]];for(let S=0,U=b.length;S<U;S++){let F=b[S],P=Array.isArray(F.value)?F.value:[F.value];for(let z=0,Y=P.length;z<Y;z++){let G=P[z],j=M(G),H=v%R,ut=H%j.boundary,vt=H+ut;v+=ut,vt!==0&&R-vt<j.storage&&(v+=R-vt),F.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=v,v+=j.storage}}}let w=v%R;return w>0&&(v+=R-w),y.__size=v,y.__cache={},this}function M(y){let _={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(_.boundary=4,_.storage=4):y.isVector2?(_.boundary=8,_.storage=8):y.isVector3||y.isColor?(_.boundary=16,_.storage=12):y.isVector4?(_.boundary=16,_.storage=16):y.isMatrix3?(_.boundary=48,_.storage=48):y.isMatrix4?(_.boundary=64,_.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),_}function m(y){let _=y.target;_.removeEventListener("dispose",m);let v=r.indexOf(_.__bindingPointIndex);r.splice(v,1),e.deleteBuffer(s[_.id]),delete s[_.id],delete a[_.id]}function u(){for(let y in s)e.deleteBuffer(s[y]);r=[],s={},a={}}return{bind:l,update:c,dispose:u}}function Oh(e,t,n,i,s,a){Ro.subVectors(e,n).addScalar(.5).multiply(i),s!==void 0?(oc.x=a*Ro.x-s*Ro.y,oc.y=s*Ro.x+a*Ro.y):oc.copy(Ro),e.copy(t),e.x+=oc.x,e.y+=oc.y,e.applyMatrix4(Tb)}function V0(){let e=0,t=0,n=0,i=0;function s(a,r,o,l){e=a,t=o,n=-3*a+3*r-2*o-l,i=2*a-2*r+o+l}return{initCatmullRom:function(a,r,o,l,c){s(r,o,c*(o-a),c*(l-r))},initNonuniformCatmullRom:function(a,r,o,l,c,h,d){let f=(r-a)/c-(o-a)/(c+h)+(o-r)/h,p=(o-r)/h-(l-r)/(h+d)+(l-o)/d;f*=h,p*=h,s(r,o,f,p)},calc:function(a){let r=a*a,o=r*a;return e+t*a+n*r+i*o}}}function QS(e,t,n,i,s){let a=(i-t)*.5,r=(s-n)*.5,o=e*e,l=e*o;return(2*n-2*i+a+r)*l+(-3*n+3*i-2*a-r)*o+a*e+n}function k3(e,t){let n=1-e;return n*n*t}function X3(e,t){return 2*(1-e)*e*t}function W3(e,t){return e*e*t}function pc(e,t,n,i){return k3(e,t)+X3(e,n)+W3(e,i)}function q3(e,t){let n=1-e;return n*n*n*t}function Y3(e,t){let n=1-e;return 3*n*n*e*t}function Z3(e,t){return 3*(1-e)*e*e*t}function J3(e,t){return e*e*e*t}function mc(e,t,n,i,s){return q3(e,t)+Y3(e,n)+Z3(e,i)+J3(e,s)}function Ab(e,t,n,i,s){let a,r;if(s===fD(e,t,n,i)>0)for(a=t;a<n;a+=i)r=KS(a,e[a],e[a+1],r);else for(a=n-i;a>=t;a-=i)r=KS(a,e[a],e[a+1],r);return r&&Tf(r,r.next)&&(wc(r),r=r.next),r}function ur(e,t){if(!e)return e;t||(t=e);let n=e,i;do if(i=!1,!n.steiner&&(Tf(n,n.next)||Ve(n.prev,n,n.next)===0)){if(wc(n),n=t=n.prev,n===n.next)break;i=!0}else n=n.next;while(i||n!==t);return t}function Tc(e,t,n,i,s,a,r){if(!e)return;!r&&a&&rD(e,i,s,a);let o=e,l,c;for(;e.prev!==e.next;){if(l=e.prev,c=e.next,a?j3(e,i,s,a):K3(e)){t.push(l.i/n|0),t.push(e.i/n|0),t.push(c.i/n|0),wc(e),e=c.next,o=c.next;continue}if(e=c,e===o){r?r===1?(e=$3(ur(e),t,n),Tc(e,t,n,i,s,a,2)):r===2&&tD(e,t,n,i,s,a):Tc(ur(e),t,n,i,s,a,1);break}}}function K3(e){let t=e.prev,n=e,i=e.next;if(Ve(t,n,i)>=0)return!1;let s=t.x,a=n.x,r=i.x,o=t.y,l=n.y,c=i.y,h=s<a?s<r?s:r:a<r?a:r,d=o<l?o<c?o:c:l<c?l:c,f=s>a?s>r?s:r:a>r?a:r,p=o>l?o>c?o:c:l>c?l:c,g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=f&&g.y>=d&&g.y<=p&&Uo(s,o,a,l,r,c,g.x,g.y)&&Ve(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function j3(e,t,n,i){let s=e.prev,a=e,r=e.next;if(Ve(s,a,r)>=0)return!1;let o=s.x,l=a.x,c=r.x,h=s.y,d=a.y,f=r.y,p=o<l?o<c?o:c:l<c?l:c,g=h<d?h<f?h:f:d<f?d:f,M=o>l?o>c?o:c:l>c?l:c,m=h>d?h>f?h:f:d>f?d:f,u=d0(p,g,t,n,i),y=d0(M,m,t,n,i),_=e.prevZ,v=e.nextZ;for(;_&&_.z>=u&&v&&v.z<=y;){if(_.x>=p&&_.x<=M&&_.y>=g&&_.y<=m&&_!==s&&_!==r&&Uo(o,h,l,d,c,f,_.x,_.y)&&Ve(_.prev,_,_.next)>=0||(_=_.prevZ,v.x>=p&&v.x<=M&&v.y>=g&&v.y<=m&&v!==s&&v!==r&&Uo(o,h,l,d,c,f,v.x,v.y)&&Ve(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;_&&_.z>=u;){if(_.x>=p&&_.x<=M&&_.y>=g&&_.y<=m&&_!==s&&_!==r&&Uo(o,h,l,d,c,f,_.x,_.y)&&Ve(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;v&&v.z<=y;){if(v.x>=p&&v.x<=M&&v.y>=g&&v.y<=m&&v!==s&&v!==r&&Uo(o,h,l,d,c,f,v.x,v.y)&&Ve(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function $3(e,t,n){let i=e;do{let s=i.prev,a=i.next.next;!Tf(s,a)&&wb(s,i,i.next,a)&&Ac(s,a)&&Ac(a,s)&&(t.push(s.i/n|0),t.push(i.i/n|0),t.push(a.i/n|0),wc(i),wc(i.next),i=e=a),i=i.next}while(i!==e);return ur(i)}function tD(e,t,n,i,s,a){let r=e;do{let o=r.next.next;for(;o!==r.prev;){if(r.i!==o.i&&cD(r,o)){let l=Rb(r,o);r=ur(r,r.next),l=ur(l,l.next),Tc(r,t,n,i,s,a,0),Tc(l,t,n,i,s,a,0);return}o=o.next}r=r.next}while(r!==e)}function eD(e,t,n,i){let s=[],a,r,o,l,c;for(a=0,r=t.length;a<r;a++)o=t[a]*i,l=a<r-1?t[a+1]*i:e.length,c=Ab(e,o,l,i,!1),c===c.next&&(c.steiner=!0),s.push(lD(c));for(s.sort(nD),a=0;a<s.length;a++)n=iD(s[a],n);return n}function nD(e,t){return e.x-t.x}function iD(e,t){let n=sD(e,t);if(!n)return t;let i=Rb(n,e);return ur(i,i.next),ur(n,n.next)}function sD(e,t){let n=t,i=-1/0,s,a=e.x,r=e.y;do{if(r<=n.y&&r>=n.next.y&&n.next.y!==n.y){let f=n.x+(r-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(f<=a&&f>i&&(i=f,s=n.x<n.next.x?n:n.next,f===a))return s}n=n.next}while(n!==t);if(!s)return null;let o=s,l=s.x,c=s.y,h=1/0,d;n=s;do a>=n.x&&n.x>=l&&a!==n.x&&Uo(r<c?a:i,r,l,c,r<c?i:a,r,n.x,n.y)&&(d=Math.abs(r-n.y)/(a-n.x),Ac(n,e)&&(d<h||d===h&&(n.x>s.x||n.x===s.x&&aD(s,n)))&&(s=n,h=d)),n=n.next;while(n!==o);return s}function aD(e,t){return Ve(e.prev,e,t.prev)<0&&Ve(t.next,e,e.next)<0}function rD(e,t,n,i){let s=e;do s.z===0&&(s.z=d0(s.x,s.y,t,n,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==e);s.prevZ.nextZ=null,s.prevZ=null,oD(s)}function oD(e){let t,n,i,s,a,r,o,l,c=1;do{for(n=e,e=null,a=null,r=0;n;){for(r++,i=n,o=0,t=0;t<c&&(o++,i=i.nextZ,!!i);t++);for(l=c;o>0||l>0&&i;)o!==0&&(l===0||!i||n.z<=i.z)?(s=n,n=n.nextZ,o--):(s=i,i=i.nextZ,l--),a?a.nextZ=s:e=s,s.prevZ=a,a=s;n=i}a.nextZ=null,c*=2}while(r>1);return e}function d0(e,t,n,i,s){return e=(e-n)*s|0,t=(t-i)*s|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function lD(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function Uo(e,t,n,i,s,a,r,o){return(s-r)*(t-o)>=(e-r)*(a-o)&&(e-r)*(i-o)>=(n-r)*(t-o)&&(n-r)*(a-o)>=(s-r)*(i-o)}function cD(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!uD(e,t)&&(Ac(e,t)&&Ac(t,e)&&hD(e,t)&&(Ve(e.prev,e,t.prev)||Ve(e,t.prev,t))||Tf(e,t)&&Ve(e.prev,e,e.next)>0&&Ve(t.prev,t,t.next)>0)}function Ve(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function Tf(e,t){return e.x===t.x&&e.y===t.y}function wb(e,t,n,i){let s=Fh(Ve(e,t,n)),a=Fh(Ve(e,t,i)),r=Fh(Ve(n,i,e)),o=Fh(Ve(n,i,t));return!!(s!==a&&r!==o||s===0&&Bh(e,n,t)||a===0&&Bh(e,i,t)||r===0&&Bh(n,e,i)||o===0&&Bh(n,t,i))}function Bh(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function Fh(e){return e>0?1:e<0?-1:0}function uD(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&wb(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function Ac(e,t){return Ve(e.prev,e,e.next)<0?Ve(e,t,e.next)>=0&&Ve(e,e.prev,t)>=0:Ve(e,t,e.prev)<0||Ve(e,e.next,t)<0}function hD(e,t){let n=e,i=!1,s=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&s<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(i=!i),n=n.next;while(n!==e);return i}function Rb(e,t){let n=new p0(e.i,e.x,e.y),i=new p0(t.i,t.x,t.y),s=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=s,s.prev=n,i.next=n,n.prev=i,a.next=i,i.prev=a,i}function KS(e,t,n,i){let s=new p0(e,t,n);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function wc(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function p0(e,t,n){this.i=e,this.x=t,this.y=n,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function fD(e,t,n,i){let s=0;for(let a=t,r=n-i;a<n;a+=i)s+=(e[r]-e[a])*(e[a+1]+e[r+1]),r=a;return s}function jS(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function $S(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}function pD(e,t,n){if(n.shapes=[],Array.isArray(e))for(let i=0,s=e.length;i<s;i++){let a=e[i];n.shapes.push(a.uuid)}else n.shapes.push(e.uuid);return n.options=Object.assign({},t),t.extrudePath!==void 0&&(n.options.extrudePath=t.extrudePath.toJSON()),n}function Hh(e,t,n){return!e||!n&&e.constructor===t?e:typeof t.BYTES_PER_ELEMENT=="number"?new t(e):Array.prototype.slice.call(e)}function mD(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function nb(){return performance.now()}var hA,ZM,fA,ib,w0,Ds,ba,En,oi,$i,Ma,Ea,JM,QM,dA,ir,pA,mA,gA,vA,_A,yA,xA,MA,ng,ig,SA,bA,EA,TA,AA,wA,RA,CA,DA,sg,ag,rg,Oo,og,lg,cg,ug,sb,UA,NA,Sa,R0,C0,D0,Dc,LA,U0,N0,ab,Po,zo,hg,fg,Sf,Bo,ar,dg,li,IA,fh,Ki,Mm,rr,Os,rb,ob,vc,L0,or,ji,ci,I0,O0,Fo,lb,cb,ub,Oi,hb,fb,No,Ho,P0,z0,db,B0,F0,Vh,Gh,kh,Xh,pg,mg,gg,vg,_g,yg,xg,Mg,Sg,bg,Eg,Tg,Ag,wg,Rg,Cg,Dg,Ug,Ng,Lg,Ig,Wh,Og,Pg,pb,zg,Bg,Fg,qh,Hg,Sm,KM,jM,$M,OA,PA,mb,zA,ya,dn,qo,bf,ye,uo,tS,BA,FA,HA,gb,VA,GA,kA,XA,Vg,eS,Ns,Yh,Ta,Sn,bm,Gg,ct,te,Tm,nS,ce,iS,sS,aS,rS,oS,ho,kg,QA,Jh,KA,Xn,Xe,Xg,xn,Qh,Wg,Ti,N,wm,lS,Ps,Ts,Ni,dh,fo,po,mo,da,pa,Qa,nc,ph,mh,Ka,jA,ic,Cm,lr,As,Dm,gh,ma,Um,vh,Nm,qg,fe,go,Li,$A,tw,ga,_h,ai,cS,uS,Ai,Kh,ew,hS,vo,ws,yh,sc,nw,iw,fS,dS,pS,mS,sw,_o,Lm,An,Ii,Rs,Im,Cs,yo,xo,gS,Om,Pm,zm,Bm,Fm,Hm,xa,_b,va,xh,qt,bn,aw,Aa,Wn,tn,Mh,Tn,jh,$h,me,rw,Ei,Gm,Mo,ri,ac,fn,rn,vS,ja,Sh,_S,bh,Eh,Th,km,Ah,yS,wh,Zt,On,wa,cw,uw,Ye,tf,_a,xS,MS,Ln,So,bo,Yg,ef,Zg,Xm,hw,fw,Us,$a,Ch,_c,Pi,pw,mw,gw,vw,_w,yw,xw,Mw,Sw,bw,Ew,Tw,Aw,ww,Rw,Cw,Dw,Uw,Nw,Lw,Iw,Ow,Pw,zw,Bw,Fw,Hw,Vw,Gw,kw,Xw,Ww,qw,Yw,Zw,Jw,Qw,Kw,jw,$w,t2,e2,n2,i2,s2,a2,r2,o2,l2,c2,u2,h2,f2,d2,p2,m2,g2,v2,_2,y2,x2,M2,S2,b2,E2,T2,A2,w2,R2,C2,D2,U2,N2,L2,I2,O2,P2,z2,B2,F2,H2,V2,G2,k2,X2,W2,q2,Y2,Z2,J2,Q2,K2,j2,$2,tR,eR,nR,iR,sR,aR,rR,oR,lR,cR,uR,hR,fR,dR,pR,mR,gR,vR,_R,yR,xR,MR,SR,bR,ER,TR,AR,wR,RR,CR,DR,UR,NR,LR,IR,OR,PR,zR,BR,FR,HR,VR,GR,kR,XR,WR,qR,ee,bt,Ji,Dh,tr,YR,Go,Do,SS,sr,Wm,bS,qm,Ym,Zm,Jm,nr,Eo,ES,ko,nf,Mb,RS,Sb,bb,Eb,CS,DS,US,NS,LS,Jg,Qg,Kg,Qm,Io,QC,KC,PS,Nh,r3,o3,c3,v3,$g,t0,E3,e0,n0,R3,C3,U3,i0,In,P3,dc,z3,B3,s0,a0,er,F3,sf,af,yc,rf,Un,xc,Mc,To,rc,Ao,wo,Ro,oc,Tb,Lh,lc,Ih,qS,Km,YS,of,r0,Sc,Co,ZS,Ph,JS,G3,cc,uc,ts,es,wi,bc,o0,zh,jm,$m,tg,Ec,lf,l0,cf,c0,uf,u0,hf,h0,f0,ff,df,qn,cr,Xo,Q3,gc,Rc,dD,pf,mf,gf,Ae,Cc,Wo,m0,g0,v0,zi,hr,_0,y0,x0,vf,fr,M0,S0,gD,b0,_f,yf,eg,tb,eb,E0,T0,xf,Mf,G0,vD,k0,_D,yD,xD,MD,SD,bD,ED,A0,Fe,YD,Yn=He(()=>{hA=0,ZM=1,fA=2,ib=1,w0=2,Ds=3,ba=0,En=1,oi=2,$i=0,Ma=1,Ea=2,JM=3,QM=4,dA=5,ir=100,pA=101,mA=102,gA=103,vA=104,_A=200,yA=201,xA=202,MA=203,ng=204,ig=205,SA=206,bA=207,EA=208,TA=209,AA=210,wA=211,RA=212,CA=213,DA=214,sg=0,ag=1,rg=2,Oo=3,og=4,lg=5,cg=6,ug=7,sb=0,UA=1,NA=2,Sa=0,R0=1,C0=2,D0=3,Dc=4,LA=5,U0=6,N0=7,ab=300,Po=301,zo=302,hg=303,fg=304,Sf=306,Bo=1e3,ar=1001,dg=1002,li=1003,IA=1004,fh=1005,Ki=1006,Mm=1007,rr=1008,Os=1009,rb=1010,ob=1011,vc=1012,L0=1013,or=1014,ji=1015,ci=1016,I0=1017,O0=1018,Fo=1020,lb=35902,cb=1021,ub=1022,Oi=1023,hb=1024,fb=1025,No=1026,Ho=1027,P0=1028,z0=1029,db=1030,B0=1031,F0=1033,Vh=33776,Gh=33777,kh=33778,Xh=33779,pg=35840,mg=35841,gg=35842,vg=35843,_g=36196,yg=37492,xg=37496,Mg=37808,Sg=37809,bg=37810,Eg=37811,Tg=37812,Ag=37813,wg=37814,Rg=37815,Cg=37816,Dg=37817,Ug=37818,Ng=37819,Lg=37820,Ig=37821,Wh=36492,Og=36494,Pg=36495,pb=36283,zg=36284,Bg=36285,Fg=36286,qh=2300,Hg=2301,Sm=2302,KM=2400,jM=2401,$M=2402,OA=3200,PA=3201,mb=0,zA=1,ya="",dn="srgb",qo="srgb-linear",bf="linear",ye="srgb",uo=7680,tS=519,BA=512,FA=513,HA=514,gb=515,VA=516,GA=517,kA=518,XA=519,Vg=35044,eS="300 es",Ns=2e3,Yh=2001,Ta=class{addEventListener(t,n){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(n)===-1&&i[t].push(n)}hasEventListener(t,n){if(this._listeners===void 0)return!1;let i=this._listeners;return i[t]!==void 0&&i[t].indexOf(n)!==-1}removeEventListener(t,n){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let a=s.indexOf(n);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let i=this._listeners[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,t);t.target=null}}},Sn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],bm=Math.PI/180,Gg=180/Math.PI;ct=class e{constructor(t=0,n=0){e.prototype.isVector2=!0,this.x=t,this.y=n}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,n){return this.x=t,this.y=n,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let n=this.x,i=this.y,s=t.elements;return this.x=s[0]*n+s[3]*i+s[6],this.y=s[1]*n+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,n){return this.x=Math.max(t.x,Math.min(n.x,this.x)),this.y=Math.max(t.y,Math.min(n.y,this.y)),this}clampScalar(t,n){return this.x=Math.max(t,Math.min(n,this.x)),this.y=Math.max(t,Math.min(n,this.y)),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let n=Math.sqrt(this.lengthSq()*t.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(t)/n;return Math.acos(yn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let n=this.x-t.x,i=this.y-t.y;return n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this}rotateAround(t,n){let i=Math.cos(n),s=Math.sin(n),a=this.x-t.x,r=this.y-t.y;return this.x=a*i-r*s+t.x,this.y=a*s+r*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},te=class e{constructor(t,n,i,s,a,r,o,l,c){e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,n,i,s,a,r,o,l,c)}set(t,n,i,s,a,r,o,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=n,h[4]=a,h[5]=l,h[6]=i,h[7]=r,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let n=this.elements,i=t.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(t,n,i){return t.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let n=t.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,n){let i=t.elements,s=n.elements,a=this.elements,r=i[0],o=i[3],l=i[6],c=i[1],h=i[4],d=i[7],f=i[2],p=i[5],g=i[8],M=s[0],m=s[3],u=s[6],y=s[1],_=s[4],v=s[7],R=s[2],w=s[5],A=s[8];return a[0]=r*M+o*y+l*R,a[3]=r*m+o*_+l*w,a[6]=r*u+o*v+l*A,a[1]=c*M+h*y+d*R,a[4]=c*m+h*_+d*w,a[7]=c*u+h*v+d*A,a[2]=f*M+p*y+g*R,a[5]=f*m+p*_+g*w,a[8]=f*u+p*v+g*A,this}multiplyScalar(t){let n=this.elements;return n[0]*=t,n[3]*=t,n[6]*=t,n[1]*=t,n[4]*=t,n[7]*=t,n[2]*=t,n[5]*=t,n[8]*=t,this}determinant(){let t=this.elements,n=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return n*r*h-n*o*c-i*a*h+i*o*l+s*a*c-s*r*l}invert(){let t=this.elements,n=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=h*r-o*c,f=o*l-h*a,p=c*a-r*l,g=n*d+i*f+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let M=1/g;return t[0]=d*M,t[1]=(s*c-h*i)*M,t[2]=(o*i-s*r)*M,t[3]=f*M,t[4]=(h*n-s*l)*M,t[5]=(s*a-o*n)*M,t[6]=p*M,t[7]=(i*l-c*n)*M,t[8]=(r*n-i*a)*M,this}transpose(){let t,n=this.elements;return t=n[1],n[1]=n[3],n[3]=t,t=n[2],n[2]=n[6],n[6]=t,t=n[5],n[5]=n[7],n[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let n=this.elements;return t[0]=n[0],t[1]=n[3],t[2]=n[6],t[3]=n[1],t[4]=n[4],t[5]=n[7],t[6]=n[2],t[7]=n[5],t[8]=n[8],this}setUvTransform(t,n,i,s,a,r,o){let l=Math.cos(a),c=Math.sin(a);return this.set(i*l,i*c,-i*(l*r+c*o)+r+t,-s*c,s*l,-s*(-c*r+l*o)+o+n,0,0,1),this}scale(t,n){return this.premultiply(Tm.makeScale(t,n)),this}rotate(t){return this.premultiply(Tm.makeRotation(-t)),this}translate(t,n){return this.premultiply(Tm.makeTranslation(t,n)),this}makeTranslation(t,n){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,n,0,0,1),this}makeRotation(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(t,n){return this.set(t,0,0,0,n,0,0,0,1),this}equals(t){let n=this.elements,i=t.elements;for(let s=0;s<9;s++)if(n[s]!==i[s])return!1;return!0}fromArray(t,n=0){for(let i=0;i<9;i++)this.elements[i]=t[i+n];return this}toArray(t=[],n=0){let i=this.elements;return t[n]=i[0],t[n+1]=i[1],t[n+2]=i[2],t[n+3]=i[3],t[n+4]=i[4],t[n+5]=i[5],t[n+6]=i[6],t[n+7]=i[7],t[n+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Tm=new te;nS={};ce={enabled:!0,workingColorSpace:qo,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===ye&&(e.r=Is(e.r),e.g=Is(e.g),e.b=Is(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===ye&&(e.r=Lo(e.r),e.g=Lo(e.g),e.b=Lo(e.b))),e},fromWorkingColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},toWorkingColorSpace:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===ya?bf:this.spaces[e].transfer},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace}};iS=[.64,.33,.3,.6,.15,.06],sS=[.2126,.7152,.0722],aS=[.3127,.329],rS=new te().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),oS=new te().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ce.define({[qo]:{primaries:iS,whitePoint:aS,transfer:bf,toXYZ:rS,fromXYZ:oS,luminanceCoefficients:sS,workingColorSpaceConfig:{unpackColorSpace:dn},outputColorSpaceConfig:{drawingBufferColorSpace:dn}},[dn]:{primaries:iS,whitePoint:aS,transfer:ye,toXYZ:rS,fromXYZ:oS,luminanceCoefficients:sS,outputColorSpaceConfig:{drawingBufferColorSpace:dn}}});kg=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{ho===void 0&&(ho=Zh("canvas")),ho.width=t.width,ho.height=t.height;let i=ho.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=ho}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let n=Zh("canvas");n.width=t.width,n.height=t.height;let i=n.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=Is(a[r]/255)*255;return i.putImageData(s,0,0),n}else if(t.data){let n=t.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Is(n[i]/255)*255):n[i]=Is(n[i]);return{data:n,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},QA=0,Jh=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:QA++}),this.uuid=Ls(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let n=t===void 0||typeof t=="string";if(!n&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Am(s[r].image)):a.push(Am(s[r]))}else a=Am(s);i.url=a}return n||(t.images[this.uuid]=i),i}};KA=0,Xn=class e extends Ta{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,i=ar,s=ar,a=Ki,r=rr,o=Oi,l=Os,c=e.DEFAULT_ANISOTROPY,h=ya){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:KA++}),this.uuid=Ls(),this.name="",this.source=new Jh(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ct(0,0),this.repeat=new ct(1,1),this.center=new ct(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new te,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let n=t===void 0||typeof t=="string";if(!n&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ab)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Bo:t.x=t.x-Math.floor(t.x);break;case ar:t.x=t.x<0?0:1;break;case dg:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Bo:t.y=t.y-Math.floor(t.y);break;case ar:t.y=t.y<0?0:1;break;case dg:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Xn.DEFAULT_IMAGE=null;Xn.DEFAULT_MAPPING=ab;Xn.DEFAULT_ANISOTROPY=1;Xe=class e{constructor(t=0,n=0,i=0,s=1){e.prototype.isVector4=!0,this.x=t,this.y=n,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,n,i,s){return this.x=t,this.y=n,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this.w=t.w+n.w,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this.w+=t.w*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this.w=t.w-n.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let n=this.x,i=this.y,s=this.z,a=this.w,r=t.elements;return this.x=r[0]*n+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*n+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*n+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*n+r[7]*i+r[11]*s+r[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let n=Math.sqrt(1-t.w*t.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/n,this.y=t.y/n,this.z=t.z/n),this}setAxisAngleFromRotationMatrix(t){let n,i,s,a,l=t.elements,c=l[0],h=l[4],d=l[8],f=l[1],p=l[5],g=l[9],M=l[2],m=l[6],u=l[10];if(Math.abs(h-f)<.01&&Math.abs(d-M)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+M)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+u-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;let _=(c+1)/2,v=(p+1)/2,R=(u+1)/2,w=(h+f)/4,A=(d+M)/4,C=(g+m)/4;return _>v&&_>R?_<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(_),s=w/i,a=A/i):v>R?v<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(v),i=w/s,a=C/s):R<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(R),i=A/a,s=C/a),this.set(i,s,a,n),this}let y=Math.sqrt((m-g)*(m-g)+(d-M)*(d-M)+(f-h)*(f-h));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(d-M)/y,this.z=(f-h)/y,this.w=Math.acos((c+p+u-1)/2),this}setFromMatrixPosition(t){let n=t.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,n){return this.x=Math.max(t.x,Math.min(n.x,this.x)),this.y=Math.max(t.y,Math.min(n.y,this.y)),this.z=Math.max(t.z,Math.min(n.z,this.z)),this.w=Math.max(t.w,Math.min(n.w,this.w)),this}clampScalar(t,n){return this.x=Math.max(t,Math.min(n,this.x)),this.y=Math.max(t,Math.min(n,this.y)),this.z=Math.max(t,Math.min(n,this.z)),this.w=Math.max(t,Math.min(n,this.w)),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this.w+=(t.w-this.w)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this.z=t.z+(n.z-t.z)*i,this.w=t.w+(n.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this.z=t[n+2],this.w=t[n+3],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t[n+2]=this.z,t[n+3]=this.w,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this.z=t.getZ(n),this.w=t.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Xg=class extends Ta{constructor(t=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=n,this.depth=1,this.scissor=new Xe(0,0,t,n),this.scissorTest=!1,this.viewport=new Xe(0,0,t,n);let s={width:t,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ki,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);let a=new Xn(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);a.flipY=!1,a.generateMipmaps=i.generateMipmaps,a.internalFormat=i.internalFormat,this.textures=[];let r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,n,i=1){if(this.width!==t||this.height!==n||this.depth!==i){this.width=t,this.height=n,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=n,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,t,n),this.scissor.set(0,0,t,n)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,s=t.textures.length;i<s;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;let n=Object.assign({},t.texture.image);return this.texture.source=new Jh(n),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},xn=class extends Xg{constructor(t=1,n=1,i={}){super(t,n,i),this.isWebGLRenderTarget=!0}},Qh=class extends Xn{constructor(t=null,n=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:n,height:i,depth:s},this.magFilter=li,this.minFilter=li,this.wrapR=ar,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}},Wg=class extends Xn{constructor(t=null,n=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:n,height:i,depth:s},this.magFilter=li,this.minFilter=li,this.wrapR=ar,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Ti=class{constructor(t=0,n=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=n,this._z=i,this._w=s}static slerpFlat(t,n,i,s,a,r,o){let l=i[s+0],c=i[s+1],h=i[s+2],d=i[s+3],f=a[r+0],p=a[r+1],g=a[r+2],M=a[r+3];if(o===0){t[n+0]=l,t[n+1]=c,t[n+2]=h,t[n+3]=d;return}if(o===1){t[n+0]=f,t[n+1]=p,t[n+2]=g,t[n+3]=M;return}if(d!==M||l!==f||c!==p||h!==g){let m=1-o,u=l*f+c*p+h*g+d*M,y=u>=0?1:-1,_=1-u*u;if(_>Number.EPSILON){let R=Math.sqrt(_),w=Math.atan2(R,u*y);m=Math.sin(m*w)/R,o=Math.sin(o*w)/R}let v=o*y;if(l=l*m+f*v,c=c*m+p*v,h=h*m+g*v,d=d*m+M*v,m===1-o){let R=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=R,c*=R,h*=R,d*=R}}t[n]=l,t[n+1]=c,t[n+2]=h,t[n+3]=d}static multiplyQuaternionsFlat(t,n,i,s,a,r){let o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],d=a[r],f=a[r+1],p=a[r+2],g=a[r+3];return t[n]=o*g+h*d+l*p-c*f,t[n+1]=l*g+h*f+c*d-o*p,t[n+2]=c*g+h*p+o*f-l*d,t[n+3]=h*g-o*d-l*f-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,n,i,s){return this._x=t,this._y=n,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,n=!0){let i=t._x,s=t._y,a=t._z,r=t._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),d=o(a/2),f=l(i/2),p=l(s/2),g=l(a/2);switch(r){case"XYZ":this._x=f*h*d+c*p*g,this._y=c*p*d-f*h*g,this._z=c*h*g+f*p*d,this._w=c*h*d-f*p*g;break;case"YXZ":this._x=f*h*d+c*p*g,this._y=c*p*d-f*h*g,this._z=c*h*g-f*p*d,this._w=c*h*d+f*p*g;break;case"ZXY":this._x=f*h*d-c*p*g,this._y=c*p*d+f*h*g,this._z=c*h*g+f*p*d,this._w=c*h*d-f*p*g;break;case"ZYX":this._x=f*h*d-c*p*g,this._y=c*p*d+f*h*g,this._z=c*h*g-f*p*d,this._w=c*h*d+f*p*g;break;case"YZX":this._x=f*h*d+c*p*g,this._y=c*p*d+f*h*g,this._z=c*h*g-f*p*d,this._w=c*h*d-f*p*g;break;case"XZY":this._x=f*h*d-c*p*g,this._y=c*p*d-f*h*g,this._z=c*h*g+f*p*d,this._w=c*h*d+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,n){let i=n/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let n=t.elements,i=n[0],s=n[4],a=n[8],r=n[1],o=n[5],l=n[9],c=n[2],h=n[6],d=n[10],f=i+o+d;if(f>0){let p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(h-l)*p,this._y=(a-c)*p,this._z=(r-s)*p}else if(i>o&&i>d){let p=2*Math.sqrt(1+i-o-d);this._w=(h-l)/p,this._x=.25*p,this._y=(s+r)/p,this._z=(a+c)/p}else if(o>d){let p=2*Math.sqrt(1+o-i-d);this._w=(a-c)/p,this._x=(s+r)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+d-i-o);this._w=(r-s)/p,this._x=(a+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,n){let i=t.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*n.z-t.z*n.y,this._y=t.z*n.x-t.x*n.z,this._z=t.x*n.y-t.y*n.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(yn(this.dot(t),-1,1)))}rotateTowards(t,n){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,n/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,n){let i=t._x,s=t._y,a=t._z,r=t._w,o=n._x,l=n._y,c=n._z,h=n._w;return this._x=i*h+r*o+s*c-a*l,this._y=s*h+r*l+a*o-i*c,this._z=a*h+r*c+i*l-s*o,this._w=r*h-i*o-s*l-a*c,this._onChangeCallback(),this}slerp(t,n){if(n===0)return this;if(n===1)return this.copy(t);let i=this._x,s=this._y,a=this._z,r=this._w,o=r*t._w+i*t._x+s*t._y+a*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=r,this._x=i,this._y=s,this._z=a,this;let l=1-o*o;if(l<=Number.EPSILON){let p=1-n;return this._w=p*r+n*this._w,this._x=p*i+n*this._x,this._y=p*s+n*this._y,this._z=p*a+n*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-n)*h)/c,f=Math.sin(n*h)/c;return this._w=r*d+this._w*f,this._x=i*d+this._x*f,this._y=s*d+this._y*f,this._z=a*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,n,i){return this.copy(t).slerp(n,i)}random(){let t=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(n),a*Math.cos(n))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,n=0){return this._x=t[n],this._y=t[n+1],this._z=t[n+2],this._w=t[n+3],this._onChangeCallback(),this}toArray(t=[],n=0){return t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._w,t}fromBufferAttribute(t,n){return this._x=t.getX(n),this._y=t.getY(n),this._z=t.getZ(n),this._w=t.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},N=class e{constructor(t=0,n=0,i=0){e.prototype.isVector3=!0,this.x=t,this.y=n,this.z=i}set(t,n,i){return i===void 0&&(i=this.z),this.x=t,this.y=n,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,n){switch(t){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,n){return this.x=t.x+n.x,this.y=t.y+n.y,this.z=t.z+n.z,this}addScaledVector(t,n){return this.x+=t.x*n,this.y+=t.y*n,this.z+=t.z*n,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,n){return this.x=t.x-n.x,this.y=t.y-n.y,this.z=t.z-n.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,n){return this.x=t.x*n.x,this.y=t.y*n.y,this.z=t.z*n.z,this}applyEuler(t){return this.applyQuaternion(lS.setFromEuler(t))}applyAxisAngle(t,n){return this.applyQuaternion(lS.setFromAxisAngle(t,n))}applyMatrix3(t){let n=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*n+a[3]*i+a[6]*s,this.y=a[1]*n+a[4]*i+a[7]*s,this.z=a[2]*n+a[5]*i+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let n=this.x,i=this.y,s=this.z,a=t.elements,r=1/(a[3]*n+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*n+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*n+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*n+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(t){let n=this.x,i=this.y,s=this.z,a=t.x,r=t.y,o=t.z,l=t.w,c=2*(r*s-o*i),h=2*(o*n-a*s),d=2*(a*i-r*n);return this.x=n+l*c+r*d-o*h,this.y=i+l*h+o*c-a*d,this.z=s+l*d+a*h-r*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let n=this.x,i=this.y,s=this.z,a=t.elements;return this.x=a[0]*n+a[4]*i+a[8]*s,this.y=a[1]*n+a[5]*i+a[9]*s,this.z=a[2]*n+a[6]*i+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,n){return this.x=Math.max(t.x,Math.min(n.x,this.x)),this.y=Math.max(t.y,Math.min(n.y,this.y)),this.z=Math.max(t.z,Math.min(n.z,this.z)),this}clampScalar(t,n){return this.x=Math.max(t,Math.min(n,this.x)),this.y=Math.max(t,Math.min(n,this.y)),this.z=Math.max(t,Math.min(n,this.z)),this}clampLength(t,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,n){return this.x+=(t.x-this.x)*n,this.y+=(t.y-this.y)*n,this.z+=(t.z-this.z)*n,this}lerpVectors(t,n,i){return this.x=t.x+(n.x-t.x)*i,this.y=t.y+(n.y-t.y)*i,this.z=t.z+(n.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,n){let i=t.x,s=t.y,a=t.z,r=n.x,o=n.y,l=n.z;return this.x=s*l-a*o,this.y=a*r-i*l,this.z=i*o-s*r,this}projectOnVector(t){let n=t.lengthSq();if(n===0)return this.set(0,0,0);let i=t.dot(this)/n;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return wm.copy(this).projectOnVector(t),this.sub(wm)}reflect(t){return this.sub(wm.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let n=Math.sqrt(this.lengthSq()*t.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(t)/n;return Math.acos(yn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let n=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return n*n+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,n,i){let s=Math.sin(n)*t;return this.x=s*Math.sin(i),this.y=Math.cos(n)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,n,i){return this.x=t*Math.sin(n),this.y=i,this.z=t*Math.cos(n),this}setFromMatrixPosition(t){let n=t.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(t){let n=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=n,this.y=i,this.z=s,this}setFromMatrixColumn(t,n){return this.fromArray(t.elements,n*4)}setFromMatrix3Column(t,n){return this.fromArray(t.elements,n*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,n=0){return this.x=t[n],this.y=t[n+1],this.z=t[n+2],this}toArray(t=[],n=0){return t[n]=this.x,t[n+1]=this.y,t[n+2]=this.z,t}fromBufferAttribute(t,n){return this.x=t.getX(n),this.y=t.getY(n),this.z=t.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(t),this.y=n,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},wm=new N,lS=new Ti,Ps=class{constructor(t=new N(1/0,1/0,1/0),n=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=n}set(t,n){return this.min.copy(t),this.max.copy(n),this}setFromArray(t){this.makeEmpty();for(let n=0,i=t.length;n<i;n+=3)this.expandByPoint(Ni.fromArray(t,n));return this}setFromBufferAttribute(t){this.makeEmpty();for(let n=0,i=t.count;n<i;n++)this.expandByPoint(Ni.fromBufferAttribute(t,n));return this}setFromPoints(t){this.makeEmpty();for(let n=0,i=t.length;n<i;n++)this.expandByPoint(t[n]);return this}setFromCenterAndSize(t,n){let i=Ni.copy(n).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,n=!1){return this.makeEmpty(),this.expandByObject(t,n)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,n=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let a=i.getAttribute("position");if(n===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,Ni):Ni.fromBufferAttribute(a,r),Ni.applyMatrix4(t.matrixWorld),this.expandByPoint(Ni);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),dh.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),dh.copy(i.boundingBox)),dh.applyMatrix4(t.matrixWorld),this.union(dh)}let s=t.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],n);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,n){return n.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ni),Ni.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let n,i;return t.normal.x>0?(n=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(n=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(n+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(n+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(n+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(n+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),n<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(nc),ph.subVectors(this.max,nc),fo.subVectors(t.a,nc),po.subVectors(t.b,nc),mo.subVectors(t.c,nc),da.subVectors(po,fo),pa.subVectors(mo,po),Qa.subVectors(fo,mo);let n=[0,-da.z,da.y,0,-pa.z,pa.y,0,-Qa.z,Qa.y,da.z,0,-da.x,pa.z,0,-pa.x,Qa.z,0,-Qa.x,-da.y,da.x,0,-pa.y,pa.x,0,-Qa.y,Qa.x,0];return!Rm(n,fo,po,mo,ph)||(n=[1,0,0,0,1,0,0,0,1],!Rm(n,fo,po,mo,ph))?!1:(mh.crossVectors(da,pa),n=[mh.x,mh.y,mh.z],Rm(n,fo,po,mo,ph))}clampPoint(t,n){return n.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ni).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ni).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ts[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ts[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ts[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ts[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ts[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ts[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ts[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ts[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ts),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Ts=[new N,new N,new N,new N,new N,new N,new N,new N],Ni=new N,dh=new Ps,fo=new N,po=new N,mo=new N,da=new N,pa=new N,Qa=new N,nc=new N,ph=new N,mh=new N,Ka=new N;jA=new Ps,ic=new N,Cm=new N,lr=class{constructor(t=new N,n=-1){this.isSphere=!0,this.center=t,this.radius=n}set(t,n){return this.center.copy(t),this.radius=n,this}setFromPoints(t,n){let i=this.center;n!==void 0?i.copy(n):jA.setFromPoints(t).getCenter(i);let s=0;for(let a=0,r=t.length;a<r;a++)s=Math.max(s,i.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let n=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=n*n}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,n){let i=this.center.distanceToSquared(t);return n.copy(t),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ic.subVectors(t,this.center);let n=ic.lengthSq();if(n>this.radius*this.radius){let i=Math.sqrt(n),s=(i-this.radius)*.5;this.center.addScaledVector(ic,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Cm.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ic.copy(t.center).add(Cm)),this.expandByPoint(ic.copy(t.center).sub(Cm))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},As=new N,Dm=new N,gh=new N,ma=new N,Um=new N,vh=new N,Nm=new N,qg=class{constructor(t=new N,n=new N(0,0,-1)){this.origin=t,this.direction=n}set(t,n){return this.origin.copy(t),this.direction.copy(n),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,n){return n.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,As)),this}closestPointToPoint(t,n){n.subVectors(t,this.origin);let i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let n=As.subVectors(t,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(t):(As.copy(this.origin).addScaledVector(this.direction,n),As.distanceToSquared(t))}distanceSqToSegment(t,n,i,s){Dm.copy(t).add(n).multiplyScalar(.5),gh.copy(n).sub(t).normalize(),ma.copy(this.origin).sub(Dm);let a=t.distanceTo(n)*.5,r=-this.direction.dot(gh),o=ma.dot(this.direction),l=-ma.dot(gh),c=ma.lengthSq(),h=Math.abs(1-r*r),d,f,p,g;if(h>0)if(d=r*l-o,f=r*o-l,g=a*h,d>=0)if(f>=-g)if(f<=g){let M=1/h;d*=M,f*=M,p=d*(d+r*f+2*o)+f*(r*d+f+2*l)+c}else f=a,d=Math.max(0,-(r*f+o)),p=-d*d+f*(f+2*l)+c;else f=-a,d=Math.max(0,-(r*f+o)),p=-d*d+f*(f+2*l)+c;else f<=-g?(d=Math.max(0,-(-r*a+o)),f=d>0?-a:Math.min(Math.max(-a,-l),a),p=-d*d+f*(f+2*l)+c):f<=g?(d=0,f=Math.min(Math.max(-a,-l),a),p=f*(f+2*l)+c):(d=Math.max(0,-(r*a+o)),f=d>0?a:Math.min(Math.max(-a,-l),a),p=-d*d+f*(f+2*l)+c);else f=r>0?-a:a,d=Math.max(0,-(r*f+o)),p=-d*d+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Dm).addScaledVector(gh,f),p}intersectSphere(t,n){As.subVectors(t.center,this.origin);let i=As.dot(this.direction),s=As.dot(As)-i*i,a=t.radius*t.radius;if(s>a)return null;let r=Math.sqrt(a-s),o=i-r,l=i+r;return l<0?null:o<0?this.at(l,n):this.at(o,n)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let n=t.normal.dot(this.direction);if(n===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/n;return i>=0?i:null}intersectPlane(t,n){let i=this.distanceToPlane(t);return i===null?null:this.at(i,n)}intersectsPlane(t){let n=t.distanceToPoint(this.origin);return n===0||t.normal.dot(this.direction)*n<0}intersectBox(t,n){let i,s,a,r,o,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(i=(t.min.x-f.x)*c,s=(t.max.x-f.x)*c):(i=(t.max.x-f.x)*c,s=(t.min.x-f.x)*c),h>=0?(a=(t.min.y-f.y)*h,r=(t.max.y-f.y)*h):(a=(t.max.y-f.y)*h,r=(t.min.y-f.y)*h),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),d>=0?(o=(t.min.z-f.z)*d,l=(t.max.z-f.z)*d):(o=(t.max.z-f.z)*d,l=(t.min.z-f.z)*d),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,n)}intersectsBox(t){return this.intersectBox(t,As)!==null}intersectTriangle(t,n,i,s,a){Um.subVectors(n,t),vh.subVectors(i,t),Nm.crossVectors(Um,vh);let r=this.direction.dot(Nm),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;ma.subVectors(this.origin,t);let l=o*this.direction.dot(vh.crossVectors(ma,vh));if(l<0)return null;let c=o*this.direction.dot(Um.cross(ma));if(c<0||l+c>r)return null;let h=-o*ma.dot(Nm);return h<0?null:this.at(h/r,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},fe=class e{constructor(t,n,i,s,a,r,o,l,c,h,d,f,p,g,M,m){e.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,n,i,s,a,r,o,l,c,h,d,f,p,g,M,m)}set(t,n,i,s,a,r,o,l,c,h,d,f,p,g,M,m){let u=this.elements;return u[0]=t,u[4]=n,u[8]=i,u[12]=s,u[1]=a,u[5]=r,u[9]=o,u[13]=l,u[2]=c,u[6]=h,u[10]=d,u[14]=f,u[3]=p,u[7]=g,u[11]=M,u[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(t){let n=this.elements,i=t.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(t){let n=this.elements,i=t.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(t){let n=t.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(t,n,i){return t.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,n,i){return this.set(t.x,n.x,i.x,0,t.y,n.y,i.y,0,t.z,n.z,i.z,0,0,0,0,1),this}extractRotation(t){let n=this.elements,i=t.elements,s=1/go.setFromMatrixColumn(t,0).length(),a=1/go.setFromMatrixColumn(t,1).length(),r=1/go.setFromMatrixColumn(t,2).length();return n[0]=i[0]*s,n[1]=i[1]*s,n[2]=i[2]*s,n[3]=0,n[4]=i[4]*a,n[5]=i[5]*a,n[6]=i[6]*a,n[7]=0,n[8]=i[8]*r,n[9]=i[9]*r,n[10]=i[10]*r,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(t){let n=this.elements,i=t.x,s=t.y,a=t.z,r=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(a),d=Math.sin(a);if(t.order==="XYZ"){let f=r*h,p=r*d,g=o*h,M=o*d;n[0]=l*h,n[4]=-l*d,n[8]=c,n[1]=p+g*c,n[5]=f-M*c,n[9]=-o*l,n[2]=M-f*c,n[6]=g+p*c,n[10]=r*l}else if(t.order==="YXZ"){let f=l*h,p=l*d,g=c*h,M=c*d;n[0]=f+M*o,n[4]=g*o-p,n[8]=r*c,n[1]=r*d,n[5]=r*h,n[9]=-o,n[2]=p*o-g,n[6]=M+f*o,n[10]=r*l}else if(t.order==="ZXY"){let f=l*h,p=l*d,g=c*h,M=c*d;n[0]=f-M*o,n[4]=-r*d,n[8]=g+p*o,n[1]=p+g*o,n[5]=r*h,n[9]=M-f*o,n[2]=-r*c,n[6]=o,n[10]=r*l}else if(t.order==="ZYX"){let f=r*h,p=r*d,g=o*h,M=o*d;n[0]=l*h,n[4]=g*c-p,n[8]=f*c+M,n[1]=l*d,n[5]=M*c+f,n[9]=p*c-g,n[2]=-c,n[6]=o*l,n[10]=r*l}else if(t.order==="YZX"){let f=r*l,p=r*c,g=o*l,M=o*c;n[0]=l*h,n[4]=M-f*d,n[8]=g*d+p,n[1]=d,n[5]=r*h,n[9]=-o*h,n[2]=-c*h,n[6]=p*d+g,n[10]=f-M*d}else if(t.order==="XZY"){let f=r*l,p=r*c,g=o*l,M=o*c;n[0]=l*h,n[4]=-d,n[8]=c*h,n[1]=f*d+M,n[5]=r*h,n[9]=p*d-g,n[2]=g*d-p,n[6]=o*h,n[10]=M*d+f}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(t){return this.compose($A,t,tw)}lookAt(t,n,i){let s=this.elements;return ai.subVectors(t,n),ai.lengthSq()===0&&(ai.z=1),ai.normalize(),ga.crossVectors(i,ai),ga.lengthSq()===0&&(Math.abs(i.z)===1?ai.x+=1e-4:ai.z+=1e-4,ai.normalize(),ga.crossVectors(i,ai)),ga.normalize(),_h.crossVectors(ai,ga),s[0]=ga.x,s[4]=_h.x,s[8]=ai.x,s[1]=ga.y,s[5]=_h.y,s[9]=ai.y,s[2]=ga.z,s[6]=_h.z,s[10]=ai.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,n){let i=t.elements,s=n.elements,a=this.elements,r=i[0],o=i[4],l=i[8],c=i[12],h=i[1],d=i[5],f=i[9],p=i[13],g=i[2],M=i[6],m=i[10],u=i[14],y=i[3],_=i[7],v=i[11],R=i[15],w=s[0],A=s[4],C=s[8],b=s[12],S=s[1],U=s[5],F=s[9],P=s[13],z=s[2],Y=s[6],G=s[10],j=s[14],H=s[3],ut=s[7],vt=s[11],yt=s[15];return a[0]=r*w+o*S+l*z+c*H,a[4]=r*A+o*U+l*Y+c*ut,a[8]=r*C+o*F+l*G+c*vt,a[12]=r*b+o*P+l*j+c*yt,a[1]=h*w+d*S+f*z+p*H,a[5]=h*A+d*U+f*Y+p*ut,a[9]=h*C+d*F+f*G+p*vt,a[13]=h*b+d*P+f*j+p*yt,a[2]=g*w+M*S+m*z+u*H,a[6]=g*A+M*U+m*Y+u*ut,a[10]=g*C+M*F+m*G+u*vt,a[14]=g*b+M*P+m*j+u*yt,a[3]=y*w+_*S+v*z+R*H,a[7]=y*A+_*U+v*Y+R*ut,a[11]=y*C+_*F+v*G+R*vt,a[15]=y*b+_*P+v*j+R*yt,this}multiplyScalar(t){let n=this.elements;return n[0]*=t,n[4]*=t,n[8]*=t,n[12]*=t,n[1]*=t,n[5]*=t,n[9]*=t,n[13]*=t,n[2]*=t,n[6]*=t,n[10]*=t,n[14]*=t,n[3]*=t,n[7]*=t,n[11]*=t,n[15]*=t,this}determinant(){let t=this.elements,n=t[0],i=t[4],s=t[8],a=t[12],r=t[1],o=t[5],l=t[9],c=t[13],h=t[2],d=t[6],f=t[10],p=t[14],g=t[3],M=t[7],m=t[11],u=t[15];return g*(+a*l*d-s*c*d-a*o*f+i*c*f+s*o*p-i*l*p)+M*(+n*l*p-n*c*f+a*r*f-s*r*p+s*c*h-a*l*h)+m*(+n*c*d-n*o*p-a*r*d+i*r*p+a*o*h-i*c*h)+u*(-s*o*h-n*l*d+n*o*f+s*r*d-i*r*f+i*l*h)}transpose(){let t=this.elements,n;return n=t[1],t[1]=t[4],t[4]=n,n=t[2],t[2]=t[8],t[8]=n,n=t[6],t[6]=t[9],t[9]=n,n=t[3],t[3]=t[12],t[12]=n,n=t[7],t[7]=t[13],t[13]=n,n=t[11],t[11]=t[14],t[14]=n,this}setPosition(t,n,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=n,s[14]=i),this}invert(){let t=this.elements,n=t[0],i=t[1],s=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=t[9],f=t[10],p=t[11],g=t[12],M=t[13],m=t[14],u=t[15],y=d*m*c-M*f*c+M*l*p-o*m*p-d*l*u+o*f*u,_=g*f*c-h*m*c-g*l*p+r*m*p+h*l*u-r*f*u,v=h*M*c-g*d*c+g*o*p-r*M*p-h*o*u+r*d*u,R=g*d*l-h*M*l-g*o*f+r*M*f+h*o*m-r*d*m,w=n*y+i*_+s*v+a*R;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/w;return t[0]=y*A,t[1]=(M*f*a-d*m*a-M*s*p+i*m*p+d*s*u-i*f*u)*A,t[2]=(o*m*a-M*l*a+M*s*c-i*m*c-o*s*u+i*l*u)*A,t[3]=(d*l*a-o*f*a-d*s*c+i*f*c+o*s*p-i*l*p)*A,t[4]=_*A,t[5]=(h*m*a-g*f*a+g*s*p-n*m*p-h*s*u+n*f*u)*A,t[6]=(g*l*a-r*m*a-g*s*c+n*m*c+r*s*u-n*l*u)*A,t[7]=(r*f*a-h*l*a+h*s*c-n*f*c-r*s*p+n*l*p)*A,t[8]=v*A,t[9]=(g*d*a-h*M*a-g*i*p+n*M*p+h*i*u-n*d*u)*A,t[10]=(r*M*a-g*o*a+g*i*c-n*M*c-r*i*u+n*o*u)*A,t[11]=(h*o*a-r*d*a-h*i*c+n*d*c+r*i*p-n*o*p)*A,t[12]=R*A,t[13]=(h*M*s-g*d*s+g*i*f-n*M*f-h*i*m+n*d*m)*A,t[14]=(g*o*s-r*M*s-g*i*l+n*M*l+r*i*m-n*o*m)*A,t[15]=(r*d*s-h*o*s+h*i*l-n*d*l-r*i*f+n*o*f)*A,this}scale(t){let n=this.elements,i=t.x,s=t.y,a=t.z;return n[0]*=i,n[4]*=s,n[8]*=a,n[1]*=i,n[5]*=s,n[9]*=a,n[2]*=i,n[6]*=s,n[10]*=a,n[3]*=i,n[7]*=s,n[11]*=a,this}getMaxScaleOnAxis(){let t=this.elements,n=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(n,i,s))}makeTranslation(t,n,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(t){let n=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(t){let n=Math.cos(t),i=Math.sin(t);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,n){let i=Math.cos(n),s=Math.sin(n),a=1-i,r=t.x,o=t.y,l=t.z,c=a*r,h=a*o;return this.set(c*r+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*r,0,c*l-s*o,h*l+s*r,a*l*l+i,0,0,0,0,1),this}makeScale(t,n,i){return this.set(t,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,n,i,s,a,r){return this.set(1,i,a,0,t,1,r,0,n,s,1,0,0,0,0,1),this}compose(t,n,i){let s=this.elements,a=n._x,r=n._y,o=n._z,l=n._w,c=a+a,h=r+r,d=o+o,f=a*c,p=a*h,g=a*d,M=r*h,m=r*d,u=o*d,y=l*c,_=l*h,v=l*d,R=i.x,w=i.y,A=i.z;return s[0]=(1-(M+u))*R,s[1]=(p+v)*R,s[2]=(g-_)*R,s[3]=0,s[4]=(p-v)*w,s[5]=(1-(f+u))*w,s[6]=(m+y)*w,s[7]=0,s[8]=(g+_)*A,s[9]=(m-y)*A,s[10]=(1-(f+M))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,n,i){let s=this.elements,a=go.set(s[0],s[1],s[2]).length(),r=go.set(s[4],s[5],s[6]).length(),o=go.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],Li.copy(this);let c=1/a,h=1/r,d=1/o;return Li.elements[0]*=c,Li.elements[1]*=c,Li.elements[2]*=c,Li.elements[4]*=h,Li.elements[5]*=h,Li.elements[6]*=h,Li.elements[8]*=d,Li.elements[9]*=d,Li.elements[10]*=d,n.setFromRotationMatrix(Li),i.x=a,i.y=r,i.z=o,this}makePerspective(t,n,i,s,a,r,o=Ns){let l=this.elements,c=2*a/(n-t),h=2*a/(i-s),d=(n+t)/(n-t),f=(i+s)/(i-s),p,g;if(o===Ns)p=-(r+a)/(r-a),g=-2*r*a/(r-a);else if(o===Yh)p=-r/(r-a),g=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,n,i,s,a,r,o=Ns){let l=this.elements,c=1/(n-t),h=1/(i-s),d=1/(r-a),f=(n+t)*c,p=(i+s)*h,g,M;if(o===Ns)g=(r+a)*d,M=-2*d;else if(o===Yh)g=a*d,M=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=M,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let n=this.elements,i=t.elements;for(let s=0;s<16;s++)if(n[s]!==i[s])return!1;return!0}fromArray(t,n=0){for(let i=0;i<16;i++)this.elements[i]=t[i+n];return this}toArray(t=[],n=0){let i=this.elements;return t[n]=i[0],t[n+1]=i[1],t[n+2]=i[2],t[n+3]=i[3],t[n+4]=i[4],t[n+5]=i[5],t[n+6]=i[6],t[n+7]=i[7],t[n+8]=i[8],t[n+9]=i[9],t[n+10]=i[10],t[n+11]=i[11],t[n+12]=i[12],t[n+13]=i[13],t[n+14]=i[14],t[n+15]=i[15],t}},go=new N,Li=new fe,$A=new N(0,0,0),tw=new N(1,1,1),ga=new N,_h=new N,ai=new N,cS=new fe,uS=new Ti,Ai=class e{constructor(t=0,n=0,i=0,s=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,n,i,s=this._order){return this._x=t,this._y=n,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,n=this._order,i=!0){let s=t.elements,a=s[0],r=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],f=s[6],p=s[10];switch(n){case"XYZ":this._y=Math.asin(yn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-yn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,a),this._z=0);break;case"ZXY":this._x=Math.asin(yn(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-yn(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(yn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,a)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-yn(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,n,i){return cS.makeRotationFromQuaternion(t),this.setFromRotationMatrix(cS,n,i)}setFromVector3(t,n=this._order){return this.set(t.x,t.y,t.z,n)}reorder(t){return uS.setFromEuler(this),this.setFromQuaternion(uS,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],n=0){return t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Ai.DEFAULT_ORDER="XYZ";Kh=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},ew=0,hS=new N,vo=new Ti,ws=new fe,yh=new N,sc=new N,nw=new N,iw=new Ti,fS=new N(1,0,0),dS=new N(0,1,0),pS=new N(0,0,1),mS={type:"added"},sw={type:"removed"},_o={type:"childadded",child:null},Lm={type:"childremoved",child:null},An=class e extends Ta{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ew++}),this.uuid=Ls(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new N,n=new Ai,i=new Ti,s=new N(1,1,1);function a(){i.setFromEuler(n,!1)}function r(){n.setFromQuaternion(i,void 0,!1)}n._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new fe},normalMatrix:{value:new te}}),this.matrix=new fe,this.matrixWorld=new fe,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Kh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,n){this.quaternion.setFromAxisAngle(t,n)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,n){return vo.setFromAxisAngle(t,n),this.quaternion.multiply(vo),this}rotateOnWorldAxis(t,n){return vo.setFromAxisAngle(t,n),this.quaternion.premultiply(vo),this}rotateX(t){return this.rotateOnAxis(fS,t)}rotateY(t){return this.rotateOnAxis(dS,t)}rotateZ(t){return this.rotateOnAxis(pS,t)}translateOnAxis(t,n){return hS.copy(t).applyQuaternion(this.quaternion),this.position.add(hS.multiplyScalar(n)),this}translateX(t){return this.translateOnAxis(fS,t)}translateY(t){return this.translateOnAxis(dS,t)}translateZ(t){return this.translateOnAxis(pS,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ws.copy(this.matrixWorld).invert())}lookAt(t,n,i){t.isVector3?yh.copy(t):yh.set(t,n,i);let s=this.parent;this.updateWorldMatrix(!0,!1),sc.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ws.lookAt(sc,yh,this.up):ws.lookAt(yh,sc,this.up),this.quaternion.setFromRotationMatrix(ws),s&&(ws.extractRotation(s.matrixWorld),vo.setFromRotationMatrix(ws),this.quaternion.premultiply(vo.invert()))}add(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(mS),_o.child=t,this.dispatchEvent(_o),_o.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let n=this.children.indexOf(t);return n!==-1&&(t.parent=null,this.children.splice(n,1),t.dispatchEvent(sw),Lm.child=t,this.dispatchEvent(Lm),Lm.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ws.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ws.multiply(t.parent.matrixWorld)),t.applyMatrix4(ws),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(mS),_o.child=t,this.dispatchEvent(_o),_o.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,n){if(this[t]===n)return this;for(let i=0,s=this.children.length;i<s;i++){let r=this.children[i].getObjectByProperty(t,n);if(r!==void 0)return r}}getObjectsByProperty(t,n,i=[]){this[t]===n&&i.push(this);let s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(t,n,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sc,t,nw),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sc,iw,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let n=this.matrixWorld.elements;return t.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(t){t(this);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverseVisible(t)}traverseAncestors(t){let n=this.parent;n!==null&&(t(n),n.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].updateMatrixWorld(t)}updateWorldMatrix(t,n){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){let s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(t){let n=t===void 0||typeof t=="string",i={};n&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];a(t.shapes,d)}else a(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(t.materials,this.material[l]));s.material=o}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(a(t.animations,l))}}if(n){let o=r(t.geometries),l=r(t.materials),c=r(t.textures),h=r(t.images),d=r(t.shapes),f=r(t.skeletons),p=r(t.animations),g=r(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function r(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,n=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),n===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}};An.DEFAULT_UP=new N(0,1,0);An.DEFAULT_MATRIX_AUTO_UPDATE=!0;An.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;Ii=new N,Rs=new N,Im=new N,Cs=new N,yo=new N,xo=new N,gS=new N,Om=new N,Pm=new N,zm=new N,Bm=new Xe,Fm=new Xe,Hm=new Xe,xa=class e{constructor(t=new N,n=new N,i=new N){this.a=t,this.b=n,this.c=i}static getNormal(t,n,i,s){s.subVectors(i,n),Ii.subVectors(t,n),s.cross(Ii);let a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,n,i,s,a){Ii.subVectors(s,n),Rs.subVectors(i,n),Im.subVectors(t,n);let r=Ii.dot(Ii),o=Ii.dot(Rs),l=Ii.dot(Im),c=Rs.dot(Rs),h=Rs.dot(Im),d=r*c-o*o;if(d===0)return a.set(0,0,0),null;let f=1/d,p=(c*l-o*h)*f,g=(r*h-o*l)*f;return a.set(1-p-g,g,p)}static containsPoint(t,n,i,s){return this.getBarycoord(t,n,i,s,Cs)===null?!1:Cs.x>=0&&Cs.y>=0&&Cs.x+Cs.y<=1}static getInterpolation(t,n,i,s,a,r,o,l){return this.getBarycoord(t,n,i,s,Cs)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Cs.x),l.addScaledVector(r,Cs.y),l.addScaledVector(o,Cs.z),l)}static getInterpolatedAttribute(t,n,i,s,a,r){return Bm.setScalar(0),Fm.setScalar(0),Hm.setScalar(0),Bm.fromBufferAttribute(t,n),Fm.fromBufferAttribute(t,i),Hm.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(Bm,a.x),r.addScaledVector(Fm,a.y),r.addScaledVector(Hm,a.z),r}static isFrontFacing(t,n,i,s){return Ii.subVectors(i,n),Rs.subVectors(t,n),Ii.cross(Rs).dot(s)<0}set(t,n,i){return this.a.copy(t),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(t,n,i,s){return this.a.copy(t[n]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,n,i,s){return this.a.fromBufferAttribute(t,n),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ii.subVectors(this.c,this.b),Rs.subVectors(this.a,this.b),Ii.cross(Rs).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,i,s,a){return e.getInterpolation(t,this.a,this.b,this.c,n,i,s,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,n){let i=this.a,s=this.b,a=this.c,r,o;yo.subVectors(s,i),xo.subVectors(a,i),Om.subVectors(t,i);let l=yo.dot(Om),c=xo.dot(Om);if(l<=0&&c<=0)return n.copy(i);Pm.subVectors(t,s);let h=yo.dot(Pm),d=xo.dot(Pm);if(h>=0&&d<=h)return n.copy(s);let f=l*d-h*c;if(f<=0&&l>=0&&h<=0)return r=l/(l-h),n.copy(i).addScaledVector(yo,r);zm.subVectors(t,a);let p=yo.dot(zm),g=xo.dot(zm);if(g>=0&&p<=g)return n.copy(a);let M=p*c-l*g;if(M<=0&&c>=0&&g<=0)return o=c/(c-g),n.copy(i).addScaledVector(xo,o);let m=h*g-p*d;if(m<=0&&d-h>=0&&p-g>=0)return gS.subVectors(a,s),o=(d-h)/(d-h+(p-g)),n.copy(s).addScaledVector(gS,o);let u=1/(m+M+f);return r=M*u,o=f*u,n.copy(i).addScaledVector(yo,r).addScaledVector(xo,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},_b={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},va={h:0,s:0,l:0},xh={h:0,s:0,l:0};qt=class{constructor(t,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,n,i)}set(t,n,i){if(n===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,n,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,n=dn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ce.toWorkingColorSpace(this,n),this}setRGB(t,n,i,s=ce.workingColorSpace){return this.r=t,this.g=n,this.b=i,ce.toWorkingColorSpace(this,s),this}setHSL(t,n,i,s=ce.workingColorSpace){if(t=WA(t,1),n=yn(n,0,1),i=yn(i,0,1),n===0)this.r=this.g=this.b=i;else{let a=i<=.5?i*(1+n):i+n-i*n,r=2*i-a;this.r=Vm(r,a,t+1/3),this.g=Vm(r,a,t),this.b=Vm(r,a,t-1/3)}return ce.toWorkingColorSpace(this,s),this}setStyle(t,n=dn){function i(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a,r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,n);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,n);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,n);if(r===6)return this.setHex(parseInt(a,16),n);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,n);return this}setColorName(t,n=dn){let i=_b[t.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Is(t.r),this.g=Is(t.g),this.b=Is(t.b),this}copyLinearToSRGB(t){return this.r=Lo(t.r),this.g=Lo(t.g),this.b=Lo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=dn){return ce.fromWorkingColorSpace(bn.copy(this),t),Math.round(yn(bn.r*255,0,255))*65536+Math.round(yn(bn.g*255,0,255))*256+Math.round(yn(bn.b*255,0,255))}getHexString(t=dn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,n=ce.workingColorSpace){ce.fromWorkingColorSpace(bn.copy(this),n);let i=bn.r,s=bn.g,a=bn.b,r=Math.max(i,s,a),o=Math.min(i,s,a),l,c,h=(o+r)/2;if(o===r)l=0,c=0;else{let d=r-o;switch(c=h<=.5?d/(r+o):d/(2-r-o),r){case i:l=(s-a)/d+(s<a?6:0);break;case s:l=(a-i)/d+2;break;case a:l=(i-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,n=ce.workingColorSpace){return ce.fromWorkingColorSpace(bn.copy(this),n),t.r=bn.r,t.g=bn.g,t.b=bn.b,t}getStyle(t=dn){ce.fromWorkingColorSpace(bn.copy(this),t);let n=bn.r,i=bn.g,s=bn.b;return t!==dn?`color(${t} ${n.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,n,i){return this.getHSL(va),this.setHSL(va.h+t,va.s+n,va.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,n){return this.r=t.r+n.r,this.g=t.g+n.g,this.b=t.b+n.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,n){return this.r+=(t.r-this.r)*n,this.g+=(t.g-this.g)*n,this.b+=(t.b-this.b)*n,this}lerpColors(t,n,i){return this.r=t.r+(n.r-t.r)*i,this.g=t.g+(n.g-t.g)*i,this.b=t.b+(n.b-t.b)*i,this}lerpHSL(t,n){this.getHSL(va),t.getHSL(xh);let i=Em(va.h,xh.h,n),s=Em(va.s,xh.s,n),a=Em(va.l,xh.l,n);return this.setHSL(i,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let n=this.r,i=this.g,s=this.b,a=t.elements;return this.r=a[0]*n+a[3]*i+a[6]*s,this.g=a[1]*n+a[4]*i+a[7]*s,this.b=a[2]*n+a[5]*i+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,n=0){return this.r=t[n],this.g=t[n+1],this.b=t[n+2],this}toArray(t=[],n=0){return t[n]=this.r,t[n+1]=this.g,t[n+2]=this.b,t}fromBufferAttribute(t,n){return this.r=t.getX(n),this.g=t.getY(n),this.b=t.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},bn=new qt;qt.NAMES=_b;aw=0,Aa=class extends Ta{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:aw++}),this.uuid=Ls(),this.name="",this.blending=Ma,this.side=ba,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ng,this.blendDst=ig,this.blendEquation=ir,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qt(0,0,0),this.blendAlpha=0,this.depthFunc=Oo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=tS,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=uo,this.stencilZFail=uo,this.stencilZPass=uo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let n in t){let i=t[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}let s=this[n];if(s===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[n]=i}}toJSON(t){let n=t===void 0||typeof t=="string";n&&(t={textures:{},images:{}});let i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ma&&(i.blending=this.blending),this.side!==ba&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ng&&(i.blendSrc=this.blendSrc),this.blendDst!==ig&&(i.blendDst=this.blendDst),this.blendEquation!==ir&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Oo&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==tS&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==uo&&(i.stencilFail=this.stencilFail),this.stencilZFail!==uo&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==uo&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){let r=[];for(let o in a){let l=a[o];delete l.metadata,r.push(l)}return r}if(n){let a=s(t.textures),r=s(t.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let n=t.clippingPlanes,i=null;if(n!==null){let s=n.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=n[a].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},Wn=class extends Aa{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ai,this.combine=sb,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},tn=new N,Mh=new ct,Tn=class{constructor(t,n,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=n,this.count=t!==void 0?t.length/n:0,this.normalized=i,this.usage=Vg,this.updateRanges=[],this.gpuType=ji,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,n){this.updateRanges.push({start:t,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,n,i){t*=this.itemSize,i*=n.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=n.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Mh.fromBufferAttribute(this,n),Mh.applyMatrix3(t),this.setXY(n,Mh.x,Mh.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)tn.fromBufferAttribute(this,n),tn.applyMatrix3(t),this.setXYZ(n,tn.x,tn.y,tn.z);return this}applyMatrix4(t){for(let n=0,i=this.count;n<i;n++)tn.fromBufferAttribute(this,n),tn.applyMatrix4(t),this.setXYZ(n,tn.x,tn.y,tn.z);return this}applyNormalMatrix(t){for(let n=0,i=this.count;n<i;n++)tn.fromBufferAttribute(this,n),tn.applyNormalMatrix(t),this.setXYZ(n,tn.x,tn.y,tn.z);return this}transformDirection(t){for(let n=0,i=this.count;n<i;n++)tn.fromBufferAttribute(this,n),tn.transformDirection(t),this.setXYZ(n,tn.x,tn.y,tn.z);return this}set(t,n=0){return this.array.set(t,n),this}getComponent(t,n){let i=this.array[t*this.itemSize+n];return this.normalized&&(i=Qi(i,this.array)),i}setComponent(t,n,i){return this.normalized&&(i=Te(i,this.array)),this.array[t*this.itemSize+n]=i,this}getX(t){let n=this.array[t*this.itemSize];return this.normalized&&(n=Qi(n,this.array)),n}setX(t,n){return this.normalized&&(n=Te(n,this.array)),this.array[t*this.itemSize]=n,this}getY(t){let n=this.array[t*this.itemSize+1];return this.normalized&&(n=Qi(n,this.array)),n}setY(t,n){return this.normalized&&(n=Te(n,this.array)),this.array[t*this.itemSize+1]=n,this}getZ(t){let n=this.array[t*this.itemSize+2];return this.normalized&&(n=Qi(n,this.array)),n}setZ(t,n){return this.normalized&&(n=Te(n,this.array)),this.array[t*this.itemSize+2]=n,this}getW(t){let n=this.array[t*this.itemSize+3];return this.normalized&&(n=Qi(n,this.array)),n}setW(t,n){return this.normalized&&(n=Te(n,this.array)),this.array[t*this.itemSize+3]=n,this}setXY(t,n,i){return t*=this.itemSize,this.normalized&&(n=Te(n,this.array),i=Te(i,this.array)),this.array[t+0]=n,this.array[t+1]=i,this}setXYZ(t,n,i,s){return t*=this.itemSize,this.normalized&&(n=Te(n,this.array),i=Te(i,this.array),s=Te(s,this.array)),this.array[t+0]=n,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,n,i,s,a){return t*=this.itemSize,this.normalized&&(n=Te(n,this.array),i=Te(i,this.array),s=Te(s,this.array),a=Te(a,this.array)),this.array[t+0]=n,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Vg&&(t.usage=this.usage),t}},jh=class extends Tn{constructor(t,n,i){super(new Uint16Array(t),n,i)}},$h=class extends Tn{constructor(t,n,i){super(new Uint32Array(t),n,i)}},me=class extends Tn{constructor(t,n,i){super(new Float32Array(t),n,i)}},rw=0,Ei=new fe,Gm=new An,Mo=new N,ri=new Ps,ac=new Ps,fn=new N,rn=class e extends Ta{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:rw++}),this.uuid=Ls(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(vb(t)?$h:jh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,n){return this.attributes[t]=n,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,n,i=0){this.groups.push({start:t,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,n){this.drawRange.start=t,this.drawRange.count=n}applyMatrix4(t){let n=this.attributes.position;n!==void 0&&(n.applyMatrix4(t),n.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let a=new te().getNormalMatrix(t);i.applyNormalMatrix(a),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ei.makeRotationFromQuaternion(t),this.applyMatrix4(Ei),this}rotateX(t){return Ei.makeRotationX(t),this.applyMatrix4(Ei),this}rotateY(t){return Ei.makeRotationY(t),this.applyMatrix4(Ei),this}rotateZ(t){return Ei.makeRotationZ(t),this.applyMatrix4(Ei),this}translate(t,n,i){return Ei.makeTranslation(t,n,i),this.applyMatrix4(Ei),this}scale(t,n,i){return Ei.makeScale(t,n,i),this.applyMatrix4(Ei),this}lookAt(t){return Gm.lookAt(t),Gm.updateMatrix(),this.applyMatrix4(Gm.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Mo).negate(),this.translate(Mo.x,Mo.y,Mo.z),this}setFromPoints(t){let n=this.getAttribute("position");if(n===void 0){let i=[];for(let s=0,a=t.length;s<a;s++){let r=t[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new me(i,3))}else{for(let i=0,s=n.count;i<s;i++){let a=t[i];n.setXYZ(i,a.x,a.y,a.z||0)}t.length>n.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ps);let t=this.attributes.position,n=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),n)for(let i=0,s=n.length;i<s;i++){let a=n[i];ri.setFromBufferAttribute(a),this.morphTargetsRelative?(fn.addVectors(this.boundingBox.min,ri.min),this.boundingBox.expandByPoint(fn),fn.addVectors(this.boundingBox.max,ri.max),this.boundingBox.expandByPoint(fn)):(this.boundingBox.expandByPoint(ri.min),this.boundingBox.expandByPoint(ri.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new lr);let t=this.attributes.position,n=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(t){let i=this.boundingSphere.center;if(ri.setFromBufferAttribute(t),n)for(let a=0,r=n.length;a<r;a++){let o=n[a];ac.setFromBufferAttribute(o),this.morphTargetsRelative?(fn.addVectors(ri.min,ac.min),ri.expandByPoint(fn),fn.addVectors(ri.max,ac.max),ri.expandByPoint(fn)):(ri.expandByPoint(ac.min),ri.expandByPoint(ac.max))}ri.getCenter(i);let s=0;for(let a=0,r=t.count;a<r;a++)fn.fromBufferAttribute(t,a),s=Math.max(s,i.distanceToSquared(fn));if(n)for(let a=0,r=n.length;a<r;a++){let o=n[a],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)fn.fromBufferAttribute(o,c),l&&(Mo.fromBufferAttribute(t,c),fn.add(Mo)),s=Math.max(s,i.distanceToSquared(fn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,n=this.attributes;if(t===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=n.position,s=n.normal,a=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Tn(new Float32Array(4*i.count),4));let r=this.getAttribute("tangent"),o=[],l=[];for(let C=0;C<i.count;C++)o[C]=new N,l[C]=new N;let c=new N,h=new N,d=new N,f=new ct,p=new ct,g=new ct,M=new N,m=new N;function u(C,b,S){c.fromBufferAttribute(i,C),h.fromBufferAttribute(i,b),d.fromBufferAttribute(i,S),f.fromBufferAttribute(a,C),p.fromBufferAttribute(a,b),g.fromBufferAttribute(a,S),h.sub(c),d.sub(c),p.sub(f),g.sub(f);let U=1/(p.x*g.y-g.x*p.y);isFinite(U)&&(M.copy(h).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(U),m.copy(d).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(U),o[C].add(M),o[b].add(M),o[S].add(M),l[C].add(m),l[b].add(m),l[S].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let C=0,b=y.length;C<b;++C){let S=y[C],U=S.start,F=S.count;for(let P=U,z=U+F;P<z;P+=3)u(t.getX(P+0),t.getX(P+1),t.getX(P+2))}let _=new N,v=new N,R=new N,w=new N;function A(C){R.fromBufferAttribute(s,C),w.copy(R);let b=o[C];_.copy(b),_.sub(R.multiplyScalar(R.dot(b))).normalize(),v.crossVectors(w,b);let U=v.dot(l[C])<0?-1:1;r.setXYZW(C,_.x,_.y,_.z,U)}for(let C=0,b=y.length;C<b;++C){let S=y[C],U=S.start,F=S.count;for(let P=U,z=U+F;P<z;P+=3)A(t.getX(P+0)),A(t.getX(P+1)),A(t.getX(P+2))}}computeVertexNormals(){let t=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Tn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);let s=new N,a=new N,r=new N,o=new N,l=new N,c=new N,h=new N,d=new N;if(t)for(let f=0,p=t.count;f<p;f+=3){let g=t.getX(f+0),M=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(n,g),a.fromBufferAttribute(n,M),r.fromBufferAttribute(n,m),h.subVectors(r,a),d.subVectors(s,a),h.cross(d),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,M),c.fromBufferAttribute(i,m),o.add(h),l.add(h),c.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(M,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=n.count;f<p;f+=3)s.fromBufferAttribute(n,f+0),a.fromBufferAttribute(n,f+1),r.fromBufferAttribute(n,f+2),h.subVectors(r,a),d.subVectors(s,a),h.cross(d),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let n=0,i=t.count;n<i;n++)fn.fromBufferAttribute(t,n),fn.normalize(),t.setXYZ(n,fn.x,fn.y,fn.z)}toNonIndexed(){function t(o,l){let c=o.array,h=o.itemSize,d=o.normalized,f=new c.constructor(l.length*h),p=0,g=0;for(let M=0,m=l.length;M<m;M++){o.isInterleavedBufferAttribute?p=l[M]*o.data.stride+o.offset:p=l[M]*h;for(let u=0;u<h;u++)f[g++]=c[p++]}return new Tn(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let n=new e,i=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=t(l,i);n.setAttribute(o,c)}let a=this.morphAttributes;for(let o in a){let l=[],c=a[o];for(let h=0,d=c.length;h<d;h++){let f=c[h],p=t(f,i);l.push(p)}n.morphAttributes[o]=l}n.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;for(let o=0,l=r.length;o<l;o++){let c=r[o];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let n=this.index;n!==null&&(t.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});let i=this.attributes;for(let l in i){let c=i[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},a=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,f=c.length;d<f;d++){let p=c[d];h.push(p.toJSON(t.data))}h.length>0&&(s[l]=h,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let n={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone(n));let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(n))}let a=t.morphAttributes;for(let c in a){let h=[],d=a[c];for(let f=0,p=d.length;f<p;f++)h.push(d[f].clone(n));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let r=t.groups;for(let c=0,h=r.length;c<h;c++){let d=r[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},vS=new fe,ja=new qg,Sh=new lr,_S=new N,bh=new N,Eh=new N,Th=new N,km=new N,Ah=new N,yS=new N,wh=new N,Zt=class extends An{constructor(t=new rn,n=new Wn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=n,this.updateMorphTargets()}copy(t,n){return super.copy(t,n),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){let o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,n){let i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;n.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(a&&o){Ah.set(0,0,0);for(let l=0,c=a.length;l<c;l++){let h=o[l],d=a[l];h!==0&&(km.fromBufferAttribute(d,t),r?Ah.addScaledVector(km,h):Ah.addScaledVector(km.sub(n),h))}n.add(Ah)}return n}raycast(t,n){let i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Sh.copy(i.boundingSphere),Sh.applyMatrix4(a),ja.copy(t.ray).recast(t.near),!(Sh.containsPoint(ja.origin)===!1&&(ja.intersectSphere(Sh,_S)===null||ja.origin.distanceToSquared(_S)>(t.far-t.near)**2))&&(vS.copy(a).invert(),ja.copy(t.ray).applyMatrix4(vS),!(i.boundingBox!==null&&ja.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,n,ja)))}_computeIntersections(t,n,i){let s,a=this.geometry,r=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,h=a.attributes.uv1,d=a.attributes.normal,f=a.groups,p=a.drawRange;if(o!==null)if(Array.isArray(r))for(let g=0,M=f.length;g<M;g++){let m=f[g],u=r[m.materialIndex],y=Math.max(m.start,p.start),_=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let v=y,R=_;v<R;v+=3){let w=o.getX(v),A=o.getX(v+1),C=o.getX(v+2);s=Rh(this,u,t,i,c,h,d,w,A,C),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,n.push(s))}}else{let g=Math.max(0,p.start),M=Math.min(o.count,p.start+p.count);for(let m=g,u=M;m<u;m+=3){let y=o.getX(m),_=o.getX(m+1),v=o.getX(m+2);s=Rh(this,r,t,i,c,h,d,y,_,v),s&&(s.faceIndex=Math.floor(m/3),n.push(s))}}else if(l!==void 0)if(Array.isArray(r))for(let g=0,M=f.length;g<M;g++){let m=f[g],u=r[m.materialIndex],y=Math.max(m.start,p.start),_=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let v=y,R=_;v<R;v+=3){let w=v,A=v+1,C=v+2;s=Rh(this,u,t,i,c,h,d,w,A,C),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,n.push(s))}}else{let g=Math.max(0,p.start),M=Math.min(l.count,p.start+p.count);for(let m=g,u=M;m<u;m+=3){let y=m,_=m+1,v=m+2;s=Rh(this,r,t,i,c,h,d,y,_,v),s&&(s.faceIndex=Math.floor(m/3),n.push(s))}}}};On=class e extends rn{constructor(t=1,n=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:n,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};let o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);let l=[],c=[],h=[],d=[],f=0,p=0;g("z","y","x",-1,-1,i,n,t,r,a,0),g("z","y","x",1,-1,i,n,-t,r,a,1),g("x","z","y",1,1,t,i,n,s,r,2),g("x","z","y",1,-1,t,i,-n,s,r,3),g("x","y","z",1,-1,t,n,i,s,a,4),g("x","y","z",-1,-1,t,n,-i,s,a,5),this.setIndex(l),this.setAttribute("position",new me(c,3)),this.setAttribute("normal",new me(h,3)),this.setAttribute("uv",new me(d,2));function g(M,m,u,y,_,v,R,w,A,C,b){let S=v/A,U=R/C,F=v/2,P=R/2,z=w/2,Y=A+1,G=C+1,j=0,H=0,ut=new N;for(let vt=0;vt<G;vt++){let yt=vt*U-P;for(let Ft=0;Ft<Y;Ft++){let Nt=Ft*S-F;ut[M]=Nt*y,ut[m]=yt*_,ut[u]=z,c.push(ut.x,ut.y,ut.z),ut[M]=0,ut[m]=0,ut[u]=w>0?1:-1,h.push(ut.x,ut.y,ut.z),d.push(Ft/A),d.push(1-vt/C),j+=1}}for(let vt=0;vt<C;vt++)for(let yt=0;yt<A;yt++){let Ft=f+yt+Y*vt,Nt=f+yt+Y*(vt+1),W=f+(yt+1)+Y*(vt+1),it=f+(yt+1)+Y*vt;l.push(Ft,Nt,it),l.push(Nt,W,it),H+=6}o.addGroup(p,H,b),p+=H,f+=j}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};wa={clone:Vo,merge:Nn},cw=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,uw=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ye=class extends Aa{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=cw,this.fragmentShader=uw,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Vo(t.uniforms),this.uniformsGroups=lw(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let n=super.toJSON(t);n.glslVersion=this.glslVersion,n.uniforms={};for(let s in this.uniforms){let r=this.uniforms[s].value;r&&r.isTexture?n.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?n.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?n.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?n.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?n.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?n.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?n.uniforms[s]={type:"m4",value:r.toArray()}:n.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}},tf=class extends An{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new fe,this.projectionMatrix=new fe,this.projectionMatrixInverse=new fe,this.coordinateSystem=Ns}copy(t,n){return super.copy(t,n),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,n){super.updateWorldMatrix(t,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},_a=new N,xS=new ct,MS=new ct,Ln=class extends tf{constructor(t=50,n=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,n){return super.copy(t,n),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let n=.5*this.getFilmHeight()/t;this.fov=Gg*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(bm*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Gg*2*Math.atan(Math.tan(bm*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,n,i){_a.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(_a.x,_a.y).multiplyScalar(-t/_a.z),_a.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(_a.x,_a.y).multiplyScalar(-t/_a.z)}getViewSize(t,n){return this.getViewBounds(t,xS,MS),n.subVectors(MS,xS)}setViewOffset(t,n,i,s,a,r){this.aspect=t/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,n=t*Math.tan(bm*.5*this.fov)/this.zoom,i=2*n,s=this.aspect*i,a=-.5*s,r=this.view;if(this.view!==null&&this.view.enabled){let l=r.fullWidth,c=r.fullHeight;a+=r.offsetX*s/l,n-=r.offsetY*i/c,s*=r.width/l,i*=r.height/c}let o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,n,n-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let n=super.toJSON(t);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}},So=-90,bo=1,Yg=class extends An{constructor(t,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ln(So,bo,t,n);s.layers=this.layers,this.add(s);let a=new Ln(So,bo,t,n);a.layers=this.layers,this.add(a);let r=new Ln(So,bo,t,n);r.layers=this.layers,this.add(r);let o=new Ln(So,bo,t,n);o.layers=this.layers,this.add(o);let l=new Ln(So,bo,t,n);l.layers=this.layers,this.add(l);let c=new Ln(So,bo,t,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,n=this.children.concat(),[i,s,a,r,o,l]=n;for(let c of n)this.remove(c);if(t===Ns)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Yh)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of n)this.add(c),c.updateMatrixWorld()}update(t,n){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[a,r,o,l,c,h]=this.children,d=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let M=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(n,a),t.setRenderTarget(i,1,s),t.render(n,r),t.setRenderTarget(i,2,s),t.render(n,o),t.setRenderTarget(i,3,s),t.render(n,l),t.setRenderTarget(i,4,s),t.render(n,c),i.texture.generateMipmaps=M,t.setRenderTarget(i,5,s),t.render(n,h),t.setRenderTarget(d,f,p),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},ef=class extends Xn{constructor(t,n,i,s,a,r,o,l,c,h){t=t!==void 0?t:[],n=n!==void 0?n:Po,super(t,n,i,s,a,r,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Zg=class extends xn{constructor(t=1,n={}){super(t,t,n),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new ef(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:Ki}fromEquirectangularTexture(t,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new On(5,5,5),a=new Ye({name:"CubemapFromEquirect",uniforms:Vo(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:En,blending:$i});a.uniforms.tEquirect.value=n;let r=new Zt(s,a),o=n.minFilter;return n.minFilter===rr&&(n.minFilter=Ki),new Yg(1,10,this).update(t,r),n.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,n,i,s){let a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(n,i,s);t.setRenderTarget(a)}},Xm=new N,hw=new N,fw=new te,Us=class{constructor(t=new N(1,0,0),n=0){this.isPlane=!0,this.normal=t,this.constant=n}set(t,n){return this.normal.copy(t),this.constant=n,this}setComponents(t,n,i,s){return this.normal.set(t,n,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,n){return this.normal.copy(t),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(t,n,i){let s=Xm.subVectors(i,n).cross(hw.subVectors(t,n)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,n){return n.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,n){let i=t.delta(Xm),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?n.copy(t.start):null;let a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:n.copy(t.start).addScaledVector(i,a)}intersectsLine(t){let n=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return n<0&&i>0||i<0&&n>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,n){let i=n||fw.getNormalMatrix(t),s=this.coplanarPoint(Xm).applyMatrix4(t),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},$a=new lr,Ch=new N,_c=class{constructor(t=new Us,n=new Us,i=new Us,s=new Us,a=new Us,r=new Us){this.planes=[t,n,i,s,a,r]}set(t,n,i,s,a,r){let o=this.planes;return o[0].copy(t),o[1].copy(n),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(t){let n=this.planes;for(let i=0;i<6;i++)n[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,n=Ns){let i=this.planes,s=t.elements,a=s[0],r=s[1],o=s[2],l=s[3],c=s[4],h=s[5],d=s[6],f=s[7],p=s[8],g=s[9],M=s[10],m=s[11],u=s[12],y=s[13],_=s[14],v=s[15];if(i[0].setComponents(l-a,f-c,m-p,v-u).normalize(),i[1].setComponents(l+a,f+c,m+p,v+u).normalize(),i[2].setComponents(l+r,f+h,m+g,v+y).normalize(),i[3].setComponents(l-r,f-h,m-g,v-y).normalize(),i[4].setComponents(l-o,f-d,m-M,v-_).normalize(),n===Ns)i[5].setComponents(l+o,f+d,m+M,v+_).normalize();else if(n===Yh)i[5].setComponents(o,d,M,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),$a.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let n=t.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),$a.copy(n.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere($a)}intersectsSprite(t){return $a.center.set(0,0,0),$a.radius=.7071067811865476,$a.applyMatrix4(t.matrixWorld),this.intersectsSphere($a)}intersectsSphere(t){let n=this.planes,i=t.center,s=-t.radius;for(let a=0;a<6;a++)if(n[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let n=this.planes;for(let i=0;i<6;i++){let s=n[i];if(Ch.x=s.normal.x>0?t.max.x:t.min.x,Ch.y=s.normal.y>0?t.max.y:t.min.y,Ch.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Ch)<0)return!1}return!0}containsPoint(t){let n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};Pi=class e extends rn{constructor(t=1,n=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:n,widthSegments:i,heightSegments:s};let a=t/2,r=n/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,d=t/o,f=n/l,p=[],g=[],M=[],m=[];for(let u=0;u<h;u++){let y=u*f-r;for(let _=0;_<c;_++){let v=_*d-a;g.push(v,-y,0),M.push(0,0,1),m.push(_/o),m.push(1-u/l)}}for(let u=0;u<l;u++)for(let y=0;y<o;y++){let _=y+c*u,v=y+c*(u+1),R=y+1+c*(u+1),w=y+1+c*u;p.push(_,v,w),p.push(v,R,w)}this.setIndex(p),this.setAttribute("position",new me(g,3)),this.setAttribute("normal",new me(M,3)),this.setAttribute("uv",new me(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},pw=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,mw=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,gw=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,vw=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_w=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,yw=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,xw=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Mw=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Sw=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,bw=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ew=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Tw=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Aw=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ww=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Rw=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Cw=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Dw=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Uw=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Nw=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Lw=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Iw=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ow=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Pw=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,zw=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Bw=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Fw=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Hw=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Vw=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Gw=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,kw=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Xw="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ww=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,qw=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Yw=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Zw=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Jw=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Qw=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Kw=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,jw=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,$w=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,t2=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,e2=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,n2=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,i2=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,s2=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,a2=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,r2=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,o2=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,l2=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,c2=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,u2=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,h2=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,f2=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,d2=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,p2=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,m2=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,g2=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,v2=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_2=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,y2=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,x2=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,M2=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,S2=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,b2=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,E2=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,T2=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,A2=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,w2=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,R2=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,C2=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,D2=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,U2=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,N2=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,L2=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,I2=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,O2=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,P2=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,z2=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,B2=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,F2=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,H2=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,V2=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,G2=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,k2=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,X2=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,W2=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,q2=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Y2=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Z2=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,J2=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Q2=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,K2=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,j2=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,$2=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,tR=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,eR=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,nR=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,iR=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,sR=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,aR=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,rR=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,oR=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,lR=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,cR=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uR=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,hR=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,fR=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,dR=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,pR=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mR=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gR=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vR=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_R=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yR=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,xR=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,MR=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,SR=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,bR=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ER=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,TR=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,AR=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,wR=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,RR=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,CR=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,DR=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,UR=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,NR=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,LR=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,IR=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,OR=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,PR=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zR=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,BR=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,FR=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,HR=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,VR=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,GR=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,kR=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,XR=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,WR=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,qR=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ee={alphahash_fragment:pw,alphahash_pars_fragment:mw,alphamap_fragment:gw,alphamap_pars_fragment:vw,alphatest_fragment:_w,alphatest_pars_fragment:yw,aomap_fragment:xw,aomap_pars_fragment:Mw,batching_pars_vertex:Sw,batching_vertex:bw,begin_vertex:Ew,beginnormal_vertex:Tw,bsdfs:Aw,iridescence_fragment:ww,bumpmap_pars_fragment:Rw,clipping_planes_fragment:Cw,clipping_planes_pars_fragment:Dw,clipping_planes_pars_vertex:Uw,clipping_planes_vertex:Nw,color_fragment:Lw,color_pars_fragment:Iw,color_pars_vertex:Ow,color_vertex:Pw,common:zw,cube_uv_reflection_fragment:Bw,defaultnormal_vertex:Fw,displacementmap_pars_vertex:Hw,displacementmap_vertex:Vw,emissivemap_fragment:Gw,emissivemap_pars_fragment:kw,colorspace_fragment:Xw,colorspace_pars_fragment:Ww,envmap_fragment:qw,envmap_common_pars_fragment:Yw,envmap_pars_fragment:Zw,envmap_pars_vertex:Jw,envmap_physical_pars_fragment:r2,envmap_vertex:Qw,fog_vertex:Kw,fog_pars_vertex:jw,fog_fragment:$w,fog_pars_fragment:t2,gradientmap_pars_fragment:e2,lightmap_pars_fragment:n2,lights_lambert_fragment:i2,lights_lambert_pars_fragment:s2,lights_pars_begin:a2,lights_toon_fragment:o2,lights_toon_pars_fragment:l2,lights_phong_fragment:c2,lights_phong_pars_fragment:u2,lights_physical_fragment:h2,lights_physical_pars_fragment:f2,lights_fragment_begin:d2,lights_fragment_maps:p2,lights_fragment_end:m2,logdepthbuf_fragment:g2,logdepthbuf_pars_fragment:v2,logdepthbuf_pars_vertex:_2,logdepthbuf_vertex:y2,map_fragment:x2,map_pars_fragment:M2,map_particle_fragment:S2,map_particle_pars_fragment:b2,metalnessmap_fragment:E2,metalnessmap_pars_fragment:T2,morphinstance_vertex:A2,morphcolor_vertex:w2,morphnormal_vertex:R2,morphtarget_pars_vertex:C2,morphtarget_vertex:D2,normal_fragment_begin:U2,normal_fragment_maps:N2,normal_pars_fragment:L2,normal_pars_vertex:I2,normal_vertex:O2,normalmap_pars_fragment:P2,clearcoat_normal_fragment_begin:z2,clearcoat_normal_fragment_maps:B2,clearcoat_pars_fragment:F2,iridescence_pars_fragment:H2,opaque_fragment:V2,packing:G2,premultiplied_alpha_fragment:k2,project_vertex:X2,dithering_fragment:W2,dithering_pars_fragment:q2,roughnessmap_fragment:Y2,roughnessmap_pars_fragment:Z2,shadowmap_pars_fragment:J2,shadowmap_pars_vertex:Q2,shadowmap_vertex:K2,shadowmask_pars_fragment:j2,skinbase_vertex:$2,skinning_pars_vertex:tR,skinning_vertex:eR,skinnormal_vertex:nR,specularmap_fragment:iR,specularmap_pars_fragment:sR,tonemapping_fragment:aR,tonemapping_pars_fragment:rR,transmission_fragment:oR,transmission_pars_fragment:lR,uv_pars_fragment:cR,uv_pars_vertex:uR,uv_vertex:hR,worldpos_vertex:fR,background_vert:dR,background_frag:pR,backgroundCube_vert:mR,backgroundCube_frag:gR,cube_vert:vR,cube_frag:_R,depth_vert:yR,depth_frag:xR,distanceRGBA_vert:MR,distanceRGBA_frag:SR,equirect_vert:bR,equirect_frag:ER,linedashed_vert:TR,linedashed_frag:AR,meshbasic_vert:wR,meshbasic_frag:RR,meshlambert_vert:CR,meshlambert_frag:DR,meshmatcap_vert:UR,meshmatcap_frag:NR,meshnormal_vert:LR,meshnormal_frag:IR,meshphong_vert:OR,meshphong_frag:PR,meshphysical_vert:zR,meshphysical_frag:BR,meshtoon_vert:FR,meshtoon_frag:HR,points_vert:VR,points_frag:GR,shadow_vert:kR,shadow_frag:XR,sprite_vert:WR,sprite_frag:qR},bt={common:{diffuse:{value:new qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new te}},envmap:{envMap:{value:null},envMapRotation:{value:new te},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new te}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new te}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new te},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new te},normalScale:{value:new ct(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new te},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new te}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new te}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new te}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0},uvTransform:{value:new te}},sprite:{diffuse:{value:new qt(16777215)},opacity:{value:1},center:{value:new ct(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}}},Ji={basic:{uniforms:Nn([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.fog]),vertexShader:ee.meshbasic_vert,fragmentShader:ee.meshbasic_frag},lambert:{uniforms:Nn([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,bt.lights,{emissive:{value:new qt(0)}}]),vertexShader:ee.meshlambert_vert,fragmentShader:ee.meshlambert_frag},phong:{uniforms:Nn([bt.common,bt.specularmap,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,bt.lights,{emissive:{value:new qt(0)},specular:{value:new qt(1118481)},shininess:{value:30}}]),vertexShader:ee.meshphong_vert,fragmentShader:ee.meshphong_frag},standard:{uniforms:Nn([bt.common,bt.envmap,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.roughnessmap,bt.metalnessmap,bt.fog,bt.lights,{emissive:{value:new qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag},toon:{uniforms:Nn([bt.common,bt.aomap,bt.lightmap,bt.emissivemap,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.gradientmap,bt.fog,bt.lights,{emissive:{value:new qt(0)}}]),vertexShader:ee.meshtoon_vert,fragmentShader:ee.meshtoon_frag},matcap:{uniforms:Nn([bt.common,bt.bumpmap,bt.normalmap,bt.displacementmap,bt.fog,{matcap:{value:null}}]),vertexShader:ee.meshmatcap_vert,fragmentShader:ee.meshmatcap_frag},points:{uniforms:Nn([bt.points,bt.fog]),vertexShader:ee.points_vert,fragmentShader:ee.points_frag},dashed:{uniforms:Nn([bt.common,bt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ee.linedashed_vert,fragmentShader:ee.linedashed_frag},depth:{uniforms:Nn([bt.common,bt.displacementmap]),vertexShader:ee.depth_vert,fragmentShader:ee.depth_frag},normal:{uniforms:Nn([bt.common,bt.bumpmap,bt.normalmap,bt.displacementmap,{opacity:{value:1}}]),vertexShader:ee.meshnormal_vert,fragmentShader:ee.meshnormal_frag},sprite:{uniforms:Nn([bt.sprite,bt.fog]),vertexShader:ee.sprite_vert,fragmentShader:ee.sprite_frag},background:{uniforms:{uvTransform:{value:new te},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ee.background_vert,fragmentShader:ee.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new te}},vertexShader:ee.backgroundCube_vert,fragmentShader:ee.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ee.cube_vert,fragmentShader:ee.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ee.equirect_vert,fragmentShader:ee.equirect_frag},distanceRGBA:{uniforms:Nn([bt.common,bt.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ee.distanceRGBA_vert,fragmentShader:ee.distanceRGBA_frag},shadow:{uniforms:Nn([bt.lights,bt.fog,{color:{value:new qt(0)},opacity:{value:1}}]),vertexShader:ee.shadow_vert,fragmentShader:ee.shadow_frag}};Ji.physical={uniforms:Nn([Ji.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new te},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new te},clearcoatNormalScale:{value:new ct(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new te},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new te},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new te},sheen:{value:0},sheenColor:{value:new qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new te},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new te},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new te},transmissionSamplerSize:{value:new ct},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new te},attenuationDistance:{value:0},attenuationColor:{value:new qt(0)},specularColor:{value:new qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new te},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new te},anisotropyVector:{value:new ct},anisotropyMap:{value:null},anisotropyMapTransform:{value:new te}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag};Dh={r:0,b:0,g:0},tr=new Ai,YR=new fe;Go=class extends tf{constructor(t=-1,n=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=n,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,n){return super.copy(t,n),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,n,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,a=i-t,r=i+t,o=s+n,l=s-n;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,r=a+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let n=super.toJSON(t);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}},Do=4,SS=[.125,.215,.35,.446,.526,.582],sr=20,Wm=new Go,bS=new qt,qm=null,Ym=0,Zm=0,Jm=!1,nr=(1+Math.sqrt(5))/2,Eo=1/nr,ES=[new N(-nr,Eo,0),new N(nr,Eo,0),new N(-Eo,0,nr),new N(Eo,0,nr),new N(0,nr,-Eo),new N(0,nr,Eo),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)],ko=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,n=0,i=.1,s=100){qm=this._renderer.getRenderTarget(),Ym=this._renderer.getActiveCubeFace(),Zm=this._renderer.getActiveMipmapLevel(),Jm=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,i,s,a),n>0&&this._blur(a,0,0,n),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,n=null){return this._fromTexture(t,n)}fromCubemap(t,n=null){return this._fromTexture(t,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wS(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=AS(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(qm,Ym,Zm),this._renderer.xr.enabled=Jm,t.scissorTest=!1,Uh(t,0,0,t.width,t.height)}_fromTexture(t,n){t.mapping===Po||t.mapping===zo?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),qm=this._renderer.getRenderTarget(),Ym=this._renderer.getActiveCubeFace(),Zm=this._renderer.getActiveMipmapLevel(),Jm=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=n||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Ki,minFilter:Ki,generateMipmaps:!1,type:ci,format:Oi,colorSpace:qo,depthBuffer:!1},s=TS(t,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=TS(t,n,i);let{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=tC(a)),this._blurMaterial=eC(a,t,n)}return s}_compileMaterial(t){let n=new Zt(this._lodPlanes[0],t);this._renderer.compile(n,Wm)}_sceneToCubeUV(t,n,i,s){let o=new Ln(90,1,n,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(bS),h.toneMapping=Sa,h.autoClear=!1;let p=new Wn({name:"PMREM.Background",side:En,depthWrite:!1,depthTest:!1}),g=new Zt(new On,p),M=!1,m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,M=!0):(p.color.copy(bS),M=!0);for(let u=0;u<6;u++){let y=u%3;y===0?(o.up.set(0,l[u],0),o.lookAt(c[u],0,0)):y===1?(o.up.set(0,0,l[u]),o.lookAt(0,c[u],0)):(o.up.set(0,l[u],0),o.lookAt(0,0,c[u]));let _=this._cubeSize;Uh(s,y*_,u>2?_:0,_,_),h.setRenderTarget(s),M&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=d,t.background=m}_textureToCubeUV(t,n){let i=this._renderer,s=t.mapping===Po||t.mapping===zo;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=wS()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=AS());let a=s?this._cubemapMaterial:this._equirectMaterial,r=new Zt(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=t;let l=this._cubeSize;Uh(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(r,Wm)}_applyPMREM(t){let n=this._renderer,i=n.autoClear;n.autoClear=!1;let s=this._lodPlanes.length;for(let a=1;a<s;a++){let r=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=ES[(s-a-1)%ES.length];this._blur(t,a-1,a,r,o)}n.autoClear=i}_blur(t,n,i,s,a){let r=this._pingPongRenderTarget;this._halfBlur(t,r,n,i,s,"latitudinal",a),this._halfBlur(r,t,i,i,s,"longitudinal",a)}_halfBlur(t,n,i,s,a,r,o){let l=this._renderer,c=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,d=new Zt(this._lodPlanes[s],c),f=c.uniforms,p=this._sizeLods[i]-1,g=isFinite(a)?Math.PI/(2*p):2*Math.PI/(2*sr-1),M=a/g,m=isFinite(a)?1+Math.floor(h*M):sr;m>sr&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${sr}`);let u=[],y=0;for(let A=0;A<sr;++A){let C=A/M,b=Math.exp(-C*C/2);u.push(b),A===0?y+=b:A<m&&(y+=2*b)}for(let A=0;A<u.length;A++)u[A]=u[A]/y;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=u,f.latitudinal.value=r==="latitudinal",o&&(f.poleAxis.value=o);let{_lodMax:_}=this;f.dTheta.value=g,f.mipInt.value=_-i;let v=this._sizeLods[s],R=3*v*(s>_-Do?s-_+Do:0),w=4*(this._cubeSize-v);Uh(n,R,w,3*v,2*v),l.setRenderTarget(n),l.render(d,Wm)}};nf=class extends Xn{constructor(t,n,i,s,a,r,o,l,c,h=No){if(h!==No&&h!==Ho)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===No&&(i=or),i===void 0&&h===Ho&&(i=Fo),super(null,s,a,r,o,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:n},this.magFilter=o!==void 0?o:li,this.minFilter=l!==void 0?l:li,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let n=super.toJSON(t);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}},Mb=new Xn,RS=new nf(1,1),Sb=new Qh,bb=new Wg,Eb=new ef,CS=[],DS=[],US=new Float32Array(16),NS=new Float32Array(9),LS=new Float32Array(4);Jg=class{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.setValue=RC(n.type)}},Qg=class{constructor(t,n,i){this.id=t,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=ZC(n.type)}},Kg=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,n,i){let s=this.seq;for(let a=0,r=s.length;a!==r;++a){let o=s[a];o.setValue(t,n[o.id],i)}}},Qm=/(\w+)(\])?(\[|\.)?/g;Io=class{constructor(t,n){this.seq=[],this.map={};let i=t.getProgramParameter(n,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let a=t.getActiveUniform(n,s),r=t.getUniformLocation(n,a.name);JC(a,r,this)}}setValue(t,n,i,s){let a=this.map[n];a!==void 0&&a.setValue(t,i,s)}setOptional(t,n,i){let s=n[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,n,i,s){for(let a=0,r=n.length;a!==r;++a){let o=n[a],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,n){let i=[];for(let s=0,a=t.length;s!==a;++s){let r=t[s];r.id in n&&i.push(r)}return i}};QC=37297,KC=0;PS=new te;Nh=new N;r3=/^[ \t]*#include +<([\w\d./]+)>/gm;o3=new Map;c3=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;v3=0,$g=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let n=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(n),a=this._getShaderStage(i),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(t){let n=this.materialCache.get(t);for(let i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let n=this.materialCache,i=n.get(t);return i===void 0&&(i=new Set,n.set(t,i)),i}_getShaderStage(t){let n=this.shaderCache,i=n.get(t);return i===void 0&&(i=new t0(t),n.set(t,i)),i}},t0=class{constructor(t){this.id=v3++,this.code=t,this.usedTimes=0}};E3=0;e0=class extends Aa{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=OA,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},n0=class extends Aa{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},R3=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,C3=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;U3={[sg]:ag,[rg]:cg,[og]:ug,[Oo]:lg,[ag]:sg,[cg]:rg,[ug]:og,[lg]:Oo};i0=class extends Ln{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},In=class extends An{constructor(){super(),this.isGroup=!0,this.type="Group"}},P3={type:"move"},dc=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new In,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new In,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new In,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let n=this._hand;if(n)for(let i of t.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,n,i){let s=null,a=null,r=null,o=this._targetRay,l=this._grip,c=this._hand;if(t&&n.session.visibilityState!=="visible-blurred"){if(c&&t.hand){r=!0;for(let M of t.hand.values()){let m=n.getJointPose(M,i),u=this._getHandJoint(c,M);m!==null&&(u.matrix.fromArray(m.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=m.radius),u.visible=m!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=h.position.distanceTo(d.position),p=.02,g=.005;c.inputState.pinching&&f>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(a=n.getPose(t.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=n.getPose(t.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(P3)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(t,n){if(t.joints[n.jointName]===void 0){let i=new In;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[n.jointName]=i,t.add(i)}return t.joints[n.jointName]}},z3=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,B3=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,s0=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,n,i){if(this.texture===null){let s=new Xn,a=t.properties.get(s);a.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){let n=t.cameras[0].viewport,i=new Ye({vertexShader:z3,fragmentShader:B3,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Zt(new Pi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},a0=class extends Ta{constructor(t,n){super();let i=this,s=null,a=1,r=null,o="local-floor",l=1,c=null,h=null,d=null,f=null,p=null,g=null,M=new s0,m=n.getContextAttributes(),u=null,y=null,_=[],v=[],R=new ct,w=null,A=new Ln;A.viewport=new Xe;let C=new Ln;C.viewport=new Xe;let b=[A,C],S=new i0,U=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let it=_[W];return it===void 0&&(it=new dc,_[W]=it),it.getTargetRaySpace()},this.getControllerGrip=function(W){let it=_[W];return it===void 0&&(it=new dc,_[W]=it),it.getGripSpace()},this.getHand=function(W){let it=_[W];return it===void 0&&(it=new dc,_[W]=it),it.getHandSpace()};function P(W){let it=v.indexOf(W.inputSource);if(it===-1)return;let mt=_[it];mt!==void 0&&(mt.update(W.inputSource,W.frame,c||r),mt.dispatchEvent({type:W.type,data:W.inputSource}))}function z(){s.removeEventListener("select",P),s.removeEventListener("selectstart",P),s.removeEventListener("selectend",P),s.removeEventListener("squeeze",P),s.removeEventListener("squeezestart",P),s.removeEventListener("squeezeend",P),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",Y);for(let W=0;W<_.length;W++){let it=v[W];it!==null&&(v[W]=null,_[W].disconnect(it))}U=null,F=null,M.reset(),t.setRenderTarget(u),p=null,f=null,d=null,s=null,y=null,Nt.stop(),i.isPresenting=!1,t.setPixelRatio(w),t.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){a=W,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){o=W,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(W){c=W},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(W){if(s=W,s!==null){if(u=t.getRenderTarget(),s.addEventListener("select",P),s.addEventListener("selectstart",P),s.addEventListener("selectend",P),s.addEventListener("squeeze",P),s.addEventListener("squeezestart",P),s.addEventListener("squeezeend",P),s.addEventListener("end",z),s.addEventListener("inputsourceschange",Y),m.xrCompatible!==!0&&await n.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(R),s.renderState.layers===void 0){let it={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:a};p=new XRWebGLLayer(s,n,it),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new xn(p.framebufferWidth,p.framebufferHeight,{format:Oi,type:Os,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let it=null,mt=null,tt=null;m.depth&&(tt=m.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,it=m.stencil?Ho:No,mt=m.stencil?Fo:or);let Et={colorFormat:n.RGBA8,depthFormat:tt,scaleFactor:a};d=new XRWebGLBinding(s,n),f=d.createProjectionLayer(Et),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),y=new xn(f.textureWidth,f.textureHeight,{format:Oi,type:Os,depthTexture:new nf(f.textureWidth,f.textureHeight,mt,void 0,void 0,void 0,void 0,void 0,void 0,it),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await s.requestReferenceSpace(o),Nt.setContext(s),Nt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return M.getDepthTexture()};function Y(W){for(let it=0;it<W.removed.length;it++){let mt=W.removed[it],tt=v.indexOf(mt);tt>=0&&(v[tt]=null,_[tt].disconnect(mt))}for(let it=0;it<W.added.length;it++){let mt=W.added[it],tt=v.indexOf(mt);if(tt===-1){for(let gt=0;gt<_.length;gt++)if(gt>=v.length){v.push(mt),tt=gt;break}else if(v[gt]===null){v[gt]=mt,tt=gt;break}if(tt===-1)break}let Et=_[tt];Et&&Et.connect(mt)}}let G=new N,j=new N;function H(W,it,mt){G.setFromMatrixPosition(it.matrixWorld),j.setFromMatrixPosition(mt.matrixWorld);let tt=G.distanceTo(j),Et=it.projectionMatrix.elements,gt=mt.projectionMatrix.elements,wt=Et[14]/(Et[10]-1),Ht=Et[14]/(Et[10]+1),Q=(Et[9]+1)/Et[5],ot=(Et[9]-1)/Et[5],D=(Et[8]-1)/Et[0],ft=(gt[8]+1)/gt[0],at=wt*D,rt=wt*ft,$=tt/(-D+ft),Rt=$*-D;if(it.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(Rt),W.translateZ($),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert(),Et[10]===-1)W.projectionMatrix.copy(it.projectionMatrix),W.projectionMatrixInverse.copy(it.projectionMatrixInverse);else{let dt=wt+$,T=Ht+$,x=at-Rt,B=rt+(tt-Rt),Z=Q*Ht/T*dt,st=ot*Ht/T*dt;W.projectionMatrix.makePerspective(x,B,Z,st,dt,T),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}}function ut(W,it){it===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(it.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(s===null)return;let it=W.near,mt=W.far;M.texture!==null&&(M.depthNear>0&&(it=M.depthNear),M.depthFar>0&&(mt=M.depthFar)),S.near=C.near=A.near=it,S.far=C.far=A.far=mt,(U!==S.near||F!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),U=S.near,F=S.far),A.layers.mask=W.layers.mask|2,C.layers.mask=W.layers.mask|4,S.layers.mask=A.layers.mask|C.layers.mask;let tt=W.parent,Et=S.cameras;ut(S,tt);for(let gt=0;gt<Et.length;gt++)ut(Et[gt],tt);Et.length===2?H(S,A,C):S.projectionMatrix.copy(A.projectionMatrix),vt(W,S,tt)};function vt(W,it,mt){mt===null?W.matrix.copy(it.matrixWorld):(W.matrix.copy(mt.matrixWorld),W.matrix.invert(),W.matrix.multiply(it.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(it.projectionMatrix),W.projectionMatrixInverse.copy(it.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=Gg*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(W){l=W,f!==null&&(f.fixedFoveation=W),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=W)},this.hasDepthSensing=function(){return M.texture!==null},this.getDepthSensingMesh=function(){return M.getMesh(S)};let yt=null;function Ft(W,it){if(h=it.getViewerPose(c||r),g=it,h!==null){let mt=h.views;p!==null&&(t.setRenderTargetFramebuffer(y,p.framebuffer),t.setRenderTarget(y));let tt=!1;mt.length!==S.cameras.length&&(S.cameras.length=0,tt=!0);for(let gt=0;gt<mt.length;gt++){let wt=mt[gt],Ht=null;if(p!==null)Ht=p.getViewport(wt);else{let ot=d.getViewSubImage(f,wt);Ht=ot.viewport,gt===0&&(t.setRenderTargetTextures(y,ot.colorTexture,f.ignoreDepthValues?void 0:ot.depthStencilTexture),t.setRenderTarget(y))}let Q=b[gt];Q===void 0&&(Q=new Ln,Q.layers.enable(gt),Q.viewport=new Xe,b[gt]=Q),Q.matrix.fromArray(wt.transform.matrix),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.projectionMatrix.fromArray(wt.projectionMatrix),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert(),Q.viewport.set(Ht.x,Ht.y,Ht.width,Ht.height),gt===0&&(S.matrix.copy(Q.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),tt===!0&&S.cameras.push(Q)}let Et=s.enabledFeatures;if(Et&&Et.includes("depth-sensing")){let gt=d.getDepthInformation(mt[0]);gt&&gt.isValid&&gt.texture&&M.init(t,gt,s.renderState)}}for(let mt=0;mt<_.length;mt++){let tt=v[mt],Et=_[mt];tt!==null&&Et!==void 0&&Et.update(tt,it,c||r)}yt&&yt(W,it),it.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:it}),g=null}let Nt=new xb;Nt.setAnimationLoop(Ft),this.setAnimationLoop=function(W){yt=W},this.dispose=function(){}}},er=new Ai,F3=new fe;sf=class{constructor(t={}){let{canvas:n=qA(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=r;let g=new Uint32Array(4),M=new Int32Array(4),m=null,u=null,y=[],_=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=dn,this.toneMapping=Sa,this.toneMappingExposure=1;let v=this,R=!1,w=0,A=0,C=null,b=-1,S=null,U=new Xe,F=new Xe,P=null,z=new qt(0),Y=0,G=n.width,j=n.height,H=1,ut=null,vt=null,yt=new Xe(0,0,G,j),Ft=new Xe(0,0,G,j),Nt=!1,W=new _c,it=!1,mt=!1,tt=new fe,Et=new fe,gt=new N,wt=new Xe,Ht={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Q=!1;function ot(){return C===null?H:1}let D=i;function ft(E,I){return n.getContext(E,I)}try{let E={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in n&&n.setAttribute("data-engine","three.js r170"),n.addEventListener("webglcontextlost",et,!1),n.addEventListener("webglcontextrestored",At,!1),n.addEventListener("webglcontextcreationerror",_t,!1),D===null){let I="webgl2";if(D=ft(I,E),D===null)throw ft(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let at,rt,$,Rt,dt,T,x,B,Z,st,J,Lt,xt,Tt,Gt,lt,Ut,Vt,Xt,Mt,ie,Wt,ge,L;function St(){at=new iC(D),at.init(),Wt=new O3(D,at),rt=new KR(D,at,t,Wt),$=new N3(D,at),rt.reverseDepthBuffer&&f&&$.buffers.depth.setReversed(!0),Rt=new rC(D),dt=new y3,T=new I3(D,at,$,dt,rt,Wt,Rt),x=new $R(v),B=new nC(v),Z=new dw(D),ge=new JR(D,Z),st=new sC(D,Z,Rt,ge),J=new lC(D,st,Z,Rt),Xt=new oC(D,rt,T),lt=new jR(dt),Lt=new _3(v,x,B,at,rt,ge,lt),xt=new H3(v,dt),Tt=new M3,Gt=new w3(at),Vt=new ZR(v,x,B,$,J,p,l),Ut=new D3(v,J,rt),L=new V3(D,Rt,rt,$),Mt=new QR(D,at,Rt),ie=new aC(D,at,Rt),Rt.programs=Lt.programs,v.capabilities=rt,v.extensions=at,v.properties=dt,v.renderLists=Tt,v.shadowMap=Ut,v.state=$,v.info=Rt}St();let q=new a0(v,D);this.xr=q,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){let E=at.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=at.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(E){E!==void 0&&(H=E,this.setSize(G,j,!1))},this.getSize=function(E){return E.set(G,j)},this.setSize=function(E,I,k=!0){if(q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=E,j=I,n.width=Math.floor(E*H),n.height=Math.floor(I*H),k===!0&&(n.style.width=E+"px",n.style.height=I+"px"),this.setViewport(0,0,E,I)},this.getDrawingBufferSize=function(E){return E.set(G*H,j*H).floor()},this.setDrawingBufferSize=function(E,I,k){G=E,j=I,H=k,n.width=Math.floor(E*k),n.height=Math.floor(I*k),this.setViewport(0,0,E,I)},this.getCurrentViewport=function(E){return E.copy(U)},this.getViewport=function(E){return E.copy(yt)},this.setViewport=function(E,I,k,X){E.isVector4?yt.set(E.x,E.y,E.z,E.w):yt.set(E,I,k,X),$.viewport(U.copy(yt).multiplyScalar(H).round())},this.getScissor=function(E){return E.copy(Ft)},this.setScissor=function(E,I,k,X){E.isVector4?Ft.set(E.x,E.y,E.z,E.w):Ft.set(E,I,k,X),$.scissor(F.copy(Ft).multiplyScalar(H).round())},this.getScissorTest=function(){return Nt},this.setScissorTest=function(E){$.setScissorTest(Nt=E)},this.setOpaqueSort=function(E){ut=E},this.setTransparentSort=function(E){vt=E},this.getClearColor=function(E){return E.copy(Vt.getClearColor())},this.setClearColor=function(){Vt.setClearColor.apply(Vt,arguments)},this.getClearAlpha=function(){return Vt.getClearAlpha()},this.setClearAlpha=function(){Vt.setClearAlpha.apply(Vt,arguments)},this.clear=function(E=!0,I=!0,k=!0){let X=0;if(E){let O=!1;if(C!==null){let pt=C.texture.format;O=pt===F0||pt===B0||pt===z0}if(O){let pt=C.texture.type,Ct=pt===Os||pt===or||pt===vc||pt===Fo||pt===I0||pt===O0,Ot=Vt.getClearColor(),Pt=Vt.getClearAlpha(),Yt=Ot.r,$t=Ot.g,zt=Ot.b;Ct?(g[0]=Yt,g[1]=$t,g[2]=zt,g[3]=Pt,D.clearBufferuiv(D.COLOR,0,g)):(M[0]=Yt,M[1]=$t,M[2]=zt,M[3]=Pt,D.clearBufferiv(D.COLOR,0,M))}else X|=D.COLOR_BUFFER_BIT}I&&(X|=D.DEPTH_BUFFER_BIT),k&&(X|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",et,!1),n.removeEventListener("webglcontextrestored",At,!1),n.removeEventListener("webglcontextcreationerror",_t,!1),Tt.dispose(),Gt.dispose(),dt.dispose(),x.dispose(),B.dispose(),J.dispose(),ge.dispose(),L.dispose(),Lt.dispose(),q.dispose(),q.removeEventListener("sessionstart",Qo),q.removeEventListener("sessionend",Ko),ns.stop()};function et(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function At(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;let E=Rt.autoReset,I=Ut.enabled,k=Ut.autoUpdate,X=Ut.needsUpdate,O=Ut.type;St(),Rt.autoReset=E,Ut.enabled=I,Ut.autoUpdate=k,Ut.needsUpdate=X,Ut.type=O}function _t(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Jt(E){let I=E.target;I.removeEventListener("dispose",Jt),Re(I)}function Re(E){Je(E),dt.remove(E)}function Je(E){let I=dt.get(E).programs;I!==void 0&&(I.forEach(function(k){Lt.releaseProgram(k)}),E.isShaderMaterial&&Lt.releaseShaderCache(E))}this.renderBufferDirect=function(E,I,k,X,O,pt){I===null&&(I=Ht);let Ct=O.isMesh&&O.matrixWorld.determinant()<0,Ot=Se(E,I,k,X,O);$.setMaterial(X,Ct);let Pt=k.index,Yt=1;if(X.wireframe===!0){if(Pt=st.getWireframeAttribute(k),Pt===void 0)return;Yt=2}let $t=k.drawRange,zt=k.attributes.position,he=$t.start*Yt,Ce=($t.start+$t.count)*Yt;pt!==null&&(he=Math.max(he,pt.start*Yt),Ce=Math.min(Ce,(pt.start+pt.count)*Yt)),Pt!==null?(he=Math.max(he,0),Ce=Math.min(Ce,Pt.count)):zt!=null&&(he=Math.max(he,0),Ce=Math.min(Ce,zt.count));let Ue=Ce-he;if(Ue<0||Ue===1/0)return;ge.setup(O,X,Ot,k,Pt);let Pn,ve=Mt;if(Pt!==null&&(Pn=Z.get(Pt),ve=ie,ve.setIndex(Pn)),O.isMesh)X.wireframe===!0?($.setLineWidth(X.wireframeLinewidth*ot()),ve.setMode(D.LINES)):ve.setMode(D.TRIANGLES);else if(O.isLine){let Bt=X.linewidth;Bt===void 0&&(Bt=1),$.setLineWidth(Bt*ot()),O.isLineSegments?ve.setMode(D.LINES):O.isLineLoop?ve.setMode(D.LINE_LOOP):ve.setMode(D.LINE_STRIP)}else O.isPoints?ve.setMode(D.POINTS):O.isSprite&&ve.setMode(D.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)ve.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(at.get("WEBGL_multi_draw"))ve.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let Bt=O._multiDrawStarts,is=O._multiDrawCounts,_e=O._multiDrawCount,Ri=Pt?Z.get(Pt).bytesPerElement:1,vr=dt.get(X).currentProgram.getUniforms();for(let Zn=0;Zn<_e;Zn++)vr.setValue(D,"_gl_DrawID",Zn),ve.render(Bt[Zn]/Ri,is[Zn])}else if(O.isInstancedMesh)ve.renderInstances(he,Ue,O.count);else if(k.isInstancedBufferGeometry){let Bt=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,is=Math.min(k.instanceCount,Bt);ve.renderInstances(he,Ue,is)}else ve.render(he,Ue)};function ue(E,I,k){E.transparent===!0&&E.side===oi&&E.forceSinglePass===!1?(E.side=En,E.needsUpdate=!0,ne(E,I,k),E.side=ba,E.needsUpdate=!0,ne(E,I,k),E.side=oi):ne(E,I,k)}this.compile=function(E,I,k=null){k===null&&(k=E),u=Gt.get(k),u.init(I),_.push(u),k.traverseVisible(function(O){O.isLight&&O.layers.test(I.layers)&&(u.pushLight(O),O.castShadow&&u.pushShadow(O))}),E!==k&&E.traverseVisible(function(O){O.isLight&&O.layers.test(I.layers)&&(u.pushLight(O),O.castShadow&&u.pushShadow(O))}),u.setupLights();let X=new Set;return E.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let pt=O.material;if(pt)if(Array.isArray(pt))for(let Ct=0;Ct<pt.length;Ct++){let Ot=pt[Ct];ue(Ot,k,O),X.add(Ot)}else ue(pt,k,O),X.add(pt)}),_.pop(),u=null,X},this.compileAsync=function(E,I,k=null){let X=this.compile(E,I,k);return new Promise(O=>{function pt(){if(X.forEach(function(Ct){dt.get(Ct).currentProgram.isReady()&&X.delete(Ct)}),X.size===0){O(E);return}setTimeout(pt,10)}at.get("KHR_parallel_shader_compile")!==null?pt():setTimeout(pt,10)})};let wn=null;function hi(E){wn&&wn(E)}function Qo(){ns.stop()}function Ko(){ns.start()}let ns=new xb;ns.setAnimationLoop(hi),typeof self<"u"&&ns.setContext(self),this.setAnimationLoop=function(E){wn=E,q.setAnimationLoop(E),E===null?ns.stop():ns.start()},q.addEventListener("sessionstart",Qo),q.addEventListener("sessionend",Ko),this.render=function(E,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),q.enabled===!0&&q.isPresenting===!0&&(q.cameraAutoUpdate===!0&&q.updateCamera(I),I=q.getCamera()),E.isScene===!0&&E.onBeforeRender(v,E,I,C),u=Gt.get(E,_.length),u.init(I),_.push(u),Et.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),W.setFromProjectionMatrix(Et),mt=this.localClippingEnabled,it=lt.init(this.clippingPlanes,mt),m=Tt.get(E,y.length),m.init(),y.push(m),q.enabled===!0&&q.isPresenting===!0){let pt=v.xr.getDepthSensingMesh();pt!==null&&gr(pt,I,-1/0,v.sortObjects)}gr(E,I,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(ut,vt),Q=q.enabled===!1||q.isPresenting===!1||q.hasDepthSensing()===!1,Q&&Vt.addToRenderList(m,E),this.info.render.frame++,it===!0&&lt.beginShadows();let k=u.state.shadowsArray;Ut.render(k,E,I),it===!0&&lt.endShadows(),this.info.autoReset===!0&&this.info.reset();let X=m.opaque,O=m.transmissive;if(u.setupLights(),I.isArrayCamera){let pt=I.cameras;if(O.length>0)for(let Ct=0,Ot=pt.length;Ct<Ot;Ct++){let Pt=pt[Ct];V(X,O,E,Pt)}Q&&Vt.render(E);for(let Ct=0,Ot=pt.length;Ct<Ot;Ct++){let Pt=pt[Ct];jo(m,E,Pt,Pt.viewport)}}else O.length>0&&V(X,O,E,I),Q&&Vt.render(E),jo(m,E,I);C!==null&&(T.updateMultisampleRenderTarget(C),T.updateRenderTargetMipmap(C)),E.isScene===!0&&E.onAfterRender(v,E,I),ge.resetDefaultState(),b=-1,S=null,_.pop(),_.length>0?(u=_[_.length-1],it===!0&&lt.setGlobalState(v.clippingPlanes,u.state.camera)):u=null,y.pop(),y.length>0?m=y[y.length-1]:m=null};function gr(E,I,k,X){if(E.visible===!1)return;if(E.layers.test(I.layers)){if(E.isGroup)k=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(I);else if(E.isLight)u.pushLight(E),E.castShadow&&u.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||W.intersectsSprite(E)){X&&wt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Et);let Ct=J.update(E),Ot=E.material;Ot.visible&&m.push(E,Ct,Ot,k,wt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||W.intersectsObject(E))){let Ct=J.update(E),Ot=E.material;if(X&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),wt.copy(E.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),wt.copy(Ct.boundingSphere.center)),wt.applyMatrix4(E.matrixWorld).applyMatrix4(Et)),Array.isArray(Ot)){let Pt=Ct.groups;for(let Yt=0,$t=Pt.length;Yt<$t;Yt++){let zt=Pt[Yt],he=Ot[zt.materialIndex];he&&he.visible&&m.push(E,Ct,he,k,wt.z,zt)}}else Ot.visible&&m.push(E,Ct,Ot,k,wt.z,null)}}let pt=E.children;for(let Ct=0,Ot=pt.length;Ct<Ot;Ct++)gr(pt[Ct],I,k,X)}function jo(E,I,k,X){let O=E.opaque,pt=E.transmissive,Ct=E.transparent;u.setupLightsView(k),it===!0&&lt.setGlobalState(v.clippingPlanes,k),X&&$.viewport(U.copy(X)),O.length>0&&ht(O,I,k),pt.length>0&&ht(pt,I,k),Ct.length>0&&ht(Ct,I,k),$.buffers.depth.setTest(!0),$.buffers.depth.setMask(!0),$.buffers.color.setMask(!0),$.setPolygonOffset(!1)}function V(E,I,k,X){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[X.id]===void 0&&(u.state.transmissionRenderTarget[X.id]=new xn(1,1,{generateMipmaps:!0,type:at.has("EXT_color_buffer_half_float")||at.has("EXT_color_buffer_float")?ci:Os,minFilter:rr,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ce.workingColorSpace}));let pt=u.state.transmissionRenderTarget[X.id],Ct=X.viewport||U;pt.setSize(Ct.z,Ct.w);let Ot=v.getRenderTarget();v.setRenderTarget(pt),v.getClearColor(z),Y=v.getClearAlpha(),Y<1&&v.setClearColor(16777215,.5),v.clear(),Q&&Vt.render(k);let Pt=v.toneMapping;v.toneMapping=Sa;let Yt=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),u.setupLightsView(X),it===!0&&lt.setGlobalState(v.clippingPlanes,X),ht(E,k,X),T.updateMultisampleRenderTarget(pt),T.updateRenderTargetMipmap(pt),at.has("WEBGL_multisampled_render_to_texture")===!1){let $t=!1;for(let zt=0,he=I.length;zt<he;zt++){let Ce=I[zt],Ue=Ce.object,Pn=Ce.geometry,ve=Ce.material,Bt=Ce.group;if(ve.side===oi&&Ue.layers.test(X.layers)){let is=ve.side;ve.side=En,ve.needsUpdate=!0,nt(Ue,k,X,Pn,ve,Bt),ve.side=is,ve.needsUpdate=!0,$t=!0}}$t===!0&&(T.updateMultisampleRenderTarget(pt),T.updateRenderTargetMipmap(pt))}v.setRenderTarget(Ot),v.setClearColor(z,Y),Yt!==void 0&&(X.viewport=Yt),v.toneMapping=Pt}function ht(E,I,k){let X=I.isScene===!0?I.overrideMaterial:null;for(let O=0,pt=E.length;O<pt;O++){let Ct=E[O],Ot=Ct.object,Pt=Ct.geometry,Yt=X===null?Ct.material:X,$t=Ct.group;Ot.layers.test(k.layers)&&nt(Ot,I,k,Pt,Yt,$t)}}function nt(E,I,k,X,O,pt){E.onBeforeRender(v,I,k,X,O,pt),E.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),O.onBeforeRender(v,I,k,X,E,pt),O.transparent===!0&&O.side===oi&&O.forceSinglePass===!1?(O.side=En,O.needsUpdate=!0,v.renderBufferDirect(k,I,X,O,E,pt),O.side=ba,O.needsUpdate=!0,v.renderBufferDirect(k,I,X,O,E,pt),O.side=oi):v.renderBufferDirect(k,I,X,O,E,pt),E.onAfterRender(v,I,k,X,O,pt)}function ne(E,I,k){I.isScene!==!0&&(I=Ht);let X=dt.get(E),O=u.state.lights,pt=u.state.shadowsArray,Ct=O.state.version,Ot=Lt.getParameters(E,O.state,pt,I,k),Pt=Lt.getProgramCacheKey(Ot),Yt=X.programs;X.environment=E.isMeshStandardMaterial?I.environment:null,X.fog=I.fog,X.envMap=(E.isMeshStandardMaterial?B:x).get(E.envMap||X.environment),X.envMapRotation=X.environment!==null&&E.envMap===null?I.environmentRotation:E.envMapRotation,Yt===void 0&&(E.addEventListener("dispose",Jt),Yt=new Map,X.programs=Yt);let $t=Yt.get(Pt);if($t!==void 0){if(X.currentProgram===$t&&X.lightsStateVersion===Ct)return oe(E,Ot),$t}else Ot.uniforms=Lt.getUniforms(E),E.onBeforeCompile(Ot,v),$t=Lt.acquireProgram(Ot,Pt),Yt.set(Pt,$t),X.uniforms=Ot.uniforms;let zt=X.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(zt.clippingPlanes=lt.uniform),oe(E,Ot),X.needsLights=If(E),X.lightsStateVersion=Ct,X.needsLights&&(zt.ambientLightColor.value=O.state.ambient,zt.lightProbe.value=O.state.probe,zt.directionalLights.value=O.state.directional,zt.directionalLightShadows.value=O.state.directionalShadow,zt.spotLights.value=O.state.spot,zt.spotLightShadows.value=O.state.spotShadow,zt.rectAreaLights.value=O.state.rectArea,zt.ltc_1.value=O.state.rectAreaLTC1,zt.ltc_2.value=O.state.rectAreaLTC2,zt.pointLights.value=O.state.point,zt.pointLightShadows.value=O.state.pointShadow,zt.hemisphereLights.value=O.state.hemi,zt.directionalShadowMap.value=O.state.directionalShadowMap,zt.directionalShadowMatrix.value=O.state.directionalShadowMatrix,zt.spotShadowMap.value=O.state.spotShadowMap,zt.spotLightMatrix.value=O.state.spotLightMatrix,zt.spotLightMap.value=O.state.spotLightMap,zt.pointShadowMap.value=O.state.pointShadowMap,zt.pointShadowMatrix.value=O.state.pointShadowMatrix),X.currentProgram=$t,X.uniformsList=null,$t}function Kt(E){if(E.uniformsList===null){let I=E.currentProgram.getUniforms();E.uniformsList=Io.seqWithValue(I.seq,E.uniforms)}return E.uniformsList}function oe(E,I){let k=dt.get(E);k.outputColorSpace=I.outputColorSpace,k.batching=I.batching,k.batchingColor=I.batchingColor,k.instancing=I.instancing,k.instancingColor=I.instancingColor,k.instancingMorph=I.instancingMorph,k.skinning=I.skinning,k.morphTargets=I.morphTargets,k.morphNormals=I.morphNormals,k.morphColors=I.morphColors,k.morphTargetsCount=I.morphTargetsCount,k.numClippingPlanes=I.numClippingPlanes,k.numIntersection=I.numClipIntersection,k.vertexAlphas=I.vertexAlphas,k.vertexTangents=I.vertexTangents,k.toneMapping=I.toneMapping}function Se(E,I,k,X,O){I.isScene!==!0&&(I=Ht),T.resetTextureUnits();let pt=I.fog,Ct=X.isMeshStandardMaterial?I.environment:null,Ot=C===null?v.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:qo,Pt=(X.isMeshStandardMaterial?B:x).get(X.envMap||Ct),Yt=X.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,$t=!!k.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),zt=!!k.morphAttributes.position,he=!!k.morphAttributes.normal,Ce=!!k.morphAttributes.color,Ue=Sa;X.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(Ue=v.toneMapping);let Pn=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,ve=Pn!==void 0?Pn.length:0,Bt=dt.get(X),is=u.state.lights;if(it===!0&&(mt===!0||E!==S)){let fi=E===S&&X.id===b;lt.setState(X,E,fi)}let _e=!1;X.version===Bt.__version?(Bt.needsLights&&Bt.lightsStateVersion!==is.state.version||Bt.outputColorSpace!==Ot||O.isBatchedMesh&&Bt.batching===!1||!O.isBatchedMesh&&Bt.batching===!0||O.isBatchedMesh&&Bt.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Bt.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Bt.instancing===!1||!O.isInstancedMesh&&Bt.instancing===!0||O.isSkinnedMesh&&Bt.skinning===!1||!O.isSkinnedMesh&&Bt.skinning===!0||O.isInstancedMesh&&Bt.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Bt.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Bt.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Bt.instancingMorph===!1&&O.morphTexture!==null||Bt.envMap!==Pt||X.fog===!0&&Bt.fog!==pt||Bt.numClippingPlanes!==void 0&&(Bt.numClippingPlanes!==lt.numPlanes||Bt.numIntersection!==lt.numIntersection)||Bt.vertexAlphas!==Yt||Bt.vertexTangents!==$t||Bt.morphTargets!==zt||Bt.morphNormals!==he||Bt.morphColors!==Ce||Bt.toneMapping!==Ue||Bt.morphTargetsCount!==ve)&&(_e=!0):(_e=!0,Bt.__version=X.version);let Ri=Bt.currentProgram;_e===!0&&(Ri=ne(X,I,O));let vr=!1,Zn=!1,$o=!1,Ne=Ri.getUniforms(),Fi=Bt.uniforms;if($.useProgram(Ri.program)&&(vr=!0,Zn=!0,$o=!0),X.id!==b&&(b=X.id,Zn=!0),vr||S!==E){$.buffers.depth.getReversed()?(tt.copy(E.projectionMatrix),ZA(tt),JA(tt),Ne.setValue(D,"projectionMatrix",tt)):Ne.setValue(D,"projectionMatrix",E.projectionMatrix),Ne.setValue(D,"viewMatrix",E.matrixWorldInverse);let zs=Ne.map.cameraPosition;zs!==void 0&&zs.setValue(D,gt.setFromMatrixPosition(E.matrixWorld)),rt.logarithmicDepthBuffer&&Ne.setValue(D,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&Ne.setValue(D,"isOrthographic",E.isOrthographicCamera===!0),S!==E&&(S=E,Zn=!0,$o=!0)}if(O.isSkinnedMesh){Ne.setOptional(D,O,"bindMatrix"),Ne.setOptional(D,O,"bindMatrixInverse");let fi=O.skeleton;fi&&(fi.boneTexture===null&&fi.computeBoneTexture(),Ne.setValue(D,"boneTexture",fi.boneTexture,T))}O.isBatchedMesh&&(Ne.setOptional(D,O,"batchingTexture"),Ne.setValue(D,"batchingTexture",O._matricesTexture,T),Ne.setOptional(D,O,"batchingIdTexture"),Ne.setValue(D,"batchingIdTexture",O._indirectTexture,T),Ne.setOptional(D,O,"batchingColorTexture"),O._colorsTexture!==null&&Ne.setValue(D,"batchingColorTexture",O._colorsTexture,T));let tl=k.morphAttributes;if((tl.position!==void 0||tl.normal!==void 0||tl.color!==void 0)&&Xt.update(O,k,Ri),(Zn||Bt.receiveShadow!==O.receiveShadow)&&(Bt.receiveShadow=O.receiveShadow,Ne.setValue(D,"receiveShadow",O.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(Fi.envMap.value=Pt,Fi.flipEnvMap.value=Pt.isCubeTexture&&Pt.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&I.environment!==null&&(Fi.envMapIntensity.value=I.environmentIntensity),Zn&&(Ne.setValue(D,"toneMappingExposure",v.toneMappingExposure),Bt.needsLights&&nn(Fi,$o),pt&&X.fog===!0&&xt.refreshFogUniforms(Fi,pt),xt.refreshMaterialUniforms(Fi,X,H,j,u.state.transmissionRenderTarget[E.id]),Io.upload(D,Kt(Bt),Fi,T)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Io.upload(D,Kt(Bt),Fi,T),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&Ne.setValue(D,"center",O.center),Ne.setValue(D,"modelViewMatrix",O.modelViewMatrix),Ne.setValue(D,"normalMatrix",O.normalMatrix),Ne.setValue(D,"modelMatrix",O.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){let fi=X.uniformsGroups;for(let zs=0,Bs=fi.length;zs<Bs;zs++){let J0=fi[zs];L.update(J0,Ri),L.bind(J0,Ri)}}return Ri}function nn(E,I){E.ambientLightColor.needsUpdate=I,E.lightProbe.needsUpdate=I,E.directionalLights.needsUpdate=I,E.directionalLightShadows.needsUpdate=I,E.pointLights.needsUpdate=I,E.pointLightShadows.needsUpdate=I,E.spotLights.needsUpdate=I,E.spotLightShadows.needsUpdate=I,E.rectAreaLights.needsUpdate=I,E.hemisphereLights.needsUpdate=I}function If(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(E,I,k){dt.get(E.texture).__webglTexture=I,dt.get(E.depthTexture).__webglTexture=k;let X=dt.get(E);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=k===void 0,X.__autoAllocateDepthBuffer||at.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,I){let k=dt.get(E);k.__webglFramebuffer=I,k.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(E,I=0,k=0){C=E,w=I,A=k;let X=!0,O=null,pt=!1,Ct=!1;if(E){let Pt=dt.get(E);if(Pt.__useDefaultFramebuffer!==void 0)$.bindFramebuffer(D.FRAMEBUFFER,null),X=!1;else if(Pt.__webglFramebuffer===void 0)T.setupRenderTarget(E);else if(Pt.__hasExternalTextures)T.rebindTextures(E,dt.get(E.texture).__webglTexture,dt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let zt=E.depthTexture;if(Pt.__boundDepthTexture!==zt){if(zt!==null&&dt.has(zt)&&(E.width!==zt.image.width||E.height!==zt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(E)}}let Yt=E.texture;(Yt.isData3DTexture||Yt.isDataArrayTexture||Yt.isCompressedArrayTexture)&&(Ct=!0);let $t=dt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray($t[I])?O=$t[I][k]:O=$t[I],pt=!0):E.samples>0&&T.useMultisampledRTT(E)===!1?O=dt.get(E).__webglMultisampledFramebuffer:Array.isArray($t)?O=$t[k]:O=$t,U.copy(E.viewport),F.copy(E.scissor),P=E.scissorTest}else U.copy(yt).multiplyScalar(H).floor(),F.copy(Ft).multiplyScalar(H).floor(),P=Nt;if($.bindFramebuffer(D.FRAMEBUFFER,O)&&X&&$.drawBuffers(E,O),$.viewport(U),$.scissor(F),$.setScissorTest(P),pt){let Pt=dt.get(E.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+I,Pt.__webglTexture,k)}else if(Ct){let Pt=dt.get(E.texture),Yt=I||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,Pt.__webglTexture,k||0,Yt)}b=-1},this.readRenderTargetPixels=function(E,I,k,X,O,pt,Ct){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ot=dt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ct!==void 0&&(Ot=Ot[Ct]),Ot){$.bindFramebuffer(D.FRAMEBUFFER,Ot);try{let Pt=E.texture,Yt=Pt.format,$t=Pt.type;if(!rt.textureFormatReadable(Yt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!rt.textureTypeReadable($t)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=E.width-X&&k>=0&&k<=E.height-O&&D.readPixels(I,k,X,O,Wt.convert(Yt),Wt.convert($t),pt)}finally{let Pt=C!==null?dt.get(C).__webglFramebuffer:null;$.bindFramebuffer(D.FRAMEBUFFER,Pt)}}},this.readRenderTargetPixelsAsync=async function(E,I,k,X,O,pt,Ct){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ot=dt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ct!==void 0&&(Ot=Ot[Ct]),Ot){let Pt=E.texture,Yt=Pt.format,$t=Pt.type;if(!rt.textureFormatReadable(Yt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!rt.textureTypeReadable($t))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(I>=0&&I<=E.width-X&&k>=0&&k<=E.height-O){$.bindFramebuffer(D.FRAMEBUFFER,Ot);let zt=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,zt),D.bufferData(D.PIXEL_PACK_BUFFER,pt.byteLength,D.STREAM_READ),D.readPixels(I,k,X,O,Wt.convert(Yt),Wt.convert($t),0);let he=C!==null?dt.get(C).__webglFramebuffer:null;$.bindFramebuffer(D.FRAMEBUFFER,he);let Ce=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await YA(D,Ce,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,zt),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,pt),D.deleteBuffer(zt),D.deleteSync(Ce),pt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,I=null,k=0){E.isTexture!==!0&&(hc("WebGLRenderer: copyFramebufferToTexture function signature has changed."),I=arguments[0]||null,E=arguments[1]);let X=Math.pow(2,-k),O=Math.floor(E.image.width*X),pt=Math.floor(E.image.height*X),Ct=I!==null?I.x:0,Ot=I!==null?I.y:0;T.setTexture2D(E,0),D.copyTexSubImage2D(D.TEXTURE_2D,k,0,0,Ct,Ot,O,pt),$.unbindTexture()},this.copyTextureToTexture=function(E,I,k=null,X=null,O=0){E.isTexture!==!0&&(hc("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,E=arguments[1],I=arguments[2],O=arguments[3]||0,k=null);let pt,Ct,Ot,Pt,Yt,$t,zt,he,Ce,Ue=E.isCompressedTexture?E.mipmaps[O]:E.image;k!==null?(pt=k.max.x-k.min.x,Ct=k.max.y-k.min.y,Ot=k.isBox3?k.max.z-k.min.z:1,Pt=k.min.x,Yt=k.min.y,$t=k.isBox3?k.min.z:0):(pt=Ue.width,Ct=Ue.height,Ot=Ue.depth||1,Pt=0,Yt=0,$t=0),X!==null?(zt=X.x,he=X.y,Ce=X.z):(zt=0,he=0,Ce=0);let Pn=Wt.convert(I.format),ve=Wt.convert(I.type),Bt;I.isData3DTexture?(T.setTexture3D(I,0),Bt=D.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(T.setTexture2DArray(I,0),Bt=D.TEXTURE_2D_ARRAY):(T.setTexture2D(I,0),Bt=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,I.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,I.unpackAlignment);let is=D.getParameter(D.UNPACK_ROW_LENGTH),_e=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Ri=D.getParameter(D.UNPACK_SKIP_PIXELS),vr=D.getParameter(D.UNPACK_SKIP_ROWS),Zn=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,Ue.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Ue.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Pt),D.pixelStorei(D.UNPACK_SKIP_ROWS,Yt),D.pixelStorei(D.UNPACK_SKIP_IMAGES,$t);let $o=E.isDataArrayTexture||E.isData3DTexture,Ne=I.isDataArrayTexture||I.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){let Fi=dt.get(E),tl=dt.get(I),fi=dt.get(Fi.__renderTarget),zs=dt.get(tl.__renderTarget);$.bindFramebuffer(D.READ_FRAMEBUFFER,fi.__webglFramebuffer),$.bindFramebuffer(D.DRAW_FRAMEBUFFER,zs.__webglFramebuffer);for(let Bs=0;Bs<Ot;Bs++)$o&&D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,dt.get(E).__webglTexture,O,$t+Bs),E.isDepthTexture?(Ne&&D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,dt.get(I).__webglTexture,O,Ce+Bs),D.blitFramebuffer(Pt,Yt,pt,Ct,zt,he,pt,Ct,D.DEPTH_BUFFER_BIT,D.NEAREST)):Ne?D.copyTexSubImage3D(Bt,O,zt,he,Ce+Bs,Pt,Yt,pt,Ct):D.copyTexSubImage2D(Bt,O,zt,he,Ce+Bs,Pt,Yt,pt,Ct);$.bindFramebuffer(D.READ_FRAMEBUFFER,null),$.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else Ne?E.isDataTexture||E.isData3DTexture?D.texSubImage3D(Bt,O,zt,he,Ce,pt,Ct,Ot,Pn,ve,Ue.data):I.isCompressedArrayTexture?D.compressedTexSubImage3D(Bt,O,zt,he,Ce,pt,Ct,Ot,Pn,Ue.data):D.texSubImage3D(Bt,O,zt,he,Ce,pt,Ct,Ot,Pn,ve,Ue):E.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,O,zt,he,pt,Ct,Pn,ve,Ue.data):E.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,O,zt,he,Ue.width,Ue.height,Pn,Ue.data):D.texSubImage2D(D.TEXTURE_2D,O,zt,he,pt,Ct,Pn,ve,Ue);D.pixelStorei(D.UNPACK_ROW_LENGTH,is),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,_e),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Ri),D.pixelStorei(D.UNPACK_SKIP_ROWS,vr),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Zn),O===0&&I.generateMipmaps&&D.generateMipmap(Bt),$.unbindTexture()},this.copyTextureToTexture3D=function(E,I,k=null,X=null,O=0){return E.isTexture!==!0&&(hc("WebGLRenderer: copyTextureToTexture3D function signature has changed."),k=arguments[0]||null,X=arguments[1]||null,E=arguments[2],I=arguments[3],O=arguments[4]||0),hc('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,I,k,X,O)},this.initRenderTarget=function(E){dt.get(E).__webglFramebuffer===void 0&&T.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?T.setTextureCube(E,0):E.isData3DTexture?T.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?T.setTexture2DArray(E,0):T.setTexture2D(E,0),$.unbindTexture()},this.resetState=function(){w=0,A=0,C=null,$.reset(),ge.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ns}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let n=this.getContext();n.drawingBufferColorspace=ce._getDrawingBufferColorSpace(t),n.unpackColorSpace=ce._getUnpackColorSpace()}},af=class e{constructor(t,n=1,i=1e3){this.isFog=!0,this.name="",this.color=new qt(t),this.near=n,this.far=i}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},yc=class extends An{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ai,this.environmentIntensity=1,this.environmentRotation=new Ai,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,n){return super.copy(t,n),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let n=super.toJSON(t);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}},rf=class{constructor(t,n){this.isInterleavedBuffer=!0,this.array=t,this.stride=n,this.count=t!==void 0?t.length/n:0,this.usage=Vg,this.updateRanges=[],this.version=0,this.uuid=Ls()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,n){this.updateRanges.push({start:t,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,n,i){t*=this.stride,i*=n.stride;for(let s=0,a=this.stride;s<a;s++)this.array[t+s]=n.array[i+s];return this}set(t,n=0){return this.array.set(t,n),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ls()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let n=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(n,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ls()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Un=new N,xc=class e{constructor(t,n,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=n,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let n=0,i=this.data.count;n<i;n++)Un.fromBufferAttribute(this,n),Un.applyMatrix4(t),this.setXYZ(n,Un.x,Un.y,Un.z);return this}applyNormalMatrix(t){for(let n=0,i=this.count;n<i;n++)Un.fromBufferAttribute(this,n),Un.applyNormalMatrix(t),this.setXYZ(n,Un.x,Un.y,Un.z);return this}transformDirection(t){for(let n=0,i=this.count;n<i;n++)Un.fromBufferAttribute(this,n),Un.transformDirection(t),this.setXYZ(n,Un.x,Un.y,Un.z);return this}getComponent(t,n){let i=this.array[t*this.data.stride+this.offset+n];return this.normalized&&(i=Qi(i,this.array)),i}setComponent(t,n,i){return this.normalized&&(i=Te(i,this.array)),this.data.array[t*this.data.stride+this.offset+n]=i,this}setX(t,n){return this.normalized&&(n=Te(n,this.array)),this.data.array[t*this.data.stride+this.offset]=n,this}setY(t,n){return this.normalized&&(n=Te(n,this.array)),this.data.array[t*this.data.stride+this.offset+1]=n,this}setZ(t,n){return this.normalized&&(n=Te(n,this.array)),this.data.array[t*this.data.stride+this.offset+2]=n,this}setW(t,n){return this.normalized&&(n=Te(n,this.array)),this.data.array[t*this.data.stride+this.offset+3]=n,this}getX(t){let n=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(n=Qi(n,this.array)),n}getY(t){let n=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(n=Qi(n,this.array)),n}getZ(t){let n=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(n=Qi(n,this.array)),n}getW(t){let n=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(n=Qi(n,this.array)),n}setXY(t,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(n=Te(n,this.array),i=Te(i,this.array)),this.data.array[t+0]=n,this.data.array[t+1]=i,this}setXYZ(t,n,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(n=Te(n,this.array),i=Te(i,this.array),s=Te(s,this.array)),this.data.array[t+0]=n,this.data.array[t+1]=i,this.data.array[t+2]=s,this}setXYZW(t,n,i,s,a){return t=t*this.data.stride+this.offset,this.normalized&&(n=Te(n,this.array),i=Te(i,this.array),s=Te(s,this.array),a=Te(a,this.array)),this.data.array[t+0]=n,this.data.array[t+1]=i,this.data.array[t+2]=s,this.data.array[t+3]=a,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let n=[];for(let i=0;i<this.count;i++){let s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)n.push(this.data.array[s+a])}return new Tn(new this.array.constructor(n),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let n=[];for(let i=0;i<this.count;i++){let s=i*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)n.push(this.data.array[s+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:n,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Mc=class extends Aa{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new qt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},rc=new N,Ao=new N,wo=new N,Ro=new ct,oc=new ct,Tb=new fe,Lh=new N,lc=new N,Ih=new N,qS=new ct,Km=new ct,YS=new ct,of=class extends An{constructor(t=new Mc){if(super(),this.isSprite=!0,this.type="Sprite",To===void 0){To=new rn;let n=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new rf(n,5);To.setIndex([0,1,2,0,2,3]),To.setAttribute("position",new xc(i,3,0,!1)),To.setAttribute("uv",new xc(i,2,3,!1))}this.geometry=To,this.material=t,this.center=new ct(.5,.5)}raycast(t,n){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ao.setFromMatrixScale(this.matrixWorld),Tb.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),wo.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ao.multiplyScalar(-wo.z);let i=this.material.rotation,s,a;i!==0&&(a=Math.cos(i),s=Math.sin(i));let r=this.center;Oh(Lh.set(-.5,-.5,0),wo,r,Ao,s,a),Oh(lc.set(.5,-.5,0),wo,r,Ao,s,a),Oh(Ih.set(.5,.5,0),wo,r,Ao,s,a),qS.set(0,0),Km.set(1,0),YS.set(1,1);let o=t.ray.intersectTriangle(Lh,lc,Ih,!1,rc);if(o===null&&(Oh(lc.set(-.5,.5,0),wo,r,Ao,s,a),Km.set(0,1),o=t.ray.intersectTriangle(Lh,Ih,lc,!1,rc),o===null))return;let l=t.ray.origin.distanceTo(rc);l<t.near||l>t.far||n.push({distance:l,point:rc.clone(),uv:xa.getInterpolation(rc,Lh,lc,Ih,qS,Km,YS,new ct),face:null,object:this})}copy(t,n){return super.copy(t,n),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};r0=class extends Xn{constructor(t=null,n=1,i=1,s,a,r,o,l,c=li,h=li,d,f){super(null,r,o,l,c,h,s,a,d,f),this.isDataTexture=!0,this.image={data:t,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Sc=class extends Tn{constructor(t,n,i,s=1){super(t,n,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Co=new fe,ZS=new fe,Ph=[],JS=new Ps,G3=new fe,cc=new Zt,uc=new lr,ts=class extends Zt{constructor(t,n,i){super(t,n),this.isInstancedMesh=!0,this.instanceMatrix=new Sc(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,G3)}computeBoundingBox(){let t=this.geometry,n=this.count;this.boundingBox===null&&(this.boundingBox=new Ps),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,Co),JS.copy(t.boundingBox).applyMatrix4(Co),this.boundingBox.union(JS)}computeBoundingSphere(){let t=this.geometry,n=this.count;this.boundingSphere===null&&(this.boundingSphere=new lr),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,Co),uc.copy(t.boundingSphere).applyMatrix4(Co),this.boundingSphere.union(uc)}copy(t,n){return super.copy(t,n),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,n){n.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,n){n.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,n){let i=n.morphTargetInfluences,s=this.morphTexture.source.data.data,a=i.length+1,r=t*a+1;for(let o=0;o<i.length;o++)i[o]=s[r+o]}raycast(t,n){let i=this.matrixWorld,s=this.count;if(cc.geometry=this.geometry,cc.material=this.material,cc.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),uc.copy(this.boundingSphere),uc.applyMatrix4(i),t.ray.intersectsSphere(uc)!==!1))for(let a=0;a<s;a++){this.getMatrixAt(a,Co),ZS.multiplyMatrices(i,Co),cc.matrixWorld=ZS,cc.raycast(t,Ph);for(let r=0,o=Ph.length;r<o;r++){let l=Ph[r];l.instanceId=a,l.object=this,n.push(l)}Ph.length=0}}setColorAt(t,n){this.instanceColor===null&&(this.instanceColor=new Sc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),n.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,n){n.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,n){let i=n.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new r0(new Float32Array(s*this.count),s,this.count,P0,ji));let a=this.morphTexture.source.data.data,r=0;for(let c=0;c<i.length;c++)r+=i[c];let o=this.geometry.morphTargetsRelative?1:1-r,l=s*t;a[l]=o,a.set(i,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}},es=class extends Xn{constructor(t,n,i,s,a,r,o,l,c){super(t,n,i,s,a,r,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},wi=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,n){let i=this.getUtoTmapping(t);return this.getPoint(i,n)}getPoints(t=5){let n=[];for(let i=0;i<=t;i++)n.push(this.getPoint(i/t));return n}getSpacedPoints(t=5){let n=[];for(let i=0;i<=t;i++)n.push(this.getPointAt(i/t));return n}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let n=[],i,s=this.getPoint(0),a=0;n.push(0);for(let r=1;r<=t;r++)i=this.getPoint(r/t),a+=i.distanceTo(s),n.push(a),s=i;return this.cacheArcLengths=n,n}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,n){let i=this.getLengths(),s=0,a=i.length,r;n?r=n:r=t*i[a-1];let o=0,l=a-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=i[s]-r,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===r)return s/(a-1);let h=i[s],f=i[s+1]-h,p=(r-h)/f;return(s+p)/(a-1)}getTangent(t,n){let s=t-1e-4,a=t+1e-4;s<0&&(s=0),a>1&&(a=1);let r=this.getPoint(s),o=this.getPoint(a),l=n||(r.isVector2?new ct:new N);return l.copy(o).sub(r).normalize(),l}getTangentAt(t,n){let i=this.getUtoTmapping(t);return this.getTangent(i,n)}computeFrenetFrames(t,n){let i=new N,s=[],a=[],r=[],o=new N,l=new fe;for(let p=0;p<=t;p++){let g=p/t;s[p]=this.getTangentAt(g,new N)}a[0]=new N,r[0]=new N;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),d=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=c&&(c=h,i.set(1,0,0)),d<=c&&(c=d,i.set(0,1,0)),f<=c&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),a[0].crossVectors(s[0],o),r[0].crossVectors(s[0],a[0]);for(let p=1;p<=t;p++){if(a[p]=a[p-1].clone(),r[p]=r[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(yn(s[p-1].dot(s[p]),-1,1));a[p].applyMatrix4(l.makeRotationAxis(o,g))}r[p].crossVectors(s[p],a[p])}if(n===!0){let p=Math.acos(yn(a[0].dot(a[t]),-1,1));p/=t,s[0].dot(o.crossVectors(a[0],a[t]))>0&&(p=-p);for(let g=1;g<=t;g++)a[g].applyMatrix4(l.makeRotationAxis(s[g],p*g)),r[g].crossVectors(s[g],a[g])}return{tangents:s,normals:a,binormals:r}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},bc=class extends wi{constructor(t=0,n=0,i=1,s=1,a=0,r=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=n,this.xRadius=i,this.yRadius=s,this.aStartAngle=a,this.aEndAngle=r,this.aClockwise=o,this.aRotation=l}getPoint(t,n=new ct){let i=n,s=Math.PI*2,a=this.aEndAngle-this.aStartAngle,r=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=s;for(;a>s;)a-=s;a<Number.EPSILON&&(r?a=0:a=s),this.aClockwise===!0&&!r&&(a===s?a=-s:a=a-s);let o=this.aStartAngle+t*a,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),f=l-this.aX,p=c-this.aY;l=f*h-p*d+this.aX,c=f*d+p*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},o0=class extends bc{constructor(t,n,i,s,a,r){super(t,n,i,i,s,a,r),this.isArcCurve=!0,this.type="ArcCurve"}};zh=new N,jm=new V0,$m=new V0,tg=new V0,Ec=class extends wi{constructor(t=[],n=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=n,this.curveType=i,this.tension=s}getPoint(t,n=new N){let i=n,s=this.points,a=s.length,r=(a-(this.closed?0:1))*t,o=Math.floor(r),l=r-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/a)+1)*a:l===0&&o===a-1&&(o=a-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%a]:(zh.subVectors(s[0],s[1]).add(s[0]),c=zh);let d=s[o%a],f=s[(o+1)%a];if(this.closed||o+2<a?h=s[(o+2)%a]:(zh.subVectors(s[a-1],s[a-2]).add(s[a-1]),h=zh),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(d),p),M=Math.pow(d.distanceToSquared(f),p),m=Math.pow(f.distanceToSquared(h),p);M<1e-4&&(M=1),g<1e-4&&(g=M),m<1e-4&&(m=M),jm.initNonuniformCatmullRom(c.x,d.x,f.x,h.x,g,M,m),$m.initNonuniformCatmullRom(c.y,d.y,f.y,h.y,g,M,m),tg.initNonuniformCatmullRom(c.z,d.z,f.z,h.z,g,M,m)}else this.curveType==="catmullrom"&&(jm.initCatmullRom(c.x,d.x,f.x,h.x,this.tension),$m.initCatmullRom(c.y,d.y,f.y,h.y,this.tension),tg.initCatmullRom(c.z,d.z,f.z,h.z,this.tension));return i.set(jm.calc(l),$m.calc(l),tg.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let n=0,i=t.points.length;n<i;n++){let s=t.points[n];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let n=0,i=this.points.length;n<i;n++){let s=this.points[n];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let n=0,i=t.points.length;n<i;n++){let s=t.points[n];this.points.push(new N().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};lf=class extends wi{constructor(t=new ct,n=new ct,i=new ct,s=new ct){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=n,this.v2=i,this.v3=s}getPoint(t,n=new ct){let i=n,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(mc(t,s.x,a.x,r.x,o.x),mc(t,s.y,a.y,r.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},l0=class extends wi{constructor(t=new N,n=new N,i=new N,s=new N){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=n,this.v2=i,this.v3=s}getPoint(t,n=new N){let i=n,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(mc(t,s.x,a.x,r.x,o.x),mc(t,s.y,a.y,r.y,o.y),mc(t,s.z,a.z,r.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},cf=class extends wi{constructor(t=new ct,n=new ct){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=n}getPoint(t,n=new ct){let i=n;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,n){return this.getPoint(t,n)}getTangent(t,n=new ct){return n.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,n){return this.getTangent(t,n)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},c0=class extends wi{constructor(t=new N,n=new N){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=n}getPoint(t,n=new N){let i=n;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,n){return this.getPoint(t,n)}getTangent(t,n=new N){return n.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,n){return this.getTangent(t,n)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},uf=class extends wi{constructor(t=new ct,n=new ct,i=new ct){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=n,this.v2=i}getPoint(t,n=new ct){let i=n,s=this.v0,a=this.v1,r=this.v2;return i.set(pc(t,s.x,a.x,r.x),pc(t,s.y,a.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},u0=class extends wi{constructor(t=new N,n=new N,i=new N){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=n,this.v2=i}getPoint(t,n=new N){let i=n,s=this.v0,a=this.v1,r=this.v2;return i.set(pc(t,s.x,a.x,r.x),pc(t,s.y,a.y,r.y),pc(t,s.z,a.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},hf=class extends wi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,n=new ct){let i=n,s=this.points,a=(s.length-1)*t,r=Math.floor(a),o=a-r,l=s[r===0?r:r-1],c=s[r],h=s[r>s.length-2?s.length-1:r+1],d=s[r>s.length-3?s.length-1:r+2];return i.set(QS(o,l.x,c.x,h.x,d.x),QS(o,l.y,c.y,h.y,d.y)),i}copy(t){super.copy(t),this.points=[];for(let n=0,i=t.points.length;n<i;n++){let s=t.points[n];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let n=0,i=this.points.length;n<i;n++){let s=this.points[n];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let n=0,i=t.points.length;n<i;n++){let s=t.points[n];this.points.push(new ct().fromArray(s))}return this}},h0=Object.freeze({__proto__:null,ArcCurve:o0,CatmullRomCurve3:Ec,CubicBezierCurve:lf,CubicBezierCurve3:l0,EllipseCurve:bc,LineCurve:cf,LineCurve3:c0,QuadraticBezierCurve:uf,QuadraticBezierCurve3:u0,SplineCurve:hf}),f0=class extends wi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),n=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(n)){let i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new h0[i](n,t))}return this}getPoint(t,n){let i=t*this.getLength(),s=this.getCurveLengths(),a=0;for(;a<s.length;){if(s[a]>=i){let r=s[a]-i,o=this.curves[a],l=o.getLength(),c=l===0?0:1-r/l;return o.getPointAt(c,n)}a++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],n=0;for(let i=0,s=this.curves.length;i<s;i++)n+=this.curves[i].getLength(),t.push(n);return this.cacheLengths=t,t}getSpacedPoints(t=40){let n=[];for(let i=0;i<=t;i++)n.push(this.getPoint(i/t));return this.autoClose&&n.push(n[0]),n}getPoints(t=12){let n=[],i;for(let s=0,a=this.curves;s<a.length;s++){let r=a[s],o=r.isEllipseCurve?t*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?t*r.points.length:t,l=r.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];i&&i.equals(h)||(n.push(h),i=h)}}return this.autoClose&&n.length>1&&!n[n.length-1].equals(n[0])&&n.push(n[0]),n}copy(t){super.copy(t),this.curves=[];for(let n=0,i=t.curves.length;n<i;n++){let s=t.curves[n];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let n=0,i=this.curves.length;n<i;n++){let s=this.curves[n];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let n=0,i=t.curves.length;n<i;n++){let s=t.curves[n];this.curves.push(new h0[s.type]().fromJSON(s))}return this}},ff=class extends f0{constructor(t){super(),this.type="Path",this.currentPoint=new ct,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let n=1,i=t.length;n<i;n++)this.lineTo(t[n].x,t[n].y);return this}moveTo(t,n){return this.currentPoint.set(t,n),this}lineTo(t,n){let i=new cf(this.currentPoint.clone(),new ct(t,n));return this.curves.push(i),this.currentPoint.set(t,n),this}quadraticCurveTo(t,n,i,s){let a=new uf(this.currentPoint.clone(),new ct(t,n),new ct(i,s));return this.curves.push(a),this.currentPoint.set(i,s),this}bezierCurveTo(t,n,i,s,a,r){let o=new lf(this.currentPoint.clone(),new ct(t,n),new ct(i,s),new ct(a,r));return this.curves.push(o),this.currentPoint.set(a,r),this}splineThru(t){let n=[this.currentPoint.clone()].concat(t),i=new hf(n);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,n,i,s,a,r){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,n+l,i,s,a,r),this}absarc(t,n,i,s,a,r){return this.absellipse(t,n,i,i,s,a,r),this}ellipse(t,n,i,s,a,r,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,n+h,i,s,a,r,o,l),this}absellipse(t,n,i,s,a,r,o,l){let c=new bc(t,n,i,s,a,r,o,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},df=class e extends rn{constructor(t=1,n=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:n,thetaStart:i,thetaLength:s},n=Math.max(3,n);let a=[],r=[],o=[],l=[],c=new N,h=new ct;r.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,f=3;d<=n;d++,f+=3){let p=i+d/n*s;c.x=t*Math.cos(p),c.y=t*Math.sin(p),r.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(r[f]/t+1)/2,h.y=(r[f+1]/t+1)/2,l.push(h.x,h.y)}for(let d=1;d<=n;d++)a.push(d,d+1,0);this.setIndex(a),this.setAttribute("position",new me(r,3)),this.setAttribute("normal",new me(o,3)),this.setAttribute("uv",new me(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},qn=class e extends rn{constructor(t=1,n=1,i=1,s=32,a=1,r=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:n,height:i,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),a=Math.floor(a);let h=[],d=[],f=[],p=[],g=0,M=[],m=i/2,u=0;y(),r===!1&&(t>0&&_(!0),n>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new me(d,3)),this.setAttribute("normal",new me(f,3)),this.setAttribute("uv",new me(p,2));function y(){let v=new N,R=new N,w=0,A=(n-t)/i;for(let C=0;C<=a;C++){let b=[],S=C/a,U=S*(n-t)+t;for(let F=0;F<=s;F++){let P=F/s,z=P*l+o,Y=Math.sin(z),G=Math.cos(z);R.x=U*Y,R.y=-S*i+m,R.z=U*G,d.push(R.x,R.y,R.z),v.set(Y,A,G).normalize(),f.push(v.x,v.y,v.z),p.push(P,1-S),b.push(g++)}M.push(b)}for(let C=0;C<s;C++)for(let b=0;b<a;b++){let S=M[b][C],U=M[b+1][C],F=M[b+1][C+1],P=M[b][C+1];(t>0||b!==0)&&(h.push(S,U,P),w+=3),(n>0||b!==a-1)&&(h.push(U,F,P),w+=3)}c.addGroup(u,w,0),u+=w}function _(v){let R=g,w=new ct,A=new N,C=0,b=v===!0?t:n,S=v===!0?1:-1;for(let F=1;F<=s;F++)d.push(0,m*S,0),f.push(0,S,0),p.push(.5,.5),g++;let U=g;for(let F=0;F<=s;F++){let z=F/s*l+o,Y=Math.cos(z),G=Math.sin(z);A.x=b*G,A.y=m*S,A.z=b*Y,d.push(A.x,A.y,A.z),f.push(0,S,0),w.x=Y*.5+.5,w.y=G*.5*S+.5,p.push(w.x,w.y),g++}for(let F=0;F<s;F++){let P=R+F,z=U+F;v===!0?h.push(z,z+1,P):h.push(z+1,z,P),C+=3}c.addGroup(u,C,v===!0?1:2),u+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},cr=class e extends qn{constructor(t=1,n=1,i=32,s=1,a=!1,r=0,o=Math.PI*2){super(0,t,n,i,s,a,r,o),this.type="ConeGeometry",this.parameters={radius:t,height:n,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:r,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Xo=class extends ff{constructor(t){super(t),this.uuid=Ls(),this.type="Shape",this.holes=[]}getPointsHoles(t){let n=[];for(let i=0,s=this.holes.length;i<s;i++)n[i]=this.holes[i].getPoints(t);return n}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let n=0,i=t.holes.length;n<i;n++){let s=t.holes[n];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let n=0,i=this.holes.length;n<i;n++){let s=this.holes[n];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let n=0,i=t.holes.length;n<i;n++){let s=t.holes[n];this.holes.push(new ff().fromJSON(s))}return this}},Q3={triangulate:function(e,t,n=2){let i=t&&t.length,s=i?t[0]*n:e.length,a=Ab(e,0,s,n,!0),r=[];if(!a||a.next===a.prev)return r;let o,l,c,h,d,f,p;if(i&&(a=eD(e,t,a,n)),e.length>80*n){o=c=e[0],l=h=e[1];for(let g=n;g<s;g+=n)d=e[g],f=e[g+1],d<o&&(o=d),f<l&&(l=f),d>c&&(c=d),f>h&&(h=f);p=Math.max(c-o,h-l),p=p!==0?32767/p:0}return Tc(a,r,n,o,l,p,0),r}};gc=class e{static area(t){let n=t.length,i=0;for(let s=n-1,a=0;a<n;s=a++)i+=t[s].x*t[a].y-t[a].x*t[s].y;return i*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(t,n){let i=[],s=[],a=[];jS(t),$S(i,t);let r=t.length;n.forEach(jS);for(let l=0;l<n.length;l++)s.push(r),r+=n[l].length,$S(i,n[l]);let o=Q3.triangulate(i,s);for(let l=0;l<o.length;l+=3)a.push(o.slice(l,l+3));return a}};Rc=class e extends rn{constructor(t=new Xo([new ct(.5,.5),new ct(-.5,.5),new ct(-.5,-.5),new ct(.5,-.5)]),n={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:n},t=Array.isArray(t)?t:[t];let i=this,s=[],a=[];for(let o=0,l=t.length;o<l;o++){let c=t[o];r(c)}this.setAttribute("position",new me(s,3)),this.setAttribute("uv",new me(a,2)),this.computeVertexNormals();function r(o){let l=[],c=n.curveSegments!==void 0?n.curveSegments:12,h=n.steps!==void 0?n.steps:1,d=n.depth!==void 0?n.depth:1,f=n.bevelEnabled!==void 0?n.bevelEnabled:!0,p=n.bevelThickness!==void 0?n.bevelThickness:.2,g=n.bevelSize!==void 0?n.bevelSize:p-.1,M=n.bevelOffset!==void 0?n.bevelOffset:0,m=n.bevelSegments!==void 0?n.bevelSegments:3,u=n.extrudePath,y=n.UVGenerator!==void 0?n.UVGenerator:dD,_,v=!1,R,w,A,C;u&&(_=u.getSpacedPoints(h),v=!0,f=!1,R=u.computeFrenetFrames(h,!1),w=new N,A=new N,C=new N),f||(m=0,p=0,g=0,M=0);let b=o.extractPoints(c),S=b.shape,U=b.holes;if(!gc.isClockWise(S)){S=S.reverse();for(let Q=0,ot=U.length;Q<ot;Q++){let D=U[Q];gc.isClockWise(D)&&(U[Q]=D.reverse())}}let P=gc.triangulateShape(S,U),z=S;for(let Q=0,ot=U.length;Q<ot;Q++){let D=U[Q];S=S.concat(D)}function Y(Q,ot,D){return ot||console.error("THREE.ExtrudeGeometry: vec does not exist"),Q.clone().addScaledVector(ot,D)}let G=S.length,j=P.length;function H(Q,ot,D){let ft,at,rt,$=Q.x-ot.x,Rt=Q.y-ot.y,dt=D.x-Q.x,T=D.y-Q.y,x=$*$+Rt*Rt,B=$*T-Rt*dt;if(Math.abs(B)>Number.EPSILON){let Z=Math.sqrt(x),st=Math.sqrt(dt*dt+T*T),J=ot.x-Rt/Z,Lt=ot.y+$/Z,xt=D.x-T/st,Tt=D.y+dt/st,Gt=((xt-J)*T-(Tt-Lt)*dt)/($*T-Rt*dt);ft=J+$*Gt-Q.x,at=Lt+Rt*Gt-Q.y;let lt=ft*ft+at*at;if(lt<=2)return new ct(ft,at);rt=Math.sqrt(lt/2)}else{let Z=!1;$>Number.EPSILON?dt>Number.EPSILON&&(Z=!0):$<-Number.EPSILON?dt<-Number.EPSILON&&(Z=!0):Math.sign(Rt)===Math.sign(T)&&(Z=!0),Z?(ft=-Rt,at=$,rt=Math.sqrt(x)):(ft=$,at=Rt,rt=Math.sqrt(x/2))}return new ct(ft/rt,at/rt)}let ut=[];for(let Q=0,ot=z.length,D=ot-1,ft=Q+1;Q<ot;Q++,D++,ft++)D===ot&&(D=0),ft===ot&&(ft=0),ut[Q]=H(z[Q],z[D],z[ft]);let vt=[],yt,Ft=ut.concat();for(let Q=0,ot=U.length;Q<ot;Q++){let D=U[Q];yt=[];for(let ft=0,at=D.length,rt=at-1,$=ft+1;ft<at;ft++,rt++,$++)rt===at&&(rt=0),$===at&&($=0),yt[ft]=H(D[ft],D[rt],D[$]);vt.push(yt),Ft=Ft.concat(yt)}for(let Q=0;Q<m;Q++){let ot=Q/m,D=p*Math.cos(ot*Math.PI/2),ft=g*Math.sin(ot*Math.PI/2)+M;for(let at=0,rt=z.length;at<rt;at++){let $=Y(z[at],ut[at],ft);tt($.x,$.y,-D)}for(let at=0,rt=U.length;at<rt;at++){let $=U[at];yt=vt[at];for(let Rt=0,dt=$.length;Rt<dt;Rt++){let T=Y($[Rt],yt[Rt],ft);tt(T.x,T.y,-D)}}}let Nt=g+M;for(let Q=0;Q<G;Q++){let ot=f?Y(S[Q],Ft[Q],Nt):S[Q];v?(A.copy(R.normals[0]).multiplyScalar(ot.x),w.copy(R.binormals[0]).multiplyScalar(ot.y),C.copy(_[0]).add(A).add(w),tt(C.x,C.y,C.z)):tt(ot.x,ot.y,0)}for(let Q=1;Q<=h;Q++)for(let ot=0;ot<G;ot++){let D=f?Y(S[ot],Ft[ot],Nt):S[ot];v?(A.copy(R.normals[Q]).multiplyScalar(D.x),w.copy(R.binormals[Q]).multiplyScalar(D.y),C.copy(_[Q]).add(A).add(w),tt(C.x,C.y,C.z)):tt(D.x,D.y,d/h*Q)}for(let Q=m-1;Q>=0;Q--){let ot=Q/m,D=p*Math.cos(ot*Math.PI/2),ft=g*Math.sin(ot*Math.PI/2)+M;for(let at=0,rt=z.length;at<rt;at++){let $=Y(z[at],ut[at],ft);tt($.x,$.y,d+D)}for(let at=0,rt=U.length;at<rt;at++){let $=U[at];yt=vt[at];for(let Rt=0,dt=$.length;Rt<dt;Rt++){let T=Y($[Rt],yt[Rt],ft);v?tt(T.x,T.y+_[h-1].y,_[h-1].x+D):tt(T.x,T.y,d+D)}}}W(),it();function W(){let Q=s.length/3;if(f){let ot=0,D=G*ot;for(let ft=0;ft<j;ft++){let at=P[ft];Et(at[2]+D,at[1]+D,at[0]+D)}ot=h+m*2,D=G*ot;for(let ft=0;ft<j;ft++){let at=P[ft];Et(at[0]+D,at[1]+D,at[2]+D)}}else{for(let ot=0;ot<j;ot++){let D=P[ot];Et(D[2],D[1],D[0])}for(let ot=0;ot<j;ot++){let D=P[ot];Et(D[0]+G*h,D[1]+G*h,D[2]+G*h)}}i.addGroup(Q,s.length/3-Q,0)}function it(){let Q=s.length/3,ot=0;mt(z,ot),ot+=z.length;for(let D=0,ft=U.length;D<ft;D++){let at=U[D];mt(at,ot),ot+=at.length}i.addGroup(Q,s.length/3-Q,1)}function mt(Q,ot){let D=Q.length;for(;--D>=0;){let ft=D,at=D-1;at<0&&(at=Q.length-1);for(let rt=0,$=h+m*2;rt<$;rt++){let Rt=G*rt,dt=G*(rt+1),T=ot+ft+Rt,x=ot+at+Rt,B=ot+at+dt,Z=ot+ft+dt;gt(T,x,B,Z)}}}function tt(Q,ot,D){l.push(Q),l.push(ot),l.push(D)}function Et(Q,ot,D){wt(Q),wt(ot),wt(D);let ft=s.length/3,at=y.generateTopUV(i,s,ft-3,ft-2,ft-1);Ht(at[0]),Ht(at[1]),Ht(at[2])}function gt(Q,ot,D,ft){wt(Q),wt(ot),wt(ft),wt(ot),wt(D),wt(ft);let at=s.length/3,rt=y.generateSideWallUV(i,s,at-6,at-3,at-2,at-1);Ht(rt[0]),Ht(rt[1]),Ht(rt[3]),Ht(rt[1]),Ht(rt[2]),Ht(rt[3])}function wt(Q){s.push(l[Q*3+0]),s.push(l[Q*3+1]),s.push(l[Q*3+2])}function Ht(Q){a.push(Q.x),a.push(Q.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),n=this.parameters.shapes,i=this.parameters.options;return pD(n,i,t)}static fromJSON(t,n){let i=[];for(let a=0,r=t.shapes.length;a<r;a++){let o=n[t.shapes[a]];i.push(o)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new h0[s.type]().fromJSON(s)),new e(i,t.options)}},dD={generateTopUV:function(e,t,n,i,s){let a=t[n*3],r=t[n*3+1],o=t[i*3],l=t[i*3+1],c=t[s*3],h=t[s*3+1];return[new ct(a,r),new ct(o,l),new ct(c,h)]},generateSideWallUV:function(e,t,n,i,s,a){let r=t[n*3],o=t[n*3+1],l=t[n*3+2],c=t[i*3],h=t[i*3+1],d=t[i*3+2],f=t[s*3],p=t[s*3+1],g=t[s*3+2],M=t[a*3],m=t[a*3+1],u=t[a*3+2];return Math.abs(o-h)<Math.abs(r-c)?[new ct(r,1-l),new ct(c,1-d),new ct(f,1-g),new ct(M,1-u)]:[new ct(o,1-l),new ct(h,1-d),new ct(p,1-g),new ct(m,1-u)]}};pf=class e extends rn{constructor(t=1,n=32,i=16,s=0,a=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:n,heightSegments:i,phiStart:s,phiLength:a,thetaStart:r,thetaLength:o},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));let l=Math.min(r+o,Math.PI),c=0,h=[],d=new N,f=new N,p=[],g=[],M=[],m=[];for(let u=0;u<=i;u++){let y=[],_=u/i,v=0;u===0&&r===0?v=.5/n:u===i&&l===Math.PI&&(v=-.5/n);for(let R=0;R<=n;R++){let w=R/n;d.x=-t*Math.cos(s+w*a)*Math.sin(r+_*o),d.y=t*Math.cos(r+_*o),d.z=t*Math.sin(s+w*a)*Math.sin(r+_*o),g.push(d.x,d.y,d.z),f.copy(d).normalize(),M.push(f.x,f.y,f.z),m.push(w+v,1-_),y.push(c++)}h.push(y)}for(let u=0;u<i;u++)for(let y=0;y<n;y++){let _=h[u][y+1],v=h[u][y],R=h[u+1][y],w=h[u+1][y+1];(u!==0||r>0)&&p.push(_,v,w),(u!==i-1||l<Math.PI)&&p.push(v,R,w)}this.setIndex(p),this.setAttribute("position",new me(g,3)),this.setAttribute("normal",new me(M,3)),this.setAttribute("uv",new me(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},mf=class e extends rn{constructor(t=1,n=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:n,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);let r=[],o=[],l=[],c=[],h=new N,d=new N,f=new N;for(let p=0;p<=i;p++)for(let g=0;g<=s;g++){let M=g/s*a,m=p/i*Math.PI*2;d.x=(t+n*Math.cos(m))*Math.cos(M),d.y=(t+n*Math.cos(m))*Math.sin(M),d.z=n*Math.sin(m),o.push(d.x,d.y,d.z),h.x=t*Math.cos(M),h.y=t*Math.sin(M),f.subVectors(d,h).normalize(),l.push(f.x,f.y,f.z),c.push(g/s),c.push(p/i)}for(let p=1;p<=i;p++)for(let g=1;g<=s;g++){let M=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,u=(s+1)*(p-1)+g,y=(s+1)*p+g;r.push(M,m,y),r.push(m,u,y)}this.setIndex(r),this.setAttribute("position",new me(o,3)),this.setAttribute("normal",new me(l,3)),this.setAttribute("uv",new me(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}},gf=class extends Ye{static get type(){return"RawShaderMaterial"}constructor(t){super(t),this.isRawShaderMaterial=!0}},Ae=class extends Aa{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new qt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mb,this.normalScale=new ct(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ai,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Cc=class extends Ae{static get type(){return"MeshPhysicalMaterial"}constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ct(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return yn(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(n){this.ior=(1+.4*n)/(1-.4*n)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new qt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new qt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new qt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};Wo=class{constructor(t,n,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new n.constructor(i),this.sampleValues=n,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let n=this.parameterPositions,i=this._cachedIndex,s=n[i],a=n[i-1];t:{e:{let r;n:{i:if(!(t<s)){for(let o=i+2;;){if(s===void 0){if(t<a)break i;return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(a=s,s=n[++i],t<s)break e}r=n.length;break n}if(!(t>=a)){let o=n[1];t<o&&(i=2,a=o);for(let l=i-2;;){if(a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=a,a=n[--i-1],t>=a)break e}r=i,i=0;break n}break t}for(;i<r;){let o=i+r>>>1;t<n[o]?r=o:i=o+1}if(s=n[i],a=n[i-1],a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,a,s)}return this.interpolate_(i,a,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let n=this.resultBuffer,i=this.sampleValues,s=this.valueSize,a=t*s;for(let r=0;r!==s;++r)n[r]=i[a+r];return n}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},m0=class extends Wo{constructor(t,n,i,s){super(t,n,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:KM,endingEnd:KM}}intervalChanged_(t,n,i){let s=this.parameterPositions,a=t-2,r=t+1,o=s[a],l=s[r];if(o===void 0)switch(this.getSettings_().endingStart){case jM:a=t,o=2*n-i;break;case $M:a=s.length-2,o=n+s[a]-s[a+1];break;default:a=t,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case jM:r=t,l=2*i-n;break;case $M:r=1,l=i+s[1]-s[0];break;default:r=t-1,l=n}let c=(i-n)*.5,h=this.valueSize;this._weightPrev=c/(n-o),this._weightNext=c/(l-i),this._offsetPrev=a*h,this._offsetNext=r*h}interpolate_(t,n,i,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,f=this._weightPrev,p=this._weightNext,g=(i-n)/(s-n),M=g*g,m=M*g,u=-f*m+2*f*M-f*g,y=(1+f)*m+(-1.5-2*f)*M+(-.5+f)*g+1,_=(-1-p)*m+(1.5+p)*M+.5*g,v=p*m-p*M;for(let R=0;R!==o;++R)a[R]=u*r[h+R]+y*r[c+R]+_*r[l+R]+v*r[d+R];return a}},g0=class extends Wo{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t,n,i,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=(i-n)/(s-n),d=1-h;for(let f=0;f!==o;++f)a[f]=r[c+f]*d+r[l+f]*h;return a}},v0=class extends Wo{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},zi=class{constructor(t,n,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(n===void 0||n.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Hh(n,this.TimeBufferType),this.values=Hh(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let n=t.constructor,i;if(n.toJSON!==this.toJSON)i=n.toJSON(t);else{i={name:t.name,times:Hh(t.times,Array),values:Hh(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s)}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new v0(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new g0(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new m0(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let n;switch(t){case qh:n=this.InterpolantFactoryMethodDiscrete;break;case Hg:n=this.InterpolantFactoryMethodLinear;break;case Sm:n=this.InterpolantFactoryMethodSmooth;break}if(n===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=n,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return qh;case this.InterpolantFactoryMethodLinear:return Hg;case this.InterpolantFactoryMethodSmooth:return Sm}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let n=this.times;for(let i=0,s=n.length;i!==s;++i)n[i]+=t}return this}scale(t){if(t!==1){let n=this.times;for(let i=0,s=n.length;i!==s;++i)n[i]*=t}return this}trim(t,n){let i=this.times,s=i.length,a=0,r=s-1;for(;a!==s&&i[a]<t;)++a;for(;r!==-1&&i[r]>n;)--r;if(++r,a!==0||r!==s){a>=r&&(r=Math.max(r,1),a=r-1);let o=this.getValueSize();this.times=i.slice(a,r),this.values=this.values.slice(a*o,r*o)}return this}validate(){let t=!0,n=this.getValueSize();n-Math.floor(n)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,a=i.length;a===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let r=null;for(let o=0;o!==a;o++){let l=i[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(r!==null&&r>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,r),t=!1;break}r=l}if(s!==void 0&&mD(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),n=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Sm,a=t.length-1,r=1;for(let o=1;o<a;++o){let l=!1,c=t[o],h=t[o+1];if(c!==h&&(o!==1||c!==t[0]))if(s)l=!0;else{let d=o*i,f=d-i,p=d+i;for(let g=0;g!==i;++g){let M=n[d+g];if(M!==n[f+g]||M!==n[p+g]){l=!0;break}}}if(l){if(o!==r){t[r]=t[o];let d=o*i,f=r*i;for(let p=0;p!==i;++p)n[f+p]=n[d+p]}++r}}if(a>0){t[r]=t[a];for(let o=a*i,l=r*i,c=0;c!==i;++c)n[l+c]=n[o+c];++r}return r!==t.length?(this.times=t.slice(0,r),this.values=n.slice(0,r*i)):(this.times=t,this.values=n),this}clone(){let t=this.times.slice(),n=this.values.slice(),i=this.constructor,s=new i(this.name,t,n);return s.createInterpolant=this.createInterpolant,s}};zi.prototype.TimeBufferType=Float32Array;zi.prototype.ValueBufferType=Float32Array;zi.prototype.DefaultInterpolation=Hg;hr=class extends zi{constructor(t,n,i){super(t,n,i)}};hr.prototype.ValueTypeName="bool";hr.prototype.ValueBufferType=Array;hr.prototype.DefaultInterpolation=qh;hr.prototype.InterpolantFactoryMethodLinear=void 0;hr.prototype.InterpolantFactoryMethodSmooth=void 0;_0=class extends zi{};_0.prototype.ValueTypeName="color";y0=class extends zi{};y0.prototype.ValueTypeName="number";x0=class extends Wo{constructor(t,n,i,s){super(t,n,i,s)}interpolate_(t,n,i,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=(i-n)/(s-n),c=t*o;for(let h=c+o;c!==h;c+=4)Ti.slerpFlat(a,0,r,c-o,r,c,l);return a}},vf=class extends zi{InterpolantFactoryMethodLinear(t){return new x0(this.times,this.values,this.getValueSize(),t)}};vf.prototype.ValueTypeName="quaternion";vf.prototype.InterpolantFactoryMethodSmooth=void 0;fr=class extends zi{constructor(t,n,i){super(t,n,i)}};fr.prototype.ValueTypeName="string";fr.prototype.ValueBufferType=Array;fr.prototype.DefaultInterpolation=qh;fr.prototype.InterpolantFactoryMethodLinear=void 0;fr.prototype.InterpolantFactoryMethodSmooth=void 0;M0=class extends zi{};M0.prototype.ValueTypeName="vector";S0=class{constructor(t,n,i){let s=this,a=!1,r=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=n,this.onError=i,this.itemStart=function(h){o++,a===!1&&s.onStart!==void 0&&s.onStart(h,r,o),a=!0},this.itemEnd=function(h){r++,s.onProgress!==void 0&&s.onProgress(h,r,o),r===o&&(a=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,f=c.length;d<f;d+=2){let p=c[d],g=c[d+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null}}},gD=new S0,b0=class{constructor(t){this.manager=t!==void 0?t:gD,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,n){let i=this;return new Promise(function(s,a){i.load(t,s,n,a)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};b0.DEFAULT_MATERIAL_NAME="__DEFAULT";_f=class extends An{constructor(t,n=1){super(),this.isLight=!0,this.type="Light",this.color=new qt(t),this.intensity=n}dispose(){}copy(t,n){return super.copy(t,n),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let n=super.toJSON(t);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}},yf=class extends _f{constructor(t,n,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(An.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qt(n)}copy(t,n){return super.copy(t,n),this.groundColor.copy(t.groundColor),this}},eg=new fe,tb=new N,eb=new N,E0=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ct(512,512),this.map=null,this.mapPass=null,this.matrix=new fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new _c,this._frameExtents=new ct(1,1),this._viewportCount=1,this._viewports=[new Xe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let n=this.camera,i=this.matrix;tb.setFromMatrixPosition(t.matrixWorld),n.position.copy(tb),eb.setFromMatrixPosition(t.target.matrixWorld),n.lookAt(eb),n.updateMatrixWorld(),eg.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(eg),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(eg)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},T0=class extends E0{constructor(){super(new Go(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},xf=class extends _f{constructor(t,n){super(t,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(An.DEFAULT_UP),this.updateMatrix(),this.target=new An,this.shadow=new T0}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},Mf=class{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=nb(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let n=nb();t=(n-this.oldTime)/1e3,this.oldTime=n,this.elapsedTime+=t}return t}};G0="\\[\\]\\.:\\/",vD=new RegExp("["+G0+"]","g"),k0="[^"+G0+"]",_D="[^"+G0.replace("\\.","")+"]",yD=/((?:WC+[\/:])*)/.source.replace("WC",k0),xD=/(WCOD+)?/.source.replace("WCOD",_D),MD=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",k0),SD=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",k0),bD=new RegExp("^"+yD+xD+MD+SD+"$"),ED=["material","materials","bones","map"],A0=class{constructor(t,n,i){let s=i||Fe.parseTrackName(n);this._targetGroup=t,this._bindings=t.subscribe_(n,s)}getValue(t,n){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,n)}setValue(t,n){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,a=i.length;s!==a;++s)i[s].setValue(t,n)}bind(){let t=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=t.length;n!==i;++n)t[n].bind()}unbind(){let t=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=t.length;n!==i;++n)t[n].unbind()}},Fe=class e{constructor(t,n,i){this.path=n,this.parsedPath=i||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,i){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,i):new e(t,n,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(vD,"")}static parseTrackName(t){let n=bD.exec(t);if(n===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:n[2],objectName:n[3],objectIndex:n[4],propertyName:n[5],propertyIndex:n[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let a=i.nodeName.substring(s+1);ED.indexOf(a)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=a)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,n){if(n===void 0||n===""||n==="."||n===-1||n===t.name||n===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(n);if(i!==void 0)return i}if(t.children){let i=function(a){for(let r=0;r<a.length;r++){let o=a[r];if(o.name===n||o.uuid===n)return o;let l=i(o.children);if(l)return l}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,n){t[n]=this.targetObject[this.propertyName]}_getValue_array(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)t[n++]=i[s]}_getValue_arrayElement(t,n){t[n]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,n){this.resolvedProperty.toArray(t,n)}_setValue_direct(t,n){this.targetObject[this.propertyName]=t[n]}_setValue_direct_setNeedsUpdate(t,n){this.targetObject[this.propertyName]=t[n],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,n){this.targetObject[this.propertyName]=t[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)i[s]=t[n++]}_setValue_array_setNeedsUpdate(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)i[s]=t[n++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,n){let i=this.resolvedProperty;for(let s=0,a=i.length;s!==a;++s)i[s]=t[n++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,n){this.resolvedProperty[this.propertyIndex]=t[n]}_setValue_arrayElement_setNeedsUpdate(t,n){this.resolvedProperty[this.propertyIndex]=t[n],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,n){this.resolvedProperty[this.propertyIndex]=t[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,n){this.resolvedProperty.fromArray(t,n)}_setValue_fromArray_setNeedsUpdate(t,n){this.resolvedProperty.fromArray(t,n),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,n){this.resolvedProperty.fromArray(t,n),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,n){this.bind(),this.getValue(t,n)}_setValue_unbound(t,n){this.bind(),this.setValue(t,n)}bind(){let t=this.node,n=this.parsedPath,i=n.objectName,s=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=n.objectIndex;switch(i){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let r=t[s];if(r===void 0){let c=n.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(a!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}l=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=a}else r.fromArray!==void 0&&r.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=r):Array.isArray(r)?(l=this.BindingType.EntireArray,this.resolvedProperty=r):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Fe.Composite=A0;Fe.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Fe.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Fe.prototype.GetterByBindingType=[Fe.prototype._getValue_direct,Fe.prototype._getValue_array,Fe.prototype._getValue_arrayElement,Fe.prototype._getValue_toArray];Fe.prototype.SetterByBindingTypeAndVersioning=[[Fe.prototype._setValue_direct,Fe.prototype._setValue_direct_setNeedsUpdate,Fe.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Fe.prototype._setValue_array,Fe.prototype._setValue_array_setNeedsUpdate,Fe.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Fe.prototype._setValue_arrayElement,Fe.prototype._setValue_arrayElement_setNeedsUpdate,Fe.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Fe.prototype._setValue_fromArray,Fe.prototype._setValue_fromArray_setNeedsUpdate,Fe.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];YD=new Float32Array(1);typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="170")});var Af,X0=He(()=>{Af={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`}});var ui,TD,W0,AD,Ra,Zo=He(()=>{Yn();ui=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},TD=new Go(-1,1,1,-1,0,1),W0=class extends rn{constructor(){super(),this.setAttribute("position",new me([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new me([0,2,0,0,2,0],2))}},AD=new W0,Ra=class{constructor(t){this._mesh=new Zt(AD,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,TD)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}});var wf,Cb=He(()=>{Yn();Zo();wf=class extends ui{constructor(t,n){super(),this.textureID=n!==void 0?n:"tDiffuse",t instanceof Ye?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=wa.clone(t.uniforms),this.material=new Ye({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new Ra(this.material)}render(t,n,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(n),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}});var Nc,Rf,q0=He(()=>{Zo();Nc=class extends ui{constructor(t,n){super(),this.scene=t,this.camera=n,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,n,i){let s=t.getContext(),a=t.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0);let r,o;this.inverse?(r=0,o=1):(r=1,o=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),a.buffers.stencil.setFunc(s.ALWAYS,r,4294967295),a.buffers.stencil.setClear(o),a.buffers.stencil.setLocked(!0),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.color.setMask(!0),a.buffers.depth.setMask(!0),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(s.EQUAL,1,4294967295),a.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),a.buffers.stencil.setLocked(!0)}},Rf=class extends ui{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}});var Cf,Db=He(()=>{Yn();X0();Cb();q0();q0();Cf=class{constructor(t,n){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),n===void 0){let i=t.getSize(new ct);this._width=i.width,this._height=i.height,n=new xn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ci}),n.texture.name="EffectComposer.rt1"}else this._width=n.width,this._height=n.height;this.renderTarget1=n,this.renderTarget2=n.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new wf(Af),this.copyPass.material.blending=$i,this.clock=new Mf}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,n){this.passes.splice(n,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let n=this.passes.indexOf(t);n!==-1&&this.passes.splice(n,1)}isLastEnabledPass(t){for(let n=t+1;n<this.passes.length;n++)if(this.passes[n].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());let n=this.renderer.getRenderTarget(),i=!1;for(let s=0,a=this.passes.length;s<a;s++){let r=this.passes[s];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),r.render(this.renderer,this.writeBuffer,this.readBuffer,t,i),r.needsSwap){if(i){let o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Nc!==void 0&&(r instanceof Nc?i=!0:r instanceof Rf&&(i=!1))}}this.renderer.setRenderTarget(n)}reset(t){if(t===void 0){let n=this.renderer.getSize(new ct);this._pixelRatio=this.renderer.getPixelRatio(),this._width=n.width,this._height=n.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,n){this._width=t,this._height=n;let i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let a=0;a<this.passes.length;a++)this.passes[a].setSize(i,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}});var Df,Ub=He(()=>{Yn();Zo();Df=class extends ui{constructor(t,n,i=null,s=null,a=null){super(),this.scene=t,this.camera=n,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=a,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new qt}render(t,n,i){let s=t.autoClear;t.autoClear=!1;let a,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(a=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(a),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),t.autoClear=s}}});var Nb,Lb=He(()=>{Yn();Nb={name:"LuminosityHighPassShader",shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new qt(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`}});var Jo,Ib=He(()=>{Yn();Zo();X0();Lb();Jo=class e extends ui{constructor(t,n,i,s){super(),this.strength=n!==void 0?n:1,this.radius=i,this.threshold=s,this.resolution=t!==void 0?new ct(t.x,t.y):new ct(256,256),this.clearColor=new qt(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new xn(a,r,{type:ci}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){let f=new xn(a,r,{type:ci});f.texture.name="UnrealBloomPass.h"+d,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);let p=new xn(a,r,{type:ci});p.texture.name="UnrealBloomPass.v"+d,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),a=Math.round(a/2),r=Math.round(r/2)}let o=Nb;this.highPassUniforms=wa.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ye({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let l=[3,5,7,9,11];a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new ct(1/a,1/r),a=Math.round(a/2),r=Math.round(r/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=n,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new N(1,1,1),new N(1,1,1),new N(1,1,1),new N(1,1,1),new N(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;let h=Af;this.copyUniforms=wa.clone(h.uniforms),this.blendMaterial=new Ye({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:Ea,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new qt,this.oldClearAlpha=1,this.basic=new Wn,this.fsQuad=new Ra(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,n){let i=Math.round(t/2),s=Math.round(n/2);this.renderTargetBright.setSize(i,s);for(let a=0;a<this.nMips;a++)this.renderTargetsHorizontal[a].setSize(i,s),this.renderTargetsVertical[a].setSize(i,s),this.separableBlurMaterials[a].uniforms.invSize.value=new ct(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(t,n,i,s,a){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();let r=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this.fsQuad.render(t),o=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(i),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=r}getSeperableBlurMaterial(t){let n=[];for(let i=0;i<t;i++)n.push(.39894*Math.exp(-.5*i*i/(t*t))/t);return new Ye({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new ct(.5,.5)},direction:{value:new ct(.5,.5)},gaussianCoefficients:{value:n}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(t){return new Ye({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}};Jo.BlurDirectionX=new ct(1,0);Jo.BlurDirectionY=new ct(0,1)});var Ob,Pb=He(()=>{Ob={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`}});var Uf,zb=He(()=>{Yn();Zo();Pb();Uf=class extends ui{constructor(){super();let t=Ob;this.uniforms=wa.clone(t.uniforms),this.material=new gf({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new Ra(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,n,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},ce.getTransfer(this._outputColorSpace)===ye&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===R0?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===C0?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===D0?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Dc?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===U0?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===N0&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(n),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}});function Bb(e){if(!Number.isFinite(e)||e<0)return"-:--.--";let t=Math.floor(e/60),n=Math.floor(e%60),i=Math.floor(e*100%100);return`${t}:${String(n).padStart(2,"0")}.${String(i).padStart(2,"0")}`}var en,wD,Ze,Nf,Ca,dr=He(()=>{"use strict";en=(e,t,n)=>Math.min(n,Math.max(t,e)),wD=(e,t,n)=>e+(t-e)*n,Ze=(e,t,n,i)=>wD(e,t,1-Math.exp(-n*i)),Nf=(e,t,n)=>e<t?Math.min(e+n,t):Math.max(e-n,t),Ca=(e=1,t)=>t===void 0?Math.random()*e:e+Math.random()*(t-e)});var Lf,Fb=He(()=>{"use strict";dr();Lf=class{context;started=!1;master;engineGain;engineFilter;saw;square;wind;skid;nitro;init(){if(this.started)return;let t=window.AudioContext||window.webkitAudioContext;if(!t)return;this.started=!0;let n=this.context=new t,i=this.master=n.createGain();i.gain.value=.85;let s=n.createDynamicsCompressor();i.connect(s),s.connect(n.destination),this.engineGain=n.createGain(),this.engineGain.gain.value=0,this.engineFilter=n.createBiquadFilter(),this.engineFilter.type="lowpass",this.engineFilter.frequency.value=400,this.saw=n.createOscillator(),this.saw.type="sawtooth",this.saw.frequency.value=60,this.square=n.createOscillator(),this.square.type="square",this.square.frequency.value=30;let a=n.createGain();a.gain.value=.55,this.saw.connect(this.engineFilter),this.square.connect(a),a.connect(this.engineFilter),this.engineFilter.connect(this.engineGain),this.engineGain.connect(i),this.saw.start(),this.square.start();let r=n.createBuffer(1,n.sampleRate,n.sampleRate),o=r.getChannelData(0);for(let c=0;c<o.length;c+=1)o[c]=Math.random()*2-1;let l=(c,h,d=1)=>{let f=n.createBufferSource();f.buffer=r,f.loop=!0;let p=n.createBiquadFilter();p.type=c,p.frequency.value=h,p.Q.value=d;let g=n.createGain();return g.gain.value=0,f.connect(p),p.connect(g),g.connect(i),f.start(),{filter:p,gain:g}};this.wind=l("lowpass",500),this.skid=l("highpass",1100),this.nitro=l("bandpass",900,1.6)}set(t,n,i,s,a){if(!this.started||!this.context||!this.saw||!this.square||!this.engineFilter||!this.engineGain||!this.wind||!this.skid||!this.nitro)return;let r=this.context.currentTime,o=.045,l=42+t*185;this.saw.frequency.setTargetAtTime(l*2,r,o),this.square.frequency.setTargetAtTime(l,r,o),this.engineFilter.frequency.setTargetAtTime(260+t*1500,r,o),this.engineGain.gain.setTargetAtTime(.05+n*.115+t*.05,r,o),this.wind.gain.gain.setTargetAtTime(i*i*.3,r,.1),this.wind.filter.frequency.setTargetAtTime(380+i*900,r,.1),this.skid.gain.gain.setTargetAtTime(en(s,0,1)*.22,r,.05),this.nitro.gain.gain.setTargetAtTime(a?.3:0,r,a?.03:.12),this.nitro.filter.frequency.setTargetAtTime(a?2200:800,r,.18)}beep(t,n=.14,i=.22,s="square"){if(!this.started||!this.context||!this.master)return;let a=this.context.currentTime,r=this.context.createOscillator(),o=this.context.createGain();r.type=s,r.frequency.value=t,o.gain.setValueAtTime(i,a),o.gain.exponentialRampToValueAtTime(.001,a+n),r.connect(o),o.connect(this.master),r.start(a),r.stop(a+n+.02)}thud(){if(!this.started||!this.context||!this.master)return;let t=this.context.currentTime,n=this.context.createOscillator(),i=this.context.createGain();n.type="triangle",n.frequency.setValueAtTime(95,t),n.frequency.exponentialRampToValueAtTime(38,t+.16),i.gain.setValueAtTime(.5,t),i.gain.exponentialRampToValueAtTime(.001,t+.22),n.connect(i),i.connect(this.master),n.start(t),n.stop(t+.25)}idle(){this.started&&this.set(.08,0,0,0,!1)}suspend(){this.context?.suspend()}resume(){this.context?.resume()}}});function Hb({tuning:e,track:t,player:n,getRaceState:i,getNitro:s,onLapCross:a}){function r(o,l){let c=o.laneBase+Math.sin(o.s*.012+o.lanePhase)*1.7+o.nudge;o.nudge=Ze(o.nudge,0,1.6,l);let h=t.sampleAt(o.s),d=h.p.x+h.r.x*c,f=h.p.z+h.r.z*c,p=d-o.pos.x,g=f-o.pos.z;if(p*p+g*g>1e-6&&o.v>.5){let m=Math.atan2(p,g)-o.h;for(;m>Math.PI;)m-=Math.PI*2;for(;m<-Math.PI;)m+=Math.PI*2;o.h+=en(m,-2.6*l,2.6*l)}o.pos.set(d,0,f)}return{drivePlayer(o){let l=t.sampleAt(o.s+14+Math.abs(o.vf)*.45),h=Math.atan2(l.p.x-o.pos.x,l.p.z-o.pos.z)-o.h;for(;h>Math.PI;)h-=Math.PI*2;for(;h<-Math.PI;)h+=Math.PI*2;o._st=en(h*2.4,-1,1);let d=((Math.round(o.s/t.spacing)+26)%t.sampleCount+t.sampleCount)%t.sampleCount,f=t.speedProfile[d];o._th=o.vf<f?1:0,o._br=o.vf>f+3?1:0,o._nitro=f>45&&s()>35},step(o,l){if(i()!=="racing"){r(o,l);return}let c=(Math.round(o.s/t.spacing)%t.sampleCount+t.sampleCount)%t.sampleCount,h=e.aiSkill[o.idx-1],d=en(1+(n.progress-o.progress)*5e-4,.9,1.12),f=o.finished?18:t.speedProfile[(c+22)%t.sampleCount]*h*d;o.v=Nf(o.v,f,(f>o.v?12.5:15)*l);let p=o.s;o.s=(o.s+o.v*l)%t.length,p>o.s&&a(o),o.progress=o.wraps*t.length+o.s,r(o,l)}}}var Vb=He(()=>{"use strict";dr()});function Gb({camera:e,player:t,track:n,tuning:i,getRaceState:s,getCountdown:a,getNitroActive:r,getShake:o,setShake:l}){let c=new N(0,3,-10),h=new N,d=new N,f=new N,p=i.fovBase,g=0,M=0,m=!1;return{setFree(u){m=u},update(u){if(m)return;let y=new N(Math.sin(t.h),0,Math.cos(t.h)),_=s();if(_==="title"){M+=u*.2;let z=8.4,Y=t.pos.x+Math.sin(M)*z,G=t.pos.z+Math.cos(M)*z;c.set(Ze(c.x,Y,3,u),Ze(c.y,t.pos.y+2.3,3,u),Ze(c.z,G,3,u)),e.position.copy(c),e.lookAt(t.pos.x,t.pos.y+.55,t.pos.z),e.fov=Ze(e.fov,50,3,u),e.updateProjectionMatrix();return}if(_==="countdown"){let z=en(1-a()/3.9,0,1),Y=z*z*(3-2*z),G=n.sampleAt(t.s);d.copy(t.pos).addScaledVector(new N(G.r.x,0,G.r.z),7.5).addScaledVector(y,6).setY(1.3),f.copy(t.pos).addScaledVector(y,-i.camDist).setY(i.camH),c.lerpVectors(d,f,Y),e.position.copy(c),h.copy(t.pos).setY(t.pos.y+.7),e.lookAt(h),e.fov=Ze(e.fov,i.fovBase,5,u),e.updateProjectionMatrix();return}let v=Math.abs(t.vf),R=t.vel.lengthSq()>1?t.vel.clone().normalize():y,w=y.clone().lerp(R,t.drifting?.42:.12).normalize(),A=i.camDist+v*.03,C=i.camH+v*.007,b=t.pos.clone().addScaledVector(w,-A).addScaledVector(t.vel,1/i.camLam).setY(C);c.set(Ze(c.x,b.x,i.camLam,u),Ze(c.y,b.y,i.camLam,u),Ze(c.z,b.z,i.camLam,u));let S=t.pos.clone().addScaledVector(w,i.camLook).addScaledVector(t.vel,.45/i.camLookLam).setY(t.pos.y+.78);h.set(Ze(h.x,S.x,i.camLookLam,u),Ze(h.y,S.y,i.camLookLam,u),Ze(h.z,S.z,i.camLookLam,u));let U=Math.max(0,o()-u*2.2);l(U);let F=U*.22+(r()?.045:0)+(t.onGrass&&v>8?.05:0);e.position.copy(c),F>.001&&e.position.add(new N(Ca(-F,F),Ca(-F,F)*.6,Ca(-F,F))),e.lookAt(h);let P=i.fovBase+en(v/i.vMax,0,1)*i.fovSpeed+(r()?i.fovNitro:0);p=Ze(p,P,5,u),e.fov=p,g=Ze(g,-t.steer*.035-t.vlat*.004,6,u),e.rotateZ(g),e.updateProjectionMatrix()}}}var kb=He(()=>{"use strict";Yn();dr()});function Y0(e,t=Math.PI/3){let n=Math.cos(t),i=(1+1e-10)*100,s=[new N,new N,new N],a=new N,r=new N,o=new N,l=new N;function c(M){let m=~~(M.x*i),u=~~(M.y*i),y=~~(M.z*i);return`${m},${u},${y}`}let h=e.index?e.toNonIndexed():e,d=h.attributes.position,f={};for(let M=0,m=d.count/3;M<m;M++){let u=3*M,y=s[0].fromBufferAttribute(d,u+0),_=s[1].fromBufferAttribute(d,u+1),v=s[2].fromBufferAttribute(d,u+2);a.subVectors(v,_),r.subVectors(y,_);let R=new N().crossVectors(a,r).normalize();for(let w=0;w<3;w++){let A=s[w],C=c(A);C in f||(f[C]=[]),f[C].push(R)}}let p=new Float32Array(d.count*3),g=new Tn(p,3,!1);for(let M=0,m=d.count/3;M<m;M++){let u=3*M,y=s[0].fromBufferAttribute(d,u+0),_=s[1].fromBufferAttribute(d,u+1),v=s[2].fromBufferAttribute(d,u+2);a.subVectors(v,_),r.subVectors(y,_),o.crossVectors(a,r).normalize();for(let R=0;R<3;R++){let w=s[R],A=c(w),C=f[A];l.set(0,0,0);for(let b=0,S=C.length;b<S;b++){let U=C[b];o.dot(U)>n&&l.add(U)}l.normalize(),g.setXYZ(u+R,l.x,l.y,l.z)}}return h.setAttribute("normal",g),h}var Xb=He(()=>{Yn()});function Wb(e,t={}){let n=new In,i=new In;n.add(i);let s=new Cc({color:e,metalness:.42,roughness:.38,clearcoat:1,clearcoatRoughness:.07,envMapIntensity:1.35}),a=new Cc({color:329484,metalness:0,roughness:.05,clearcoat:1,clearcoatRoughness:.05,envMapIntensity:1.5}),r=new Ae({color:1184535,metalness:.55,roughness:.55}),o=new Ae({color:t.rim??13225172,metalness:.95,roughness:.28}),l=1.45,c=-1.45,h=.44,d=.34,f=.14,p=Math.sqrt(h*h-(d-f)**2),g=Math.PI+Math.asin((d-f)/h),M=-Math.asin((d-f)/h),m=new Xo;m.moveTo(2.42,f),m.quadraticCurveTo(2.5,.18,2.5,.3),m.quadraticCurveTo(2.49,.46,2.34,.56),m.quadraticCurveTo(2.05,.7,1.75,.795),m.quadraticCurveTo(1.3,.845,.95,.86),m.lineTo(-1.05,.875),m.quadraticCurveTo(-1.7,.89,-2.05,.955),m.quadraticCurveTo(-2.42,.83,-2.38,.62),m.lineTo(-2.3,f),m.lineTo(c-p,f),m.absarc(c,d,h,g,M,!0),m.lineTo(l-p,f),m.absarc(l,d,h,g,M,!0),m.lineTo(2.42,f);let u=new Rc(m,{depth:1.74,bevelEnabled:!0,bevelThickness:.11,bevelSize:.09,bevelSegments:5,curveSegments:26});u.rotateY(-Math.PI/2),u.translate(.87,0,0),u=Y0(u,.85);let y=new Zt(u,s);y.castShadow=!0,i.add(y);let _=new Xo;_.moveTo(1.02,.8),_.quadraticCurveTo(.62,1.06,.18,1.16),_.quadraticCurveTo(-.1,1.215,-.45,1.215),_.quadraticCurveTo(-.95,1.17,-1.38,.985),_.quadraticCurveTo(-1.58,.9,-1.66,.82),_.lineTo(-1.6,.8),_.lineTo(1.02,.8);let v=new Rc(_,{depth:1.1,bevelEnabled:!0,bevelThickness:.07,bevelSize:.06,bevelSegments:4,curveSegments:20});v.rotateY(-Math.PI/2),v.translate(.55,0,0),v=Y0(v,.9);let R=new Zt(v,a);R.castShadow=!0,i.add(R);for(let Nt of[l,c]){let W=new Zt(new On(1.66,.55,1.02),new Ae({color:657932,roughness:1}));W.position.set(0,.42,Nt),i.add(W)}let w=new Zt(new On(1.62,.06,4.2),r);w.position.set(0,.15,0),i.add(w);let A=(Nt,W,it,mt,tt,Et,gt,wt=0)=>{let Ht=new Zt(new On(Nt,W,it),gt);return Ht.position.set(mt,tt,Et),wt&&(Ht.rotation.x=wt),i.add(Ht),Ht};A(1.9,.05,.36,0,.125,2.42,r),A(1,.17,.08,0,.3,2.45,r),A(.46,.1,.06,0,.485,2.435,r),A(1.52,.12,.26,0,.19,-2.28,r);for(let Nt of[-.45,-.15,.15,.45])A(.025,.15,.26,Nt,.115,-2.28,r);for(let Nt of[-.94,.94])A(.07,.1,1.9,Nt,.15,0,r);for(let Nt of[-.55,.55])A(.06,.22,.16,Nt,1.1,-2.12,r);let C=A(1.6,.04,.38,0,1.2,-2.16,s,-.1);C.castShadow=!0;for(let Nt of[-.81,.81])A(.025,.13,.36,Nt,1.235,-2.16,r);for(let Nt of[-1,1])A(.035,.15,.05,Nt*1,.9,.66,r),A(.21,.1,.08,Nt*1.07,.97,.64,s);let b=new Ae({color:10466500,emissive:13625599,emissiveIntensity:2.2});for(let Nt of[-.62,.62])A(.44,.05,.15,Nt,.525,2.45,b,-.25);let S=new Ae({color:5571848,emissive:16718382,emissiveIntensity:1.5});A(1.72,.15,.05,0,.74,-2.475,r);let U=A(1.64,.08,.05,0,.74,-2.5,S),F=new Ae({color:3816770,metalness:.95,roughness:.35}),P=[];for(let Nt of[-.3,.3]){let W=new Zt(new qn(.055,.055,.24,12),F);W.rotation.x=Math.PI/2,W.position.set(Nt,.3,-2.46),i.add(W);let it=new Wn({transparent:!0,opacity:.95,blending:Ea,depthWrite:!1});it.color.setRGB(1.2,2.4,3.6);let mt=new Zt(new cr(.075,.72,8),it);mt.rotation.x=-Math.PI/2,mt.position.set(Nt,.3,-2.86),mt.visible=!1,i.add(mt),P.push(mt)}let z=[],Y=[],G=new qn(.34,.34,.3,28);G.rotateZ(Math.PI/2);let j=new Ae({color:1974050,roughness:.85}),H=new qn(.205,.205,.245,20);H.rotateZ(Math.PI/2);let ut=new qn(.15,.15,.03,18);ut.rotateZ(Math.PI/2);let vt=new Ae({color:12106946,metalness:.85,roughness:.35}),yt=new Ae({color:12653087,roughness:.5});function Ft(Nt,W,it){let mt=new In;mt.position.set(Nt,.34,W);let tt=new In,Et=new Zt(G,j);Et.castShadow=!0;let gt=new Zt(H,new Ae({color:1052948,metalness:.7,roughness:.45}));tt.add(Et,gt);let wt=Math.sign(Nt)*.128,Ht=new Zt(new mf(.195,.024,10,28),o);Ht.rotation.y=Math.PI/2,Ht.position.x=wt,tt.add(Ht);for(let ft=0;ft<7;ft++){let at=new In,rt=new Zt(new On(.045,.175,.06),o);rt.position.set(wt,.105,0),at.add(rt),at.rotation.x=ft/7*Math.PI*2,tt.add(at)}let Q=new Zt(new qn(.066,.066,.27,12).rotateZ(Math.PI/2),o);tt.add(Q);let ot=new Zt(ut,vt);ot.position.x=-Math.sign(Nt)*.04;let D=new Zt(new On(.05,.16,.1),yt);D.position.set(-Math.sign(Nt)*.04,.13,Math.sign(W)*.05||.05),mt.add(tt,ot,D),n.add(mt),z.push(tt),it&&Y.push(mt)}return Ft(-.845,l,!0),Ft(.845,l,!0),Ft(-.845,c,!1),Ft(.845,c,!1),{grp:n,body:i,wheels:z,pivots:Y,paintMat:s,tailMat:S,flames:P,exhaust:[new N(-.3,.3,-2.56),new N(.3,.3,-2.56)],rearWheels:[new N(-.845,.02,c),new N(.845,.02,c)]}}var qb=He(()=>{"use strict";Yn();Xb()});function Yb(e,t){let n=document.createElement("canvas");n.width=n.height=64;let i=n.getContext("2d"),s=i.createRadialGradient(32,32,2,32,32,30);return s.addColorStop(0,e),s.addColorStop(1,t),i.fillStyle=s,i.fillRect(0,0,64,64),new es(n)}function Zb(e,t,n,i,s){let a=[];for(let o=0;o<t;o+=1){let l=new of(new Mc({map:n,blending:i,color:s,transparent:!0,opacity:0,depthWrite:!1}));l.visible=!1,e.add(l),a.push({sp:l,life:0,max:1,vel:new N,grow:1,op0:.5})}let r=0;return{items:a,spawn(o,l,c,h,d,f){let p=a[r];r=(r+1)%t,p.sp.visible=!0,p.life=p.max=c,p.sp.position.copy(o),p.vel.copy(l),p.sp.scale.setScalar(h),p.grow=d,p.op0=f,p.sp.material.opacity=f},update(o){for(let l of a){if(!l.sp.visible)continue;if(l.life-=o,l.life<=0){l.sp.visible=!1;continue}let c=l.life/l.max;l.sp.position.addScaledVector(l.vel,o),l.sp.scale.multiplyScalar(1+l.grow*o),l.sp.material.opacity=l.op0*c}}}}function Jb(e){let t=Zb(e,56,Yb("rgba(230,230,235,0.85)","rgba(230,230,235,0)"),Ma,13619414),n=Zb(e,28,Yb("rgba(255,255,255,1)","rgba(80,180,255,0)"),Ea,8376575),i=new Pi(.3,.78);i.rotateX(-Math.PI/2);let s=new Wn({color:723725,transparent:!0,opacity:.42,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2}),a=new ts(i,s,Lc),r=new fe().makeScale(0,0,0);for(let d=0;d<Lc;d+=1)a.setMatrixAt(d,r);a.instanceMatrix.needsUpdate=!0,e.add(a);let o=0,l=new fe,c=new Ti,h=new Ai;return{smoke:t,flame:n,skids:a,skidCount:Lc,zeroMatrix:r,laySkid(d,f,p){h.set(0,p,0),c.setFromEuler(h),l.compose(new N(d,.025,f),c,new N(1,1,1)),a.setMatrixAt(o,l),o=(o+1)%Lc,a.instanceMatrix.needsUpdate=!0},resetSkids(){for(let d=0;d<Lc;d+=1)a.setMatrixAt(d,r);a.instanceMatrix.needsUpdate=!0,o=0}}}var Lc,Qb=He(()=>{"use strict";Yn();Lc=320});function Kb(e,t,n,i,s){let a=new Set,r=new Set,o=l=>a.has(l)||r.has(l);return e.addEventListener("keydown",l=>{RD.includes(l.code)&&l.preventDefault(),a.add(l.code);let c=n();(l.code==="Escape"||l.code==="KeyP")&&(c==="racing"?i(!0):c==="paused"&&i(!1)),l.code==="KeyR"&&["racing","paused","finished"].includes(c)&&s(),l.code==="Enter"&&c==="title"&&s()},{signal:t}),e.addEventListener("keyup",l=>a.delete(l.code),{signal:t}),e.addEventListener("blur",()=>a.clear(),{signal:t}),{isDown:o,read(){return{throttle:o("KeyW")||o("ArrowUp")?1:0,brake:o("KeyS")||o("ArrowDown")?1:0,steer:(o("KeyA")||o("ArrowLeft")?1:0)-(o("KeyD")||o("ArrowRight")?1:0),handbrake:o("Space"),nitro:o("ShiftLeft")||o("ShiftRight")}},press(l){r.add(l)},release(l){l?r.delete(l):r.clear()},clear(){a.clear(),r.clear()}}}var RD,jb=He(()=>{"use strict";RD=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space","ShiftLeft","ShiftRight"]});function $b({player:e,track:t,tuning:n,input:i,audio:s,dynamics:a,getRaceState:r,addRaceTime:o,onLapCross:l,drivePlayer:c}){return{step(h){let d=i.read(),f=d.throttle,p=d.brake,g=d.steer,M=d.handbrake,m=r();a.demoMode&&(c(e),f=e._th,p=e._br,g=e._st,M=!1),(m!=="racing"||e.finished)&&(f=0,p=m==="countdown"?0:.6,g=0,M=!1);let u=Math.sign(g-e.steer)===Math.sign(e.steer)||g===0?n.steerFall:n.steerRise;e.steer=Nf(e.steer,g,u*h),e.steerVis=Ze(e.steerVis,e.steer,12,h);let y={x:Math.sin(e.h),z:Math.cos(e.h)},_={x:y.z,z:-y.x},v=e.vel.x*y.x+e.vel.z*y.z,R=e.vel.x*_.x+e.vel.z*_.z;a.nitroActive=d.nitro&&a.nitroBar>0&&f>0&&v>1&&m==="racing"&&!e.finished&&!a.demoMode?!0:a.demoMode&&e._nitro&&a.nitroBar>0,a.nitroActive?a.nitroBar=Math.max(0,a.nitroBar-n.nitroUse*h):a.nitroBar=Math.min(100,a.nitroBar+(e.drifting?n.nitroDriftRegen:n.nitroRegen)*h);let w=e.onGrass?n.grassDragMult:1,A=n.roll+(e.onGrass?n.grassRoll:0),C=0;f&&(C+=n.engine*(a.nitroActive?n.nitroMult:1)*(v<3?1.25:1)),p&&(v>.5?C-=n.brake:v>n.revMax&&(C-=n.revForce)),M&&(C-=5.5*Math.sign(v)),C-=n.drag*w*v*Math.abs(v)+A*en(v/2,-1,1),e.acc=C,v+=C*h,e.drifting=M&&Math.abs(v)>6||Math.abs(R)>n.driftLatTh;let b=M?n.gripHand:e.drifting?n.gripDrift:n.gripNormal;R*=Math.exp(-b*h);let S=en(Math.abs(v)/9,0,1)/(1+Math.abs(v)*n.steerHiDamp),U=e.steer*n.steerMax*S*(e.drifting?n.driftYawBoost:1)*(v<-.5?-1:1);e.h+=U*h;let F={x:Math.sin(e.h),z:Math.cos(e.h)},P={x:F.z,z:-F.x};e.vel.set(F.x*v+P.x*R,0,F.z*v+P.z*R),e.pos.addScaledVector(e.vel,h),e.vf=v,e.vlat=R,e.lastIdx=t.nearestIndex(e.pos,e.lastIdx);let z=t.samples[e.lastIdx],Y=e.pos.x-z.p.x,G=e.pos.z-z.p.z,j=Y*z.r.x+G*z.r.z;if(e.onGrass=Math.abs(j)>n.roadHalf-.6,Math.abs(j)>n.railClamp){let vt=Math.abs(j)-n.railClamp;e.pos.x-=z.r.x*vt*Math.sign(j),e.pos.z-=z.r.z*vt*Math.sign(j);let yt=e.vel.x*z.r.x+e.vel.z*z.r.z;Math.sign(yt)===Math.sign(j)&&(e.vel.x-=z.r.x*yt*1.3,e.vel.z-=z.r.z*yt*1.3,e.vel.multiplyScalar(.92),e.vf*=.92,a.railHitCool<=0&&Math.abs(yt)>3&&(s.thud(),a.shake=Math.min(1,Math.abs(yt)*.09),a.railHitCool=.5))}a.railHitCool-=h;let H=e.s;e.s=e.lastIdx*t.spacing;let ut=e.s-H;ut<-t.length/2?(ut+=t.length,l(e)):ut>t.length/2&&(ut-=t.length,e.wraps=Math.max(0,e.wraps-1),e.lap=Math.max(1,e.lap-1)),e.progress=e.wraps*t.length+e.s,a.wrongWayTime=m==="racing"&&!e.finished&&Math.abs(v)>4&&ut<-.005?a.wrongWayTime+h:0,m==="racing"&&!e.finished&&o(h)}}}function t1(e,t,n){let i=e[0];for(let s=1;s<e.length;s+=1){let a=e[s],r=a.pos.x-i.pos.x,o=a.pos.z-i.pos.z,l=r*r+o*o;if(l>=4.6||l<=1e-4)continue;let c=Math.sqrt(l),h=r/c,d=o/c,f=(2.15-c)*.5;i.pos.x-=h*f,i.pos.z-=d*f;let p=Math.round(a.s/t.spacing),g=t.samples[t.nearestIndex(a.pos,p)];a.nudge+=(h*g.r.x+d*g.r.z)*f*2,i.vel.multiplyScalar(.985),n()}}var e1=He(()=>{"use strict";dr()});function n1(e,t,n){let i=n,s=Ca,a=[[-10,-80],[-10,60],[30,150],[120,205],[225,195],[290,120],[285,20],[215,-25],[150,-5],[95,-60],[105,-150],[170,-195],[120,-270],[10,-285],[-70,-240],[-10,-200]],r=new Ec(a.map(m=>new N(m[0],0,m[1])),!0,"centripetal"),o=1e3,l=[];for(let m=0;m<o;m++){let u=m/o,y=r.getPointAt(u),_=r.getTangentAt(u).normalize();l.push({p:y,f:_,r:new N(_.z,0,-_.x),kappa:0})}let c=r.getLength(),h=c/o,d=new Float32Array(o);{for(let m=0;m<o;m++){let u=l[m].f,y=l[(m+1)%o].f;l[m].kappa=Math.acos(en(u.dot(y),-1,1))/h}for(let m=0;m<o;m++){let u=0;for(let y=-3;y<=3;y++)u+=l[(m+y+o)%o].kappa;d[m]=Math.min(i.aiVMax,Math.sqrt(i.aiLatAcc/Math.max(u/7,1e-4)))}for(let m=0;m<3;m++)for(let u=o-1;u>=0;u--){let y=d[(u+1)%o];d[u]=Math.min(d[u],Math.sqrt(y*y+2*i.aiBrake*h))}}function f(m){let u=(m/h%o+o)%o,y=Math.floor(u)%o,_=u-y,v=l[y],R=l[(y+1)%o];return{p:new N().lerpVectors(v.p,R.p,_),f:new N().lerpVectors(v.f,R.f,_).normalize(),r:new N().lerpVectors(v.r,R.r,_).normalize()}}function p(m,u){let y=u,_=1/0;for(let v=-36;v<=60;v++){let R=((u+v)%o+o)%o,w=m.distanceToSquared(l[R].p);w<_&&(_=w,y=R)}return y}function g(){let m=document.createElement("canvas");m.width=512,m.height=1024;let u=m.getContext("2d");u.fillStyle="#33343a",u.fillRect(0,0,512,1024);let y=u.getImageData(0,0,512,1024),_=y.data;for(let R=0;R<_.length;R+=4){let w=(Math.random()-.5)*22;_[R]+=w,_[R+1]+=w,_[R+2]+=w}u.putImageData(y,0,0);for(let R of[128,384]){let w=u.createLinearGradient(R-70,0,R+70,0);w.addColorStop(0,"rgba(0,0,0,0)"),w.addColorStop(.5,"rgba(16,16,18,0.35)"),w.addColorStop(1,"rgba(0,0,0,0)"),u.fillStyle=w,u.fillRect(R-70,0,140,1024)}for(let R=0;R<1024;R+=128)u.fillStyle=R/128%2?"#c8332e":"#e8e4da",u.fillRect(0,R,14,128),u.fillRect(498,R,14,128);u.fillStyle="#dcd8cc",u.fillRect(22,0,7,1024),u.fillRect(483,0,7,1024),u.fillStyle="#d8a93c";for(let R=0;R<1024;R+=96)u.fillRect(249,R,5,58),u.fillRect(258,R,5,58);let v=new es(m);return v.wrapS=v.wrapT=Bo,v.colorSpace=dn,v.anisotropy=t.capabilities.getMaxAnisotropy(),v}{let m=[],u=[],y=[],_=i.roadHalf;for(let w=0;w<=o;w++){let A=l[w%o],C=A.p.clone().addScaledVector(A.r,-_),b=A.p.clone().addScaledVector(A.r,_);m.push(C.x,.012,C.z,b.x,.012,b.z);let S=w*h/14;if(u.push(0,S,1,S),w<o){let U=w*2;y.push(U,U+2,U+1,U+1,U+2,U+3)}}let v=new rn;v.setAttribute("position",new me(m,3)),v.setAttribute("uv",new me(u,2)),v.setIndex(y),v.computeVertexNormals();let R=new Zt(v,new Ae({map:g(),roughness:.88,metalness:.04}));R.receiveShadow=!0,e.add(R)}{for(let w of[-1,1]){let A=i.roadHalf+1.5,C=[],b=[];for(let F=0;F<=o;F++){let P=l[F%o],z=P.p.clone().addScaledVector(P.r,w*A);if(C.push(z.x,0,z.z,z.x,.85,z.z),F<o){let Y=F*2;b.push(Y,Y+2,Y+1,Y+1,Y+2,Y+3)}}let S=new rn;S.setAttribute("position",new me(C,3)),S.setIndex(b),S.computeVertexNormals();let U=new Zt(S,new Ae({color:10133672,metalness:.85,roughness:.42,side:oi}));e.add(U)}let m=new qn(.07,.07,.85,6),u=new Ae({color:5922662,metalness:.7,roughness:.5}),y=Math.floor(o/7)*2,_=new ts(m,u,y),v=new fe,R=0;for(let w=0;w<o;w+=7)for(let A of[-1,1]){let C=l[w],b=C.p.clone().addScaledVector(C.r,A*(i.roadHalf+1.5));v.makeTranslation(b.x,.42,b.z),_.setMatrixAt(R++,v)}_.count=R,e.add(_)}{let W=function(rt,$,Rt,dt){let T=document.createElement("canvas");T.width=512,T.height=224;let x=T.getContext("2d");x.fillStyle="#101218",x.fillRect(0,0,512,224),x.strokeStyle="#ffb000",x.lineWidth=10,x.strokeRect(8,8,496,208),x.fillStyle="#ffb000",x.font="italic 900 86px Arial",x.textAlign="center",x.fillText(rt,256,112),x.fillStyle="rgba(255,255,255,.75)",x.font="600 34px Arial",x.fillText($,256,174);let B=new es(T);B.colorSpace=dn;let Z=l[Rt],st=Z.p.clone().addScaledVector(Z.r,dt*(i.roadHalf+8)),J=new In,Lt=new Zt(new Pi(11,4.8),new Ae({map:B,roughness:.7,side:oi,emissive:16777215,emissiveMap:B,emissiveIntensity:.35}));Lt.position.y=5.4;for(let xt of[-4.6,4.6]){let Tt=new Zt(new qn(.16,.16,5.4,6),new Ae({color:3356220,metalness:.8,roughness:.5}));Tt.position.set(xt,2.7,-.1),J.add(Tt)}J.add(Lt),J.position.copy(st),J.lookAt(Z.p.x,5.4,Z.p.z),e.add(J)};var M=W;let m=document.createElement("canvas");m.width=m.height=256;let u=m.getContext("2d");u.fillStyle="#37502c",u.fillRect(0,0,256,256);for(let rt=0;rt<3800;rt++)u.fillStyle=`rgba(${20+s(30)|0},${50+s(40)|0},${18+s(25)|0},.5)`,u.fillRect(s(256)|0,s(256)|0,2,2);let y=new es(m);y.wrapS=y.wrapT=Bo,y.repeat.set(190,190),y.colorSpace=dn;let _=new Zt(new Pi(2600,2600),new Ae({map:y,roughness:1}));_.rotation.x=-Math.PI/2,_.position.y=-.02,_.receiveShadow=!0,e.add(_);let v=new Ae({color:5787491,roughness:1,flatShading:!0});for(let rt=0;rt<22;rt++){let $=rt/22*Math.PI*2+s(.28),Rt=s(820,1080),dt=s(55,150),T=new Zt(new cr(s(110,200),dt,7),v);T.position.set(Math.sin($)*Rt+120,dt/2-8,Math.cos($)*Rt-40),T.rotation.y=s(Math.PI*2),T.scale.x=s(1.2,2.4),e.add(T)}let R=[],w=0;for(;R.length<230&&w++<4e3;){let rt=s(-360,560),$=s(-500,420),Rt=!0;for(let dt=0;dt<o;dt+=6){let T=l[dt].p.x-rt,x=l[dt].p.z-$;if(T*T+x*x<361){Rt=!1;break}}Rt&&R.push([rt,$,s(.75,1.5)])}let A=new qn(.22,.3,1.6,6),C=new cr(1.9,4.6,7),b=new Ae({color:4863266,roughness:1}),S=new Ae({color:2902562,roughness:1}),U=new ts(A,b,R.length),F=new ts(C,S,R.length);F.castShadow=!0;let P=new fe,z=new N,Y=new Ti;R.forEach(([rt,$,Rt],dt)=>{P.compose(new N(rt,.8*Rt,$),Y,z.set(Rt,Rt,Rt)),U.setMatrixAt(dt,P),P.compose(new N(rt,(1.6+2.3)*Rt,$),Y,z.set(Rt,Rt,Rt)),F.setMatrixAt(dt,P)}),e.add(U,F);let G=new qn(.09,.12,6.4,6),j=new Ae({color:3948614,metalness:.8,roughness:.5}),H=new On(.95,.14,.3),ut=new Ae({color:2236962,emissive:16767392,emissiveIntensity:2.4}),vt=Math.floor(o/50),yt=new ts(G,j,vt),Ft=new ts(H,ut,vt),Nt=0;for(let rt=0;rt<o;rt+=50){let $=l[rt],Rt=Nt%2?1:-1,dt=$.p.clone().addScaledVector($.r,Rt*(i.roadHalf+2.6));P.makeTranslation(dt.x,3.2,dt.z),yt.setMatrixAt(Nt,P);let T=dt.clone().addScaledVector($.r,-Rt*.85);P.makeRotationY(Math.atan2($.r.x,$.r.z)).setPosition(T.x,6.32,T.z),Ft.setMatrixAt(Nt,P),Nt++}yt.count=Ft.count=Nt,e.add(yt,Ft),W("APEX RUSH","SUNSET TRACK \xB7 NITRO CIRCUIT",60,1),W("TURN 4","SLOW DOWN \xB7 CORNERS SEPARATE THE PROS",310,-1),W("NITRO \u26A1","HOLD SHIFT TO IGNITE NITRO",560,1),W("DRIFT","SPACE TO DRIFT \xB7 RECHARGES NITRO",800,-1);let it=l[0],mt=new In,tt=new Ae({color:2764083,metalness:.85,roughness:.4});for(let rt of[-1,1]){let $=new Zt(new On(.55,7,.55),tt);$.position.copy(it.p).addScaledVector(it.r,rt*(i.roadHalf+1.2)),$.position.y=3.5,mt.add($)}let Et=new Zt(new On((i.roadHalf+1.2)*2+.5,1.15,.8),tt);Et.position.copy(it.p),Et.position.y=6.6,Et.rotation.y=Math.atan2(it.r.x,it.r.z),mt.add(Et);let gt=document.createElement("canvas");gt.width=512,gt.height=64;let wt=gt.getContext("2d");for(let rt=0;rt<16;rt++)for(let $=0;$<2;$++)wt.fillStyle=(rt+$)%2?"#0d0d0f":"#f2efe6",wt.fillRect(rt*32,$*32,32,32);wt.fillStyle="#ffb000",wt.font="italic 900 40px Arial",wt.textAlign="center",wt.fillText("START \xB7 FINISH",256,46);let Ht=new es(gt);Ht.colorSpace=dn;let Q=new Zt(new Pi((i.roadHalf+1.2)*2,1.05),new Ae({map:Ht,side:oi,emissive:16777215,emissiveMap:Ht,emissiveIntensity:.3}));Q.position.copy(it.p),Q.position.y=6.6,Q.rotation.y=Math.atan2(it.f.x,it.f.z)+Math.PI/2,mt.add(Q),e.add(mt);let ot=document.createElement("canvas");ot.width=448,ot.height=64;let D=ot.getContext("2d");for(let rt=0;rt<28;rt++)for(let $=0;$<4;$++)D.fillStyle=(rt+$)%2?"#111":"#eee",D.fillRect(rt*16,$*16,16,16);let ft=new es(ot);ft.colorSpace=dn;let at=new Zt(new Pi(i.roadHalf*2,1.6),new Wn({map:ft}));at.rotation.x=-Math.PI/2,at.rotation.z=-Math.atan2(it.f.x,it.f.z),at.position.copy(it.p),at.position.y=.022,e.add(at)}return{sampleCount:o,samples:l,length:c,spacing:h,speedProfile:d,sampleAt:f,nearestIndex:p}}var i1=He(()=>{"use strict";Yn();dr()});var s1,pr,a1,r1=He(()=>{"use strict";s1={step:.008333333333333333,engine:14.5,nitroMult:1.52,drag:.0036,roll:.55,brake:17,revForce:7.5,revMax:-10,gripNormal:9.2,gripDrift:4.6,gripHand:2.05,steerMax:2.75,steerHiDamp:.021,steerRise:8.5,steerFall:14,driftYawBoost:1.34,driftLatTh:4.3,grassDragMult:2.6,grassRoll:2,nitroUse:30,nitroRegen:8.5,nitroDriftRegen:17,vMax:75,roadHalf:7,railClamp:7.55,camDist:7.7,camH:2.55,camLook:6.6,camLam:4.6,camLookLam:7.5,fovBase:60,fovSpeed:17,fovNitro:8.5,aiVMax:58,aiLatAcc:12.5,aiBrake:13.5,aiSkill:[.998,.974,.948]},pr=[0,9,17,26,36,47,64],a1=[{name:"YOU",color:2128383,isPlayer:!0},{name:"ARES",color:14165548,rim:13225172},{name:"VEX",color:1513501,rim:14266970},{name:"NOVA",color:15263980,rim:8948111}]});var o1={};g1(o1,{mountRacing:()=>CD});function CD(e){let t=new AbortController,n=!0,i=!1,s=0,a=new Set,r=(V,ht)=>{let nt=window.setTimeout(()=>{a.delete(nt),n&&V()},ht);return a.add(nt),nt},o=()=>Math.max(1,e.clientWidth),l=()=>Math.max(1,e.clientHeight),c=V=>{let ht=e.querySelector(V);if(!ht)throw new Error(`Racing UI is missing element: ${V}`);return ht};function h(V){c("#errMsg").textContent=V,c("#errbox").classList.remove("hidden"),c("#loading").classList.add("hidden")}window.addEventListener("error",V=>{i||h("Initialization failed: "+(V.message||"unknown error"))},{signal:t.signal});let d=s1,f=Bb,p=Ca,g;try{g=new sf({antialias:!0,powerPreference:"high-performance"})}catch(V){throw h("This browser cannot enable WebGL. Please use the latest Chrome or Safari."),V}let M=(()=>{try{let V=g.getContext(),ht=V.getExtension("WEBGL_debug_renderer_info");return ht?V.getParameter(ht.UNMASKED_RENDERER_WEBGL):""}catch{return""}})(),m=/swiftshader|software|llvmpipe/i.test(M),u=m?1:Math.min(window.devicePixelRatio||1,2);g.setPixelRatio(u),g.setSize(o(),l()),g.shadowMap.enabled=!m,g.shadowMap.type=w0,g.toneMapping=Dc,g.toneMappingExposure=1.06;let y=c("#app");y.appendChild(g.domElement);let _=new yc;_.fog=new af(13996378,140,950);let v=new Ln(d.fovBase,o()/l(),.1,2200);v.position.set(0,3,-10);let R=new N(-.55,.3,-.78).normalize();function w(){let V=new pf(1e3,32,18),ht=new Ye({side:En,fog:!1,depthWrite:!1,uniforms:{sunDir:{value:R}},vertexShader:`varying vec3 vDir; void main(){ vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,fragmentShader:`varying vec3 vDir; uniform vec3 sunDir;
        void main(){
          float h = vDir.y;
          vec3 zen = vec3(0.16,0.26,0.52)*1.25;
          vec3 hor = vec3(2.5,1.15,0.45);
          vec3 col = mix(hor, zen, smoothstep(-0.02,0.42,h));
          col = mix(vec3(1.4,0.62,0.30), col, smoothstep(-0.25,0.02,h));
          float sd = max(dot(vDir,sunDir),0.0);
          col += vec3(3.2,1.9,0.9)*pow(sd,420.0)*3.0;   // sun disc
          col += vec3(1.6,0.85,0.35)*pow(sd,18.0)*0.55; // sunset glow
          gl_FragColor = vec4(col,1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`});return new Zt(V,ht)}let A=w();_.add(A);{let V=new yc;V.add(w());let ht=new Zt(new df(900,32),new Wn({color:3352348}));ht.rotation.x=-Math.PI/2,ht.position.y=-2,V.add(ht);let nt=new ko(g);_.environment=nt.fromScene(V).texture,nt.dispose()}let C=new xf(16767392,2.9);C.castShadow=!0,C.shadow.mapSize.set(2048,2048),C.shadow.camera.left=-60,C.shadow.camera.right=60,C.shadow.camera.top=60,C.shadow.camera.bottom=-60,C.shadow.camera.near=10,C.shadow.camera.far=320,C.shadow.bias=-.0012,_.add(C,C.target),_.add(new yf(9482984,4864038,.55));let b=new Cf(g,new xn(o()*u,l()*u,{type:ci,samples:m?0:4}));b.setPixelRatio(u),b.addPass(new Df(_,v));let S=new Jo(new ct(o(),l()),.5,.55,.85);b.addPass(S),b.addPass(new Uf);let U=n1(_,g,d),F=U.samples,P=U.length,z=U.spacing,Y=U.sampleAt,G=U.nearestIndex,j=a1.map((V,ht)=>{let nt=Wb(V.color,{rim:"rim"in V?V.rim:void 0});return _.add(nt.grp),{name:V.name,color:V.color,rim:"rim"in V?V.rim:void 0,isPlayer:"isPlayer"in V&&V.isPlayer,model:nt,idx:ht,pos:new N,h:0,vel:new N,vf:0,vlat:0,steer:0,steerVis:0,s:0,lastIdx:0,lap:1,wraps:0,progress:0,finished:!1,finishTime:0,v:0,laneBase:0,lanePhase:p(Math.PI*2),nudge:0,spin:0,drifting:!1,onGrass:!1,roll:0,pitch:0,acc:0,_th:0,_br:0,_st:0,_nitro:!1}}),H=j[0];function ut(){let V=[24,18,12,6];[j[1],j[2],j[3],H].forEach((nt,ne)=>{let Kt=V[ne],oe=Y(Kt),Se=(ne%2?-1:1)*2.6;nt.s=Kt,nt.pos.copy(oe.p).addScaledVector(oe.r,Se),nt.h=Math.atan2(oe.f.x,oe.f.z),nt.vel.set(0,0,0),nt.vf=0,nt.vlat=0,nt.v=0,nt.steer=0,nt.lap=1,nt.wraps=0,nt.finished=!1,nt.finishTime=0,nt.lastIdx=Math.round(Kt/z),nt.nudge=0,nt.laneBase=Se*.8,vt(nt,0)})}function vt(V,ht){let nt=V.model;nt.grp.position.copy(V.pos),nt.grp.rotation.y=V.h;let ne=V.isPlayer?V.vlat:0,Kt=en(-ne*.016-V.steer*Math.min(Math.abs(V.vf??V.v),30)*.0035,-.085,.085),oe=en(-(V.acc||0)*.0045,-.05,.06);V.roll=Ze(V.roll,Kt,8,ht||.016),V.pitch=Ze(V.pitch,oe,6,ht||.016),nt.body.rotation.z=V.roll,nt.body.rotation.x=V.pitch;let Se=V.isPlayer?V.vf:V.v;V.spin+=Se/.34*(ht||0),nt.wheels.forEach(nn=>{nn.rotation.x=V.spin}),nt.pivots.forEach(nn=>{nn.rotation.y=V.isPlayer?V.steerVis*.42:0})}let yt=Jb(_),{smoke:Ft,flame:Nt,skids:W,laySkid:it}=yt,mt=0,tt=new Lf,Et=Kb(e,t.signal,()=>gt,St,Wt),gt="loading",wt=0,Ht=0,Q=0,ot=-1,D=-1,ft={nitroBar:100,nitroActive:!1,railHitCool:0,wrongWayTime:0,shake:0,demoMode:!1};function at(V){if(V.wraps++,V.isPlayer){if(V.wraps>=1){let ht=wt-Q;if(V.wraps<=3&&ht>5){ot=ht;let nt=D<0||ht<D;nt&&(D=ht),V.wraps<3&&Xt(`LAP <em>${V.wraps+1}/3</em>`,`Last lap ${f(ht)}${nt?" \u2605 Best":""}`,nt)}Q=wt}V.lap=V.wraps+1,V.wraps>=3&&!V.finished&&(V.finished=!0,V.finishTime=wt,q())}else V.lap=V.wraps+1,V.wraps>=3&&!V.finished&&(V.finished=!0,V.finishTime=wt)}let rt=Hb({tuning:d,track:U,player:H,getRaceState:()=>gt,getNitro:()=>ft.nitroBar,onLapCross:at}),$=$b({player:H,track:U,tuning:d,input:Et,audio:tt,dynamics:ft,getRaceState:()=>gt,addRaceTime:V=>{wt+=V},onLapCross:at,drivePlayer:rt.drivePlayer}),Rt=Gb({camera:v,player:H,track:U,tuning:d,getRaceState:()=>gt,getCountdown:()=>Ht,getNitroActive:()=>ft.nitroActive,getShake:()=>ft.shake,setShake:V=>{ft.shake=V}});function dt(){C.position.copy(H.pos).addScaledVector(R,150),C.target.position.copy(H.pos),C.target.updateMatrixWorld()}let T=[];{let V=c("#nitroSegs");for(let ht=0;ht<12;ht++){let nt=document.createElement("i");V.appendChild(nt),T.push(nt)}}let x={hud:c("#hud"),posN:c("#posN"),posT:c("#posT"),lapTxt:c("#lapTxt"),timeTxt:c("#timeTxt"),lastTxt:c("#lastTxt"),bestTxt:c("#bestTxt"),spdN:c("#spdN"),gearN:c("#gearN"),arcFill:c("#arcFill"),needle:c("#needle"),driftTag:c("#driftTag"),wrongWay:c("#wrongWay"),countNum:c("#countNum"),lapToast:c("#lapToast"),nitroVig:c("#nitroVig"),hints:c("#hints"),title:c("#title"),pause:c("#pause"),results:c("#results"),loading:c("#loading"),minimap:c("#minimap")},B=4,Z=null;function st(V){let ht=Math.abs(V);for(let nt=pr.length-2;nt>=1;nt--)if(ht>=pr[nt])return{g:nt+1,r:(ht-pr[nt])/(pr[nt+1]-pr[nt])};return{g:1,r:ht/pr[1]}}function J(){return[...j].sort((ht,nt)=>ht.finished&&nt.finished?ht.finishTime-nt.finishTime:ht.finished!==nt.finished?ht.finished?-1:1:nt.progress-ht.progress)}function Lt(){if(gt!=="racing"&&gt!=="countdown"&&gt!=="finished")return;let V=H,ht=Math.abs(V.vf)*3.6;x.spdN.textContent=String(Math.round(ht));let nt=en(Math.abs(V.vf)/d.vMax,0,1);x.arcFill.style.strokeDashoffset=(250*(1-nt)).toFixed(1),x.needle.style.transform=`rotate(${(-125+250*nt).toFixed(1)}deg)`;let{g:ne,r:Kt}=st(V.vf);x.gearN.textContent=V.vf<-.5?"R":String(ne);let oe=Math.round(ft.nitroBar/100*12);T.forEach((If,E)=>If.classList.toggle("on",E<oe)),x.driftTag.classList.toggle("on",V.drifting&&Math.abs(V.vf)>8),x.nitroVig.classList.toggle("on",ft.nitroActive),x.wrongWay.classList.toggle("show",ft.wrongWayTime>1.1);let Se=J(),nn=Se.indexOf(V)+1;x.posN.textContent=String(nn),x.posN.classList.toggle("first",nn===1),nn!==B&&(x.posN.classList.remove("pulse"),x.posN.offsetWidth,x.posN.classList.add("pulse"),nn<B&&tt.beep(880,.1,.14,"sine"),B=nn),x.lapTxt.textContent=`${Math.min(V.lap,3)}/3`,x.timeTxt.textContent=f(wt),x.lastTxt.textContent=f(ot),x.bestTxt.textContent=f(D),Vt(Se)}let xt=x.minimap.getContext("2d"),Tt=null,Gt=1,lt=[0,0];function Ut(){x.minimap.width=304,x.minimap.height=304;let ht=1e9,nt=-1e9,ne=1e9,Kt=-1e9;for(let Se of F)ht=Math.min(ht,Se.p.x),nt=Math.max(nt,Se.p.x),ne=Math.min(ne,Se.p.z),Kt=Math.max(Kt,Se.p.z);let oe=26;Gt=Math.min((304-oe*2)/(nt-ht),(304-oe*2)/(Kt-ne)),lt=[(304-(nt-ht)*Gt)/2-ht*Gt,(304-(Kt-ne)*Gt)/2-ne*Gt],Tt=F.filter((Se,nn)=>nn%5===0).map(Se=>[Se.p.x*Gt+lt[0],304-(Se.p.z*Gt+lt[1])])}function Vt(V){Tt||Ut();let ht=Tt,nt=xt,ne=x.minimap.width;nt.clearRect(0,0,ne,ne),nt.beginPath(),ht.forEach((oe,Se)=>Se?nt.lineTo(oe[0],oe[1]):nt.moveTo(oe[0],oe[1])),nt.closePath(),nt.lineWidth=9,nt.strokeStyle="rgba(255,255,255,.16)",nt.stroke(),nt.lineWidth=3.5,nt.strokeStyle="rgba(255,255,255,.5)",nt.stroke();let Kt=F[0];nt.save(),nt.translate(Kt.p.x*Gt+lt[0],ne-(Kt.p.z*Gt+lt[1])),nt.rotate(-Math.atan2(Kt.f.x,Kt.f.z)),nt.fillStyle="#ffb000",nt.fillRect(-7,-1.6,14,3.2),nt.restore();for(let oe of[...j].reverse()){let Se=oe.pos.x*Gt+lt[0],nn=ne-(oe.pos.z*Gt+lt[1]);nt.beginPath(),nt.arc(Se,nn,oe.isPlayer?7:5.5,0,Math.PI*2),nt.fillStyle=oe.isPlayer?"#35d6ff":"#"+oe.color.toString(16).padStart(6,"0"),nt.fill(),oe.isPlayer&&(nt.lineWidth=2.4,nt.strokeStyle="#fff",nt.stroke())}}function Xt(V,ht,nt){x.lapToast.querySelector("b").innerHTML=V;let ne=x.lapToast.querySelector("p");ne.textContent=ht,ne.classList.toggle("best",!!nt),x.lapToast.classList.add("show"),r(()=>x.lapToast.classList.remove("show"),2400)}function Mt(V,ht){V.classList.toggle("hidden",!ht)}function ie(){gt="title",ut(),ft.nitroBar=100,wt=0,ot=D=-1,ft.wrongWayTime=0,Mt(x.title,!0),Mt(x.pause,!1),Mt(x.results,!1),Mt(x.hud,!1),tt.idle()}function Wt(){tt.init(),tt.resume(),ut(),wt=0,Q=0,ot=D=-1,ft.nitroBar=100,ft.wrongWayTime=0,B=4,ft.shake=0,yt.resetSkids(),gt="countdown",Ht=3.9,Mt(x.title,!1),Mt(x.pause,!1),Mt(x.results,!1),Mt(x.hud,!0),x.hints.classList.remove("fade"),Z!==null&&clearTimeout(Z),Z=r(()=>x.hints.classList.add("fade"),9e3),x.countNum.classList.add("hidden"),ge=4}let ge=4;function L(V){Ht-=V;let ht=Math.ceil(Ht);ht<ge&&ht>=1&&(ge=ht,x.countNum.textContent=String(ht),x.countNum.classList.remove("hidden","go","anim"),x.countNum.offsetWidth,x.countNum.classList.add("anim"),tt.beep(440,.16,.25)),Ht<=0&&(gt="racing",x.countNum.textContent="GO!",x.countNum.classList.remove("anim","hidden"),x.countNum.offsetWidth,x.countNum.classList.add("go","anim"),tt.beep(880,.5,.3),r(()=>x.countNum.classList.add("hidden"),1e3))}function St(V){V&&gt==="racing"?(gt="paused",Mt(x.pause,!0),tt.suspend()):!V&&gt==="paused"&&(gt="racing",Mt(x.pause,!1),tt.resume())}function q(){r(()=>{gt="finished";let V=J(),ht=V.indexOf(H)+1;c("#resPos").textContent=String(ht),c("#resTime").textContent=f(H.finishTime),c("#resBest").textContent=f(D);let nt=c("#board");nt.innerHTML="";let ne=V[0].finished?V[0].finishTime:et(V[0]);V.forEach((Kt,oe)=>{let Se=Kt.finished?Kt.finishTime:et(Kt),nn=document.createElement("div");nn.className="row"+(Kt.isPlayer?" me":""),nn.innerHTML=`<span class="rk">${oe+1}</span>
          <span class="chip" style="background:#${Kt.color.toString(16).padStart(6,"0")}"></span>
          <span class="nm">${Kt.name}</span>
          <span class="tm">${f(Se)}</span>
          <span class="gap">${oe===0?"WINNER":"+"+(Se-ne).toFixed(2)+"s"}</span>`,nt.appendChild(nn)}),Mt(x.results,!0),tt.beep(660,.14,.2,"sine"),r(()=>tt.beep(880,.3,.2,"sine"),150)},1300)}function et(V){if(V.finished)return V.finishTime;let ht=3*P-V.progress;return wt+ht/Math.max(V.isPlayer?Math.abs(V.vf):V.v,15)}c("#btnStart").onclick=Wt,c("#btnResume").onclick=()=>St(!1),c("#btnRestart").onclick=()=>{Wt()},c("#btnPauseTitle").onclick=ie,c("#btnAgain").onclick=Wt,c("#btnToTitle").onclick=ie;let At=0,_t=new N;function Jt(V){At+=V;let ht=H,nt=.028;for(;At>nt&&(At-=nt,gt==="racing");){if(ft.nitroActive)for(let Kt of ht.model.exhaust){_t.copy(Kt).applyMatrix4(ht.model.grp.matrixWorld);let oe=new N(-Math.sin(ht.h),0,-Math.cos(ht.h));Nt.spawn(_t,oe.multiplyScalar(15).add(new N(p(-1.2,1.2),p(.8),p(-1.2,1.2))),.22,p(.5,.75),3,1)}if(ht.drifting&&Math.abs(ht.vf)>8||ht.onGrass&&Math.abs(ht.vf)>10)for(let Kt of ht.model.rearWheels)_t.copy(Kt).applyMatrix4(ht.model.grp.matrixWorld),Ft.spawn(_t,new N(p(-1.6,1.6),p(1.2,2.4),p(-1.6,1.6)),p(.5,.8),p(.5,.8),2.2,ht.onGrass?.3:.38)}if(ht.drifting&&Math.abs(ht.vf)>8&&!ht.onGrass&&(mt+=Math.abs(ht.vf)*V,mt>.55)){mt=0;for(let Kt of ht.model.rearWheels)_t.copy(Kt).applyMatrix4(ht.model.grp.matrixWorld),it(_t.x,_t.z,ht.h)}Ft.update(V),Nt.update(V);for(let Kt of H.model.flames)if(Kt.visible=ft.nitroActive,ft.nitroActive){let oe=p(.7,1.35);Kt.scale.set(1,oe,1),Kt.material.opacity=p(.7,1)}let ne=(Et.isDown("KeyS")||Et.isDown("ArrowDown"))&&gt==="racing";H.model.tailMat.emissiveIntensity=ne?4.2:1.5}let Re=performance.now(),Je=0,ue=0,wn=0,hi=!1,Qo=0;function Ko(V){n&&(s=requestAnimationFrame(Ko),gr(V,!0))}let ns=window.setInterval(()=>{let V=performance.now();n&&V-Re>400&&gr(V,!1)},150);function gr(V,ht){let nt=(V-Re)/1e3;if(Re=V,nt>.1&&(nt=.1),gt==="countdown"&&L(nt),gt==="racing"||gt==="countdown"){Je+=nt;let ne=0;for(;Je>=d.step&&ne++<10;){$.step(d.step);for(let Kt=1;Kt<j.length;Kt++)rt.step(j[Kt],d.step);t1(j,U,()=>{ft.railHitCool<=0&&(tt.thud(),ft.shake=.32,ft.railHitCool=.55)}),Je-=d.step}}if(gt==="finished"){$.step(Math.min(nt,.033));for(let ne=1;ne<j.length;ne++)rt.step(j[ne],Math.min(nt,.033))}for(let ne of j)vt(ne,nt);if(Jt(nt),Rt.update(nt),dt(),Lt(),tt.started&&(gt==="racing"||gt==="countdown"||gt==="finished")){let{g:ne,r:Kt}=st(H.vf),oe=(Et.isDown("KeyW")||Et.isDown("ArrowUp"))&&gt!=="countdown"?1:0,Se=gt==="countdown"&&(Et.isDown("KeyW")||Et.isDown("ArrowUp"));tt.set(Se?.75+Math.sin(V*.01)*.1:en(.12+Kt*.88,0,1),oe||Se?1:0,en(Math.abs(H.vf)/d.vMax,0,1),H.drifting&&Math.abs(H.vf)>8?.8:0,ft.nitroActive)}else tt.started&&tt.idle();Qo+=nt,ht&&gt==="racing"&&Qo>10&&(ue+=nt,wn++,ue>4&&(wn/ue<42&&!hi&&(hi=!0,g.setPixelRatio(1),b.setPixelRatio(1),console.info("[perf] Frame rate low, render resolution reduced")),ue=0,wn=0)),ht&&b.render()}let jo=new ResizeObserver(()=>{v.aspect=o()/l(),v.updateProjectionMatrix(),g.setSize(o(),l()),b.setSize(o(),l())});return jo.observe(e),ut(),Ut(),Mt(x.loading,!1),ie(),i=!0,e.__game={get state(){return gt},get player(){return H},get raceTime(){return wt},get nitro(){return ft.nitroBar},startRace:Wt,setDemo(V){ft.demoMode=V},rankCars:J,LEN:P,cars:j,camera:v,setFreeCam(V){Rt.setFree(V)},press(V){Et.press(V)},release(V){Et.release(V)},shot(V=.6){return b.render(),g.domElement.toDataURL("image/jpeg",V)}},s=requestAnimationFrame(Ko),e.focus(),ft.demoMode&&r(Wt,600),()=>{n=!1,t.abort(),cancelAnimationFrame(s),clearInterval(ns),jo.disconnect();for(let V of a)clearTimeout(V);a.clear(),Et.clear(),tt.suspend(),b.dispose?.(),g.dispose(),y.replaceChildren(),delete e.__game}}var l1=He(()=>{"use strict";Yn();Db();Ub();Ib();zb();Fb();Vb();kb();qb();Qb();jb();e1();i1();r1();dr()});var c1=Vi(FM(),1);var mr=Vi(Bc(),1);var It=Vi(Es(),1);function kM(){return(0,It.jsxs)("div",{id:"hud",className:"hidden",children:[(0,It.jsxs)("div",{id:"raceInfo",children:[(0,It.jsxs)("div",{className:"pos",children:[(0,It.jsx)("b",{id:"posN",children:"4"}),(0,It.jsx)("span",{id:"posT",children:"/4"}),(0,It.jsx)("em",{children:"POS"})]}),(0,It.jsxs)("div",{className:"rows",children:[(0,It.jsx)("label",{children:"LAP"}),(0,It.jsx)("b",{id:"lapTxt",children:"1/3"}),(0,It.jsx)("label",{children:"TIME"}),(0,It.jsx)("b",{id:"timeTxt",children:"0:00.00"}),(0,It.jsx)("label",{children:"LAST"}),(0,It.jsx)("b",{id:"lastTxt",children:"-:--.--"}),(0,It.jsx)("label",{children:"BEST"}),(0,It.jsx)("b",{id:"bestTxt",className:"gold",children:"-:--.--"})]})]}),(0,It.jsx)("div",{id:"minimapWrap",children:(0,It.jsx)("canvas",{id:"minimap"})}),(0,It.jsxs)("div",{id:"speedo",children:[(0,It.jsxs)("div",{className:"dial",children:[(0,It.jsxs)("svg",{viewBox:"0 0 212 212",children:[(0,It.jsx)("defs",{children:(0,It.jsxs)("linearGradient",{id:"spdGrad",x1:"0",y1:"1",x2:"1",y2:"0",children:[(0,It.jsx)("stop",{offset:"0",stopColor:"#ffb000"}),(0,It.jsx)("stop",{offset:".62",stopColor:"#ff7a00"}),(0,It.jsx)("stop",{offset:"1",stopColor:"#ff2e4d"})]})}),(0,It.jsx)("circle",{className:"arcBg",cx:"106",cy:"106",r:"84",pathLength:"360",strokeDasharray:"250 360",transform:"rotate(145 106 106)"}),(0,It.jsx)("circle",{id:"arcFill",className:"arcFill",cx:"106",cy:"106",r:"84",pathLength:"360",strokeDasharray:"250 360",strokeDashoffset:"250",transform:"rotate(145 106 106)"}),(0,It.jsx)("line",{id:"needle",className:"needle",x1:"106",y1:"106",x2:"106",y2:"34",transform:"rotate(-125 106 106)"})]}),(0,It.jsxs)("div",{className:"core",children:[(0,It.jsx)("b",{id:"spdN",children:"0"}),(0,It.jsx)("span",{children:"KM/H"}),(0,It.jsxs)("div",{className:"gear",children:[(0,It.jsx)("i",{children:"GEAR"}),(0,It.jsx)("span",{id:"gearN",children:"1"})]})]})]}),(0,It.jsxs)("div",{id:"nitroRow",children:[(0,It.jsx)("label",{children:"\u26A1 NITRO"}),(0,It.jsx)("div",{id:"nitroSegs"})]})]}),(0,It.jsxs)("div",{id:"driftTag",children:["DRIFT",(0,It.jsx)("small",{children:"Drifting refills nitro"})]}),(0,It.jsxs)("div",{id:"hints",children:[(0,It.jsxs)("div",{children:[(0,It.jsx)("kbd",{children:"W"}),(0,It.jsx)("kbd",{children:"\u2191"})," Throttle"]}),(0,It.jsxs)("div",{children:[(0,It.jsx)("kbd",{children:"S"}),(0,It.jsx)("kbd",{children:"\u2193"})," Brake / Reverse"]}),(0,It.jsxs)("div",{children:[(0,It.jsx)("kbd",{children:"A"}),(0,It.jsx)("kbd",{children:"D"})," Steer"]}),(0,It.jsxs)("div",{children:[(0,It.jsx)("kbd",{children:"SPACE"})," Handbrake drift"]}),(0,It.jsxs)("div",{children:[(0,It.jsx)("kbd",{children:"SHIFT"})," Nitro boost"]}),(0,It.jsxs)("div",{children:[(0,It.jsx)("kbd",{children:"ESC"})," Pause\xA0",(0,It.jsx)("kbd",{children:"R"})," Restart"]})]}),(0,It.jsxs)("div",{id:"center",children:[(0,It.jsx)("div",{id:"countNum",className:"hidden"}),(0,It.jsxs)("div",{id:"lapToast",children:[(0,It.jsx)("b",{}),(0,It.jsx)("p",{})]}),(0,It.jsx)("div",{id:"wrongWay",children:"\u26A0 WRONG WAY \u2014 TURN AROUND"})]})]})}var Dt=Vi(Es(),1);function XM(){return(0,Dt.jsxs)("div",{id:"title",className:"overlay hidden",children:[(0,Dt.jsx)("div",{className:"stripes"}),(0,Dt.jsxs)("div",{className:"inner",children:[(0,Dt.jsx)("div",{className:"kicker",children:"NITRO CIRCUIT \xB7 TWILIGHT TRACK"}),(0,Dt.jsxs)("h1",{children:["APEX RUSH",(0,Dt.jsx)("span",{className:"en",children:"APEX RUSH"})]}),(0,Dt.jsx)("p",{className:"tag",children:"Three laps to glory \xB7 Nitro wide open \xB7 Won in the corners"}),(0,Dt.jsx)("button",{id:"btnStart",className:"btn",children:(0,Dt.jsx)("span",{children:"Start Race\xA0\u25B8"})}),(0,Dt.jsxs)("div",{className:"keys",children:[(0,Dt.jsxs)("div",{children:[(0,Dt.jsx)("kbd",{children:"W"}),"Throttle"]}),(0,Dt.jsxs)("div",{children:[(0,Dt.jsx)("kbd",{children:"S"}),"Brake"]}),(0,Dt.jsxs)("div",{children:[(0,Dt.jsx)("kbd",{children:"A"}),(0,Dt.jsx)("kbd",{children:"D"}),"Steer"]}),(0,Dt.jsxs)("div",{children:[(0,Dt.jsx)("kbd",{children:"SPACE"}),"Drift"]}),(0,Dt.jsxs)("div",{children:[(0,Dt.jsx)("kbd",{children:"SHIFT"}),"Nitro"]}),(0,Dt.jsxs)("div",{children:[(0,Dt.jsx)("kbd",{children:"ENTER"}),"Jump straight in"]})]})]}),(0,Dt.jsx)("div",{className:"foot",children:"THREE.JS PROCEDURAL MODELING \xB7 WEBAUDIO SYNTHESIZED ENGINE SOUND"})]})}function WM(){return(0,Dt.jsxs)("div",{id:"pause",className:"overlay hidden",children:[(0,Dt.jsx)("div",{className:"stripes"}),(0,Dt.jsx)("h2",{className:"skew",children:"Game Paused"}),(0,Dt.jsx)("p",{children:"PAUSED \u2014 Press ESC to resume"}),(0,Dt.jsxs)("div",{className:"actions",children:[(0,Dt.jsx)("button",{id:"btnResume",className:"btn",children:(0,Dt.jsx)("span",{children:"Resume \u25B8"})}),(0,Dt.jsx)("button",{id:"btnRestart",className:"btn ghost",children:(0,Dt.jsx)("span",{children:"Restart Race"})}),(0,Dt.jsx)("button",{id:"btnPauseTitle",className:"btn ghost",children:(0,Dt.jsx)("span",{children:"Back to Title"})})]})]})}function qM(){return(0,Dt.jsxs)("div",{id:"results",className:"overlay hidden",children:[(0,Dt.jsx)("div",{className:"stripes"}),(0,Dt.jsx)("div",{className:"head",children:"RACE COMPLETE \xB7 FINISHED"}),(0,Dt.jsxs)("h2",{children:["P",(0,Dt.jsx)("i",{id:"resPos",children:"1"})]}),(0,Dt.jsxs)("div",{className:"stats",children:[(0,Dt.jsxs)("span",{children:["Total Time",(0,Dt.jsx)("b",{id:"resTime",children:"-"})]}),(0,Dt.jsxs)("span",{children:["Best Lap",(0,Dt.jsx)("b",{id:"resBest",children:"-"})]})]}),(0,Dt.jsx)("div",{id:"board"}),(0,Dt.jsxs)("div",{className:"actions",children:[(0,Dt.jsx)("button",{id:"btnAgain",className:"btn",children:(0,Dt.jsx)("span",{children:"Race Again \u25B8"})}),(0,Dt.jsx)("button",{id:"btnToTitle",className:"btn ghost",children:(0,Dt.jsx)("span",{children:"Back to Title"})})]})]})}function YM({error:e,onRetry:t}){return(0,Dt.jsxs)(Dt.Fragment,{children:[(0,Dt.jsxs)("div",{id:"loading",children:[(0,Dt.jsx)("div",{className:"logo skew",children:"APEX RUSH"}),(0,Dt.jsx)("div",{className:"bar",children:(0,Dt.jsx)("i",{})}),(0,Dt.jsx)("p",{children:"Initializing render engine\u2026"})]}),(0,Dt.jsx)("div",{id:"errbox",className:e?"":"hidden",children:(0,Dt.jsxs)("div",{className:"card",children:[(0,Dt.jsx)("h2",{children:"\u26A0 Failed to Load"}),(0,Dt.jsx)("p",{id:"errMsg",children:e||"This browser could not initialize the 3D game."}),(0,Dt.jsx)("button",{className:"btn",onClick:t,children:(0,Dt.jsx)("span",{children:"Reload"})})]})})]})}var Bi=Vi(Es(),1);function Z0(e){let t=(0,mr.useRef)(null),[n,i]=(0,mr.useState)(0),[s,a]=(0,mr.useState)("");return(0,mr.useEffect)(()=>{let r=t.current;if(!r)return;let o=!1,l;return a(""),Promise.resolve().then(()=>(l1(),o1)).then(({mountRacing:c})=>{o||(l=c(r))}).catch(c=>{o||a(c?.message||"Game failed to initialize")}),()=>{o=!0,l?.()}},[n]),(0,Bi.jsxs)("div",{ref:t,className:"racing-root",tabIndex:0,onPointerDown:()=>t.current?.focus(),children:[(0,Bi.jsx)("div",{id:"app"}),(0,Bi.jsx)("div",{id:"vig"}),(0,Bi.jsx)("div",{id:"nitroVig"}),(0,Bi.jsx)(kM,{}),(0,Bi.jsx)(XM,{}),(0,Bi.jsx)(WM,{}),(0,Bi.jsx)(qM,{}),(0,Bi.jsx)(YM,{error:s,onRetry:()=>i(r=>r+1)})]})}var u1=Vi(Es(),1);(0,c1.createRoot)(document.getElementById("root")).render((0,u1.jsx)(Z0,{appId:"racing"}));
