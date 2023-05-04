export interface IResponseTreeNode {
    id: number;
    questionId: number;
    formId: number;
    responseId: number;
    siblingNodeId: number | null;
    parentNodeId: number | null;
    rootNode: boolean;
    question: null;
    form: null;
    response: null;
    parentNode: null;
    siblingNode: null;
    childNodes: null;
}