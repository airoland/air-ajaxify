# air-ajaxify

A.I.R AJAX request for html, with loadingbar and custom options.

Author: A.I.Roland

作者：张英磊

License: MIT

使用者须保留文件中的作者版权信息

Version: 1.0.9

**Notice: jQuery is neccessary.**

# 中文文档 (English documentation will come soon.)

## 简介

`air-ajaxify`是一个封装好的，用AJAX请求网页内容的工具，它简化了请求方式，并且自带loadingbar（CSS3加载动画）。

`air-ajaxify`可以让你用最简单的方式体验到模块化组件开发的乐趣，它轻量而小巧，在良好使用的情况下可以达到类似SPA（单页应用）的效果，同时相比于其他框架几乎不需要任何学习成本。

如果你正为了做SPA而准备学习某种框架，那么`air-ajaxify`将为你提供一个好的开始。

**注意：本工具依赖于jQuery，以后会考虑推出原生JS的版本。**

## 开源说明

目前正在V1.0.x迭代中，最新的V1.0.9版本功能已经完备，但代码还有可以优化和精简的地方，因此暂不开源，只提供压缩版本（在dist目录下）。待版本更新到V1.1.0优化完毕以后会全面开源。

## 使用教程

`air-ajaxify`可使用两种方式（Javascript和DOM属性）来进行设置。

### 快速入门

一个最简单的使用air-ajaxify的方式如下：

在HTML中：

```html
<a href="javascript:;" aa-url="test.html" aa-target="test">test</a>
<div aa-body="test"></div>
```

随后在页面底部引入`air-ajaxify.min.js`即可

`air-ajaxify`会在页面加载时进行初始化，当我们点击`a`标签后，会把`test.html`的内容加载到下方的`div`盒子中，并且加载过程中会在页面顶部显示一条从左至右的loadingbar（采用CSS3动画）。

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

#### AJAX状态操作

`options`中的一些属性可以根据AJAX请求的状态来执行操作。

你可以传入一段可执行的Javascript代码，比如：

```javascript
// 全局设置所有air-ajaxify请求的通用操作
air.ajaxify({
	render: "alert()"	// 在加载成功并开始渲染页面时执行alert
});

// 或者为某个elem单独指定操作
air.ajaxify({
	elem: "#test",
	render: "alert(3)"
});
```

也可以像这样：

```javascript
air.ajaxify({
	render: "foo()"	// 在加载成功并开始渲染页面时执行foo函数，但由于函数返回false，因此页面不会被渲染
});

function foo(){
	alert();
	return false;
}
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

**注意：对同一bodyname使用setData将会进行覆盖。**

#### air.ajaxify.send(elem)

立即发送AJAX请求，传入符合jQuery选择器规范的elem字符串作为参数，这个元素至少应该是air.ajaxify绑定的元素（无论以哪种形式绑定）。

#### air.ajaxify.refresh(bodyname)

刷新指定的aa-body中的页面。

#### air.ajaxify.back(bodyname)

在指定aa-body中执行回退操作，返回之前的历史记录，可多次返回直到初始的页面。
