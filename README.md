# SSA - Simple Scroll Animation

This Library lets you simply add any animation based on the scroll position of an element.
It's just the basics and nothing more complex, so the minified version is **only 3kB** big. 


## Installation
To use this library in your project just download `ssa.js` or the minified version `ssa-min.js` from the /dist directory and include it in your project.


## Sample Project
In the examples folder is a sample project to show you how it works and what you can do with the library. 
Just clone this repository and open up the `index.html`.


## Usage
To add an animation to an element you have to give it an ID. 
The `createAnimation()` function creates an animation object of your element. You can start the animation by calling the `start()` function of the animation object.

```javascript
Scroll.createAnimation(elementId, style, endValues, endOffset, startValues, startOffset, unit).start();
```
The elementId and style must be provided. The rest of the arguments are optional.

| Argument      | Description   | Type  |  Default |
|:-------------:|:-------------:|:-----:|:-----:|
| elementId     | The Id of the element (without #)| String | No default |
| style         | Object with the css property and a valueMapper |  Object `{property: String, valueMapper: function}` | No default |
| endValues     | Numbers in an array that represent the value at the end of the animation |    Array(Numbers)| [0]
| endOffset     | Offset from the bottom of the viewport where the animation should end (in percent 0-1)      |    Number | 1
| startValues   | Numbers in an array that represent the value at the start of the animation     |    Array(Numbers) | [0]
| startOffset   | Offset from the bottom of the viewport where the animation should start (in percent 0-1)     |    Number | 0
| unit          | The unit that is used (px, em, %)|    String | px


### Style
The style defines what css property gets changed. 

 ```javascript
 {
    property: 'string', 
    valueMapper: 'function'
}
 ```
 
 The property is used to change the style object of an node. It has to be lower camel case f.e. BackgroundColor, borderRadius, ...
 
 The value mapper is a function that returns the value. The mapper gets the values and the unit as an argument.
  
  For example: 
  
  ```javascript
{
    property: "transform",
    valueMapper: function(vals, unit){
        return `rotate(${vals[0] + unit})`  
    }
}

{
    property: "transform",
    valueMapper: function(vals, unit){
        return `scaleX(${val[0]}) translateX(${vals[1] + unit})`  
    }
}
  ```
  
### Offset
The offset is the distance in percent from the bottom of the viewport to the top of the element.

0 -> 0% and 1 -> 100%. 

F.e. you set startOffset to 0, than the element starts to animate after the element is shown on the screen. When you set endOffset to 1 the animation stops after the top of the
element passes the top of the viewport.


### Predefined Animations
There are several predefined animations so you don't have to write every time a style. This functions take the same arguments as `createAnimation()` except it doesn't take a style and the **values don't have to be an array**.

```javascript
Scroll.width(elementId, endValue, endOffset, startValue, startOffset, unit)
Scroll.height(...)
Scroll.opacity(...)
Scroll.bottom(...)
Scroll.top(...)
Scroll.left(...)
Scroll.right(...)
Scroll.rotate(...)
Scroll.scale(...)
Scroll.scaleX(...)
Scroll.scaleY(...)
Scroll.translateX(...)
Scroll.translateY(...)
```

You can set different animations on the same element, as long the property is not overridden, like it is the case with scale and translate. 
In that case you have to write your own mapper function with two values.


```javascript
Scroll.opacity("element", 1, 0.5).start();
Scroll.rotate("element", 180).start();
```


### Extra
Unit and the start/end points can be set through an setter on the animation object which returns it self.

```javascript
Scroll.opacity("element")
    .setStart({value: 0.5, offset: 0.1})
    .setEnd({value: 1, offset: 0.9})
    .start();
```

## Author
* Quentin Wendegass - [Homepage](https://www.wendegass.com)

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details




  
  
  
  
  
  
  



    


