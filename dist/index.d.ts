declare const xmlQuery: (ast: xmlQuery.XmlNode | xmlQuery.XmlNode[]) => xmlQuery.XmlQuery;
declare namespace xmlQuery {
    interface XmlNode {
        name: string;
        type: string;
        value: string;
        parent: XmlNode;
        attributes: {
            [name: string]: string;
        };
        children: XmlNode[];
    }
    interface XmlQuery {
        get(index: number): XmlNode;
        children(): XmlQuery;
        findInNode(node: XmlNode, sel: string): any;
        find(sel: string): XmlQuery;
        has(sel: string): boolean;
        attr(name?: string): {
            [key: string]: string;
        } | string;
        eq(index: number): XmlQuery;
        first(): XmlQuery;
        last(): XmlQuery;
        map(fn: (v: XmlNode, i: number, a: XmlNode[]) => any): any;
        each(fn: (v: XmlNode, i: number, a: XmlNode[]) => void): void;
        size(): number;
        prop(name: string): string;
        text(): string;
    }
}
export = xmlQuery;
