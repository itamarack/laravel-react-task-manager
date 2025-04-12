export const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return {result, removed};
};


export const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return {result, removed};
};

export const computeTaskStateOnDrag = (payload, initialState) => {    
    const { source, destination } = payload;
    const sIdentifier = +source.droppableId;
    const dIdentifier = +destination.droppableId;

    if (sIdentifier === dIdentifier) {
        const sTasks = initialState[sIdentifier].tasks;
        const { result, removed } = reorder(sTasks, source.index, destination.index);

        const newState = [...initialState];
        newState[sIdentifier].tasks = result;
        const container = newState[dIdentifier];

        return { newState, removed, container };

    } else {
        const sTasks = initialState[sIdentifier].tasks;
        const dTasks = initialState[dIdentifier].tasks;
        const { result, removed } = move(sTasks, dTasks, source, destination);

        const newState = [...initialState];
        newState[sIdentifier].tasks = result[sIdentifier];
        newState[dIdentifier].tasks = result[dIdentifier];
        const container = newState[dIdentifier];

        return { newState, removed, container };
    }
}