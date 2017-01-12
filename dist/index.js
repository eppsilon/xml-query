"use strict";
var flatMap = function (arr, fn) {
    return Array.prototype.concat.apply([], arr.map(fn));
};
var xmlQuery = function (ast) {
    return new XmlQuery(ast);
};
var XmlQuery = (function () {
    function XmlQuery(ast) {
        this.nodes = Array.isArray(ast) ? ast : (ast ? [ast] : []);
        this.length = this.nodes.length;
    }
    XmlQuery.prototype.get = function (index) {
        return this.nodes[index];
    };
    XmlQuery.prototype.children = function () {
        return xmlQuery(flatMap(this.nodes, function (node) { return node.children; }));
    };
    XmlQuery.prototype.findInNode = function (node, sel) {
        var _this = this;
        var res = (node.name === sel) ? [node] : [];
        return res.concat(flatMap(node.children, function (node) { return _this.findInNode(node, sel); }));
    };
    XmlQuery.prototype.find = function (sel) {
        var _this = this;
        return xmlQuery(flatMap(this.nodes, function (node) { return _this.findInNode(node, sel); }));
    };
    XmlQuery.prototype.has = function (sel) {
        if (this.nodes.length === 0) {
            return false;
        }
        if (this.nodes.some(function (node) { return node.name === sel; })) {
            return true;
        }
        return this.children().has(sel);
    };
    XmlQuery.prototype.attr = function (name) {
        if (this.length) {
            var attrs = this.nodes[0].attributes;
            return name ? attrs[name] : attrs;
        }
    };
    XmlQuery.prototype.eq = function (index) {
        return xmlQuery(this.nodes[index]);
    };
    XmlQuery.prototype.first = function () {
        return this.eq(0);
    };
    XmlQuery.prototype.last = function () {
        return this.eq(this.length - 1);
    };
    XmlQuery.prototype.map = function (fn) {
        return this.nodes.map(fn);
    };
    XmlQuery.prototype.each = function (fn) {
        return this.nodes.forEach(fn);
    };
    XmlQuery.prototype.size = function () {
        return this.length;
    };
    XmlQuery.prototype.prop = function (name) {
        var node = this.get(0);
        if (node) {
            return node[name];
        }
    };
    XmlQuery.prototype.text = function () {
        var res = '';
        this.each(function (node) {
            if (node.type === 'text') {
                res += node.value;
            }
            else {
                res += xmlQuery(node).children().text();
            }
        });
        return res;
    };
    return XmlQuery;
}());
module.exports = xmlQuery;
