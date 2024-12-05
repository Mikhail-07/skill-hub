import React from 'react';
import { observer } from 'mobx-react-lite';
import ModalWindow from '@/components/ModalWindow';

interface SortableTableProps {
  name: string;
  arr: Array<Record<string, any>>;
  headerConfig: Array<{ id: string; title: string; template?: (value: any) => React.ReactNode }>;
  children?: React.ReactNode;
}

const SortableTable: React.FC<SortableTableProps> = observer(({ name, arr, headerConfig, children }) => {
  if (arr.length === 0) return null;

  const cells = headerConfig.map(({ id, template }) => ({
    id,
    template,
  }));

  return (
    <div className="mb-8 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-900 max-w-full">
      <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{name}</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white">
              <th className="px-6 py-3 text-sm font-medium tracking-wide uppercase">#</th>
              {headerConfig.map((item) => (
                <th
                  key={item.id}
                  className="px-6 py-3 text-sm font-medium tracking-wide uppercase"
                >
                  {item.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {arr.map((item, idx) =>
              children ? (
                <ModalWindow key={item.id} isOpen={false} onClose={() => {}} header={`Details for ${item.id}`}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4">{idx + 1}</td>
                    {cells.map(({ id, template }) => (
                      <td key={id} className="px-6 py-4">
                        {template ? template(item[id]) : item[id]}
                      </td>
                    ))}
                  </tr>
                  {children}
                </ModalWindow>
              ) : (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">{idx + 1}</td>
                  {cells.map(({ id, template }) => (
                    <td key={id} className="px-6 py-4">
                      {template ? template(item[id]) : item[id]}
                    </td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default SortableTable;
