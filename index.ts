/*!
 * XML-Query
 * Copyright (c) 2016 Pedro Ladaria
 * https://github.com/pladaria/xml-query
 * MIT Licensed
 */
const flatMap = (arr: any[], fn: (v: any, i: number, a: any[]) => any) =>
    Array.prototype.concat.apply([], arr.map(fn));

const xmlQuery = (ast: xmlQuery.XmlNode | xmlQuery.XmlNode[]): xmlQuery.XmlQuery => {
    return new XmlQuery(ast);
}

class XmlQuery implements xmlQuery.XmlQuery {
    private nodes: xmlQuery.XmlNode[];
    private length: number;

    constructor(ast: xmlQuery.XmlNode | xmlQuery.XmlNode[]) {
        this.nodes = Array.isArray(ast) ? ast : (ast ? [ast] : []);
        this.length = this.nodes.length;
    }

    /**
     * Retrieve one of the elements
     */
    get(index: number) {
        return this.nodes[index];
    }

    /**
     * Returns a new xmlQuery object containing the children of the top level elements
     */
    children() {
        return xmlQuery(flatMap(this.nodes, (node) => node.children));
    }

    /**
     * Recursively find by name starting in the provided node
     */
    findInNode(node: xmlQuery.XmlNode, sel: string) {
        const res = (node.name === sel) ? [node] : [];
        return res.concat(flatMap(node.children, (node) => this.findInNode(node, sel)));
    }

    /**
     * Find by name. Including top level nodes and all its children.
     */
    find(sel: string) {
        return xmlQuery(flatMap(this.nodes, (node) => this.findInNode(node, sel)));
    }

    /**
     * Returns true if it has the given element. Faster than find because it stops on first occurence.
     */
    has(sel: string) {
        if (this.nodes.length === 0) {
            return false;
        }
        if (this.nodes.some((node) => node.name === sel)) {
            return true;
        }
        return this.children().has(sel);
    }

    /**
     * Get all attributes. If a name is provided, it returns the value for that key
     */
    attr(name?: string) {
        if (this.length) {
            const attrs = this.nodes[0].attributes;
            return name ? attrs[name] : attrs;
        }
    }

    /**
     * Returns a new XmlQuery object for the selected element by index
     */
    eq(index: number) {
        return xmlQuery(this.nodes[index]);
    }

    /**
     * Returns a new XmlQuery object for the first element
     */
    first() {
        return this.eq(0);
    }

    /**
     * Returns a new XmlQuery object for the last element
     */
    last() {
        return this.eq(this.length - 1);
    }

    /**
     * Iterate over a xmlQuery object, executing a function for each element. Returns the results in an array.
     */
    map(fn: (v: xmlQuery.XmlNode, i: number, a: xmlQuery.XmlNode[]) => any) {
        return this.nodes.map(fn);
    }

    /**
     * Iterate over a xmlQuery object, executing a function for each element
     */
    each(fn: (v: xmlQuery.XmlNode, i: number, a: xmlQuery.XmlNode[]) => void) {
        return this.nodes.forEach(fn);
    }

    /**
     * Get length
     */
    size() {
        return this.length;
    }

    /**
     * Get the value of a property for the first element in the set
     */
    prop(name: string) {
        const node = this.get(0);
        if (node) {
            return node[name];
        }
    }

    /**
     * Get the combined text contents of each element, including their descendants
     */
    text() {
        let res = '';
        this.each(node => {
            if (node.type === 'text') {
                res += node.value;
            } else {
                res += xmlQuery(node).children().text();
            }
        });
        return res;
    }
}

namespace xmlQuery {
    export interface XmlNode {
        name: string;
        type: string;
        value: string;
        parent: XmlNode;
        attributes: { [name: string]: string };
        children: XmlNode[];
    }

    export interface XmlQuery {
        /**
         * Retrieve one of the elements
         */
        get(index: number): XmlNode;

        /**
         * Returns a new xmlQuery object containing the children of the top level elements
         */
        children(): XmlQuery;

        /**
         * Recursively find by name starting in the provided node
         */
        findInNode(node: XmlNode, sel: string);

        /**
         * Find by name. Including top level nodes and all its children.
         */
        find(sel: string): XmlQuery;

        /**
         * Returns true if it has the given element. Faster than find because it stops on first occurence.
         */
        has(sel: string): boolean;

        /**
         * Get all attributes. If a name is provided, it returns the value for that key
         */
        attr(name?: string): { [key: string]: string } | string;

        /**
         * Returns a new XmlQuery object for the selected element by index
         */
        eq(index: number): XmlQuery;

        /**
         * Returns a new XmlQuery object for the first element
         */
        first(): XmlQuery;

        /**
         * Returns a new XmlQuery object for the last element
         */
        last(): XmlQuery;

        /**
         * Iterate over a xmlQuery object, executing a function for each element. Returns the results in an array.
         */
        map(fn: (v: XmlNode, i: number, a: XmlNode[]) => any);

        /**
         * Iterate over a xmlQuery object, executing a function for each element
         */
        each(fn: (v: XmlNode, i: number, a: XmlNode[]) => void): void;

        /**
         * Get length
         */
        size(): number;

        /**
         * Get the value of a property for the first element in the set
         */
        prop(name: string): string;

        /**
         * Get the combined text contents of each element, including their descendants
         */
        text(): string;
    }
}

export = xmlQuery;
