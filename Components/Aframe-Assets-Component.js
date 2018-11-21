!function(t) {
    function e(a) {
        if (s[a])
            return s[a].exports;
        var i = s[a] = {
            exports: {},
            id: a,
            loaded: !1
        };
        return t[a].call(i.exports, i, i.exports, e),
        i.loaded = !0,
        i.exports
    }
    var s = {};
    return e.m = t,
    e.c = s,
    e.p = "",
    e(0)
}([function(t, e) {
    if ("undefined" == typeof AFRAME)
        throw new Error("Component attempted to register before AFRAME was available.");
    AFRAME.registerComponent("asset-on-demand", {
        schema: {
            src: {
                default: "",
                type: "string"
            },
            type: {
                default: "img",
                oneOf: ["img", "audio", "video"]
            },
            attributes: {
                default: "",
                parse: function(t) {
                    return t.split(",").map(function(t) {
                        return t.split(":")
                    })
                }
            },
            component: {
                default: "material",
                type: "string"
            },
            componentattr: {
                default: "",
                parse: function(t) {
                    var e = null;
                    if ("" != t) {
                        var s = t.split(",");
                        e = s && s.length > 0 ? {} : null;
                        for (var a = 0; a < s.length; a++) {
                            var i = s[a].split(":");
                            e[i[0]] = i[1]
                        }
                    }
                    return e
                }
            },
            assetattr: {
                default: "src",
                type: "string"
            },
            fallback: {
                default: "",
                type: "asset"
            },
            addevent: {
                default: "play",
                type: "array"
            },
            removeevent: {
                default: "pause",
                type: "array"
            },
            softmode: {
                default: !1,
                type: "boolean"
            }
        },
        multiple: !1,
        init: function() {
            this.attachAsset = this.attachAsset.bind(this),
            this.detachAsset = this.detachAsset.bind(this),
            this.reloadAsset = this.reloadAsset.bind(this),
            this.loadAsset = this.loadAsset.bind(this),
            this.assetID = this.guid();
            var t = document.querySelector("a-assets")
              , e = document.createElement(this.data.type);
            if (this.assetElement = t.appendChild(e),
            this.data.attributes && "" != this.data.attributes && this.data.attributes.length > 0)
                for (var s = 0; s < this.data.attributes.length; s++)
                    this.assetElement.setAttribute(this.data.attributes[s][0], this.data.attributes[s][1]);
            this.assetElement.setAttribute("id", this.assetID)
        },
        update: function(t) {
            this.componentObj = {},
            this.data.componentattr && (this.componentObj = this.data.componentattr),
            t && t.addevent && t.removeevent && this.removeEventListeners(t),
            this.addEventListeners(),
            this.attachDefault(),
            this.data.softmode && this.assetElement.setAttribute("src", this.data.src)
        },
        addEventListeners: function() {
            for (var t = 0; t < this.data.addevent.length; t++)
                this.el.addEventListener(this.data.addevent[t], this.loadAsset);
            for (var t = 0; t < this.data.removeevent.length; t++)
                this.el.addEventListener(this.data.removeevent[t], this.detachAsset)
        },
        removeEventListeners: function(t) {
            for (var e = 0; e < t.addevent.length; e++)
                this.el.removeEventListener(t.addevent[e], this.loadAsset);
            for (var e = 0; e < t.removeevent.length; e++)
                this.el.removeEventListener(t.removeevent[e], this.detachAsset)
        },
        remove: function() {
            for (var t = 0; t < this.data.addevent.length; t++)
                this.el.removeEventListener(this.data.addevent[t], this.loadAsset);
            for (var t = 0; t < this.data.removeevent.length; t++)
                this.el.removeEventListener(this.data.removeevent[t], this.detachAsset)
        },
        loadAsset: function() {
            this.data.softmode || this.assetElement.setAttribute("src", this.data.src),
            this.assetElement.complete ? this.attachAsset() : (this.assetElement.addEventListener("load", this.attachAsset),
            this.assetElement.addEventListener("error", this.reloadAsset))
        },
        attachAsset: function() {
            this.componentObj[this.data.assetattr] = "#" + this.assetID,
            this.attach()
        },
        detachAsset: function() {
            this.assetElement && !this.data.softmode && (this.assetElement.removeEventListener("load", this.attachAsset),
            this.assetElement.removeEventListener("error", this.reloadAsset),
            this.assetElement.setAttribute("src", "")),
            this.el.object3DMap.mesh.material.map && this.el.object3DMap.mesh.material.map.dispose(),
            this.attachDefault()
        },
        attachDefault: function() {
            "" != this.data.fallback && (this.componentObj[this.data.assetattr] = this.data.fallback),
            this.attach()
        },
        attach: function() {
            this.componentObj && Object.keys(this.componentObj).length > 0 && AFRAME.utils.entity.setComponentProperty(this.el, this.data.component, this.componentObj)
        },
        reloadAsset: function() {
            this.detachAsset(),
            window.setTimeout(this.loadAsset, 1e3)
        },
        guid: function() {
            return "a" + this.guidPart() + this.guidPart() + "-" + this.guidPart() + "-" + this.guidPart() + "-" + this.guidPart() + "-" + this.guidPart() + this.guidPart() + this.guidPart()
        },
        guidPart: function() {
            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
        }
    })
}
]);
