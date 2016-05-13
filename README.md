# air-ajaxify

A.I.R light-weight SPA framework, based on AJAX, with loadingbar and custom options.

Author: A.I.Roland

作者：张英磊

License: MIT

使用者须保留文件中的作者版权信息

Version: 1.0.94

**Notice: jQuery is neccessary.**

# 中文文档 (English documentation will come soon.)

## 简介

`air-ajaxify`是一个轻量级类SPA框架，它基于AJAX来获取组件页面，并且自带loadingbar（CSS3），也可自己设置过渡动画。

`air-ajaxify`可以让你用最简单的方式体验到模块化组件开发的乐趣，它非常小巧，在良好使用的情况下完全可以达到SPA（单页应用）的效果，你甚至可以把它理解为**只实现了router的小型前端框架**，同时相比于其他框架几乎不需要任何学习成本。

通常情况下你只需要搭建一个主体页面并引入`air-ajaxify`，其余的页面都可以做成组件形式来异步加载，组件中写的JS代码都会在加载时执行，这样可以大大减少开发上的重复性劳动。

另外，如果你正为了做SPA而准备学习其他框架，那么`air-ajaxify`将为你提供一个好的开始。

**注意：本工具依赖于jQuery，以后会考虑推出原生JS的版本。**

## 开源说明

目前正在V1.0.x迭代中，最新的V1.0.94版本功能已经完备，但代码还有可以优化和精简的地方，因此暂不开源，只提供压缩版本（在dist目录下）。待版本更新到V1.1.0优化完毕以后会全面开源。

## 更新说明 - V1.0.94

更新了`back()`方法，提供两种回退模式（详见[air.ajaxify.back()](#airajaxifybackbodyname--isnewrequest)）。

## 更新说明 - V1.0.93

1、AJAX状态控制全部采用回调函数的方式（详见[AJAX状态控制](#ajax状态控制)）；

2、增加了`loadingFunction`属性（详见[loadingFunction](#loadingfunction)）；

3、更成熟的`setData()`机制，使用`back()`返回时仍能正确获取到此页面之前设置的数据；

4、更新了`固有方法`的说明（详见[air-js固有方法](#air-js固有方法)）。

5、增加了`回调函数的默认参数`的说明（详见[回调函数的默认参数](#回调函数的默认参数)）。

## 更新说明 - V1.0.92

1、原有的`send()`方法将被`go()`替代（详见[air.ajaxify.go(elem)](#airajaxifygoelem)）；

2、为`send()`方法提供了崭新的功能，这将进一步增强`air-ajaxify`的灵活性（详见[air.ajaxify.send(options)](#airajaxifysendoptions)）；

3、在文档中添加`固有方法`的说明（详见[air-js固有方法](#air-js固有方法)）。

## 使用教程

`air-ajaxify`可使用两种方式（Javascript和DOM属性）来进行设置。

### 快速入门

一个最简单的使用air-ajaxify的方式如下：

在主体页面中：

```html
<a href="javascript:;" aa-url="test.html" aa-target="test">test</a>
<div aa-body="test"></div>
```

随后在页面底部引入`air-ajaxify.min.js`即可

`air-ajaxify`会在页面加载时进行初始化，当我们点击`a`标签后，会把组件页面`test.html`的内容加载到下方的`div`盒子中，并且执行`test.html`中的JS代码，同时加载过程中会在页面顶部显示一条从左至右的loadingbar（采用CSS3动画）。

### DOM属性介绍

**注意：用DOM属性进行的设置将只对属性所在的DOM标签生效。**

#### aa-url

此属性有两个作用，一是用于标识此DOM为`air-ajaxify`能够识别的DOM对象，二是用于指定请求页面的URL地址，`air-ajaxify`将会在初始化或进行全局设置时自动扫描带有`aa-url`的DOM标签并绑定单击事件，`aa-url`属性可用于任意DOM标签中。如果你想在JS中设置全局URL地址（详见[全局设置](#全局设置)），那么至少应该在DOM中写上不赋值的`aa-url`用作标识。比如：

```html
<div aa-url></div>
```

```javascript
air.ajaxify({url:"test.html"});
```

#### aa-target和aa-body

这两个属性通常成对使用，`aa-target`放在被点击的DOM标签中，`aa-body`放在加载内容的DOM盒子中，其中`aa-target`和`aa-body`的值相等的DOM元素之间将建立多对多的映射关系。比如：

```html
<div aa-url="test1.html" aa-target="page1">test1</div>
<div aa-url="test2.html" aa-target="page1">test2</div>
<div aa-url="test3.html" aa-target="page2">test3</div>

<div aa-body="page1"></div>
<div aa-body="page1"></div>
<div aa-body="page2"></div>
```

点击`test1`会将test1.html的内容同时加载到**两个**`page1`盒子中，点击`test2`同理，只是加载的页面为test2.html。而点击`test3`则会将test3.html加载到`page2`中。

#### loadingbar相关属性

`air-ajaxify`提供丰富的DOM属性来自定义loadingbar：

* `aa-loadingbar-direction`： 设置点击此DOM时loadingbar的加载方向，支持"right","left","up","down"四个方向，默认为"right"；
* `aa-loadingbar-height`： 设置loadingbar的高度，仅当loadingbar的方向为"right"和"left"时生效，支持使用各种单位；
* `aa-loadingbar-width`： 设置loadingbar的宽度，仅当loadingbar的方向为"up"和"down"时生效，支持使用各种单位；
* `aa-loadingbar-color`： 设置loadingbar的颜色，支持各种CSS颜色值；
* `aa-loadingbar-opacity`： 设置loadingbar的透明度，取值范围0.0 ~ 1.0；
* `aa-loadingbar-show`： 设置是否显示loadingbar，取值"true"或"false"，默认"true"；
* `aa-loadingbar-shadow`： 设置是否显示loadingbar的阴影动画，取值"true"或"false"，默认"true"；
* `aa-loadingbar-class`： 设置loadingbar的用户自定义样式，如果你写好了用于loadingbar的CSS Class，可将Class名赋予此属性。

#### loading content相关属性

如果你不喜欢用`air-ajaxify`的自带loadingbar加载动画，也可以用下面的方式来自定义你的加载动画：

* `aa-loadingcontent-html`： 设置自定义的加载动画HTML内容，如：`"<img src='loading.gif'>"`，这些HTML内容将会被包含在一个由`air-ajaxify`预设的空白div盒子中显示；
* `aa-loadingcontent-class`： 设置包含自定义加载动画的div的样式，如果你在上一个属性中自定义了动画，那么最好为它写好样式来确保显示正常，这个样式将被加载到上一条提到的div盒子上；
* `aa-loadingcontent-show`： 设置是否显示自定义动画，取值"true"或"false"，默认"true"。

出于增强`air-ajaxify`灵活性的考虑，我将自带的loadingbar和用户自定义的loading content设置为不冲突的，即共存的。如果你只想显示其中一种，可将另外一种设置为不显示。

#### 注意事项

通常情况下，当你想要自定义loadingbar或者loading content的时候，应该使用`air-ajaxify`的主方法来进行[全局设置](#全局设置)，因为DOM属性只会影响到当前标签的设置，全局设置会更加方便。

### 主方法教程

#### air.ajaxify(options)

主方法，其中`options`参数是可选的，默认的`options`参数如下：

```javascript
options = {
	elem: null,
	url: null,					// 对应aa-url
	target: null,				// 对应aa-target
	loadingBar: {
		color: null,			// 对应aa-laodingbar-color
		height: null,			// 对应aa-loadingbar-height
		width: null,			// 对应aa-loadingbar-width
		opacity: null,			// 对应aa-loadingbar-opacity
		direction: 'right',		// 对应aa-loadingbar-direction
		shadow: true,			// 对应aa-loadingbar-shadow
		cssClass: null,			// 对应aa-loadingbar-class
		show: true				// 对应aa-loadingbar-show
	},
	loadingContent: {
		html: null,				// 对应aa-loadingcontent-html
		cssClass: null,			// 对应aa-loadingcontent-class
		show: true				// 对应aa-loadingcontent-show
	},
	loadingFunction: {
		pre: null,
		after: null,
		show: true
	},
	prepare:null,
	before:null,
	sucess:null,
	render:null,
	afterRender:null,
	error:null,
	time:15000,
	timeout:null,
	complete:null
}
```

其中与DOM属性对应的地方已标识出来，此处不再赘述。

#### elem

elem属性用来绑定元素到`air-ajaxify`中，你可以传入**符合jQuery选择器规范的字符串**，则options的其他属性都将被赋予选择器对应的元素，**无论它们是否有aa-url等DOM属性**。使用elem来绑定的元素设置的options优先级为最高（详见[优先级](#优先级)）。

#### 全局设置

如果在options中不设置elem属性，则`air.ajaxify(options)`将会进行全局属性设置，比如：

```javascript
air.ajaxify({
	url: "demo.html",	// 设置所有的aa-url
	target: "page",		// 设置所有的aa-target
	loadingBar:{
		color: #333		// 设置所有的loadingbar颜色
	}
});
```

**注意：全局设置会影响到所有可被air-ajaxify识别的DOM元素，即存在aa-url属性的dom元素，哪怕aa-url并没有被赋值。**

#### 优先级

搞清楚`air-ajaxify`设置属性的优先级是一件很有意思的事情，这也是`air-ajaxify`灵活性的一种体现。
当我们进行了一系列的属性设置之后，`air-ajaxify`处理属性的优先级如下：

**指定elem属性的设置 > DOM属性设置 > 全局设置**

举个例子：

HTML:

```html
<div aa-url>test1<div>
<div aa-url class="example" id="test2">test2<div>
<div aa-url="demo3.html" class="example" aa-loadingbar-color="#ff5d05">test3<div>
<div id="test4">test4<div>

<div aa-body="testbody"><div>
```

我们按从上至下的顺序，用`test1`~`test4`来指代前4个DOM元素

Javascript:

```javascript
// 这是全局设置
air.ajaxify({
	url: "demo1.html",
	target: "testbody"
});
```

此时`test1`和`test2`的aa-url都将被设为"demo1.html"，而`test3`由于已经在DOM属性中显示指定了aa-url，因此不会被全局设置影响。另外，`test1`、`test2`、`test3`的aa-target都将被设为"testbody"，它们的loadingbar将采用默认颜色，除了已经在DOM属性中指定aa-loadingbar-color的`test3`。至于`test4`，由于它没有在DOM中设置aa-url，所以不会被全局设置识别。

```javascript
$("#test2").attr("aa-url","demo2.html");
```

此时我们用jQuery给`test2`的aa-url属性赋值，根据优先级，`test2`的aa-url将不再被全局设置影响。

下面我们使用elem设置：

```javascript
air.ajaxify({
	elem: ".example",
	url: "demo4.html"
});
```

我们是用Class选择器来指定的，因此`test2`和`test3`都会被影响到，虽然它们已经被全局设置过，而且DOM属性没有被改变，但是它们的aa-url实质上已经被设为"demo4.html"。

```javascript
air.ajaxify({
	elem: "#test4",
	url: "demo5.html",
	target: "testbody"
});
```

现在我们用elem来绑定了`test4`，它的优先级显然是最高的。

**深入了解air-ajaxify的属性优先级可以帮助你灵活的应对各种场景。**

#### 继承与合并机制

`air-ajaxify`对属性设置采用了继承与合并的机制，这会让你使用起来感觉非常方便。

##### 继承

属性的继承顺序如下：

**默认设置 --> 全局设置 --> DOM属性 --> elem设置**

即后面的设置会继承自前面的设置，除非你进行了显式覆写。

让我们继续使用上一节“优先级”中的例子：

假设我们在用elem绑定`test4`时采用了下面这种方式：

```javascript
air.ajaxify({
	elem: "#test4"
});
```

你会发现我并没有指定url和target，但这不代表它不会正常工作，因为它的url和target会继承自之前的全局设置。

现在我们再为`test4`显式指定一个DOM属性：

```javascript
$("#test4").attr("aa-loadingbar-height","30px");
```

则`test4`的loadingbar高度将会继承自DOM设置，但其他设置仍继承自全局设置。

##### 合并

如果我们重复进行全局设置或elem设置，则后面的属性会合并到之前的设置中。

比如：

```javascript
air.ajaxify({
	url: "demo1.html",
	target: "testbody",
	loadingBar:{
		show: false
	},
	loadingContent:{
		html: "<img src='loading.gif'>",
		cssClass: "loading"
	}
});

air.ajaxify({
	url: "demo2.html",
	loadingContent:{
		cssClass: "loading-new"
	}
});
```

此时全局设置中的url和loading content的样式会变成后面设置的，但其余未被覆写的设置仍沿用前面的设置。

**注意：elem设置的合并是以elem的值作为唯一标识的**

举例：

```html
<div class="example" id="test1">test1<div>
<div class="example" id="test2">test2<div>
```

```javascript
air.ajaxify({
	elem: "#test1",
	url: "demo1.html",
	target: "testbody"
});

// 合并至test1
air.ajaxify({
	elem: "#test1",
	url: "demo2.html"
});

// 不会影响test1
air.ajaxify({
	elem: "#test2",
	url: "demo3.html"
});

// 虽然指向了test1和test2，但标识不对应，因此属性不会合并到它们中的任何一个，而是重新进行覆写。
air.ajaxify({
	elem: ".example",
	url: "demo4.html",
	target: "testbody"
});
```

#### AJAX状态控制

`options`中的一些属性可以根据AJAX请求的状态来执行操作。

对AJAX的状态控制采用回调函数的形式，比如：

```javascript
// 全局设置所有air-ajaxify请求的通用操作
air.ajaxify({
	render: function(){
		alert();	// 在加载成功并开始渲染页面时执行alert
	}
});

// 或者为某个elem单独指定操作
air.ajaxify({
	elem: "#test",
	render: function(){
		// do something
	}
});
```

某些回调函数也可以返回false来阻塞下一步的执行：

```javascript
air.ajaxify({
	render: function(){
		alert();
		return false;	// 在加载成功并开始渲染页面时执行此函数，但由于函数返回false，因此页面不会被渲染
	}
});
```

下面是详细说明：

* `prepare`:	在初始化AJAX请求前执行的操作，**如果返回false则不会发送AJAX请求**，如果返回其他值或无返回值则正常发送请求；
* `before`:	AJAX发送请求前的操作，相当于beforeSend，但无论返回什么都不会阻塞发送；
* `success`:	只要请求成功都会被执行的操作，顺序在render之前；
* `render`:	加载成功并准备渲染页面前的操作，**如果返回false则不会渲染页面**，如果返回其他值或无返回值则正常渲染页面；
* `afterRender`:	页面渲染成功后的操作，**如果设置了render的返回值为false，则afterRender不会被执行**；
* `error`:	AJAX请求出错时执行的操作，如果没有指定，则默认在aa-body中显示一段文字；
* `time`:		设置超时时间，默认15000，单位毫秒；
* `timeout`:	AJAX请求超时时执行的操作；
* `complete`:	无论出现何种情况，只要请求完成就会执行的操作。

**再次提醒：只有prepare和render在返回false时才会阻塞下一步操作。**

#### loadingFunction

尽管loadingContent已经让用户可以自定义加载动画，但我仍然希望给予用户更多选择，因此增加了loadingFunction属性。

你可以用回调函数的方式来设置loadingFunction：

```javascript
air.ajaxify({
	loadingFunction:{
		pre: function() {
			// 加载动画开始
		},
		after: function() {
			// 加载动画结束或销毁
		},
		show: true	// 是否显示
	}
});
```

你可以在pre和after的回调函数中做任何想做的事情，比如在HTML中事先写好loading的DOM对象，然后用pre和after来控制显示。

或许你觉得上一小节**AJAX状态控制**中的`before`和`complete`中也能做相同的事情，但谁也无法保证你在之后不会因为特殊需求而把`before`和`complete`给覆盖掉，因此使用专门的loadingFunction来做加载动画的控制将不会让你觉得束手束脚。

**注意事项：**

**1、pre的执行顺序在before之后，loadingContent和loadingBar开始之前；**

**2、after的执行顺序在loadingContent和loadingBar结束之后，timeout和complete之前；**

**3、loadingFunction、loadingContent和loadingBar三者都是不冲突的；**

**4、loadingFunction不提供在DOM属性上进行设置。**

#### 回调函数的默认参数

无论AJAX状态控制的回调函数，还是loadingFunction的回调函数，都会携带一些可选的参数。

所有的回调函数中的第一个参数默认都是options对象，里面包含了与本次请求对应的全部设置，例如：

```javascript
air.ajaxify({
	prepare: function(op){
		console.log(op);
		if(op.url == "demo.html")
			return false;		// 加载之前判断此次请求的url是不是demo.html，如果是则返回false，不发起请求。
	},
	after: function(op, XHR, status){
		// do something
	}
});
```

`prepare`, `before` 以及 `loadingFunction.pre` 中默认只携带options；

`success`, `render` ,`afterRender`, `error` 中第一个参数是options，第二个参数是data（即成功或出错返回的数据）；

`timeout`, `complete` 以及 `loadingFunction.after` 中第一个参数是options，第二个参数是XHR对象，第三个参数是status（即返回状态）。

### API

#### air.ajaxify.param(bodyname [, key])

如果你在url中指定了传递的参数，那么可以在你的aa-target指向的目标页面中使用此函数来获取url参数对象，此函数以aa-body的值作为标识（因为目标页面本身并不知道自己会加载到哪个aa-body里），返回的是JSON对象。你也可以传入可选参数key来获取指定的value。

举例：

home.html:
```html
<div aa-url="test.html?foo=abc&bar=3" aa-target="testbody1">test1<div>
<div aa-url="test.html?foo=def&bar=4" aa-target="testbody2">test2<div>

<div aa-body="testbody1"><div>
<div aa-body="testbody2"><div>
```

test.html:
```javascript
var param1 = air.ajaxify.param("testbody1");
console.log(param1);	// {foo:"abc",bar:"3"}

var bar = air.ajaxify.param("testbody2","bar");
console.log(bar);		// 4
```

#### air.ajaxify.setData(bodyname, content) 和 air.ajaxify.getData(bodyname)

这两个方法可以让你在body之间共享数据。用setData来保存数据，以bodyname（aa-body的值）作为标识，content可以传入任何形式的数据。在目标页面使用getData(bodyname)来获取数据。

**注意事项：**

**1、在同一页面中对同一bodyname使用setData将会进行覆盖；**

**2、不同页面中的同一bodyname的数据都会被保存，如果你使用`air.ajaxify.back(bodyname)`方法返回页面，你仍然可以正确获取到之前设置的数据。**

#### air.ajaxify.go(elem)

立即触发elem的AJAX请求，传入符合jQuery选择器规范的elem字符串作为参数，这个元素至少应该是air.ajaxify绑定的元素（无论以哪种形式绑定）。

**等同于V1.0.92版本之前的`air.ajaxify.send(elem)`。**

#### air.ajaxify.back(bodyname [, isNewRequest])

在指定aa-body中执行回退操作，返回之前的历史记录，可多次返回直到初始的页面，**所返回页面中的JS代码将会重新执行**。

为了增强灵活性，我在V1.0.94版本增加了一个可选参数`isNewRequest`，如果传入`true`，则代表你希望以重新发送请求的方式来获取上一张页面。传入其他值或不传值将会按默认的缓存方式来回退。

通常情况下我们不需要设置这个参数，默认的缓存模式已经可以满足大部分需求，不仅回退速度快，而且JS代码也会执行，如果你用AJAX请求来获取数据，那么回退后的页面数据也会进行更新。

但如果你是在服务端来渲染页面数据的（比如使用nodejs），并且希望回退时也更新数据，那么设置此参数是一个比较好的选择。

#### air.ajaxify.refresh(bodyname)

刷新指定的aa-body中的页面。

#### air.ajaxify.send([options])

这个方法的使用方式与主方法`air.ajaxify(options)`几乎一样，传入的options（可选）参数格式也没有任何区别。他们之间最大的不同在于，`send`方法可以直接按传递的参数发起请求，**而不必事先绑定任何元素**。

为方便使用，`send`方法中的属性设置将自动按`air-ajaxify`的属性继承顺序来进行继承，`send`方法设置的属性处于属性继承链的末端，即它始终继承自其他属性设置，因此它的属性优先级也最高。

在使用此方法时，会出现两种情况：

1、当你传入的options中没有`elem`属性时，`send`方法将按全局属性继承与合并。你甚至可以不传入options参数直接调用，`send`方法会直接按全局设置来发送请求；

2、当你传入`elem`属性时，`send`方法会优先寻找**匹配的elem设置及其对应的DOM属性**，如果存在，将按`air-ajaxify`的继承顺序，最终合并至`send`方法的属性中。如果不存在对应的elem，则按第1种情况处理。

可以发现，`send`方法是完全不受元素绑定的限制的，你可以在任何情况下使用它按需要发送请求。

**注意：**

**1、即使`send`方法没有约束，你也应该至少配置一个与`target`属性对应的`aa-body`盒子来接收页面，否则将什么都看不到；**

**2、`send`方法设置的属性将只会影响由它发送的请求，而不会对任何其他形式设置的属性进行覆盖。**

## air-js固有方法

为了方便大家的使用，任何隶属于`air-js`的工具都会有几个方便小巧的固有方法，无论你单独使用`air-ajaxify`、`air-validator`、`air-page`等等中的哪一个，你都可以用同样的方式调用它们。即使你同时使用所有的插件，它们也不会发生冲突。

### air.getParam([key])

获取当前**浏览器地址栏**中的url参数，有一个可选参数`key`。不传入`key`就返回key/value形式的JSON对象，传入`key`则直接获取对应value。

### air.isEmpty(arg)

判断传入的**值或对象**是否为空，如果参数是**空字符串、null、undefined、空对象或空数组**，则返回true。否则返回false。

这个方法与平常我们用“叹号`!`取反来判定空值”相比有两个优势：

1、它可以判定数组和对象是否为空；

2、叹号会将数字0判定为false，而此方法会正确识别数字0 。

### air.isMobile()

根据屏幕宽度来判断是不是手机用户，边界值为768像素。

### air.setRem()

这个方法可以根据屏幕宽度来计算`rem`单位的相对值，如果你准备开发移动端响应式页面，可以直接调用此方法，随后在CSS中以rem作为单位，则不论在何种宽度的屏幕上，你的样式都能够进行响应式的变化。

### air.rmspStr(str)

去掉字符串中的**所有**空格。
