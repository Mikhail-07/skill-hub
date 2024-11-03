import React, { FC, ReactNode } from 'react'

interface SimpleCellProps {
  before?: ReactNode;
  after?: ReactNode;
  header?: ReactNode;
  mode?: string;
  children: ReactNode;
}

const SimpleCell: FC<SimpleCellProps> = ({ before, after, header, children, mode }) => {
  return (
    <div className={`flex space-x-2  mb-8 ${mode === 'white' ? 'text-white' : null}`}>
      {before ?
        <div>
          {before}
        </div>
        : null
      }
      <div >
        {header ?
          <div className='pb-2'>
            {header}
          </div>
          :null
        }
        {children}
      </div>
      {after ?
        <div>
          {after}
        </div>
        : null
      }
    </div>
  );
}

export default SimpleCell