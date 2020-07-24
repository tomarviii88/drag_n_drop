import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';

const itemsFromBackend = [
  { id: uuid(), content: 'Item 1' },
  { id: uuid(), content: 'Item 2' },
  { id: uuid(), content: 'Item 3' },
  { id: uuid(), content: 'Item 4' },
  { id: uuid(), content: 'Item 5' }
];

const columnsFromBackend = {
  [uuid()]: {
    name: 'Todo',
    items: itemsFromBackend
  },
  [uuid()]: {
    name: 'InProgress',
    items: []
  }
};


const DragDrop = () => {
  const [columns, setColumns] = useState(columnsFromBackend);

  const onDropEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

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
