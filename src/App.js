import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useSwipeable } from 'react-swipeable';
import { v4 as uuid } from 'uuid';

const itemsFromBackend = [
  { id: uuid(), content: 'Item 1' },
  { id: uuid(), content: 'Item 2' },
  { id: uuid(), content: 'Item 3' },
  { id: uuid(), content: 'Item 4' },
  { id: uuid(), content: 'Item 5' }
];

const columnsFromBackend = {
  ['1']: {
    name: 'Todo',
    items: itemsFromBackend
  },
  ['2']: {
    name: 'InProgress',
    items: []
  }
};

const onDropEnd = (result, columns, setColumns) => {
  const { source, destination } = result;
  if (!result.destination) {
    // if (source.droppableId === '1') {
    //   const sourceColumn = columns[source.droppableId];
    //   const destColumn = columns['2'];
    //   const sourceItems = [...sourceColumn.items];
    //   const destItems = [...destColumn.items];
    //   const [removed] = sourceItems.splice(source.index, 1);
    //   destItems.splice(0, 0, removed);
    //   setColumns({
    //     ...columns,
    //     [source.droppableId]: {
    //       ...sourceColumn,
    //       items: sourceItems
    //     },
    //     ['2']: {
    //       ...destColumn,
    //       items: destItems
    //     }
    //   });
    //   return;
    // } else {
    //   const sourceColumn = columns[source.droppableId];
    //   const destColumn = columns['1'];
    //   const sourceItems = [...sourceColumn.items];
    //   const destItems = [...destColumn.items];
    //   const [removed] = sourceItems.splice(source.index, 1);
    //   destItems.splice(0, 0, removed);
    //   setColumns({
    //     ...columns,
    //     [source.droppableId]: {
    //       ...sourceColumn,
    //       items: sourceItems
    //     },
    //     ['1']: {
    //       ...destColumn,
    //       items: destItems
    //     }
    //   });
    //   return;
    // }
    return;
  }

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};

const DragDrop = () => {
  const [columns, setColumns] = useState(columnsFromBackend);
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      console.log('swipping left');
      const sourceColumn = columns['1'];
      const destColumn = columns['2'];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(0, 1);
      destItems.splice(0, 0, removed);
      setColumns({
        ...columns,
        ['1']: {
          ...sourceColumn,
          items: sourceItems
        },
        ['2']: {
          ...destColumn,
          items: destItems
        }
      });
      return;
    },
    onSwipedRight: () => {},
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%'
        }}
      >
        <DragDropContext
          onDragEnd={result => onDropEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([id, column]) => {
            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Droppable droppableId={id} key={id} style={{ margin: '8px' }}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? 'lightblue'
                            : 'lightgrey',
                          padding: 20,
                          width: 250,
                          margin: '40px'
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    {...handlers}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: 'none',
                                      padding: 16,
                                      margin: '0 0 8px 0',

                                      backgroundColor: snapshot.isDragging
                                        ? '#263B4A'
                                        : '#456C86',
                                      color: 'white',
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </>
  );
};

export default DragDrop;
