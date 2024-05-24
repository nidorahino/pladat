class Queue {
    constructor() {
        this.nodes = [];
    }

    enqueue(node) {
        this.nodes.push(node);
    }

    dequeue() {
        return this.nodes.shift();
    }

    isEmpty() {
        return this.nodes.length === 0;
    }

    peek() {
        return this.nodes.length > 0 ? this.nodes[0] : null;
    }

    length() {
        return this.nodes.length;
    }

    getNodes() {
        return this.nodes;
    }

    getNodeAt(index) {
        return this.nodes[index];
    };

    hasNode(node) {
        return this.nodes.includes(node);
    }
}

module.exports = Queue;
