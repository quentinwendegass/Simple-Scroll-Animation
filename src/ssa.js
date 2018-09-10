let Scroll = (function (window) {

    if(!window){
        throw new Error("This library can only be used in an environment where a window with a document is present!");
    }

    // Height of the window viewport without scrollbar
    let clientHeight = window.document.documentElement.clientHeight;

    // Array of Objects that are animated during scroll
    let animationObjects = [];

    // Exception for AnimationObject
    let WrongArgumentsException = function(message) {
        this.message = message;
        this.name = "WrongArgumentException";
    };


    // Helper function to create the mapper
    let mapperFuncBuilder = function(prefix, unit){
        let preVal = "";
        let postVal = "";
        let isUnit = unit;

        if(prefix){
            preVal = prefix + "(";
            postVal += ")";
        }

        return function (vals, unit) {
            if(isUnit){
                return preVal + vals[0] + unit + postVal;
            }else{
                return preVal + vals[0] + postVal;
            }
        };
    };

    // Predefined mapper functions
    let mapper = {
        rotate: mapperFuncBuilder("rotate", true),
        translateX: mapperFuncBuilder("translateX", true),
        translateY: mapperFuncBuilder("translateY", true),
        scale: mapperFuncBuilder("scale", false),
        scaleX: mapperFuncBuilder("scaleX", false),
        scaleY: mapperFuncBuilder("scaleY", false),
        default: mapperFuncBuilder(false, false),
        defaultWithUnit: mapperFuncBuilder(false, true),
    };


    // Helper function to create the different constructor functions with different styles
    let animationFuncBuilder = function(style){
        return function (elementId, endValue, endOffset, startValue, startOffset, unit) {
            endValue = endValue ? [endValue] : null;
            startValue = startValue ? [startValue] : null;

            return new AnimationObject(elementId, style, endValue, endOffset, startValue, startOffset, unit);
        };
    };

    // Predefined constructor functions for different style animations
    let rotateAnimation = animationFuncBuilder({property: "transform", valueMapper: mapper.rotate});
    let opacityAnimation = animationFuncBuilder({property: "opacity", valueMapper: mapper.default});
    let translateXAnimation = animationFuncBuilder({property: "transform", valueMapper: mapper.translateX});
    let translateYAnimation = animationFuncBuilder({property: "transform", valueMapper: mapper.translateY});
    let scaleAnimation = animationFuncBuilder({property: "transform", valueMapper: mapper.scale});
    let scaleXAnimation = animationFuncBuilder({property: "transform", valueMapper: mapper.scaleX});
    let scaleYAnimation = animationFuncBuilder({property: "transform", valueMapper: mapper.scaleY});
    let topAnimation = animationFuncBuilder({property: "top", valueMapper: mapper.defaultWithUnit});
    let bottomAnimation = animationFuncBuilder({property: "bottom", valueMapper: mapper.defaultWithUnit});
    let leftAnimation = animationFuncBuilder({property: "left", valueMapper: mapper.defaultWithUnit});
    let rightAnimation = animationFuncBuilder({property: "right", valueMapper: mapper.defaultWithUnit});
    let widthAnimation = animationFuncBuilder({property: "width", valueMapper: mapper.defaultWithUnit});
    let heightAnimation = animationFuncBuilder({property: "height", valueMapper: mapper.defaultWithUnit});



    // Constructor for creating an animation object,
    // throws an error if elementId or style is not given
    // and sets default values to not defined arguments
    // End and start offset must be a float number that sets the offset in percentage from the bottom of the viewport (0 is 0% and 1 is 100% from to bottom).
    // The end and start values must be a numeric type.
    // Unit is default set to px, but can be changed f.e. to em or %
    let AnimationObject = function(elementId, style, endValues, endOffset, startValues, startOffset, unit){

        // The function will throw an Error if there is not an element id and a style passed
        if(arguments.length < 2) throw new WrongArgumentsException("Not enough arguments provided!");

        if(typeof elementId !== "string"){
            throw new WrongArgumentsException("First argument must be a string!");
        }

        // A style is a object with "property" and "valueMapper" as properties that describes the css
        // The property has to exist in the element.style object
        if(!("property" in style) || !("valueMapper" in style)){
            throw new WrongArgumentsException("Wrong style argument!");
        }

        // Values must be an array of numbers.
        endValues = endValues || [0];
        startValues = startValues || Array.apply(null, Array(endValues.length)).map(function () { return 0; });

        if(!Array.isArray(endValues) || !Array.isArray(startValues)){
            throw new WrongArgumentsException("Start and end values must be an array!");
        }

        // Dom element that should be animated
        this.element = window.document.getElementById(elementId);

        // Start state of the animation
        this.startPoint = {
            // Setting the default values if the values is undefined (falsy).
            offset: startOffset || 0,
            values: startValues
        };

        // End state of the animation
        this.endPoint = {
            // Setting the default values if the values is undefined (falsy).
            offset: endOffset || 1,
            values: endValues
        };

        // Unit is default set to px
        this.unit = unit || "px";

        // Defines witch property should be animated. Must be defined.
        this.style = style;
    };

    // Function that is called when the page is scrolling
    AnimationObject.prototype.animate = function () {

        //Set element style to start value to have the same bounding box every frame
        this.element.style[this.style.property] = this.style.valueMapper(this.startPoint.values, this.unit);

        // Offset converted to px
        let startOffset = this.startPoint.offset * clientHeight;
        let endOffset = this.endPoint.offset * clientHeight;

        // Bottom is the height from the bottom of the viewport to the element top
        let bottom = clientHeight - this.element.getBoundingClientRect().y;

        // Set the style of the element
        if(bottom > startOffset && bottom < endOffset){

            // Sets the progress based on the scroll height of the element
            let progress = (bottom - startOffset) / (endOffset - startOffset);

            // The values of the style based on the progress
            let values = this.startPoint.values.map(function (val, index) {
                return val + progress * (this.endPoint.values[index] - val);
            }.bind(this));

            this.element.style[this.style.property] = this.style.valueMapper(values, this.unit);
        }else if(bottom < startOffset){
            this.element.style[this.style.property] = this.style.valueMapper(this.startPoint.values, this.unit);
        }else if(bottom > endOffset){
            this.element.style[this.style.property] = this.style.valueMapper(this.endPoint.values, this.unit);
        }
    };

    // Setter for unit. Returns this object
    AnimationObject.prototype.setUnit = function(unit){
        if (!unit || typeof unit !== "string"){
            throw new WrongArgumentsException("Unit is not a valid type!");
        }
        this.unit = unit;
        return this;
    };

    // Setter for start point with checking
    AnimationObject.prototype.setStart = function(startObj){
        checkStartEndObj(startObj);
        this.startPoint = startObj;
        return this;
    };

    // Setter for end point with checking
    AnimationObject.prototype.setEnd = function(endObj){
        checkStartEndObj(endObj);
        this.endPoint = endObj;
        return this;
    };

    // Adds the animation object to the list that is animated on scroll
    AnimationObject.prototype.start = function () {
        animationObjects.push(this);
    };


    // Type checking of the start and end object
    function checkStartEndObj(obj){
        if (!("values" in obj) || !("offset" in obj)){
            throw new WrongArgumentsException("Argument must be a object with 'values' and 'offset' as properties!");
        }

        if (!Array.isArray(obj.values)){
            throw new WrongArgumentsException("Values must be an array of numbers!");
        }
    }

    // Animates all objects that are in the animationObjects list.
    // For adding one start() on the object should be called
    window.document.addEventListener("scroll", function () {
        animationObjects.forEach(function (obj) {
            obj.animate();
        });
    });


    // Set new viewport height if the window is resizing
    window.addEventListener("resize", function () {
        clientHeight = window.document.documentElement.clientHeight;
    });


    // Export functions that should be available in the namespace object
    return {
        AnimationObject: AnimationObject,
        rotate: rotateAnimation,
        opacity: opacityAnimation,
        translateX: translateXAnimation,
        translateY: translateYAnimation,
        scale: scaleAnimation,
        scaleX: scaleXAnimation,
        scaleY: scaleYAnimation,
        top: topAnimation,
        bottom: bottomAnimation,
        left: leftAnimation,
        right: rightAnimation,
        width: widthAnimation,
        height: heightAnimation
    };
})(typeof window !== "undefined" ? window : null);