/* Copyright (c) 2011, Gilles Bassière. Published under the Modified BSD license.
 * See LICENSE.txt for the full text of the license. */

/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.SelectBaseLayer
 * This panel will display a button for each base layer allowing to switch easily beetween them.
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.SelectBaseLayer = OpenLayers.Class(OpenLayers.Control, {
    /**
     * Method: setMap
     *
     * Parameters:
     * map - {<OpenLayers.Map>}
     */
    setMap: function(map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);

        this.map.events.on({
            "addlayer": this.onAddLayer,
            "removelayer": this.onRemoveLayer,
            "changebaselayer": this.onChangeBaseLayer,
            scope: this
        });
    },

    /**
     * Returns the button id computed from the layer id
     */
    _makeButtonId: function(layer) {
        var lId = layer.id.replace('OpenLayers.', 'ol').replace(/\./g, '');
        return 'selectBaseLayerButton_'+lId;
    },

    /**
     * Actually add the base layer button to the selector
     */
    _addBaseLayer: function(layer) {
        if (layer.isBaseLayer) {
            var btn = document.createElement("div");
            btn.innerHTML = layer.name;
            btn.id = this._makeButtonId(layer);
            if (this.map.baseLayer == layer) {
                OpenLayers.Element.addClass(btn, 'active');
            }
            var context = {
                'layer': layer,
                'map': this.map
            };
            OpenLayers.Event.observe(btn, 'click',
                OpenLayers.Function.bindAsEventListener(
                    this.onClick, context));
            OpenLayers.Event.observe(btn, 'dblclick',
                OpenLayers.Function.bindAsEventListener(
                    this.onClick, context));
            OpenLayers.Event.observe(btn, 'mousedown',
                OpenLayers.Function.bindAsEventListener(
                    this.onMouseDown, this));
            OpenLayers.Event.observe(btn, 'mouseup',
                OpenLayers.Function.bindAsEventListener(
                    this.onMouseUp, this));
            this.div.appendChild(btn);
        }
    },

    /**
     * Remove base layer button and its event handler
     */
    _removeBaseLayer: function(layer) {
        if (layer.isBaseLayer) {
            var elt = $(this._makeButtonId(layer));
            OpenLayers.Event.stopObservingElement(elt);
            this.div.removeChild(elt);
        }
    },

    /**
     * Method: draw
     *
     * Returns:
     * {DOMElement} A reference to the DIV DOMElement containing the basemap selector
     */
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);

        for (var i=0; i<this.map.layers.length; i++) {
            this._addBaseLayer(this.map.layers[i]);
        }

        return this.div;
    },

    /**
     * Method: destroy
     */
    destroy: function() {
        for (var i=0; i<this.map.layers.length; i++) {
            this._removeBaseLayer(this.map.layers[i]);
        }
        this.map.events.un({
            "addlayer": this.onAddLayer,
            "removelayer": this.onRemoveLayer,
            "changebaselayer": this.onChangeBaseLayer,
            scope: this
        });
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },

    /**
     * Method: onClick
     * Handles click on the the base layer selector buttons
     *
     * Parameters:
     * e - {Event}
     *
     * Context:
     * map - {<OpenLayers.Map>} The main map object
     * layer - {<OpenLayers.Layer>} The new base layer
     */
    onClick: function(e) {
        this.map.setBaseLayer(this.layer);
        OpenLayers.Event.stop(evt);
    },

    /**
     * Method: mouseDown
     * Register a local 'mouseDown' flag so that we'll know whether or not to ignore a mouseUp event
     *
     * Parameters:
     * e - {Event}
     */
    onMouseDown: function(e) {
        this.isMouseDown = true;
        OpenLayers.Event.stop(e);
    },
    /**
     * Method: mouseUp
     * If the 'isMouseDown' flag has been set, that means that the drag was started from within this control, and thus we can ignore the mouseup. Otherwise, let the Event continue.
     *
     * Parameters:
     * e - {Event}
     */
    onMouseUp: function(e) {
        if (this.isMouseDown) {
            this.isMouseDown = false;
            OpenLayers.Event.stop(e);
        }
    },

    /**
     * Method: onAddLayer
     * Update the base layer selector when a base layer is added to the map
     *
     * Parameters:
     * e - {Event}
     *
     * Context:
     *  - {<OpenLayers.Control.SelectBaseLayer>} The control instance
     */
    onAddLayer: function(e) {
        this._addBaseLayer(e.layer);
    },

    /**
     * Method: onRemoveLayer
     * Update the base layer selector when a base layer is removed from the map
     *
     * Parameters:
     * e - {Event}
     *
     * Context:
     *  - {<OpenLayers.Control.SelectBaseLayer>} The control instance
     */
    onRemoveLayer: function(e) {
        this._removeBaseLayer(e.layer);
    },

    /**
     * Method: onChangeBaseLayer
     * Update the base layer selector when the map changes its base layer
     *
     * Parameters:
     * e - {Event}
     *
     * Context:
     *  - {<OpenLayers.Control.SelectBaseLayer>} The control instance
     */
    onChangeBaseLayer: function(e) {
        var btnId = this._makeButtonId(e.layer);
        for (var i=0; i<this.div.childNodes.length; i++) {
            var elt = this.div.childNodes[i];
            if (elt.nodeType == 1) {
                if (elt.id == btnId) {
                    OpenLayers.Element.addClass(elt, 'active');
                } else {
                    OpenLayers.Element.removeClass(elt, 'active');
                }
            }
        }
    },

    CLASS_NAME: "OpenLayers.Control.SelectBaseLayer"
});
