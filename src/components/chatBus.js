let openChatWithDocumentFn = null;

export const registerChatOpener = (fn) => {
    openChatWithDocumentFn = fn;
    return () => { openChatWithDocumentFn = null; };
};

export const openChatWithDocument = (document) => {
    if (openChatWithDocumentFn) {
        openChatWithDocumentFn(document);
    } else {
        console.warn("Chat widget not mounted yet");
    }
};