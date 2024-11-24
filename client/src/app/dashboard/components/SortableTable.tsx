import React from 'react';
import ModalWindow from './ModalWindow';
import { observer } from 'mobx-react-lite';

const SortableTable = observer(({ name, arr, headerConfig, children }) => {
  if (arr.length === 0) return null;

  const cells = headerConfig.map(({ id, template }) => ({
    id,
    template,
  }));

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4 w-full h-full">
      <h4 className="text-lg font-semibold mb-2">{name}</h4>
      <div className="overflow-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-2 text-left">
                <span>#</span>
              </th>
              {headerConfig.map((item) => (
                <th key={item.id} className="p-2 text-left">
                  <span>{item.title}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {arr.map((item, idx) => (
              children ? (
                <ModalWindow key={item.id} id={item.id}>
                  <tr className="border-b">
                    <td className="p-2">
                      <span>{idx + 1}</span>
                    </td>
                    {cells.map(({ id, template }) => (
                      <td key={id} className="p-2">
                        <span>{template ? template(item[id]) : item[id]}</span>
                      </td>
                    ))}
                  </tr>
                  {children}
                </ModalWindow>
              ) : (
                <tr key={item.id} className="border-b">
                  <td className="p-2">
                    <span>{idx + 1}</span>
                  </td>
                  {cells.map(({ id, template }) => (
                    <td key={id} className="p-2">
                      <span>{template ? template(item[id]) : item[id]}</span>
                    </td>
                  ))}
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default SortableTable;
