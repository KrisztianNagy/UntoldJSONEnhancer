import JSONPointer from 'untold-json-pointer';

export class PointerEvaluator {
    private pointer: JSONPointer;

    constructor() {
        this.pointer = new JSONPointer();
    }

    evaluateSingle(query: string, payLoad: any) {
        const result = this.pointer.executeQuery(payLoad, query);

        if (result.isQueryValid) {
            return result.getSingle();
        } else {
            return null;
        }
    }

    evaluateMulti(query: string, payLoad: any) {
        const result = this.pointer.executeQuery(payLoad, query);

        if (result.isQueryValid) {
            return result.getAll();
        } else {
            return [];
        }
    }
}
