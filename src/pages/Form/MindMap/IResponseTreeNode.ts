export interface IResponseTreeNode {
    id: number;
    questionId: number;
    formId: number;
    responseId: number;
    extendNodeId: number | null;
    parentNodeId: number | null;
    rootNode: boolean;
    question: null;
    form: null;
    response: null;
    parentNode: null;
    extendNode: null;
    childNodes: null;
}