/*
 * Created by Marc Römmelt on 06.04.2019 | https://github.com/MarcRoemmelt/v-tilterino
 * Created from https://github.com/micku7zu/vanilla-tilt.js.
 * Original idea: https://github.com/gijsroge/tilt.js
 * MIT License.
 * Version 0.0.1
 */

class Tilterino {
  constructor(element, settings = {}) {
    if (!(element instanceof Node)) {
      throw "Can't initialize Tilterino because " + element + " is not a Node.";
    }

    this.width = null;
    this.height = null;
    this.left = null;
    this.top = null;
    this.transitionTimeout = null;
    this.updateCall = null;
    this.mouseDown = false;

    this.updateBind = this.update.bind(this);
    this.resetBind = this.reset.bind(this);

    this.element = element;
    this.settings = this.extendSettings(settings);
    this.elementListener = this.getElementListener();

    this.reverse = this.settings.reverse ? -1 : 1;

    this.gyroscope = this.isSettingTrue(this.settings.gyroscope);

    this.addEventListeners();
  }

  isSettingTrue(setting) {
    return setting === "" || setting === true || setting === 1;
  }

  getElementListener() {
    if (!this.settings || !this.settings["mouse-event-element"]) {
      return this.element;
    }

    if (typeof this.settings["mouse-event-element"] === "string") {
      const mouseEventElement = document.querySelector(
        this.settings["mouse-event-element"]
      );

      if (mouseEventElement) {
        return mouseEventElement;
      }
    }

    if (this.settings["mouse-event-element"] instanceof Node) {
      return this.settings["mouse-event-element"];
    }
  }

  addEventListeners() {
    this.onMouseEnterBind = this.onMouseEnter.bind(this);
    this.onMouseMoveBind = this.onMouseMove.bind(this);
    this.onMouseLeaveBind = this.onMouseLeave.bind(this);
    this.onDeviceOrientationBind = this.onDeviceOrientation.bind(this);

    this.onMouseDownBind = this.onMouseDown.bind(this);
    this.onMouseUpBind = this.onMouseUp.bind(this);


    this.elementListener.addEventListener("mouseenter", this.onMouseEnterBind);
    this.elementListener.addEventListener("mousemove", this.onMouseMoveBind);
    this.elementListener.addEventListener("mouseleave", this.onMouseLeaveBind);

    this.elementListener.addEventListener("mousedown", this.onMouseDownBind);
    this.elementListener.addEventListener("mouseup", this.onMouseUpBind);

    if (this.gyroscope) {
      window.addEventListener(
        "deviceorientation",
        this.onDeviceOrientationBind
      );
    }
  }

  removeEventListeners() {
    this.elementListener.removeEventListener(
      "mouseenter",
      this.onMouseEnterBind
    );
    this.elementListener.removeEventListener("mousemove", this.onMouseMoveBind);
    this.elementListener.removeEventListener(
      "mouseleave",
      this.onMouseLeaveBind
    );
    this.elementListener.removeEventListener("mousedown", this.onMouseDownBind);
    this.elementListener.removeEventListener("mouseup", this.onMouseUpBind);

    if (this.gyroscope) {
      window.removeEventListener(
        "deviceorientation",
        this.onDeviceOrientationBind
      );
    }
  }

  destroy() {
    clearTimeout(this.transitionTimeout);
    if (this.updateCall !== null) {
      cancelAnimationFrame(this.updateCall);
    }

    this.reset();
    this.removeEventListeners();
    this.element.tilterino = null;
    delete this.element.tilterino;

    this.element = null;
  }

  onDeviceOrientation(event) {
    if (event.gamma === null || event.beta === null) {
      return;
    }

    this.updateElementPosition();

    const totalAngleX =
      this.settings.gyroscopeMaxAngleX - this.settings.gyroscopeMinAngleX;
    const totalAngleY =
      this.settings.gyroscopeMaxAngleY - this.settings.gyroscopeMinAngleY;

    const degreesPerPixelX = totalAngleX / this.width;
    const degreesPerPixelY = totalAngleY / this.height;

    const angleX = event.gamma - this.settings.gyroscopeMinAngleX;
    const angleY = event.beta - this.settings.gyroscopeMinAngleY;

    const posX = angleX / degreesPerPixelX;
    const posY = angleY / degreesPerPixelY;

    if (this.updateCall !== null) {
      cancelAnimationFrame(this.updateCall);
    }

    this.event = {
      clientX: posX + this.left,
      clientY: posY + this.top
    };

    this.updateCall = requestAnimationFrame(this.updateBind);
  }

  onMouseEnter() {
    this.updateElementPosition();
    this.element.style.willChange = "transform";
    this.setTransition();
  }

  onMouseDown(){
    this.mouseDown = true;
    if (this.updateCall !== null) {
      cancelAnimationFrame(this.updateCall);
    }
    this.event = event;
    this.updateCall = requestAnimationFrame(this.updateBind);
  }
  onMouseUp(){
    this.mouseDown = false;
    if (this.updateCall !== null) {
      cancelAnimationFrame(this.updateCall);
    }

    this.event = event;
    this.updateCall = requestAnimationFrame(this.updateBind);
  }

  onMouseMove(event) {
    if (this.updateCall !== null) {
      cancelAnimationFrame(this.updateCall);
    }

    this.event = event;
    this.updateCall = requestAnimationFrame(this.updateBind);
  }

  onMouseLeave() {
    this.setTransition();
    this.mouseDown = false;
    if (this.settings.reset) {
      requestAnimationFrame(this.resetBind);
    }
  }

  reset() {
    this.event = {
      pageX: this.left + this.width / 2,
      pageY: this.top + this.height / 2
    };

    if (this.element && this.element.style) {
      this.element.style.transform =
        `perspective(${this.settings.perspective}px) ` +
        `rotateX(0deg) ` +
        `rotateY(0deg) ` +
        `scale3d(1, 1, 1) ` +
        `translate(0px, 0px)`;
    }
  }

  getValues() {
    let x = (this.event.clientX - this.left) / this.width;
    let y = (this.event.clientY - this.top) / this.height;
    let max = this.settings.max;
    if(this.mouseDown){
      max = max*2;
    }

    x = Math.min(Math.max(x, 0), 1);
    y = Math.min(Math.max(y, 0), 1);

    let tiltX = (
      this.reverse * -(max / 2 - x * max)
    ).toFixed(2);
    let tiltY = (
      this.reverse * -(y * max - max / 2)
    ).toFixed(2);
    let angle =
      Math.atan2(
        this.event.clientX - (this.left + this.width / 2),
        -(this.event.clientY - (this.top + this.height / 2))
      ) *
      (180 / Math.PI);

    return {
      tiltX: tiltX,
      tiltY: tiltY,
      percentageX: x * 100,
      percentageY: y * 100,
      angle: angle
    };
  }

  updateElementPosition() {
    let rect = this.element.getBoundingClientRect();

    this.width = this.element.offsetWidth;
    this.height = this.element.offsetHeight;
    this.left = rect.left;
    this.top = rect.top;
  }

  update() {
    let values = this.getValues();

    let translate = "translate(0,0)";
    this.element.style.transform =
      "perspective(" +
      this.settings.perspective +
      "px) " +
      "rotateX(" +
      (this.settings.axis === "x" ? 0 : values.tiltY) +
      "deg) " +
      "rotateY(" +
      (this.settings.axis === "y" ? 0 : values.tiltX) +
      "deg) " +
      "scale3d(" +
      this.settings.scale +
      ", " +
      this.settings.scale +
      ", " +
      this.settings.scale +
      ")";

    this.element.dispatchEvent(
      new CustomEvent("tiltChange", {
        detail: values
      })
    );

    this.updateCall = null;
  }

  setTransition() {
    clearTimeout(this.transitionTimeout);
    this.element.style.transition =
      this.settings.speed + "ms " + this.settings.easing;

    this.transitionTimeout = setTimeout(() => {
      this.element.style.transition = "";
    }, this.settings.speed);
  }

  extendSettings(settings) {
    let defaultSettings = {
      reverse: false,
      max: 10,
      perspective: 1000,
      easing: "cubic-bezier(.03,.98,.52,.99)",
      scale: 1,
      speed: 300,
      transition: true,
      axis: null,
      "mouse-event-element": null,
      reset: true,
      gyroscope: false,
      gyroscopeMinAngleX: -25,
      gyroscopeMaxAngleX: 25,
      gyroscopeMinAngleY: -25,
      gyroscopeMaxAngleY: 25
    };
    const keys = Object.keys(defaultSettings);

    let newSettings = {};
    for (var i = keys.length; i--; ) {
      if (keys[i] in settings) {
        newSettings[keys[i]] = settings[keys[i]];
      } else if (this.element.hasAttribute("data-tilt-" + keys[i])) {
        let attribute = this.element.getAttribute("data-tilt-" + keys[i]);
        try {
          newSettings[keys[i]] = JSON.parse(attribute);
        } catch (e) {
          newSettings[keys[i]] = attribute;
        }
      } else {
        newSettings[keys[i]] = defaultSettings[keys[i]];
      }
    }

    return newSettings;
  }
}

export default {
  install(Vue, installOptions) {
    Vue.directive("tilt", {
      inserted(el) {
        el.tilterino = new Tilterino(el, installOptions);
      },

      unbind(el) {
        el.tilterino.destroy();
      }
    });
  }
};
